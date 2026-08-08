"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left space-y-1">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; 2026 SVC - Student Voice Campus backup by{" "}
            <Link
              className="text-emerald-500 hover:underline"
              href="https://www.etherthink.xyz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherthink
            </Link>
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Aduan bersifat rahasia dan diproses dalam 3&ndash;5 hari kerja
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs hidden sm:inline" style={{ color: "var(--text-muted)" }}>
            Tampilan
          </span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
