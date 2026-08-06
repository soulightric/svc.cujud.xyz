"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  XCircle,
  CheckCheck,
  MessageSquare,
  CalendarDays,
  User,
  Tag,
} from "lucide-react";

type StatusType = "menunggu" | "diterima" | "ditolak" | "selesai";

interface TrackData {
  nomorTiket: string;
  kategori: string;
  judul: string;
  deskripsi: string;
  status: StatusType;
  balasan: string | null;
  lampiran: string | null;
  lampiranBalasan: string | null;
  createdAt: string;
  updatedAt: string;
  pelapor: string;
  comments: {
    id: string;
    isi: string;
    createdAt: string;
    dari: string;
    isAdmin: boolean;
  }[];
}

const STATUS_CFG: Record<
  StatusType,
  { label: string; color: string; bg: string; border: string; Icon: typeof Clock3 }
> = {
  menunggu: {
    label: "Menunggu",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fcd34d",
    Icon: Clock3,
  },
  diterima: {
    label: "Diterima",
    color: "#1e40af",
    bg: "#dbeafe",
    border: "#93c5fd",
    Icon: CheckCircle2,
  },
  ditolak: {
    label: "Ditolak",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#fca5a5",
    Icon: XCircle,
  },
  selesai: {
    label: "Selesai",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#6ee7b7",
    Icon: CheckCheck,
  },
};

export default function LacakDetailPage() {
  const params = useParams();
  const nomor = typeof params.nomor === "string" ? params.nomor : "";
  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nomor) return;
    setLoading(true);
    fetch(`/api/lacak/${encodeURIComponent(nomor)}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "Tiket tidak ditemukan");
        }
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message || "Gagal memuat"))
      .finally(() => setLoading(false));
  }, [nomor]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/lacak"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
          >
            <ArrowLeft size={16} /> Cari tiket lain
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
            Beranda
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-16 text-slate-500 text-sm">Memuat tiket…</div>
        )}

        {error && !loading && (
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-red-700 font-medium">{error}</p>
            <Link href="/lacak" className="text-sm text-blue-600 hover:underline">
              Kembali ke form lacak
            </Link>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-blue-600 font-semibold tracking-wide">
                    {data.nomorTiket}
                  </p>
                  <h1 className="text-xl font-bold text-slate-900 mt-1">{data.judul}</h1>
                </div>
                <StatusBadge status={data.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Meta
                  icon={User}
                  label="Pelapor"
                  value={data.pelapor}
                />
                <Meta
                  icon={Tag}
                  label="Kategori"
                  value={data.kategori}
                />
                <Meta
                  icon={CalendarDays}
                  label="Dibuat"
                  value={fmtDate(data.createdAt)}
                />
                <Meta
                  icon={CalendarDays}
                  label="Diperbarui"
                  value={fmtDate(data.updatedAt)}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Deskripsi</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.deskripsi}</p>
              </div>

              {data.lampiran && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Lampiran</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.lampiran}
                    alt="Lampiran"
                    className="rounded-lg border border-slate-200 max-h-64 object-cover"
                  />
                </div>
              )}

              {data.balasan && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">Balasan admin</p>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{data.balasan}</p>
                </div>
              )}

              {data.lampiranBalasan && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Bukti tindak lanjut</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.lampiranBalasan}
                    alt="Lampiran balasan"
                    className="rounded-lg border border-slate-200 max-h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Thread komentar (read-only di halaman publik) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <MessageSquare size={16} /> Riwayat percakapan
                <span className="text-slate-400 font-normal">({data.comments.length})</span>
              </h2>
              {data.comments.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada komentar.</p>
              ) : (
                <ul className="space-y-3">
                  {data.comments.map((c) => (
                    <li
                      key={c.id}
                      className={`rounded-lg p-3 text-sm ${
                        c.isAdmin
                          ? "bg-blue-50 border border-blue-100"
                          : "bg-slate-50 border border-slate-100"
                      }`}
                    >
                      <div className="flex justify-between gap-2 mb-1">
                        <span className="font-medium text-slate-700 text-xs">{c.dari}</span>
                        <span className="text-[11px] text-slate-400">
                          {fmtDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-800 whitespace-pre-wrap">{c.isi}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.menunggu;
  const Icon = cfg.Icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 capitalize">{value}</p>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
