# 💍 Undangan Pernikahan — Ayunda & Bagas
Website undangan pernikahan dengan RSVP tersimpan di server (Netlify Blobs),
lintas perangkat, real-time, tanpa database eksternal.

---

## 📂 Struktur Proyek

```
wedding/
├── index.html                  ← HTML shell utama
├── css/
│   └── styles.css              ← Semua CSS (animasi, layout, komponen)
├── js/
│   ├── config.js               ← Data pernikahan (edit di sini!)
│   ├── audio.js                ← Engine putar musik
│   ├── api.js                  ← Komunikasi ke Netlify Function
│   ├── export.js               ← Export PDF tiket & Excel RSVP
│   └── app.js                  ← Semua komponen React (JSX)
├── netlify/
│   └── functions/
│       └── rsvp.js             ← Serverless function (simpan & ambil RSVP)
├── netlify.toml                ← Konfigurasi Netlify
├── package.json                ← Dependensi (@netlify/blobs)
└── musik.mp3                   ← File musik (letakkan sendiri)
```

---

## 🚀 Deploy ke Netlify (step-by-step)

### Cara 1 — Drag & Drop (paling cepat)
1. Buka [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**
2. Drag folder `wedding/` ke area drop
3. Site langsung live! Lanjut ke step **Atur Password Admin** di bawah.

### Cara 2 — Via GitHub (recommended untuk update mudah)
1. **Push proyek ke GitHub:**
   ```bash
   cd wedding
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```
2. Di Netlify: **Add new site → Import from Git → GitHub**
3. Pilih repo, biarkan semua setting default, klik **Deploy site**

---

## 🔑 Atur Password Admin (WAJIB)

Setelah deploy, atur password admin agar berbeda dari default:

1. Netlify Dashboard → **Site Settings** → **Environment Variables**
2. Klik **Add a variable**:
   - **Key:** `ADMIN_PASSWORD`
   - **Value:** password pilihan Anda (misal: `WeddingAdmin2025!`)
3. Klik **Save**
4. **Redeploy site:** Deployments → klik **Trigger deploy → Deploy site**

> ⚠️ Jika tidak diatur, password default adalah `admin123` (tidak aman untuk produksi).

---

## 🎵 Menambahkan Musik

Letakkan file musik dengan nama `musik.mp3` di folder root (sejajar `index.html`).
Format yang didukung: MP3, OGG, WAV.

---

## ✏️ Kustomisasi Data Pernikahan

Edit `js/config.js` — semua data ada di object `C`:

```javascript
const C = {
  bride: {
    first:  "NamaPendek",
    full:   "Nama Lengkap, Gelar",
    father: "Bpk. Nama Ayah",
    mother: "Ibu Nama Ibu",
    photo:  "foto-wanita.jpg",  // letakkan file di root folder
  },
  groom: { ... },

  dateDisplay:  "Sabtu, 21 Juni 2025",
  rsvpDeadline: "14 Juni 2025",
  events: [
    {
      title:   "Akad Nikah",
      time:    "08.00 – 10.00 WIB",
      venue:   "Nama Gedung",
      address: "Alamat lengkap",
      mapUrl:  "https://maps.app.goo.gl/...",
      iso:     "2025-06-21T08:00:00+07:00",  // untuk hitung mundur
    },
    { ... resepsi ... }
  ],
};
```

---

## 🛠️ Development Lokal

Untuk menjalankan dan test function di lokal:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Jalankan dev server (function + static files)
netlify dev
```

Buka `http://localhost:8888`. Function RSVP akan berjalan di lokal juga.

> **Catatan:** Netlify Blobs membutuhkan koneksi ke Netlify saat development lokal.
> Jalankan `netlify link` terlebih dahulu untuk menghubungkan ke site Anda.

---

## 📊 Panel Admin

Akses panel admin dengan klik ikon **⚙** di navigasi.

**Fitur:**
- Lihat semua konfirmasi dari semua perangkat, real-time
- Filter: Semua / Hadir / Tidak Hadir
- Statistik: total hadir, tidak hadir, jumlah tamu
- Export ke Excel (.xlsx) multi-sheet
- Tombol Refresh untuk memuat data terbaru

**Password:** yang diatur di `ADMIN_PASSWORD` env var.

---

## 🏗️ Arsitektur

```
Browser (Tamu)               Netlify CDN
    │                             │
    │  1. Buka website            │
    │ ──────────────────────────► │  Serve: index.html + CSS + JS
    │                             │
    │  2. Isi form RSVP           │
    │  POST /functions/rsvp  ───► │  Function: rsvp.js
    │                             │       │
    │                             │       ▼
    │                             │  Netlify Blobs (storage)
    │                             │  set(ticketId, rsvpData)
    │                             │
    │  3. Terima tiket ◄──────────│  Response: { success, ticketId }


Browser (Admin)
    │
    │  GET /functions/rsvp?pass=xxx
    │ ──────────────────────────► Function: rsvp.js
    │                                  │
    │                                  ▼
    │                             Netlify Blobs
    │                             list() + get(each)
    │                                  │
    │ ◄─────────────────────────── [ ...rsvpData ]
```

---

## 🔒 Keamanan

- Password admin dicek **server-side** di Netlify Function — tidak bisa dibypass dari browser
- Data tamu tersimpan di **Netlify Blobs** (infrastruktur Netlify, bukan browser)
- HTTPS otomatis diaktifkan Netlify untuk semua custom domain
- Input disanitasi di server (trim, length limit)

---

## 📦 Teknologi

| Layer    | Teknologi |
|----------|-----------|
| Frontend | React 18 (CDN), Babel Standalone, Tailwind CSS |
| Backend  | Netlify Functions (Node.js serverless) |
| Storage  | Netlify Blobs (key-value, persisten) |
| Export   | SheetJS (Excel), html2canvas + jsPDF (PDF) |
| Deploy   | Netlify (free tier cukup untuk ratusan RSVP) |
