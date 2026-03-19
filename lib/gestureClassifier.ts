/**
 * Gesture Classifier – BISINDO Rule-Based
 *
 * Setiap dari 12 gestur memiliki pola jari UNIK:
 *
 *  Halo          : thumbOpen  T T T T T
 *  Ya            : thumbUp(↑) F F F F   ← jempol TEGAK ke atas, bukan miring
 *  Tidak         : F T F F F
 *  Tolong        : F T T F F
 *  Maaf          : F F F F F            ← kepalan murni, jempol juga masuk
 *  Terima Kasih  : T T T T F
 *  Makan         : F T T T F
 *  Minum         : F F F F T
 *  Rumah         : T F F F T            ← shaka (jempol + kelingking)
 *  Selamat Pagi  : T T F F F            ← L-shape (jempol samping + telunjuk atas)
 *  Selamat Malam : F F T T F            ← tengah + manis
 *  Sekolah       : F F F T T            ← manis + kelingking
 *
 * MediaPipe Hands Landmark indices:
 *  0  = WRIST
 *  1  = THUMB_CMC, 2 = THUMB_MCP, 3 = THUMB_IP, 4 = THUMB_TIP
 *  5  = INDEX_MCP, 6 = INDEX_PIP, 7 = INDEX_DIP, 8 = INDEX_TIP
 *  9  = MIDDLE_MCP, 10 = MIDDLE_PIP, 11 = MIDDLE_DIP, 12 = MIDDLE_TIP
 *  13 = RING_MCP,  14 = RING_PIP, 15 = RING_DIP, 16 = RING_TIP
 *  17 = PINKY_MCP, 18 = PINKY_PIP, 19 = PINKY_DIP, 20 = PINKY_TIP
 */

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface ClassifyResult {
  label: string;
  confidence: number; // 0–1
}

// ─────────────────────────── Helpers ───────────────────────────

/**
 * Cek apakah jari (selain ibu jari) sedang terentang ke atas.
 * Berdasarkan posisi relatif tip vs pip vs mcp dalam sumbu Y.
 */
function isFingerUp(lm: Landmark[], tip: number, pip: number, mcp: number): boolean {
  // tip harus lebih tinggi (y lebih kecil) dari pip,
  // dan jarak tip-mcp harus lebih besar dari jarak pip-mcp (untuk menghindari false positive)
  return lm[tip].y < lm[pip].y && (lm[mcp].y - lm[tip].y) > (lm[mcp].y - lm[pip].y) * 0.5;
}

/**
 * Cek apakah ibu jari terentang KE SAMPING (bukan ke atas).
 * Dipakai untuk: Halo, Terima Kasih, Rumah, Selamat Pagi.
 */
function isThumbSideOpen(lm: Landmark[]): boolean {
  const tip = lm[4];
  const mcp = lm[2];
  // Jarak horizontal yang cukup jauh dari pangkal
  return Math.abs(tip.x - mcp.x) > 0.05;
}

/**
 * Cek apakah ibu jari mengarah TEGAK KE ATAS (khusus untuk "Ya").
 * Mensyaratkan ujung ibu jari secara signifikan lebih tinggi dari MCP dan pergelangan.
 */
function isThumbStrictlyUp(lm: Landmark[]): boolean {
  const tip    = lm[4];
  const ip     = lm[3];
  const mcp    = lm[2];
  const wrist  = lm[0];
  // Ujung harus jauh lebih tinggi dari ip dan wrist (threshold lebih ketat dari sebelumnya)
  return tip.y < ip.y - 0.04 && tip.y < mcp.y - 0.06 && tip.y < wrist.y - 0.08;
}

/**
 * Cek apakah ibu jari benar-benar terlipat ke dalam (kepalan).
 * Berdekat dengan jari telunjuk / tidak tampak menjulur.
 */
function isThumbFolded(lm: Landmark[]): boolean {
  return !isThumbSideOpen(lm) && !isThumbStrictlyUp(lm);
}

// ─────────────────────── Main Classifier ───────────────────────

export function classifyGesture(lm: Landmark[]): ClassifyResult | null {
  if (!lm || lm.length < 21) return null;

  // Status setiap jari (non-thumb)
  const idx = isFingerUp(lm, 8,  6,  5);   // telunjuk
  const mid = isFingerUp(lm, 12, 10, 9);   // tengah
  const rng = isFingerUp(lm, 16, 14, 13);  // manis
  const pky = isFingerUp(lm, 20, 18, 17);  // kelingking

  const thumbSide   = isThumbSideOpen(lm);
  const thumbUp     = isThumbStrictlyUp(lm);
  const thumbFolded = isThumbFolded(lm);

  // ── 1. Halo: semua 5 jari terbuka (jempol ke samping + 4 jari naik) ──
  if (thumbSide && idx && mid && rng && pky) {
    return { label: 'Halo', confidence: 1.0 };
  }

  // ── 2. Ya: ibu jari TEGAK ke atas, 4 jari lain terlipat ──
  // Harus thumbUp (vertikal), bukan sekadar terbuka ke samping
  if (thumbUp && !idx && !mid && !rng && !pky) {
    return { label: 'Ya', confidence: 1.0 };
  }

  // ── 3. Selamat Pagi: ibu jari ke SAMPING + hanya telunjuk naik (L-shape) ──
  // thumbSide tapi bukan thumbUp, HANYA telunjuk naik
  if (thumbSide && idx && !mid && !rng && !pky) {
    return { label: 'Selamat Pagi', confidence: 1.0 };
  }

  // ── 4. Tidak: hanya telunjuk naik, jempol TERLIPAT ──
  if (thumbFolded && idx && !mid && !rng && !pky) {
    return { label: 'Tidak', confidence: 1.0 };
  }

  // ── 5. Tolong: telunjuk + tengah naik, jempol terlipat ──
  if (thumbFolded && idx && mid && !rng && !pky) {
    return { label: 'Tolong', confidence: 1.0 };
  }

  // ── 6. Selamat Malam: tengah + manis naik, jempol terlipat ──
  if (thumbFolded && !idx && mid && rng && !pky) {
    return { label: 'Selamat Malam', confidence: 1.0 };
  }

  // ── 7. Sekolah: manis + kelingking naik, jempol terlipat ──
  if (thumbFolded && !idx && !mid && rng && pky) {
    return { label: 'Sekolah', confidence: 1.0 };
  }

  // ── 8. Maaf: SEMUA terlipat termasuk jempol — kepalan murni ──
  if (thumbFolded && !idx && !mid && !rng && !pky) {
    return { label: 'Maaf', confidence: 1.0 };
  }

  // ── 9. Minum: HANYA kelingking naik, jempol terlipat ──
  if (thumbFolded && !idx && !mid && !rng && pky) {
    return { label: 'Minum', confidence: 1.0 };
  }

  // ── 10. Terima Kasih: jempol ke samping + telunjuk+tengah+manis naik, kelingking terlipat ──
  if (thumbSide && idx && mid && rng && !pky) {
    return { label: 'Terima Kasih', confidence: 1.0 };
  }

  // ── 11. Makan: telunjuk+tengah+manis naik, jempol terlipat, kelingking terlipat ──
  if (thumbFolded && idx && mid && rng && !pky) {
    return { label: 'Makan', confidence: 1.0 };
  }

  // ── 12. Rumah: jempol ke samping + kelingking naik, 3 jari tengah terlipat (shaka) ──
  if (thumbSide && !idx && !mid && !rng && pky) {
    return { label: 'Rumah', confidence: 1.0 };
  }

  // Tidak cocok dengan gestur manapun
  return null;
}
