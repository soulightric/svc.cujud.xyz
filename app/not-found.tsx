import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 surface-page">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--text)" }}>
          404
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Halaman yang Anda cari tidak ditemukan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded text-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
