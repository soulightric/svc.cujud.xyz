import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-slate-600">Halaman yang Anda cari tidak ditemukan.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
