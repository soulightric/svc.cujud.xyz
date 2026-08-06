"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // Hanya di production agar dev tidak ribet
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.info("[sw] register gagal:", err);
    });
  }, []);

  return null;
}
