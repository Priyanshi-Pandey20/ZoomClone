import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   Otter.ai-inspired hero — pixel-faithful
   Font: Tiempos Text / fallback Georgia for
   the headline (Otter uses a serif display)
   Body: -apple-system stack (SF Pro / Segoe)
───────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:       #1A56FF;
  --blue-dark:  #1243D6;
  --black:      #0D0D0D;
  --body-gray:  #333;
  --border:     #E0E0E0;
  --bg:         #ffffff;
  --panel-bg:   #F4F6FF;
  --font-head:  'DM Serif Display', Georgia, 'Times New Roman', serif;
  --font-body:  'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

html, body { height: 100%; background: var(--bg); font-family: var(--font-body); color: var(--black); }

/* ── NAV ───────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 200;
  gap: 0;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-mark { width: 36px; height: 36px; flex-shrink: 0; }
.logo-text {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  letter-spacing: -0.3px;
  line-height: 1;
}
.logo-text span { color: var(--blue); }

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  flex: 1;
}
.nav-menu li a,
.nav-menu li button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--black);
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  font-family: var(--font-body);
  border-radius: 6px;
  transition: background 0.15s;
  white-space: nowrap;
}
.nav-menu li a:hover,
.nav-menu li button:hover { background: #f4f4f4; }
.nav-caret { font-size: 0.6rem; opacity: .6; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.nav-guest {
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--black);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  border-radius: 6px;
  transition: background .15s;
  white-space: nowrap;
}
.nav-guest:hover { background: #f4f4f4; }
.nav-register {
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--black);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  border-radius: 6px;
  transition: background .15s;
  white-space: nowrap;
}
.nav-register:hover { background: #f4f4f4; }
.nav-login {
  padding: 9px 20px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  background: var(--blue);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  border-radius: 8px;
  transition: background .15s, transform .12s;
  white-space: nowrap;
}
.nav-login:hover { background: var(--blue-dark); transform: translateY(-1px); }

/* ── HERO ───────────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* LEFT */
.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 72px 48px 72px 64px;
}

.hero-h1 {
  font-family: var(--font-head);
  font-size: clamp(3.2rem, 5.5vw, 5.2rem);
  font-weight: 400;
  line-height: 1.05;
  color: var(--black);
  letter-spacing: -0.02em;
  margin-bottom: 28px;
}
.hero-h1 .blue {
  color: var(--blue);
}

