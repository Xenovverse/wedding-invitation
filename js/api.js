/* ═══════════════════════════════════════════════════════════
   js/api.js — Komunikasi dengan Netlify Function
   Data RSVP tersimpan server-side (Netlify Blobs),
   bukan localStorage — sehingga persisten & lintas perangkat.
   ═══════════════════════════════════════════════════════════ */

const RSVP_ENDPOINT = "/.netlify/functions/rsvp";

/**
 * Kirim konfirmasi RSVP ke server.
 * @param {Object} data
 * @returns {Promise<{success:boolean, ticketId:string}>}
 */
async function submitRSVP(data) {
  const res = await fetch(RSVP_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal mengirim data. Coba lagi.");
  return json;
}

/**
 * Ambil semua data RSVP — hanya untuk admin.
 * @param {string} adminPass
 * @returns {Promise<Array>}
 */
async function fetchAllRSVPs(adminPass) {
  const res  = await fetch(`${RSVP_ENDPOINT}?pass=${encodeURIComponent(adminPass)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memuat data.");
  return json;
}
