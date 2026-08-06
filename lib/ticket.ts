import { prisma } from "@/lib/prisma";

/**
 * Generate nomor tiket unik format ADU-YYYY-NNNN
 * Menggunakan counter per tahun (row-level atomic increment via upsert + update).
 */
export async function generateNomorTiket(): Promise<string> {
  const year = new Date().getFullYear();

  // Pastikan counter tahun ini ada
  await prisma.ticketCounter.upsert({
    where: { year },
    create: { year, last: 0 },
    update: {},
  });

  // Increment atomik
  const counter = await prisma.ticketCounter.update({
    where: { year },
    data: { last: { increment: 1 } },
  });

  const seq = String(counter.last).padStart(4, "0");
  return `ADU-${year}-${seq}`;
}
