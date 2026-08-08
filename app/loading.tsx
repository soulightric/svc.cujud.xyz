export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center surface-page">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin spinner border-2"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
        />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Memuat…
        </p>
      </div>
    </div>
  );
}
