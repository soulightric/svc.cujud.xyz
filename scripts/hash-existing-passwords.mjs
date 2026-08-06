/**
 * Migrasi one-shot: hash semua password Admin & Mahasiswa yang masih plain text.
 * Password yang sudah diawali "$2a$" / "$2b$" (bcrypt) di-skip.
 *
 * Usage:
 *   node scripts/hash-existing-passwords.mjs
 *
 * Pastikan DATABASE_URL (dan DIRECT_URL jika perlu) sudah di-set.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const prisma = new PrismaClient();

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function migrateAdmins() {
  const admins = await prisma.admin.findMany({ select: { id: true, username: true, password: true } });
  let updated = 0;
  for (const a of admins) {
    if (isBcryptHash(a.password)) {
      console.log(`  skip admin ${a.username} (already hashed)`);
      continue;
    }
    const hashed = await hash(a.password);
    await prisma.admin.update({ where: { id: a.id }, data: { password: hashed } });
    console.log(`  ✓ hashed admin ${a.username}`);
    updated++;
  }
  return updated;
}

async function migrateMahasiswa() {
  const list = await prisma.mahasiswa.findMany({ select: { id: true, nim: true, password: true } });
  let updated = 0;
  for (const m of list) {
    if (isBcryptHash(m.password)) {
      console.log(`  skip mahasiswa ${m.nim} (already hashed)`);
      continue;
    }
    const hashed = await hash(m.password);
    await prisma.mahasiswa.update({ where: { id: m.id }, data: { password: hashed } });
    console.log(`  ✓ hashed mahasiswa ${m.nim}`);
    updated++;
  }
  return updated;
}

async function main() {
  console.log("Migrating Admin passwords...");
  const a = await migrateAdmins();
  console.log("Migrating Mahasiswa passwords...");
  const m = await migrateMahasiswa();
  console.log(`\nDone. Updated ${a} admin(s), ${m} mahasiswa.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
