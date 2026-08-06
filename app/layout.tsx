import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Student Voice Campus | ITH",
  description:
    "Portal pengaduan dan feedback fasilitas kampus. Sampaikan masukan Anda untuk pelayanan yang lebih baik.",
  applicationName: "SVC ITH",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SVC ITH",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d9488" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1b2d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('svc-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