/* Animated cursor blink after headline word */
.hero-h1 .cursor {
  display: inline-block;
  width: 4px;
  height: 0.85em;
  background: var(--blue);
  border-radius: 2px;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1.1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

.hero-sub {
  font-size: 1.08rem;
  line-height: 1.65;
  color: var(--body-gray);
  max-width: 500px;
  margin-bottom: 36px;
  font-weight: 400;
}

.hero-btns {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
.btn-primary {
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: var(--blue);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background .15s, transform .12s, box-shadow .15s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.btn-primary:hover {
  background: var(--blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26,86,255,.3);
}
.btn-outline {
  padding: 13px 26px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--blue);
  background: #fff;
  border: 1.5px solid var(--blue);
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background .15s, transform .12s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.btn-outline:hover { background: #f0f3ff; transform: translateY(-1px); }

/* RIGHT — video panel */
.hero-right {
  position: relative;
  background: var(--panel-bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  padding-top: 40px;
}

/* Subtle top label above the panel */
.panel-label {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: 500;
  color: var(--blue);
  white-space: nowrap;
  z-index: 2;
}

/* Browser-chrome wrapper */
.browser-chrome {
  width: 88%;
  max-width: 660px;
  margin-top: 62px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 20px 60px rgba(0,0,0,.15), 0 4px 12px rgba(0,0,0,.08);
  overflow: hidden;
  background: #fff;
  position: relative;
  z-index: 1;
  animation: slideUp .7s .15s cubic-bezier(.22,.68,0,1.2) both;
}
@keyframes slideUp {
  from { opacity:0; transform:translateY(32px); }
  to   { opacity:1; transform:translateY(0); }
}

.browser-bar {
  height: 36px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 6px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}
.b-dot { width: 10px; height: 10px; border-radius: 50%; }
.b-dot.red   { background: #FF5F57; }
.b-dot.yel   { background: #FEBC2E; }
.b-dot.grn   { background: #28C840; }
.b-url {
  flex: 1;
  margin-left: 8px;
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 0.68rem;
  color: #888;
  font-family: var(--font-body);
}

/* Video fills the chrome */
.app-video {
  width: 100%;
  display: block;
  aspect-ratio: 16/10;
  object-fit: cover;
  background: #e8ecff;
}

/* Fallback UI when video fails / before load */
.app-fallback {
  width: 100%;
  aspect-ratio: 16/10;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.af-topbar {
  height: 38px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  flex-shrink: 0;
}
.af-breadcrumb { font-size: 0.72rem; color: #888; }
.af-sep { font-size: 0.72rem; color: #ccc; }
.af-page { font-size: 0.72rem; color: #444; font-weight: 500; }
.af-share { margin-left: auto; background: var(--blue); color: #fff; font-size: 0.68rem; font-weight: 600; padding: 4px 10px; border-radius: 5px; }
.af-tabs { display: flex; gap: 0; border-bottom: 1px solid #eee; padding: 0 16px; flex-shrink: 0; }
.af-tab { font-size: 0.72rem; padding: 7px 12px; color: #888; cursor: pointer; }
.af-tab.active { color: var(--blue); border-bottom: 2px solid var(--blue); font-weight: 600; }
.af-body { display: flex; flex: 1; overflow: hidden; }
.af-main { flex: 1; padding: 14px 16px; overflow: hidden; }
.af-title { font-size: 1rem; font-weight: 700; margin-bottom: 10px; color: #111; }
.af-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.af-avatar { width: 18px; height: 18px; border-radius: 50%; background: #7C6AF5; }
.af-author { font-size: 0.68rem; color: #888; }
.af-section { font-size: 0.72rem; font-weight: 700; color: #111; margin: 10px 0 6px; }
.af-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; }
.af-check { width: 12px; height: 12px; border: 1.5px solid #ccc; border-radius: 3px; flex-shrink: 0; margin-top: 1px; }
.af-item-text { font-size: 0.68rem; color: #444; line-height: 1.5; }
.af-insight-label { font-size: 0.68rem; font-weight: 700; color: #111; margin-bottom: 4px; }
.af-bullet { font-size: 0.65rem; color: #555; line-height: 1.5; margin-bottom: 3px; padding-left: 10px; position: relative; }
.af-bullet::before { content: '•'; position: absolute; left: 0; }

.af-chat { width: 38%; border-left: 1px solid #eee; padding: 12px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
.af-chat-tabs { display: flex; gap: 0; border-bottom: 1px solid #eee; margin-bottom: 10px; }
.af-chat-tab { font-size: 0.68rem; padding: 5px 10px; color: #888; }
.af-chat-tab.active { color: var(--blue); border-bottom: 2px solid var(--blue); font-weight: 600; }
.chat-msg { display: flex; gap: 7px; align-items: flex-start; }
.chat-av { width: 22px; height: 22px; border-radius: 50%; background: #e0e0e0; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 700; color: #555; }
.chat-av.otter { background: var(--blue); color: #fff; }
.chat-content { flex: 1; }
.chat-name { font-size: 0.62rem; font-weight: 700; color: #111; margin-bottom: 3px; }
.chat-name span { font-size: 0.58rem; font-weight: 400; color: #aaa; margin-left: 5px; }
.chat-text { font-size: 0.64rem; color: #444; line-height: 1.55; }

/* Mute icon top-right */
.mute-icon {
  position: absolute;
  top: 50px;
  right: 16px;
  z-index: 3;
  color: #aaa;
  font-size: 1.1rem;
  cursor: pointer;
}

/* fade in hero left */
.hero-left { animation: fadeInLeft .65s ease both; }
@keyframes fadeInLeft {
  from { opacity:0; transform:translateX(-20px); }
  to   { opacity:1; transform:translateX(0); }
}

/* ── TESTIMONIAL CARD ───────────────────── */
.testimonial-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 40px;
  max-width: 480px;
  padding: 20px 22px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,.07);
  animation: fadeInLeft .65s .3s ease both;
}
.testimonial-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--border);
}
.testimonial-body { flex: 1; }
.testimonial-quote {
  font-size: 0.88rem;
  color: var(--black);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 8px;
}
.testimonial-author {
  font-size: 0.78rem;
  color: var(--gray, #6B7280);
  font-weight: 500;
}

/* ── RESPONSIVE ─────────────────────────── */
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-left { padding: 52px 28px; }
  .hero-right { min-height: 380px; padding-top: 28px; }
  .browser-chrome { width: 92%; margin-top: 48px; }
  .nav-menu { display: none; }
  .nav { padding: 0 20px; }
}
`;

/* ── App-UI fallback (mirrors the screenshot) ── */
function AppUI() {
  return (
    <div className="app-fallback">
      <div className="af-topbar">
        <span className="af-breadcrumb">Partnerships</span>
        <span className="af-sep">/</span>
        <span className="af-page">Kickoff Meeting</span>
        <span className="af-share">Share</span>
      </div>
      <div className="af-tabs">
        <span className="af-tab active">Summary</span>
        <span className="af-tab">Transcript</span>
      </div>
      <div className="af-body">
        <div className="af-main">
          <div className="af-title">Kickoff Meeting</div>
          <div className="af-meta">
            <div className="af-avatar" />
            <span className="af-author">Amanda · Today at 1:31 pm · 12 min</span>
          </div>
          <div className="af-section">Action Items</div>
          {["Schedule a follow-up sync after an initial working period to check progress and address any roadblocks.", "Add an action item"].map((t, i) => (
            <div className="af-item" key={i}>
              <div className="af-check" />
              <span className="af-item-text" style={{ color: i === 1 ? '#bbb' : undefined }}>{t}</span>
            </div>
          ))}
          <div className="af-section">🔍 Insights</div>
          <div className="af-insight-label">Authority</div>
          {["Amanda appears to be the primary decision-maker for overseeing the project's direction.", "She is focused on ensuring alignment across teams and establishing clear communication from the start."].map((b, i) => (
            <div className="af-bullet" key={i}>{b}</div>
          ))}
          <div className="af-insight-label" style={{ marginTop: 8 }}>Budget</div>
          <div className="af-bullet">Budget discussions were briefly touched on, with Amanda considering various resource allocations.</div>
        </div>
        <div className="af-chat">
          <div className="af-chat-tabs">
            <span className="af-chat-tab active">AI Chat</span>
            <span className="af-chat-tab">Comments</span>
          </div>
          <div className="chat-msg">
            <div className="chat-av">A</div>
            <div className="chat-content">
              <div className="chat-name">Amanda <span>9:15am</span></div>
              <div className="chat-text">Hey @otter, can you summarize what we discussed last time?</div>
            </div>
          </div>
          <div className="chat-msg">
            <div className="chat-av otter">O</div>
            <div className="chat-content">
              <div className="chat-name">Otter <span>9:15am</span></div>
              <div className="chat-text">Sure thing Amanda. Last time, we discussed key project updates, outstanding tasks, and next steps. We covered ongoing initiatives, challenges, and any blockers preventing progress.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.addEventListener("error", () => setVideoFailed(true));
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          {/* Unique logo: video camera inside a rounded square with a signal arc */}
          <svg className="logo-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="#1A56FF"/>
            {/* Camera body */}
            <rect x="6" y="11" width="16" height="12" rx="2.5" fill="white"/>
            {/* Camera lens */}
            <circle cx="14" cy="17" r="3.5" fill="#1A56FF"/>
            <circle cx="14" cy="17" r="1.8" fill="white"/>
            {/* Play triangle / record dot */}
            <circle cx="14" cy="17" r="0.8" fill="#1A56FF"/>
            {/* Video flag */}
            <path d="M22 14.5L29 11.5V22.5L22 19.5V14.5Z" fill="white"/>
            {/* Signal arc top-right */}
            <path d="M27 7 Q31 7 31 11" stroke="#93B4FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M27 4 Q34 4 34 11" stroke="#93B4FF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
          </svg>
          <span className="logo-text">Apna <span>Video</span> Call</span>
        </a>

        <div className="nav-right" style={{marginLeft: 'auto'}}>
          <button className="nav-guest" onClick={() => navigate("/ppp")}>Join as Guest</button>
          <button className="nav-register" onClick={() => navigate("/auth")}>Register</button>
          <button className="nav-login" onClick={() => navigate("/auth")}>Login</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="hero">

        {/* LEFT */}
        <div className="hero-left">
          <h1 className="hero-h1">
            Turn meetings<br />
            into transcri<span className="blue">p<span className="cursor" /></span>
          </h1>

          <p className="hero-sub">
            Apna Video Call is the AI meeting assistant that builds your knowledge
            base and powers your workflow with transcription,
            automated summaries, AI Chat, and more.
          </p>

          <div className="hero-btns">
            <Link to="/auth" className="btn-primary">Get Started</Link>
          </div>

          {/* Testimonial card */}
          <div className="testimonial-card">
            <img
              className="testimonial-avatar"
              src="https://cdn.prod.website-files.com/618e9316785b3582a5178502/67d9a0424159ef00c676ac0a_savage.avif"
              alt="Brandon Savage"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              style={{
                display: 'none', width: 52, height: 52, borderRadius: '50%',
                background: 'var(--blue)', color: '#fff', fontWeight: 700,
                fontSize: '1.1rem', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >BS</div>
            <div className="testimonial-body">
              <p className="testimonial-quote">"I use Apna Video Call almost everyday….it is a superpower."</p>
              <p className="testimonial-author">— Brandon Savage, Head of Solution Enablement, Voziq.ai</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <span className="panel-label">All to help you bring your A-game</span>
          <button
            onClick={toggleMute}
            title={muted ? "Unmute" : "Mute"}
            className="mute-icon"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          <div className="browser-chrome">
            <div className="browser-bar">
              <div className="b-dot red" />
              <div className="b-dot yel" />
              <div className="b-dot grn" />
              <div className="b-url">apnavideocall.ai / meeting</div>
            </div>

            {!videoFailed ? (
              <video
                ref={videoRef}
                className="app-video"
                src="https://public.otter.ai/video/otter-landing-video-september-2025.mp4"
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoFailed(true)}
              />
            ) : (
              <AppUI />
            )}
          </div>
        </div>

      </main>
    </>
  );
}