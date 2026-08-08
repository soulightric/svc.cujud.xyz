"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface CommentItem {
  id: string;
  isi: string;
  createdAt: string;
  adminId?: string | null;
  mahasiswaId?: string | null;
  admin?: { username: string; role?: string } | null;
  mahasiswa?: { nama: string; nim?: string } | null;
}

interface Props {
  feedbackId: string;
  /** Tampilkan form kirim? (false di halaman publik) */
  canReply?: boolean;
}

export default function CommentThread({ feedbackId, canReply = true }: Props) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isi, setIsi] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const res = await fetch(`/api/feedback/${feedbackId}/comments`);
      if (!res.ok) throw new Error("Gagal memuat komentar");
      setComments(await res.json());
    } catch {
      setError("Tidak dapat memuat komentar");
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isi.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/feedback/${feedbackId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isi: isi.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Gagal mengirim");
      }
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setIsi("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3
        className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        <MessageSquare size={13} /> Thread komentar
        {!loading && (
          <span className="font-normal normal-case" style={{ color: "var(--text-faint)" }}>
            ({comments.length})
          </span>
        )}
      </h3>

      {loading && (
        <p
          className="text-xs flex items-center gap-1.5"
          style={{ color: "var(--text-faint)" }}
        >
          <Loader2 size={12} className="animate-spin" /> Memuat…
        </p>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
          Belum ada komentar.
        </p>
      )}

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {comments.map((c) => {
          const isAdmin = !!c.adminId;
          const author = isAdmin
            ? `Admin (${c.admin?.username ?? "admin"})`
            : c.mahasiswa?.nama ?? "Mahasiswa";
          return (
            <li
              key={c.id}
              className="rounded border px-3 py-2 text-sm"
              style={{
                backgroundColor: isAdmin ? "var(--info-soft-bg)" : "var(--bg-muted)",
                borderColor: isAdmin ? "var(--info-soft-border)" : "var(--border)",
              }}
            >
              <div className="flex justify-between gap-2 mb-0.5">
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: isAdmin ? "var(--info)" : "var(--text-muted)" }}
                >
                  {author}
                </span>
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                  {fmtDate(c.createdAt)}
                </span>
              </div>
              <p
                className="whitespace-pre-wrap text-[13px]"
                style={{ color: "var(--text)" }}
              >
                {c.isi}
              </p>
            </li>
          );
        })}
      </ul>

      {canReply && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Tulis komentar…"
            className="flex-1 text-sm rounded border px-3 py-2 focus:outline-none resize-none"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <button
            type="submit"
            disabled={sending || !isi.trim()}
            className="shrink-0 h-9 w-9 rounded text-white flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
            title="Kirim"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </form>
      )}

      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
