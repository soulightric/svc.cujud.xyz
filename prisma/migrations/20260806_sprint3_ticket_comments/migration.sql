-- Sprint 3: nomor tiket, komentar thread, email mahasiswa, ticket counter

-- Mahasiswa.email (opsional)
ALTER TABLE "Mahasiswa" ADD COLUMN IF NOT EXISTS "email" TEXT;

-- Feedback.nomorTiket
ALTER TABLE "Feedback" ADD COLUMN IF NOT EXISTS "nomorTiket" TEXT;

-- Backfill nomor tiket untuk baris lama (sementara pakai id pendek)
UPDATE "Feedback"
SET "nomorTiket" = 'ADU-LEGACY-' || SUBSTRING("id" FROM 1 FOR 8)
WHERE "nomorTiket" IS NULL;

-- Unique + index
CREATE UNIQUE INDEX IF NOT EXISTS "Feedback_nomorTiket_key" ON "Feedback"("nomorTiket");
CREATE INDEX IF NOT EXISTS "Feedback_nomorTiket_idx" ON "Feedback"("nomorTiket");

-- TicketCounter
CREATE TABLE IF NOT EXISTS "TicketCounter" (
  "year" INTEGER NOT NULL,
  "last" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "TicketCounter_pkey" PRIMARY KEY ("year")
);

-- Comment
CREATE TABLE IF NOT EXISTS "Comment" (
  "id" TEXT NOT NULL,
  "isi" TEXT NOT NULL,
  "adminId" TEXT,
  "mahasiswaId" TEXT,
  "feedbackId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Comment_feedbackId_idx" ON "Comment"("feedbackId");
CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt");

DO $$ BEGIN
  ALTER TABLE "Comment" ADD CONSTRAINT "Comment_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Comment" ADD CONSTRAINT "Comment_mahasiswaId_fkey"
    FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Comment" ADD CONSTRAINT "Comment_feedbackId_fkey"
    FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
