import React, { useState, useContext } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import RestoreIcon from "@mui/icons-material/Restore"
import VideoCallIcon from "@mui/icons-material/VideoCall"
import LogoutIcon from "@mui/icons-material/Logout"
import AddIcon from "@mui/icons-material/Add"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

/* ── Design tokens (shared with landing page & video meet) ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:      #1A56FF;
  --blue-dark: #1243D6;
  --blue-dim:  rgba(26,86,255,0.15);
  --black:     #0D0D0D;
  --surface:   #111111;
  --surface2:  #1a1a1a;
  --border:    rgba(255,255,255,0.08);
  --text:      #ffffff;
  --text-muted: rgba(255,255,255,0.4);
  --text-dim:   rgba(255,255,255,0.15);
  --font-head: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
}

html, body {
  height: 100%;
  background: var(--black);
  font-family: var(--font-body);
  color: var(--text);
  overflow-x: hidden;
}

/* ── PAGE WRAP ── */
.home-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Atmospheric background */
.home-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.home-bg::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse, rgba(26,86,255,0.12) 0%, transparent 65%);
  filter: blur(40px);
}
.home-bg::after {
  content: '';
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(ellipse, rgba(26,86,255,0.07) 0%, transparent 65%);
  filter: blur(60px);
}

/* ── NAV ── */
.home-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  background: rgba(13,13,13,0.9);
  backdrop-filter: blur(12px);
  gap: 12px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: auto;
}
.nav-logo-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}
.nav-logo-text span { color: var(--blue); }

.nav-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
  position: relative;
}
.nav-icon-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--text);
  border-color: rgba(255,255,255,0.15);
}
.nav-icon-btn .tooltip {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.nav-icon-btn:hover .tooltip { opacity: 1; }

.nav-logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.nav-logout-btn:hover {
  background: rgba(239,68,68,0.1);
  border-color: rgba(239,68,68,0.3);
  color: #ef4444;
}

/* ── MAIN CONTENT ── */
.home-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0;
  padding: 0 64px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 60px);
}

/* ── LEFT PANEL ── */
.home-left {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 60px 48px 60px 0;
  animation: fadeInLeft 0.6s ease both;
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.home-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--blue-dim);
  border: 1px solid rgba(26,86,255,0.3);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--blue);
  letter-spacing: 0.5px;
  width: fit-content;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--blue);
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.home-heading {
  font-family: var(--font-head);
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--text);
  letter-spacing: -0.02em;
}
.home-heading .blue { color: var(--blue); }
.home-heading .dim { color: var(--text-muted); }

.home-sub {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 420px;
}

/* Join card */
.join-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(8px);
  animation: fadeInLeft 0.6s 0.15s ease both;
}
.join-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.join-input-row {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.join-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px 16px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  letter-spacing: 0.5px;
}
.join-input::placeholder { color: var(--text-dim); }
.join-input:focus {
  border-color: var(--blue);
  background: rgba(26,86,255,0.06);
}

.join-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.join-btn:hover {
  background: var(--blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26,86,255,0.35);
}
.join-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.join-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-dim);
  font-size: 0.75rem;
}
.join-divider::before,
.join-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.new-meeting-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 0;
  background: transparent;
  color: var(--blue);
  border: 1.5px solid rgba(26,86,255,0.35);
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  width: 100%;
}
.new-meeting-btn:hover {
  background: rgba(26,86,255,0.08);
  border-color: rgba(26,86,255,0.6);
  transform: translateY(-1px);
}

/* Stats row */
.stats-row {
  display: flex;
  gap: 24px;
  animation: fadeInLeft 0.6s 0.3s ease both;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-value {
  font-family: var(--font-head);
  font-size: 1.6rem;
  color: var(--text);
  letter-spacing: -0.02em;
}
.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
}
.stat-sep {
  width: 1px;
  background: var(--border);
  align-self: stretch;
}

/* ── RIGHT PANEL ── */
.home-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0 60px 48px;
  animation: fadeInRight 0.6s 0.1s ease both;
  position: relative;
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Floating video mock UI */
.mock-ui {
  width: 100%;
  max-width: 480px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  position: relative;
}

