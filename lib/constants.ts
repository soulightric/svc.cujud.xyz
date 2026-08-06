/** Shared constants — hindari duplikasi di page besar */

export const KATEGORI_LIST = [
  { value: "akademik", label: "Akademik", color: "#3b82f6" },
  { value: "perpustakaan", label: "Perpustakaan", color: "#8b5cf6" },
  { value: "internet", label: "Internet & Teknologi", color: "#06b6d4" },
  { value: "kantin", label: "Kantin", color: "#f59e0b" },
  { value: "gedung", label: "Gedung & Ruang Kelas", color: "#64748b" },
  { value: "keamanan", label: "Keamanan", color: "#ef4444" },
  { value: "laboratorium", label: "Laboratorium", color: "#10b981" },
  { value: "transportasi", label: "Transportasi & Parkir", color: "#ec4899" },
] as const;

export type KategoriValue = (typeof KATEGORI_LIST)[number]["value"];

export const STATUS_LIST = [
  "menunggu",
  "diterima",
  "ditolak",
  "selesai",
] as const;

export type StatusType = (typeof STATUS_LIST)[number];

export function getKategori(value: string) {
  return KATEGORI_LIST.find((k) => k.value === value) ?? KATEGORI_LIST[0];
}

export function formatTanggal(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
