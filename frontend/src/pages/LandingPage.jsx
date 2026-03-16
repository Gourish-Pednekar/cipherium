import "./LandingPage.css";

const LANGUAGES = ["हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "ਪੰਜਾਬੀ", "বাংলা", "ગુજરાતી", "English"];
const STATS = [
  { value: "47%", label: "Scam calls in regional languages" },
  { value: "2.4B", label: "Indians targeted annually" },
  { value: "93%", label: "Detection accuracy" },
];
const FEATURES = [
  { icon: "🎙", title: "Audio Analysis", desc: "Upload call recordings. We transcribe and scan for scam signals across 8+ Indian languages." },
  { icon: "💬", title: "Text Scanning", desc: "Paste WhatsApp messages or SMS. Detect OTP fraud, fake authority claims, urgency tactics." },
  { icon: "📊", title: "Risk Dashboard", desc: "Visual risk scores, highlighted suspicious phrases, manipulation tactic breakdown." },
  { icon: "⚡", title: "Instant Alerts", desc: "Real-time warnings with Safe / Suspicious / High Risk classification." },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      {/* Background */}
      <div className="landing-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-grid" />
      </div>

      {/* Nav */}
      <nav className="landing-nav fade-in">
        <div className="nav-logo">
          <span className="logo-icon">🛡</span>
          <span className="logo-text">PhishShield</span>
        </div>
        <div className="nav-langs">
          {LANGUAGES.map(l => <span key={l} className="lang-pill">{l}</span>)}
        </div>
        <button className="btn btn-primary" onClick={onStart}>Launch App →</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge fade-up">
          <span className="badge-dot" />
          AI-Powered · Vernacular Languages · Real-time Detection
        </div>
        <h1 className="hero-title fade-up-1">
          Stop Scams Before<br />
          <span className="title-accent">They Stop You</span>
        </h1>
        <p className="hero-sub fade-up-2">
          India's first multilingual phishing detector. Analyze calls and messages<br />
          in Hindi, Marathi, Tamil and more — powered by advanced AI.
        </p>
        <div className="hero-actions fade-up-3">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            <span>Analyze Now</span>
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn btn-ghost btn-lg">Watch Demo</button>
        </div>

        {/* Stats */}
        <div className="stats-row fade-up-4">
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features fade-up-5">
        <div className="section-label">Core Features</div>
        <h2 className="section-title">Everything You Need to Stay Safe</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-glow" />
          <h2 className="cta-title">Don't Be the Next Victim</h2>
          <p className="cta-sub">Analyze any suspicious message or call recording in seconds.</p>
          <button className="btn btn-primary btn-lg" onClick={onStart}>Start Free Analysis →</button>
        </div>
      </section>

      <footer className="landing-footer">
        <span>© 2025 PhishShield · Built for Hackathon</span>
        <span className="footer-langs">Supports: Hindi · Marathi · Tamil · Telugu · Bengali · Punjabi · Gujarati</span>
      </footer>
    </div>
  );
}
