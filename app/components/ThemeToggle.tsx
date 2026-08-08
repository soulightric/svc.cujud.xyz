"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "./ThemeProvider";

const OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Terang", Icon: Sun },
  { value: "dark", label: "Gelap", Icon: Moon },
  { value: "system", label: "Sistem", Icon: Monitor },
];

export default function ThemeToggle({
  className = "",
  size = 15,
  showLabel = false,
}: {
  className?: string;
  size?: number;
  /** Tampilkan teks label di samping ikon (dipakai di footer) */
  showLabel?: boolean;
}) {
  const { mode, setMode, mounted } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema tampilan"
      className={`inline-flex items-center gap-0.5 rounded border p-0.5 ${className}`}
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-muted)" }}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Tema ${label}`}
            title={`Tema ${label}`}
            onClick={() => setMode(value)}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
              active ? "shadow-sm" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: active ? "var(--bg-elevated)" : "transparent",
              color: active ? "var(--teal)" : "var(--text-muted)",
            }}
          >
            <Icon size={size} />
            {showLabel && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
