/* ═══════════════════════════════════════════════════════════
   js/config.js — Data pernikahan & utilitas umum
   Edit bagian ini sesuai kebutuhan.
   ═══════════════════════════════════════════════════════════ */

const C = {
  bride: {
    first:  "Ayunda",
    full:   "Ayunda Citra Putri, S.Ars",
    father: "Bpk. Hendra Kusuma",
    mother: "Ibu Retno Wulandari",
    bio:    "Arsitektur menjadi passion-nya, namun kecintaan pada budaya Jawa mengalir deras dalam setiap karya dan langkah hidupnya.",
    photo:  "bagas.jpg",
  },
  groom: {
    first:  "Bagas",
    full:   "Bagas Dwi Wicaksono, S.T",
    father: "Bpk. Sutrisno Wibowo",
    mother: "Ibu Sri Hartini",
    bio:    "Seorang insinyur yang percaya bahwa keindahan sejati lahir dari keseimbangan antara logika, rasa, dan kedalaman jiwa.",
    photo:  "putri.jpg",
  },
  dateDisplay:  "Sabtu, 21 Juni 2025",
  rsvpDeadline: "14 Juni 2025",
  events: [
    {
      emoji:   "💍",
      title:   "Akad Nikah",
      sub:     "Prosesi pernikahan resmi",
      date:    "Sabtu, 21 Juni 2025",
      time:    "08.00 – 10.00 WIB",
      venue:   "Masjid Agung Keraton Yogyakarta",
      address: "Jl. Kauman No.1, Ngupasan, Yogyakarta",
      mapUrl:  "https://maps.app.goo.gl/GZW2Q34DcR9WroTV9",
      iso:     "2026-06-21T08:00:00+07:00",
    },
    {
      emoji:   "💐",
      title:   "Resepsi Pernikahan",
      sub:     "Syukuran & jamuan tamu",
      date:    "Sabtu, 21 Juni 2025",
      time:    "11.00 – 15.00 WIB",
      venue:   "Pendopo Ageng Taman Sari",
      address: "Jl. Taman No.1, Patehan, Yogyakarta",
      mapUrl:  "https://maps.app.goo.gl/N4RDZrH3nSFq6VUFA",
      iso:     "2026-06-21T11:00:00+07:00",
    },
  ],
};

/** Generate unique ticket ID (8 char, ambiguous chars excluded) */
function genId() {
  const ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => ch[Math.floor(Math.random() * ch.length)]).join("");
}
