import { useState, useRef } from "react";
import "./AnalyzePage.css";

const SAMPLE_RESULTS = {
  text: {
    risk_level: "HIGH_RISK",
    risk_score: 87,
    language_detected: "Hindi",
    summary: "This message contains multiple phishing indicators including OTP request, urgency tactics, and impersonation of a banking authority.",
    highlighted_segments: [
      { text: "आपका खाता बंद हो जाएगा", label: "URGENCY", risk: "danger" },
      { text: "अभी OTP शेयर करें", label: "OTP REQUEST", risk: "danger" },
      { text: "SBI बैंक की तरफ से", label: "FAKE AUTHORITY", risk: "warn" },
      { text: "24 घंटे के अंदर", label: "TIME PRESSURE", risk: "warn" },
    ],
    tactics: ["Urgency/Fear", "Authority Impersonation", "OTP Harvesting", "Account Threat"],
    confidence: 94,
  },
  audio: {
    risk_level: "SUSPICIOUS",
    risk_score: 62,
    language_detected: "Marathi",
    duration: "2:34",
    summary: "Caller claims to be from Income Tax department, creating urgency around a tax notice. Uses fear tactics.",
    highlighted_segments: [
      { text: "आयकर विभागाचे अधिकारी", label: "FAKE AUTHORITY", risk: "warn" },
      { text: "तुम्हाला अटक होईल", label: "FEAR TACTIC", risk: "danger" },
      { text: "लगेच पैसे भरा", label: "PAYMENT DEMAND", risk: "warn" },
    ],
    tactics: ["Authority Impersonation", "Fear/Threat", "Immediate Payment Demand"],
    confidence: 78,
  },
};

const RISK_CONFIG = {
  SAFE: { label: "Safe", color: "safe", icon: "✓", desc: "No phishing indicators detected" },
  SUSPICIOUS: { label: "Suspicious", color: "warn", icon: "⚠", desc: "Some suspicious patterns found" },
  HIGH_RISK: { label: "High Risk", color: "danger", icon: "🚨", desc: "Strong phishing indicators detected" },
};

