import { useState, useEffect, useRef } from "react";
import "./DashboardPage.css";

const RISK_CONFIG = {
  SAFE: { label: "Safe", colorClass: "safe", icon: "✓", hex: "#00d68f" },
  SUSPICIOUS: { label: "Suspicious", colorClass: "warn", icon: "⚠", hex: "#ffb347" },
  HIGH_RISK: { label: "High Risk", colorClass: "danger", icon: "🚨", hex: "#ff4757" },
};

const TACTIC_ICONS = {
  "Urgency/Fear": "⏰",
  "Authority Impersonation": "🏛",
  "OTP Harvesting": "🔑",
  "Account Threat": "⚠",
  "Fear/Threat": "😱",
  "Immediate Payment Demand": "💸",
};

function RiskMeter({ score }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    setTimeout(() => setAnimated(score), 300);
  }, [score]);

  const getColor = (s) => s >= 70 ? "#ff4757" : s >= 40 ? "#ffb347" : "#00d68f";
  const circumference = 2 * Math.PI * 54;
  const progress = (animated / 100) * circumference;

  return (
    <div className="risk-meter">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getColor(score)} stopOpacity="0.8" />
            <stop offset="100%" stopColor={getColor(score)} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        {/* Glow */}
        <circle cx="70" cy="70" r="54" fill="none"
          stroke={getColor(score)} strokeWidth="12" strokeOpacity="0.15"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ filter: `blur(4px)` }}
        />
        {/* Progress */}
        <circle cx="70" cy="70" r="54" fill="none"
          stroke="url(#meterGrad)" strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x="70" y="65" textAnchor="middle" fill={getColor(score)}
          fontSize="26" fontWeight="800" fontFamily="Syne, sans-serif">
          {animated}
        </text>
        <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="11" fontFamily="DM Sans, sans-serif">
          RISK SCORE
        </text>
      </svg>
    </div>
  );
}

