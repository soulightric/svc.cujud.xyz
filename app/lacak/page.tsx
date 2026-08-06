"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Ticket, ArrowLeft } from "lucide-react";

export default function LacakIndexPage() {
  const [nomor, setNomor] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = nomor.trim().toUpperCase();
    if (!cleaned) {
      setError("Masukkan nomor tiket");
      return;
    }
    router.push(`/lacak/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm">
            <ArrowLeft size={16} /> Beranda
          </Link>
          <span className="text-sm font-semibold text-slate-800">Lacak Aduan</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Ticket className="text-blue-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Lacak Status Aduan</h1>
            <p className="text-sm text-slate-500">
              Masukkan nomor tiket (contoh: <code className="text-xs bg-slate-100 px-1 rounded">ADU-2026-0001</code>)
              untuk melihat status tanpa login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Nomor Tiket
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={nomor}
                  onChange={(e) => {
                    setNomor(e.target.value);
                    setError("");
                  }}
                  placeholder="ADU-2026-0001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Lacak Sekarang
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login mahasiswa
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
