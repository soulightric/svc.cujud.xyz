/**
 * Notifikasi email via Resend (opsional).
 * Jika RESEND_API_KEY tidak di-set, fungsi no-op (tidak error).
 */

const RESEND_API = "https://api.resend.com/emails";

interface SendEmailOpts {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(opts: SendEmailOpts): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Student Voice <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("[email] RESEND_API_KEY tidak di-set — skip kirim email");
    return false;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error:", res.status, body);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] gagal kirim:", e);
    return false;
  }
}

export async function notifyStatusChange(opts: {
  email?: string | null;
  nama: string;
  nomorTiket: string;
  judul: string;
  status: string;
  balasan?: string | null;
  trackUrl?: string;
}) {
  if (!opts.email) return;

  const statusLabel: Record<string, string> = {
    menunggu: "Menunggu",
    diterima: "Diterima",
    ditolak: "Ditolak",
    selesai: "Selesai",
  };

  const label = statusLabel[opts.status] || opts.status;
  const track = opts.trackUrl
    ? `<p><a href="${opts.trackUrl}">Lacak aduan Anda</a></p>`
    : "";

  await sendEmail({
    to: opts.email,
    subject: `[${opts.nomorTiket}] Status aduan: ${label}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Update Aduan</h2>
        <p>Halo <strong>${opts.nama}</strong>,</p>
        <p>Status aduan <strong>${opts.nomorTiket}</strong> — <em>${opts.judul}</em> — telah diperbarui menjadi:</p>
        <p style="font-size:18px;font-weight:bold">${label}</p>
        ${opts.balasan ? `<p><strong>Balasan admin:</strong><br/>${opts.balasan}</p>` : ""}
        ${track}
        <hr/>
        <p style="color:#64748b;font-size:12px">Student Voice ITH Campus</p>
      </div>
    `,
  });
}
