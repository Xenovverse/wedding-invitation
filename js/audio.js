/* ═══════════════════════════════════════════════════════════
   js/audio.js — Pemutar musik latar (musik.mp3)
   startGamelan() harus dipanggil dari user gesture (klik)
   agar browser mengizinkan autoplay.
   ═══════════════════════════════════════════════════════════ */

let _audioEl = null;

function startGamelan() {
  if (!_audioEl) {
    _audioEl = new Audio("musik.mp3");
    _audioEl.loop   = true;
    _audioEl.volume = 0.7;
  }
  _audioEl.play().catch(err => console.warn("Audio play blocked:", err));
}

function stopGamelan() {
  if (_audioEl) {
    _audioEl.pause();
    _audioEl.currentTime = 0;
  }
}
