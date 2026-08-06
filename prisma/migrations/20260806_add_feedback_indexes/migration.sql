-- Indexes for Feedback table (query performance)
CREATE INDEX IF NOT EXISTS "Feedback_status_idx" ON "Feedback"("status");
CREATE INDEX IF NOT EXISTS "Feedback_kategori_idx" ON "Feedback"("kategori");
CREATE INDEX IF NOT EXISTS "Feedback_mahasiswaId_idx" ON "Feedback"("mahasiswaId");
CREATE INDEX IF NOT EXISTS "Feedback_diteruskan_idx" ON "Feedback"("diteruskan");
CREATE INDEX IF NOT EXISTS "Feedback_createdAt_idx" ON "Feedback"("createdAt");
CREATE INDEX IF NOT EXISTS "Feedback_status_kategori_idx" ON "Feedback"("status", "kategori");
