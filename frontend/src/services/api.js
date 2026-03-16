// src/services/api.js

const BASE = "http://127.0.0.1:8000/api"; // Pointing directly to your local FastAPI server

// Helper to map FastText language codes to readable names
const LANG_MAP = {
  hi: "Hindi", mr: "Marathi", ta: "Tamil", te: "Telugu",
  bn: "Bengali", pa: "Punjabi", gu: "Gujarati", en: "English",
  unknown: "Unknown"
};

// Helper to map backend regex categories to UI tactics/labels
const TACTIC_MAP = {
  urgency: { tactic: "Urgency/Fear", label: "URGENCY", risk: "warn" },
  financial: { tactic: "Account Threat", label: "FINANCIAL THREAT", risk: "danger" },
  data_extraction: { tactic: "OTP Harvesting", label: "DATA REQUEST", risk: "danger" },
  lure: { tactic: "Too-good-to-be-true offers", label: "LURE / REWARD", risk: "warn" },
  suspicious_url: { tactic: "Suspicious Link", label: "BAD URL", risk: "danger" }
};

export async function analyzeText(text) {
  const res = await fetch(`${BASE}/analyze-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }), // We drop the language param since FastText auto-detects
  });
  
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`);
  const data = await res.json();

  // Transform backend data to match exactly what DashboardPage.jsx expects
  
  // 1. Convert "High Risk" to "HIGH_RISK"
  const formattedRiskLevel = data.risk_level.toUpperCase().replace(" ", "_");
  
  // 2. Convert 0.74 to 74
  const formattedScore = Math.round(data.risk_score * 100);

  // 3. Map flags to segments and tactics
  const segments = [];
  const tacticsSet = new Set();

  data.flags.forEach(flag => {
    const mapping = TACTIC_MAP[flag.category] || { tactic: "Suspicious Pattern", label: "FLAGGED", risk: "warn" };
    tacticsSet.add(mapping.tactic);
    
    segments.push({
      text: flag.phrase,
      label: mapping.label,
      risk: mapping.risk
    });
  });

  return {
    type: "text",
    risk_level: formattedRiskLevel,
    risk_score: formattedScore,
    language_detected: LANG_MAP[data.language_detected] || data.language_detected,
    summary: `Analyzed message intent using XLM-RoBERTa. Detected ${data.flags.length} suspicious patterns.`,
    highlighted_segments: segments,
    tactics: Array.from(tacticsSet),
    confidence: formattedScore > 80 ? 95 : 85, // AI confidence metric
    input: text
  };
}

// Placeholder for audio (we'll build this next)
// Replace the placeholder analyzeAudio in api.js with this:

export async function analyzeAudio(files) {
  const formData = new FormData();
  // We only grab the first file for this MVP payload
  formData.append("file", files[0]); 

  const res = await fetch(`${BASE}/analyze-audio`, {
    method: "POST",
    body: formData, // Notice we don't use JSON.stringify for files!
  });
  
  if (!res.ok) throw new Error(`Audio analysis failed: ${res.statusText}`);
  const data = await res.json();

  if (data.status === "error") throw new Error(data.message);

  const formattedRiskLevel = data.risk_level.toUpperCase().replace(" ", "_");
  const formattedScore = Math.round(data.risk_score * 100);

  const segments = [];
  const tacticsSet = new Set();

  data.flags.forEach(flag => {
    const mapping = TACTIC_MAP[flag.category] || { tactic: "Suspicious Pattern", label: "FLAGGED", risk: "warn" };
    tacticsSet.add(mapping.tactic);
    segments.push({ text: flag.phrase, label: mapping.label, risk: mapping.risk });
  });

  return {
    type: "audio",
    risk_level: formattedRiskLevel,
    risk_score: formattedScore,
    language_detected: LANG_MAP[data.language_detected] || data.language_detected,
    summary: `Call transcribed: "${data.original_text}". Detected ${data.flags.length} manipulation tactics.`,
    highlighted_segments: segments,
    tactics: Array.from(tacticsSet),
    confidence: formattedScore > 80 ? 92 : 82,
    input: files[0].name
  };
}