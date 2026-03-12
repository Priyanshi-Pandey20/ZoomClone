import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:       #1A56FF;
  --blue-dark:  #1243D6;
  --blue-dim:   rgba(26,86,255,0.15);
  --black:      #0D0D0D;
  --surface:    #111111;
  --surface2:   #1a1a1a;
  --border:     rgba(255,255,255,0.08);
  --text:       #ffffff;
  --text-muted: rgba(255,255,255,0.4);
  --text-dim:   rgba(255,255,255,0.15);
  --font-head:  'DM Serif Display', Georgia, serif;
  --font-body:  'DM Sans', -apple-system, sans-serif;
}

html, body {
  min-height: 100%;
  background: var(--black);
  font-family: var(--font-body);
  color: var(--text);
}

/* ── PAGE WRAP ── */
.hist-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.hist-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.hist-bg::before {
  content: '';
  position: absolute;
  top: -20%; left: -10%;
  width: 60%; height: 60%;
  background: radial-gradient(ellipse, rgba(26,86,255,0.1) 0%, transparent 65%);
  filter: blur(50px);
}

/* ── NAV ── */
.hist-nav {
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
  gap: 14px;
}

.hist-back-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
  flex-shrink: 0;
}
.hist-back-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--text);
  border-color: rgba(255,255,255,0.15);
}

.hist-nav-logo {
  display: flex; align-items: center; gap: 10px;
}
.hist-nav-logo-text {
  font-family: var(--font-body);
  font-size: 0.95rem; font-weight: 700;
  color: var(--text); letter-spacing: -0.3px;
}
.hist-nav-logo-text span { color: var(--blue); }

.hist-nav-sep {
  width: 1px; height: 20px;
  background: var(--border);
}
.hist-nav-title {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* ── CONTENT ── */
.hist-content {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px 80px;
  position: relative;
  z-index: 1;
}

/* Page header */
.hist-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hist-title-block {}
.hist-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--blue);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.hist-page-title {
  font-family: var(--font-head);
  font-size: 2.2rem;
  font-weight: 400;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.hist-count-badge {
  background: var(--blue-dim);
  border: 1px solid rgba(26,86,255,0.3);
  border-radius: 10px;
  padding: 10px 18px;
  text-align: center;
  flex-shrink: 0;
}
.hist-count-num {
  font-family: var(--font-head);
  font-size: 1.8rem;
  color: var(--blue);
  line-height: 1;
  display: block;
}
.hist-count-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 3px;
  display: block;
}

/* Search bar */
.hist-search-wrap {
  position: relative;
  margin-bottom: 24px;
  animation: fadeUp 0.5s 0.1s ease both;
}
.hist-search-icon {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  display: flex; align-items: center;
  pointer-events: none;
}
.hist-search {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 13px 16px 13px 44px;
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.hist-search::placeholder { color: var(--text-dim); }
.hist-search:focus {
  border-color: rgba(26,86,255,0.5);
  background: rgba(26,86,255,0.04);
}

/* Meeting list */
.hist-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Meeting card */
.hist-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  cursor: default;
  animation: fadeUp 0.4s ease both;
}
.hist-card:hover {
  border-color: rgba(26,86,255,0.3);
  background: rgba(26,86,255,0.04);
  transform: translateY(-1px);
}

.hist-card-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: var(--blue-dim);
  border: 1px solid rgba(26,86,255,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--blue);
  flex-shrink: 0;
}

.hist-card-body {
  flex: 1;
  min-width: 0;
}
.hist-card-code {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.3px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hist-card-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.hist-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

.hist-card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.hist-action-btn {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
  position: relative;
}
.hist-action-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--text);
  border-color: rgba(255,255,255,0.14);
}
.hist-action-btn.primary:hover {
  background: var(--blue-dim);
  border-color: rgba(26,86,255,0.4);
  color: var(--blue);
}

/* Copy toast */
.hist-action-btn .copy-toast {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%; transform: translateX(-50%);
  background: rgba(26,86,255,0.9);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}
.hist-action-btn.copied .copy-toast { opacity: 1; }

