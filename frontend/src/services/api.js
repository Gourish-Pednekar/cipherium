// src/services/api.js
// Connects to FastAPI backend at /api
// Proxied via vite.config.js → http://localhost:8000
 
const BASE = "/api";
 
/**
 * Analyze text message for phishing
 * @param {string} text
 * @param {string} language - e.g. "auto", "hi", "mr", "ta"
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeText(text, language = "auto") {
  const res = await fetch(`${BASE}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`);
  return res.json();
}
 
/**
 * Analyze audio file(s) for phishing
 * @param {File[]} files
 * @param {string} language
 * @param {Function} onProgress
 * @returns {Promise<AnalysisResult[]>}
 */
export async function analyzeAudio(files, language = "auto", onProgress) {
  const formData = new FormData();
  files.forEach((file, i) => formData.append(`files`, file));
  formData.append("language", language);
 
  const res = await fetch(`${BASE}/analyze/audio`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Audio analysis failed: ${res.statusText}`);
  return res.json();
}
 
/**
 * Get analysis history from Supabase (via backend)
 * @returns {Promise<AnalysisResult[]>}
 */
export async function getHistory() {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}
 
/*
Expected AnalysisResult shape from backend:
{
  risk_level: "SAFE" | "SUSPICIOUS" | "HIGH_RISK",
  risk_score: number,            // 0-100
  language_detected: string,
  summary: string,
  confidence: number,            // 0-100
  highlighted_segments: [
    { text: string, label: string, risk: "danger" | "warn" | "safe" }
  ],
  tactics: string[],
  // audio only:
  transcript?: string,
  duration?: string,
}
*/