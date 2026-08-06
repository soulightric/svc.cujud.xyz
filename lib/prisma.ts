import { PrismaClient } from "@prisma/client";

// Hanya nonaktifkan validasi TLS di development (workaround SSL Supabase di Windows).
// Di production validasi sertifikat tetap aktif — gunakan ?sslmode=require di DATABASE_URL.
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
