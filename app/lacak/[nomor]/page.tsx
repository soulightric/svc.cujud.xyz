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
  AlertCircle,
  Paperclip,
  ShieldCheck,
} from "lucide-react";
import Footer from "@/app/components/Footer";
import { useTheme } from "@/app/components/ThemeProvider";

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

interface StatusStyle {
  color: string;
  bg: string;
  border: string;
}

const STATUS_META: Record<StatusType, { label: string; Icon: typeof Clock3 }> = {
  menunggu: { label: "Menunggu", Icon: Clock3 },
  diterima: { label: "Diterima", Icon: CheckCircle2 },
  ditolak: { label: "Ditolak", Icon: XCircle },
  selesai: { label: "Selesai", Icon: CheckCheck },
};

const STATUS_LIGHT: Record<StatusType, StatusStyle> = {
  menunggu: { color: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  diterima: { color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
  ditolak: { color: "#991b1b", bg: "#fee2e2", border: "#fca5a5" },
  selesai: { color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
};

const STATUS_DARK: Record<StatusType, StatusStyle> = {
  menunggu: { color: "#fcd34d", bg: "#422006", border: "#854d0e" },
  diterima: { color: "#93c5fd", bg: "#0f213f", border: "#1e3a8a" },
  ditolak: { color: "#fca5a5", bg: "#450a0a", border: "#7f1d1d" },
  selesai: { color: "#6ee7b7", bg: "#052e1c", border: "#065f46" },
};

/** Urutan tahapan untuk progress tracker */
const FLOW: StatusType[] = ["menunggu", "diterima", "selesai"];

export default function LacakDetailPage() {
  const params = useParams();
  const nomor = typeof params.nomor === "string" ? params.nomor : "";
  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const statusMap = theme === "dark" ? STATUS_DARK : STATUS_LIGHT;

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

  const cardStyle = {
    backgroundColor: "var(--bg-elevated)",
    borderColor: "var(--border)",
    boxShadow: "0 1px 2px var(--shadow-color)",
  };

  return (
    <div className="min-h-screen flex flex-col surface-page">
      <header
        className="border-b sticky top-0 z-30"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/lacak"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} /> Cari tiket lain
          </Link>
          <Link
            href="/"
            className="text-sm transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            Beranda
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        {loading && <DetailSkeleton />}

        {error && !loading && (
          <div
            className="rounded border p-8 text-center space-y-3"
            style={{
              backgroundColor: "var(--danger-soft-bg)",
              borderColor: "var(--danger-soft-border)",
            }}
          >
            <AlertCircle size={28} className="mx-auto" style={{ color: "var(--danger)" }} />
            <p className="font-semibold" style={{ color: "var(--danger)" }}>
              {error}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Pastikan nomor tiket sudah benar, termasuk tanda hubungnya.
            </p>
            <Link
              href="/lacak"
              className="inline-block text-sm font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Kembali ke form lacak
            </Link>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-5">
            {/* Kartu utama */}
            <section className="rounded border p-6 space-y-5" style={cardStyle}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="text-xs font-mono font-semibold tracking-wide"
                    style={{ color: "var(--accent)" }}
                  >
                    {data.nomorTiket}
                  </p>
                  <h1
                    className="text-xl font-bold mt-1 break-words"
                    style={{ color: "var(--text)" }}
                  >
                    {data.judul}
                  </h1>
                </div>
                <StatusBadge status={data.status} styleMap={statusMap} />
              </div>

              <ProgressTracker status={data.status} styleMap={statusMap} />

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <Meta icon={User} label="Pelapor" value={data.pelapor} />
                <Meta icon={Tag} label="Kategori" value={data.kategori} />
                <Meta icon={CalendarDays} label="Dibuat" value={fmtDate(data.createdAt)} />
                <Meta icon={CalendarDays} label="Diperbarui" value={fmtDate(data.updatedAt)} />
              </div>

              <div>
                <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Deskripsi
                </p>
                <p
                  className="text-sm whitespace-pre-wrap leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  {data.deskripsi}
                </p>
              </div>

              {data.lampiran && (
                <Attachment label="Lampiran" src={data.lampiran} alt="Lampiran aduan" />
              )}

              {data.balasan && (
                <div
                  className="rounded border p-4"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p
                    className="text-xs font-medium mb-1.5 inline-flex items-center gap-1.5"
                    style={{ color: "var(--accent)" }}
                  >
                    <ShieldCheck size={13} /> Balasan admin
                  </p>
                  <p
                    className="text-sm whitespace-pre-wrap leading-relaxed"
                    style={{ color: "var(--text)" }}
                  >
                    {data.balasan}
                  </p>
                </div>
              )}

              {data.lampiranBalasan && (
                <Attachment
                  label="Bukti tindak lanjut"
                  src={data.lampiranBalasan}
                  alt="Lampiran balasan admin"
                />
              )}
            </section>

            {/* Thread komentar (read-only di halaman publik) */}
            <section className="rounded border p-6" style={cardStyle}>
              <h2
                className="text-sm font-semibold flex items-center gap-2 mb-4"
                style={{ color: "var(--text)" }}
              >
                <MessageSquare size={16} /> Riwayat percakapan
                <span className="font-normal" style={{ color: "var(--text-faint)" }}>
                  ({data.comments.length})
                </span>
              </h2>

              {data.comments.length === 0 ? (
                <p
                  className="text-sm text-center py-6 rounded border border-dashed"
                  style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}
                >
                  Belum ada komentar pada tiket ini.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.comments.map((c) => (
                    <li
                      key={c.id}
                      className="rounded border p-3 text-sm"
                      style={{
                        backgroundColor: c.isAdmin
                          ? "var(--info-soft-bg)"
                          : "var(--bg-muted)",
                        borderColor: c.isAdmin
                          ? "var(--info-soft-border)"
                          : "var(--border)",
                      }}
                    >
                      <div className="flex flex-wrap justify-between gap-2 mb-1.5">
                        <span
                          className="font-semibold text-xs inline-flex items-center gap-1.5"
                          style={{ color: c.isAdmin ? "var(--info)" : "var(--text-muted)" }}
                        >
                          {c.isAdmin && <ShieldCheck size={12} />}
                          {c.dari}
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                          {fmtDate(c.createdAt)}
                        </span>
                      </div>
                      <p
                        className="whitespace-pre-wrap leading-relaxed"
                        style={{ color: "var(--text)" }}
                      >
                        {c.isi}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function StatusBadge({
  status,
  styleMap,
}: {
  status: StatusType;
  styleMap: Record<StatusType, StatusStyle>;
}) {
  const cfg = styleMap[status] || styleMap.menunggu;
  const { label, Icon } = STATUS_META[status] || STATUS_META.menunggu;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold shrink-0"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}

function ProgressTracker({
  status,
  styleMap,
}: {
  status: StatusType;
  styleMap: Record<StatusType, StatusStyle>;
}) {
  // Tiket ditolak tidak mengikuti alur normal
  if (status === "ditolak") {
    const cfg = styleMap.ditolak;
    return (
      <div
        className="rounded border px-4 py-3 text-xs font-medium inline-flex items-center gap-2 w-full"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}
      >
        <XCircle size={14} />
        Aduan ditolak — silakan cek balasan admin di bawah.
      </div>
    );
  }

  const activeIndex = FLOW.indexOf(status);

  return (
    <div className="flex items-center">
      {FLOW.map((step, i) => {
        const done = i <= activeIndex;
        const cfg = styleMap[step];
        const { label, Icon } = STATUS_META[step];
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded flex items-center justify-center border transition-colors"
                style={{
                  backgroundColor: done ? cfg.bg : "var(--bg-muted)",
                  borderColor: done ? cfg.border : "var(--border)",
                  color: done ? cfg.color : "var(--text-faint)",
                }}
              >
                <Icon size={14} />
              </div>
              <span
                className="text-[10px] font-medium whitespace-nowrap"
                style={{ color: done ? "var(--text)" : "var(--text-faint)" }}
              >
                {label}
              </span>
            </div>
            {i < FLOW.length - 1 && (
              <div
                className="h-0.5 flex-1 mx-1 mb-5 rounded"
                style={{
                  backgroundColor: i < activeIndex ? cfg.border : "var(--border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Attachment({ label, src, alt }: { label: string; src: string; alt: string }) {
  return (
    <div>
      <p
        className="text-xs font-medium mb-1.5 inline-flex items-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        <Paperclip size={13} /> {label}
      </p>
      <a href={src} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="rounded border max-h-64 w-auto object-cover transition-opacity hover:opacity-90"
          style={{ borderColor: "var(--border)" }}
        />
      </a>
    </div>
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
      <Icon size={14} className="mt-0.5 shrink-0" style={{ color: "var(--text-faint)" }} />
      <div className="min-w-0">
        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
          {label}
        </p>
        <p className="text-sm capitalize break-words" style={{ color: "var(--text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div
        className="rounded border p-6 space-y-4"
        style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="h-3 w-32 rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
        <div className="h-6 w-3/4 rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
        <div className="h-10 w-full rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded"
              style={{ backgroundColor: "var(--bg-muted)" }}
            />
          ))}
        </div>
        <div className="h-16 w-full rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
      </div>
      <div
        className="rounded border p-6 space-y-3"
        style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
        <div className="h-14 w-full rounded" style={{ backgroundColor: "var(--bg-muted)" }} />
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