/* Empty state */
.hist-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  animation: fadeUp 0.5s ease both;
}
.hist-empty-icon {
  width: 72px; height: 72px;
  border-radius: 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.hist-empty-title {
  font-family: var(--font-head);
  font-size: 1.4rem;
  color: var(--text-muted);
  font-weight: 400;
}
.hist-empty-sub {
  font-size: 0.82rem;
  color: var(--text-dim);
  text-align: center;
  max-width: 280px;
  line-height: 1.6;
}
.hist-empty-btn {
  margin-top: 8px;
  padding: 11px 24px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
}
.hist-empty-btn:hover {
  background: var(--blue-dark);
  transform: translateY(-1px);
}

/* Skeleton loading */
.hist-skeleton {
  display: flex; flex-direction: column; gap: 12px;
}
.skel-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 22px;
  display: flex; align-items: center; gap: 18px;
}
.skel-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(255,255,255,0.05);
  animation: shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;
}
.skel-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.skel-line {
  height: 14px; border-radius: 6px;
  background: rgba(255,255,255,0.05);
  animation: shimmer 1.5s ease-in-out infinite;
}
.skel-line.short { width: 40%; }
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (max-width: 600px) {
  .hist-nav { padding: 0 16px; }
  .hist-content { padding: 32px 16px 60px; }
  .hist-page-title { font-size: 1.7rem; }
  .hist-card { padding: 16px; gap: 12px; }
  .hist-card-actions { display: none; }
}
`

/* Logo SVG */
function LogoSVG({ size = 28 }) {
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

/* Single meeting card */
function MeetingCard({ meeting, index, onJoin }) {
  const [copied, setCopied] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(meeting.meetingCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className="hist-card"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="hist-card-icon">
        <VideoCallIcon style={{ fontSize: 22 }} />
      </div>

      <div className="hist-card-body">
        <div className="hist-card-code">{meeting.meetingCode}</div>
        <div className="hist-card-meta">
          <span className="hist-meta-item">
            <CalendarTodayIcon style={{ fontSize: 12 }} />
            {formatDate(meeting.date)}
          </span>
          <span className="hist-meta-item">
            <AccessTimeIcon style={{ fontSize: 12 }} />
            {formatTime(meeting.date)}
          </span>
        </div>
      </div>

      <div className="hist-card-actions">
        <button
          className={`hist-action-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          title="Copy code"
        >
          <ContentCopyIcon style={{ fontSize: 15 }} />
          <span className="copy-toast">Copied!</span>
        </button>
        <button
          className="hist-action-btn primary"
          onClick={() => onJoin(meeting.meetingCode)}
          title="Rejoin meeting"
        >
          <OpenInNewIcon style={{ fontSize: 15 }} />
        </button>
      </div>
    </div>
  )
}

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const routeTo = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser()
        setMeetings(Array.isArray(history) ? history : history?.data || [])
      } catch (err) {
        console.error("Error fetching history:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filtered = meetings.filter(m =>
    m.meetingCode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{CSS}</style>
      <div className="hist-wrap">
        <div className="hist-bg" />

        {/* NAV */}
        <nav className="hist-nav">
          <button className="hist-back-btn" onClick={() => routeTo("/home")}>
            <ArrowBackIcon style={{ fontSize: 18 }} />
          </button>
          <div className="hist-nav-logo">
            <LogoSVG size={26} />
            <span className="hist-nav-logo-text">
              Apna <span>Video</span> Call
            </span>
          </div>
          <div className="hist-nav-sep" />
          <span className="hist-nav-title">Meeting History</span>
        </nav>

        {/* CONTENT */}
        <div className="hist-content">

          {/* Header */}
          <div className="hist-header">
            <div className="hist-title-block">
              <div className="hist-eyebrow">Your activity</div>
              <h1 className="hist-page-title">Past Meetings</h1>
            </div>
            {!loading && meetings.length > 0 && (
              <div className="hist-count-badge">
                <span className="hist-count-num">{meetings.length}</span>
                <span className="hist-count-label">meetings</span>
              </div>
            )}
          </div>

          {/* Search */}
          {!loading && meetings.length > 0 && (
            <div className="hist-search-wrap">
              <span className="hist-search-icon">
                <SearchIcon style={{ fontSize: 18 }} />
              </span>
              <input
                className="hist-search"
                type="text"
                placeholder="Search by meeting code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="hist-skeleton">
              {[...Array(4)].map((_, i) => (
                <div className="skel-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="skel-icon" />
                  <div className="skel-body">
                    <div className="skel-line" style={{ width: "55%" }} />
                    <div className="skel-line short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meetings list */}
          {!loading && filtered.length > 0 && (
            <div className="hist-list">
              {filtered.map((e, i) => (
                <MeetingCard
                  key={i}
                  meeting={e}
                  index={i}
                  onJoin={(code) => routeTo(`/${code}`)}
                />
              ))}
            </div>
          )}

          {/* Empty state — no meetings at all */}
          {!loading && meetings.length === 0 && (
            <div className="hist-empty">
              <div className="hist-empty-icon">
                <VideoCallIcon style={{ fontSize: 32 }} />
              </div>
              <div className="hist-empty-title">No meetings yet</div>
              <p className="hist-empty-sub">
                Your past meetings will appear here once you start or join a call.
              </p>
              <button className="hist-empty-btn" onClick={() => routeTo("/home")}>
                Start a meeting
              </button>
            </div>
          )}

          {/* Empty state — no search results */}
          {!loading && meetings.length > 0 && filtered.length === 0 && (
            <div className="hist-empty">
              <div className="hist-empty-icon">
                <SearchIcon style={{ fontSize: 32 }} />
              </div>
              <div className="hist-empty-title">No results</div>
              <p className="hist-empty-sub">
                No meetings match "{search}". Try a different code.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}