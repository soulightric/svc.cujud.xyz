"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Terjadi Kesalahan</h1>
        <p className="text-slate-600 text-sm">
          {error.message || "Sesuatu tidak berjalan sebagaimana mestinya."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
