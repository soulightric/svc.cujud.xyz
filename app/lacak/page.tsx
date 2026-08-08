"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Ticket, ArrowLeft, ShieldCheck, Clock3, LogIn } from "lucide-react";
import Footer from "@/app/components/Footer";

export default function LacakIndexPage() {
  const [nomor, setNomor] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = nomor.trim().toUpperCase();
    if (!cleaned) {
      setError("Masukkan nomor tiket terlebih dahulu");
      return;
    }
    router.push(`/lacak/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="min-h-screen flex flex-col surface-page">
      <header
        className="border-b sticky top-0 z-30 backdrop-blur"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} /> Beranda
          </Link>
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Lacak Aduan
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-5">
          <div
            className="rounded border shadow-sm p-8 space-y-6"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
              boxShadow: "0 1px 2px var(--shadow-color)",
            }}
          >
            <div className="text-center space-y-2">
              <div
                className="mx-auto w-12 h-12 rounded flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-soft-bg)",
                  border: "1px solid var(--accent-soft-border)",
                }}
              >
                <Ticket size={24} style={{ color: "var(--accent)" }} />
              </div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                Lacak Status Aduan
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Masukkan nomor tiket Anda untuk melihat status tanpa perlu login.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nomor-tiket"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Nomor Tiket
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    size={16}
                    style={{ color: "var(--text-faint)" }}
                  />
                  <input
                    id="nomor-tiket"
                    type="text"
                    value={nomor}
                    onChange={(e) => {
                      setNomor(e.target.value);
                      setError("");
                    }}
                    placeholder="ADU-2026-0001"
                    autoComplete="off"
                    aria-invalid={!!error}
                    className="w-full pl-10 pr-4 py-2.5 rounded border text-sm uppercase focus:outline-none"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: error ? "var(--danger)" : "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>
                {error ? (
                  <p className="mt-1.5 text-xs" style={{ color: "var(--danger)" }}>
                    {error}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs" style={{ color: "var(--text-faint)" }}>
                    Contoh format: ADU-2026-0001
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Lacak Sekarang
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              <InfoPill icon={ShieldCheck} text="Data aduan rahasia" />
              <InfoPill icon={Clock3} text="Proses 3–5 hari" />
            </div>

            <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                <LogIn size={12} /> Login mahasiswa
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function InfoPill({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded border px-3 py-2"
      style={{ backgroundColor: "var(--bg-muted)", borderColor: "var(--border)" }}
    >
      <Icon size={14} style={{ color: "var(--accent)" }} className="shrink-0" />
      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        {text}
      </span>
    </div>
  );
}
