import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "undefined" || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set in environment and be at least 32 characters. " +
        "Generate one with: openssl rand -base64 48"
    );
  }
  return new TextEncoder().encode(secret);
}

export type TokenRole = "SUPER_ADMIN" | "ADMIN" | "mahasiswa";

export interface AdminTokenPayload extends JWTPayload {
  id?: string;
  username: string;
  role: "SUPER_ADMIN" | "ADMIN";
  kategori: string | null;
}

export interface MahasiswaTokenPayload extends JWTPayload {
  id: string;
  nim: string;
  nama: string;
  role: "mahasiswa";
}

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch {
    return null;
  }
}
