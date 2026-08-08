"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = "svc-theme";

interface ThemeCtx {
  /** Pilihan user: light | dark | system */
  mode: ThemeMode;
  /** Tema yang benar-benar dipakai setelah "system" diresolusi */
  theme: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
  mounted: boolean;
}

const Ctx = createContext<ThemeCtx>({
  mode: "system",
  theme: "light",
  setMode: () => {},
  toggle: () => {},
  mounted: false,
});

export function useTheme() {
  return useContext(Ctx);
}

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [theme, setThemeResolved] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialMode = readMode();
    const resolved = initialMode === "system" ? systemTheme() : initialMode;
    setModeState(initialMode);
    setThemeResolved(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  // Ikuti perubahan preferensi OS saat mode = system
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = mq.matches ? "dark" : "light";
      setThemeResolved(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    const resolved = m === "system" ? systemTheme() : m;
    setModeState(m);
    setThemeResolved(resolved);
    applyTheme(resolved);
    try {
      localStorage.setItem(THEME_KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(theme === "dark" ? "light" : "dark");
  }, [theme, setMode]);

  return (
    <Ctx.Provider value={{ mode, theme, setMode, toggle, mounted }}>
      {children}
    </Ctx.Provider>
  );
}
