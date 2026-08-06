// Seed 1 SUPER_ADMIN + 8 admin kategori.
// Jalankan: node prisma/seed.mjs  (atau npm run seed)
// Idempoten (upsert) — aman dijalankan berulang.
// Password di-hash dengan bcrypt.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin1234";

const KATEGORI = [
  "akademik",
  "perpustakaan",
  "internet",
  "kantin",
  "gedung",
  "keamanan",
  "laboratorium",
  "transportasi",
];

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  if (!process.env.SEED_ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠ SEED_ADMIN_PASSWORD tidak di-set. Menggunakan default. " +
        "Ganti segera setelah seed di production!"
    );
  }

  const hashedPassword = await hash(DEFAULT_PASSWORD);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      role: "SUPER_ADMIN",
      kategori: null,
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      kategori: null,
    },
  });
  console.log("✓ SUPER_ADMIN  : admin");

  for (const kategori of KATEGORI) {
    const username = `admin_${kategori}`;
    await prisma.admin.upsert({
      where: { username },
      update: {
        role: "ADMIN",
        kategori,
        password: hashedPassword,
      },
      create: {
        username,
        password: hashedPassword,
        role: "ADMIN",
        kategori,
      },
    });
    console.log(`✓ ADMIN ${kategori.padEnd(13)}: ${username}`);
  }

  console.log(`\nSelesai. Password default semua admin: "${DEFAULT_PASSWORD}"`);
  console.log("Password sudah di-hash (bcrypt).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
