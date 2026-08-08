import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** Format nomor tiket resmi: ADU-2026-0001 */
const TICKET_PATTERN = /^ADU-\d{4}-\d{4}$/;

/**
 * Public endpoint — lacak aduan by nomor tiket tanpa login.
 * Tidak mengekspos NIM/nama lengkap secara berlebihan; hanya inisial + status.
 *
 * Nomor tiket berurutan sehingga mudah ditebak. Endpoint ini dibatasi
 * rate limit agar tidak bisa dipakai memanen data aduan secara massal.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ nomor: string }> }
) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`lacak:${ip}`, 20, 5 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Coba lagi dalam ${rl.retryAfterSec} detik.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const { nomor } = await params;
    const cleaned = decodeURIComponent(nomor).trim().toUpperCase();

    if (!TICKET_PATTERN.test(cleaned)) {
      return NextResponse.json({ error: "Nomor tiket tidak valid" }, { status: 400 });
    }

    const feedback = await prisma.feedback.findUnique({
      where: { nomorTiket: cleaned },
      select: {
        nomorTiket: true,
        kategori: true,
        judul: true,
        deskripsi: true,
        status: true,
        balasan: true,
        lampiran: true,
        lampiranBalasan: true,
        diteruskan: true,
        createdAt: true,
        updatedAt: true,
        mahasiswa: { select: { nama: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            isi: true,
            createdAt: true,
            adminId: true,
            mahasiswaId: true,
            admin: { select: { username: true } },
            mahasiswa: { select: { nama: true } },
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
    }

    // Mask nama: "Budi Santoso" → "Budi S."
    const parts = feedback.mahasiswa.nama.trim().split(/\s+/);
    const maskedNama =
      parts.length === 1
        ? parts[0]
        : `${parts[0]} ${parts[parts.length - 1][0]}.`;

    return NextResponse.json({
      nomorTiket: feedback.nomorTiket,
      kategori: feedback.kategori,
      judul: feedback.judul,
      deskripsi: feedback.deskripsi,
      status: feedback.status,
      balasan: feedback.balasan,
      lampiran: feedback.lampiran,
      lampiranBalasan: feedback.lampiranBalasan,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      pelapor: maskedNama,
      comments: feedback.comments.map((c) => ({
        id: c.id,
        isi: c.isi,
        createdAt: c.createdAt,
        dari: c.adminId
          ? `Admin (${c.admin?.username ?? "admin"})`
          : c.mahasiswa?.nama
            ? maskName(c.mahasiswa.nama)
            : "Mahasiswa",
        isAdmin: !!c.adminId,
      })),
    });
  } catch (error) {
    console.error("GET /api/lacak:", error);
    return NextResponse.json({ error: "Gagal mencari tiket" }, { status: 500 });
  }
}

function maskName(nama: string) {
  const parts = nama.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
