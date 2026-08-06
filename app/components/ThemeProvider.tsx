"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(Ctx);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("svc-theme") as Theme | null;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial: Theme =
        stored === "dark" || stored === "light"
          ? stored
          : prefersDark
            ? "dark"
            : "light";
      setThemeState(initial);
      applyTheme(initial);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem("svc-theme", t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Avoid flash: still render children; script in layout handles first paint
  return (
    <Ctx.Provider value={{ theme: ready ? theme : "light", toggle, setTheme }}>
      {children}
    </Ctx.Provider>
  );
}
