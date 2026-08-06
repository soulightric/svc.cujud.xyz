import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMahasiswa } from "@/lib/api-auth";

export async function GET() {
  try {
    const auth = await requireMahasiswa();
    if (!auth.ok) return NextResponse.json([], { status: 401 });

    // Aduan milik mahasiswa yang sudah diproses (termasuk selesai)
    const feedbacks = await prisma.feedback.findMany({
      where: {
        mahasiswaId: auth.payload.id,
        status: { in: ["diterima", "ditolak", "selesai"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: {
        id: true,
        nomorTiket: true,
        judul: true,
        status: true,
        balasan: true,
        updatedAt: true,
        kategori: true,
      },
    });

    return NextResponse.json(feedbacks);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