export default function AnalyzePage({ onBack, onResults }) {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const fileRef = useRef();
  const dropRef = useRef();
  const [dragging, setDragging] = useState(false);

  const LOAD_STEPS = [
    "Detecting language...",
    "Transcribing audio...",
    "Running AI analysis...",
    "Identifying tactics...",
    "Generating report...",
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("audio/") || f.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i));
    setAudioFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAudioFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const removeAudio = (i) => setAudioFiles(prev => prev.filter((_, idx) => idx !== i));

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAnalyze = async () => {
    if (tab === "text" && !text.trim()) return;
    if (tab === "audio" && audioFiles.length === 0) return;

    setLoading(true);
    setLoadStep(0);

    // Simulate loading steps
    for (let i = 0; i < LOAD_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setLoadStep(i + 1);
    }

    await new Promise(r => setTimeout(r, 400));
    setLoading(false);

    // Pass sample results (replace with real API call)
    onResults({
      type: tab,
      input: tab === "text" ? text : audioFiles.map(f => f.name),
      language,
      ...SAMPLE_RESULTS[tab],
    });
  };

  return (
    <div className="analyze-page">
      <div className="analyze-bg">
        <div className="bg-orb bg-orb-1" style={{ opacity: 0.08 }} />
      </div>

      {/* Header */}
      <header className="analyze-header fade-in">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <div className="header-title">
          <span className="logo-icon">🛡</span>
          <span className="header-brand">PhishShield</span>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          AI Ready
        </div>
      </header>

      <div className="analyze-body">
        <div className="analyze-container fade-up">
          <div className="analyze-top">
            <h1 className="analyze-title">Analyze for Scams</h1>
            <p className="analyze-sub">Upload audio files or paste text messages for instant phishing detection</p>
          </div>

          {/* Tabs */}
          <div className="tabs fade-up-1">
            <button className={`tab ${tab === "text" ? "tab-active" : ""}`} onClick={() => setTab("text")}>
              <span>💬</span> Text Message
            </button>
            <button className={`tab ${tab === "audio" ? "tab-active" : ""}`} onClick={() => setTab("audio")}>
              <span>🎙</span> Audio / Call
            </button>
          </div>

          {/* Language Selector */}
          <div className="lang-selector fade-up-2">
            <label>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="auto">Auto-detect</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="mr">Marathi (मराठी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="bn">Bengali (বাংলা)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Text Input */}
          {tab === "text" && (
            <div className="input-section fade-up-3">
              <div className="input-label">
                <span>Message Content</span>
                <span className="char-count">{text.length} chars</span>
              </div>
              <textarea
                className="text-input"
                placeholder={"Paste suspicious WhatsApp message, SMS, or email here...\n\nExample: आपका SBI खाता बंद होने वाला है। अभी 9876543210 पर OTP शेयर करें।"}
                value={text}
                onChange={e => setText(e.target.value)}
                rows={8}
              />
              <div className="input-hints">
                <span className="hint">✓ WhatsApp messages</span>
                <span className="hint">✓ SMS</span>
                <span className="hint">✓ Emails</span>
                <span className="hint">✓ Any language</span>
              </div>
            </div>
          )}

          {/* Audio Upload */}
          {tab === "audio" && (
            <div className="input-section fade-up-3">
              <div
                ref={dropRef}
                className={`dropzone ${dragging ? "dropzone-active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".mp3,.wav,.ogg,.m4a,.aac,.flac,audio/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div className="drop-icon">🎙</div>
                <p className="drop-text">Drop audio files here or <span className="drop-link">browse</span></p>
                <p className="drop-sub">MP3, WAV, OGG, M4A, AAC · Max 5 files · Up to 50MB each</p>
              </div>

              {audioFiles.length > 0 && (
                <div className="audio-list">
                  {audioFiles.map((file, i) => (
                    <div key={i} className="audio-item">
                      <div className="audio-icon">🔊</div>
                      <div className="audio-info">
                        <span className="audio-name">{file.name}</span>
                        <span className="audio-size">{formatSize(file.size)}</span>
                      </div>
                      <button className="remove-btn" onClick={() => removeAudio(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="input-hints">
                <span className="hint">✓ Phone call recordings</span>
                <span className="hint">✓ Voice messages</span>
                <span className="hint">✓ Multiple files</span>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            className={`btn btn-primary btn-full fade-up-4 ${loading ? "btn-loading" : ""}`}
            onClick={handleAnalyze}
            disabled={loading || (tab === "text" ? !text.trim() : audioFiles.length === 0)}
          >
            {loading ? (
              <>
                <span className="spinner" />
                <span>{LOAD_STEPS[Math.min(loadStep, LOAD_STEPS.length - 1)]}</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze for Phishing</span>
              </>
            )}
          </button>

          {loading && (
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${(loadStep / LOAD_STEPS.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Side Info */}
        <div className="analyze-sidebar fade-up-2">
          <div className="card sidebar-card">
            <h3 className="sidebar-title">What We Detect</h3>
            <ul className="detect-list">
              {[
                { icon: "🔑", text: "OTP & credential requests" },
                { icon: "⏰", text: "Urgency & time pressure" },
                { icon: "🏛", text: "Fake authority claims" },
                { icon: "💸", text: "Suspicious payment demands" },
                { icon: "😱", text: "Fear & threat tactics" },
                { icon: "🔗", text: "Suspicious links" },
                { icon: "🎭", text: "Impersonation patterns" },
                { icon: "🎁", text: "Too-good-to-be-true offers" },
              ].map(item => (
                <li key={item.text} className="detect-item">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card sidebar-card">
            <h3 className="sidebar-title">Risk Levels</h3>
            {Object.entries(RISK_CONFIG).map(([key, cfg]) => (
              <div key={key} className={`risk-row risk-${cfg.color}`}>
                <span className={`tag tag-${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </span>
                <span className="risk-desc">{cfg.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