.mock-topbar {
  height: 44px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 6px;
}
.mock-dot { width: 9px; height: 9px; border-radius: 50%; }
.mock-dot.r { background: #FF5F57; }
.mock-dot.y { background: #FEBC2E; }
.mock-dot.g { background: #28C840; }
.mock-url {
  margin-left: 8px;
  flex: 1;
  height: 22px;
  background: rgba(255,255,255,0.05);
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.mock-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px;
  background: #0a0a0a;
}
.mock-cam {
  aspect-ratio: 16/9;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.mock-cam.c1 { background: linear-gradient(135deg, #1a2a4a 0%, #0d1a33 100%); }
.mock-cam.c2 { background: linear-gradient(135deg, #1a3a2a 0%, #0d2218 100%); }
.mock-cam.c3 { background: linear-gradient(135deg, #2a1a3a 0%, #180d22 100%); }
.mock-cam.c4 { background: linear-gradient(135deg, #3a2a1a 0%, #22180d 100%); }

/* Animated wave on cam */
.mock-cam::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--blue);
  opacity: 0;
  transform-origin: left;
}
.mock-cam.speaking::before {
  opacity: 1;
  animation: soundwave 1.2s ease-in-out infinite;
}
@keyframes soundwave {
  0%, 100% { transform: scaleX(0.3); opacity: 0.4; }
  50% { transform: scaleX(1); opacity: 1; }
}

/* Avatar on cam */
.mock-avatar {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -55%);
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-body);
}
.mock-cam-label {
  position: absolute;
  bottom: 7px; left: 9px;
  font-size: 0.6rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}
.mock-live-badge {
  position: absolute;
  top: 7px; right: 7px;
  background: rgba(26,86,255,0.8);
  color: #fff;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 4px;
}

.mock-controls {
  height: 52px;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 16px;
}
.mock-ctrl {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}
.mock-ctrl.active { background: rgba(255,255,255,0.08); }
.mock-ctrl.end { background: rgba(239,68,68,0.2); }

/* Floating notification */
.mock-notif {
  position: absolute;
  top: 60px;
  right: -20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: floatNotif 3s ease-in-out infinite;
  white-space: nowrap;
}
@keyframes floatNotif {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.notif-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), #6b4dff);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: #fff;
}
.notif-text { font-size: 0.7rem; color: var(--text-muted); }
.notif-text strong { color: var(--text); font-weight: 600; display: block; }

/* Floating participants badge */
.mock-participants {
  position: absolute;
  bottom: 72px;
  left: -18px;
  background: var(--blue);
  border-radius: 10px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 24px rgba(26,86,255,0.4);
  animation: floatBadge 3.5s 0.5s ease-in-out infinite;
}
@keyframes floatBadge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.participants-faces {
  display: flex;
}
.p-face {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  margin-left: -6px;
  font-size: 0.55rem;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #fff;
}
.p-face:first-child { margin-left: 0; }
.p-face.a { background: #ff6b6b; }
.p-face.b { background: #4ecdc4; }
.p-face.c { background: #f9ca24; color: #333; }
.participants-text { font-size: 0.68rem; font-weight: 600; color: #fff; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .home-main {
    grid-template-columns: 1fr;
    padding: 0 24px;
    min-height: auto;
  }
  .home-left { padding: 40px 0 20px; }
  .home-right { padding: 20px 0 40px; display: none; }
  .home-nav { padding: 0 20px; }
}
`

/* ── Logo SVG ── */
function LogoSVG({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="#1A56FF" />
      <rect x="6" y="11" width="16" height="12" rx="2.5" fill="white" />
      <circle cx="14" cy="17" r="3.5" fill="#1A56FF" />
      <circle cx="14" cy="17" r="1.8" fill="white" />
      <circle cx="14" cy="17" r="0.8" fill="#1A56FF" />
      <path d="M22 14.5L29 11.5V22.5L22 19.5V14.5Z" fill="white" />
    </svg>
  )
}

function HomeComponent() {
  const navigate = useNavigate()
  const [meetingCode, setMeetingCode] = useState("")
  const { addToUserHistory } = useContext(AuthContext)

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`)
  }

  const handleNewMeeting = () => {
    const code = Math.random().toString(36).substring(2, 10)
    navigate(`/${code}`)
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="home-wrap">
        <div className="home-bg" />

        {/* NAV */}
        <nav className="home-nav">
          <div className="nav-logo">
            <LogoSVG size={28} />
            <span className="nav-logo-text">
              Apna <span>Video</span> Call
            </span>
          </div>

          <button
            className="nav-icon-btn"
            onClick={() => navigate("/history")}
            title="History"
          >
            <RestoreIcon style={{ fontSize: 18 }} />
            <span className="tooltip">History</span>
          </button>

          <button
            className="nav-logout-btn"
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/auth")
            }}
          >
            <LogoutIcon style={{ fontSize: 16 }} />
            Logout
          </button>
        </nav>

        {/* MAIN */}
        <main className="home-main">

          {/* LEFT */}
          <div className="home-left">
            <span className="home-eyebrow">
              <span className="eyebrow-dot" />
              Secure · HD · Real-time
            </span>

            <h1 className="home-heading">
              Quality calls,<br />
              <span className="blue">every</span>{" "}
              <span className="dim">time.</span>
            </h1>

            <p className="home-sub">
              Connect instantly with anyone, anywhere. 
              Enter a meeting code to join or start a new call in seconds.
            </p>

            {/* Join card */}
            <div className="join-card">
              <span className="join-card-label">Join a meeting</span>

              <div className="join-input-row">
                <input
                  className="join-input"
                  type="text"
                  placeholder="Enter meeting code…"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinVideoCall()}
                />
                <button
                  className="join-btn"
                  onClick={handleJoinVideoCall}
                  disabled={!meetingCode.trim()}
                >
                  Join
                  <ArrowForwardIcon style={{ fontSize: 18 }} />
                </button>
              </div>

              <div className="join-divider">or</div>

              <button className="new-meeting-btn" onClick={handleNewMeeting}>
                <AddIcon style={{ fontSize: 18 }} />
                Start a new meeting
              </button>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value">10K+</span>
                <span className="stat-label">Active users</span>
              </div>
              <div className="stat-sep" />
              <div className="stat-item">
                <span className="stat-value">HD</span>
                <span className="stat-label">Video quality</span>
              </div>
              <div className="stat-sep" />
              <div className="stat-item">
                <span className="stat-value">E2E</span>
                <span className="stat-label">Encrypted</span>
              </div>
            </div>
          </div>

          {/* RIGHT — decorative mock video UI */}
          <div className="home-right">
            {/* Floating notification */}
            <div className="mock-notif">
              <div className="notif-avatar">S</div>
              <div className="notif-text">
                <strong>Sneha joined</strong>
                Just now · Meeting room
              </div>
            </div>

            {/* Participants badge */}
            <div className="mock-participants">
              <div className="participants-faces">
                <div className="p-face a">A</div>
                <div className="p-face b">R</div>
                <div className="p-face c">S</div>
              </div>
              <span className="participants-text">3 in call</span>
            </div>

            <div className="mock-ui">
              <div className="mock-topbar">
                <div className="mock-dot r" />
                <div className="mock-dot y" />
                <div className="mock-dot g" />
                <div className="mock-url">apnavideocall.ai / live</div>
              </div>

              <div className="mock-grid">
                {[
                  { cls: "c1", name: "Arjun", initial: "A", bg: "#1A56FF", speaking: true },
                  { cls: "c2", name: "Riya", initial: "R", bg: "#22c55e" },
                  { cls: "c3", name: "Sneha", initial: "S", bg: "#f59e0b" },
                  { cls: "c4", name: "You", initial: "Y", bg: "#a855f7" },
                ].map((cam, i) => (
                  <div key={i} className={`mock-cam ${cam.cls} ${cam.speaking ? "speaking" : ""}`}>
                    <div
                      className="mock-avatar"
                      style={{ background: cam.bg + "33", color: cam.bg }}
                    >
                      {cam.initial}
                    </div>
                    <span className="mock-cam-label">{cam.name}</span>
                    {i === 0 && <span className="mock-live-badge">● LIVE</span>}
                  </div>
                ))}
              </div>

              <div className="mock-controls">
                <div className="mock-ctrl active">🎤</div>
                <div className="mock-ctrl active">📹</div>
                <div className="mock-ctrl active">💬</div>
                <div className="mock-ctrl end">📞</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}

export default withAuth(HomeComponent)