/* ═══════════════════════════════════════════════════════════
   js/export.js — Ekspor tiket (PDF) & data RSVP (Excel)
   Dependensi CDN: html2canvas, jsPDF, SheetJS (XLSX)
   ═══════════════════════════════════════════════════════════ */

/** Ekspor area tiket ke file PDF (A5). */
async function exportTicketAsPDF() {
  const el = document.getElementById("ticket-print-area");
  if (!el) return;
  try {
    const canvas = await html2canvas(el, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
    });
    const imgData   = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf       = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    const pw        = pdf.internal.pageSize.getWidth();
    const ph        = (canvas.height * pw) / canvas.width;
    const yo        = (pdf.internal.pageSize.getHeight() - ph) / 2;
    pdf.addImage(imgData, "PNG", 0, Math.max(0, yo), pw, ph);
    pdf.save(`Tiket-${C.bride.first}-${C.groom.first}.pdf`);
  } catch (err) {
    console.error("PDF export error:", err);
    alert("Gagal mengekspor PDF. Silakan coba lagi.");
  }
}

/** Ekspor seluruh data RSVP ke file Excel multi-sheet. */
function exportExcel(allData) {
  const wb    = XLSX.utils.book_new();
  const hadir = allData.filter(r => r.attending === "yes");
  const absen = allData.filter(r => r.attending === "no");
  const total = hadir.reduce((s, r) => s + Number(r.count || 1), 0);

  const makeSheet = (rows) => {
    const headers = ["No","Nama Tamu","Status","Jumlah Tamu","ID Tiket","Ucapan","Waktu Konfirmasi"];
    const body    = rows.map((r, i) => [
      i + 1,
      r.name || "",
      r.attending === "yes" ? "Hadir" : "Tidak Hadir",
      r.attending === "yes" ? Number(r.count || 1) : "-",
      r.ticketId || "-",
      r.message  || "",
      r.at       || "",
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...body]);
    ws["!cols"] = [{wch:4},{wch:30},{wch:14},{wch:12},{wch:12},{wch:45},{wch:22}];
    return ws;
  };

  /* Sheet 1 — Ringkasan */
  const now = new Date().toLocaleString("id-ID");
  const wsSummary = XLSX.utils.aoa_to_sheet([
    ["RINGKASAN RSVP", `${C.bride.first} & ${C.groom.first}`],
    [],
    ["Tanggal Pernikahan", C.dateDisplay],
    ["Diekspor pada",      now],
    [],
    ["STATISTIK",            "Jumlah"],
    ["Total Responden",      allData.length],
    ["Tamu Hadir",           hadir.length],
    ["Tamu Tidak Hadir",     absen.length],
    ["Total Orang Hadir",    total],
  ]);
  wsSummary["!cols"] = [{wch:26},{wch:34}];
  XLSX.utils.book_append_sheet(wb, wsSummary,      "Ringkasan");
  XLSX.utils.book_append_sheet(wb, makeSheet(allData), "Semua Tamu");
  if (hadir.length > 0) XLSX.utils.book_append_sheet(wb, makeSheet(hadir), "Tamu Hadir");
  if (absen.length > 0) XLSX.utils.book_append_sheet(wb, makeSheet(absen), "Tamu Tidak Hadir");

  XLSX.writeFile(wb, `RSVP-${C.bride.first}-${C.groom.first}.xlsx`);
}
