/**
 * netlify/functions/rsvp.js
 *
 * Serverless function — mengelola data RSVP di Netlify Blobs.
 *
 * Endpoint:
 *   POST /.netlify/functions/rsvp          → Kirim konfirmasi baru (publik)
 *   GET  /.netlify/functions/rsvp?pass=xxx → Ambil semua data (admin saja)
 *
 * Environment Variables (atur di Netlify Dashboard → Site Settings → Env):
 *   ADMIN_PASSWORD — password panel admin (default: admin123)
 */

const { getStore } = require("@netlify/blobs");

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const ok  = (body)   => ({ statusCode: 200, headers: CORS, body: JSON.stringify(body) });
const err = (status, msg) => ({ statusCode: status, headers: CORS, body: JSON.stringify({ error: msg }) });

exports.handler = async (event) => {
  /* ── Preflight CORS ── */
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  /* ── Inisialisasi Blob Store ── */
  let store;
  try {
    store = getStore("rsvp-data");
  } catch (e) {
    console.error("Blob store init error:", e);
    return err(503, "Storage tidak tersedia. Pastikan site sudah di-deploy ke Netlify.");
  }

  /* ══════════════════════════════════════════════
     POST — Tamu mengirim konfirmasi kehadiran
  ══════════════════════════════════════════════ */
  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return err(400, "Body tidak valid.");
    }

    const { ticketId, name, attending, count, message, at } = body;

    if (!ticketId || !name || !attending) {
      return err(400, "Data tidak lengkap: ticketId, name, dan attending wajib diisi.");
    }

    const validAttending = ["yes", "no"].includes(attending) ? attending : "no";

    const rsvpEntry = {
      ticketId,
      name:      name.trim().slice(0, 200),
      attending: validAttending,
      count:     validAttending === "yes" ? Math.min(Number(count) || 1, 10) : 0,
      message:   (message || "").trim().slice(0, 1000),
      at:        at || new Date().toLocaleString("id-ID"),
      createdAt: new Date().toISOString(),
    };

    try {
      await store.setJSON(ticketId, rsvpEntry);
      console.log(`RSVP saved: ${ticketId} — ${name} (${validAttending})`);
      return ok({ success: true, ticketId });
    } catch (e) {
      console.error("Save error:", e);
      return err(500, "Gagal menyimpan data. Silakan coba lagi.");
    }
  }

  /* ══════════════════════════════════════════════
     GET — Admin mengambil semua data RSVP
  ══════════════════════════════════════════════ */
  if (event.httpMethod === "GET") {
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    const pass      = (event.queryStringParameters || {}).pass || "";

    if (!pass || pass !== adminPass) {
      return err(401, "Password salah. Coba lagi.");
    }

    try {
      const { blobs } = await store.list();

      if (blobs.length === 0) return ok([]);

      const entries = await Promise.all(
        blobs.map(async (b) => {
          try {
            return await store.get(b.key, { type: "json" });
          } catch {
            return null;
          }
        })
      );

      const sorted = entries
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return ok(sorted);
    } catch (e) {
      console.error("List error:", e);
      return err(500, "Gagal memuat data RSVP.");
    }
  }

  return err(405, "Method not allowed.");
};
