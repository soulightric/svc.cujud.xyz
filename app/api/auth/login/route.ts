import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan. Coba lagi dalam ${rl.retryAfterSec} detik.` },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Wajib ada admin di database — tidak ada fallback kredensial hardcoded.
    const dbAdmin = await prisma.admin.findUnique({ where: { username } });

    if (!dbAdmin) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, dbAdmin.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: dbAdmin.id,
      username: dbAdmin.username,
      role: dbAdmin.role,
      kategori: dbAdmin.kategori ?? null,
    });

    const res = NextResponse.json({
      success: true,
      role: dbAdmin.role,
      kategori: dbAdmin.kategori ?? null,
    });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
