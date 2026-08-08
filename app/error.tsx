"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 surface-page">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Terjadi Kesalahan
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {error.message || "Sesuatu tidak berjalan sebagaimana mestinya."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded text-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
