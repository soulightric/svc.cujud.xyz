import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────
  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

    const payload = await verifyToken(token);
    if (
      !payload ||
      (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")
    ) {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete("admin_token");
      return res;
    }
  }

  // ── Mahasiswa routes ──────────────────────────────────
  if (pathname === "/login") return NextResponse.next();

  if (pathname.startsWith("/feedback")) {
    const token = req.cookies.get("mahasiswa_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "mahasiswa") {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("mahasiswa_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/feedback/:path*", "/login"],
};
