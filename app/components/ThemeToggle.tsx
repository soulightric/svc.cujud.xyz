"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? "Mode terang" : "Mode gelap"}
      aria-label={isDark ? "Mode terang" : "Mode gelap"}
      className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/10 ${className}`}
    >
      {isDark ? <Sun size={size} className="text-amber-300" /> : <Moon size={size} className="text-slate-300" />}
    </button>
  );
}