function BarChart({ segments }) {
  const counts = { danger: 0, warn: 0, safe: 0 };
  segments.forEach(s => counts[s.risk] = (counts[s.risk] || 0) + 1);
  const total = segments.length || 1;
  const bars = [
    { key: "danger", label: "High Risk", color: "#ff4757", count: counts.danger },
    { key: "warn", label: "Suspicious", color: "#ffb347", count: counts.warn },
    { key: "safe", label: "Safe", color: "#00d68f", count: counts.safe },
  ];
  return (
    <div className="bar-chart">
      {bars.map((b, i) => (
        <div key={b.key} className="bar-row" style={{ animationDelay: `${i * 0.15 + 0.5}s` }}>
          <span className="bar-label">{b.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${(b.count / total) * 100}%`,
                background: b.color,
                boxShadow: `0 0 12px ${b.color}60`,
              }}
            />
          </div>
          <span className="bar-count" style={{ color: b.color }}>{b.count}</span>
        </div>
      ))}
    </div>
  );
}

function TacticRadar({ tactics }) {
  const cx = 100, cy = 100, r = 70;
  const n = tactics.length || 1;
  const points = tactics.map((_, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const polyStr = points.map(p => `${p.x},${p.y}`).join(" ");
  const innerR = r * 0.6;
  const innerPoints = tactics.map((_, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { x: cx + innerR * Math.cos(angle), y: cy + innerR * Math.sin(angle) };
  });
  const innerPolyStr = innerPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="radar-wrap">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map(scale => {
          const pts = tactics.map((_, i) => {
            const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
            return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
          });
          return <polygon key={scale} points={pts.join(" ")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
        })}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {/* Fill */}
        <polygon points={innerPolyStr} fill="rgba(255,71,87,0.15)" stroke="#ff4757" strokeWidth="1.5" />
        {innerPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ff4757" />
        ))}
        {/* Labels */}
        {points.map((p, i) => {
          const lx = cx + (r + 16) * Math.cos((i * 2 * Math.PI) / n - Math.PI / 2);
          const ly = cy + (r + 16) * Math.sin((i * 2 * Math.PI) / n - Math.PI / 2);
          return (
            <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="DM Sans, sans-serif">
              {tactics[i].split(" ")[0]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function DashboardPage({ results, onBack, onNew }) {
  if (!results) return null;
  const cfg = RISK_CONFIG[results.risk_level] || RISK_CONFIG.SUSPICIOUS;

  return (
    <div className="dashboard">
      <div className="db-bg">
        <div className={`db-glow db-glow-${cfg.colorClass}`} />
      </div>

      {/* Header */}
      <header className="db-header fade-in">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Analyze Again</button>
        <div className="header-title">
          <span>🛡</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>PhishShield</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onNew}>New Analysis</button>
      </header>

      {/* Alert Banner */}
      {results.risk_level !== "SAFE" && (
        <div className={`alert-banner alert-${cfg.colorClass} fade-in`}>
          <span className="alert-icon">{cfg.icon}</span>
          <span className="alert-msg">
            <strong>{cfg.label} Detected</strong> — This {results.type === "audio" ? "call recording" : "message"} contains phishing indicators. Do not share any personal information.
          </span>
          <span className="alert-badge">Confidence: {results.confidence}%</span>
        </div>
      )}

      <div className="db-body">
        {/* Left Column */}
        <div className="db-main">

          {/* Risk Overview Card */}
          <div className="card db-card fade-up">
            <div className="card-header">
              <h2 className="card-title">Risk Assessment</h2>
              <span className={`tag tag-${cfg.colorClass}`}>{cfg.icon} {cfg.label}</span>
            </div>
            <div className="risk-overview">
              <RiskMeter score={results.risk_score} />
              <div className="risk-details">
                <div className="detail-row">
                  <span className="detail-label">Language Detected</span>
                  <span className="detail-value">{results.language_detected}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Analysis Type</span>
                  <span className="detail-value">{results.type === "audio" ? "🎙 Audio Call" : "💬 Text Message"}</span>
                </div>
                {results.duration && (
                  <div className="detail-row">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{results.duration}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Confidence</span>
                  <span className="detail-value">{results.confidence}%</span>
                </div>
                <p className="risk-summary">{results.summary}</p>
              </div>
            </div>
          </div>

          {/* Highlighted Segments */}
          <div className="card db-card fade-up-1">
            <div className="card-header">
              <h2 className="card-title">Suspicious Phrases Detected</h2>
              <span className="tag tag-danger">{results.highlighted_segments?.length} flagged</span>
            </div>
            <div className="segments-list">
              {results.highlighted_segments?.map((seg, i) => (
                <div key={i} className={`segment segment-${seg.risk}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="segment-text">"{seg.text}"</div>
                  <span className={`tag tag-${seg.risk === "danger" ? "danger" : "warn"}`}>
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tactic Breakdown */}
          <div className="card db-card fade-up-2">
            <div className="card-header">
              <h2 className="card-title">Manipulation Tactics</h2>
              <span className="tag tag-accent">{results.tactics?.length} detected</span>
            </div>
            <div className="tactics-grid">
              {results.tactics?.map((tactic, i) => (
                <div key={i} className="tactic-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="tactic-icon">{TACTIC_ICONS[tactic] || "⚡"}</span>
                  <span className="tactic-name">{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="db-sidebar">

          {/* Phrase Distribution */}
          <div className="card db-card fade-up">
            <h2 className="card-title" style={{ marginBottom: 20 }}>Phrase Risk Distribution</h2>
            <BarChart segments={results.highlighted_segments || []} />
          </div>

          {/* Tactic Radar */}
          {results.tactics?.length >= 3 && (
            <div className="card db-card fade-up-1">
              <h2 className="card-title" style={{ marginBottom: 12 }}>Threat Radar</h2>
              <TacticRadar tactics={results.tactics} />
            </div>
          )}

          {/* What To Do */}
          <div className={`card db-card action-card action-${cfg.colorClass} fade-up-2`}>
            <h2 className="card-title" style={{ marginBottom: 14 }}>
              {results.risk_level === "SAFE" ? "✅ You're Safe" : "⚠ What To Do"}
            </h2>
            {results.risk_level === "HIGH_RISK" && (
              <ul className="action-list">
                <li>🚫 Do NOT share OTP, PIN, or password</li>
                <li>🚫 Do NOT click any links in the message</li>
                <li>📞 Call your bank directly on the official number</li>
                <li>📢 Report to cybercrime.gov.in</li>
                <li>🗑 Delete this message immediately</li>
              </ul>
            )}
            {results.risk_level === "SUSPICIOUS" && (
              <ul className="action-list">
                <li>⚠ Verify the caller/sender identity independently</li>
                <li>🔍 Do NOT act on urgency — take time to verify</li>
                <li>📞 Call the official number of the institution</li>
                <li>🤝 Ask a trusted person before responding</li>
              </ul>
            )}
            {results.risk_level === "SAFE" && (
              <p style={{ color: "var(--text2)", fontSize: 14 }}>
                No significant phishing indicators were detected. Stay vigilant and always verify unexpected requests independently.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="db-actions fade-up-3">
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onBack}>
              🔍 Analyze Another
            </button>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
              📥 Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
