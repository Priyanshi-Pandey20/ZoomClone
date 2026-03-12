import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:      #1A56FF;
  --blue-dark: #1243D6;
  --blue-glow: rgba(26, 86, 255, 0.18);
  --bg:        #ffffff;
  --bg2:       #EFF4F8;
  --border:    #E0E0E0;
  --text:      #0D0D0D;
  --muted:     #6B7280;
  --input-bg:  #F8FAFE;
  --font-head: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
}

html, body, #root {
  height: 100%;
  background: #ffffff !important;
  font-family: var(--font-body);
  color: var(--text);
}

/* ── PAGE LAYOUT ── */
.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

/* ── LEFT PANEL ── */
.auth-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 64px;
  position: relative;
  z-index: 2;
  background: #ffffff;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 52px;
}
.auth-logo-mark {
  width: 34px; height: 34px; flex-shrink: 0;
}
.auth-logo-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  color: #0D0D0D;
  letter-spacing: -0.3px;
}
.auth-logo-text span { color: var(--blue); }

/* Heading */
.auth-heading {
  font-family: var(--font-head);
  font-size: 2.4rem;
  font-weight: 400;
  color: #0D0D0D;
  line-height: 1.15;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.auth-subtext {
  font-size: 0.88rem;
  color: #6B7280;
  margin-bottom: 32px;
}
.auth-subtext a {
  color: var(--blue);
  text-decoration: none;
  font-weight: 600;
}
.auth-subtext a:hover { text-decoration: underline; }

/* Toggle tabs */
.auth-tabs {
  display: flex;
  background: #EFF4F8;
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
  width: fit-content;
}
.auth-tab {
  padding: 8px 24px;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #6B7280;
  font-family: var(--font-body);
  transition: all .2s;
}
.auth-tab.active {
  background: var(--blue);
  color: #fff;
  box-shadow: 0 2px 12px rgba(26,86,255,.4);
}

/* Form */
.auth-form { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 380px; }

.name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.auth-input {
  width: 100%;
  padding: 12px 14px;
  background: #F8FAFE;
  border: 1.5px solid #E0E0E0;
  border-radius: 9px;
  color: #0D0D0D;
  font-size: 0.88rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.auth-input::placeholder { color: #B0B8C8; }
.auth-input:focus {
  border-color: var(--blue);
  background: rgba(26,86,255,.07);
  box-shadow: 0 0 0 3px rgba(26,86,255,.15);
}

/* Password wrapper */
.pw-wrap { position: relative; }
.pw-toggle {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  transition: color .2s;
}
.pw-toggle:hover { color: #0D0D0D; }

/* Error */
.auth-error {
  font-size: 0.8rem;
  color: #FF6B6B;
  background: rgba(255,107,107,.1);
  border: 1px solid rgba(255,107,107,.2);
  border-radius: 7px;
  padding: 9px 13px;
}

/* Submit button */
.auth-submit {
  width: 100%;
  padding: 13px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background .15s, transform .12s, box-shadow .15s;
  margin-top: 4px;
  letter-spacing: 0.2px;
}
.auth-submit:hover {
  background: var(--blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26,86,255,.35);
}
.auth-submit:active { transform: translateY(0); }

/* Divider */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.78rem;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ── RIGHT PANEL ── */
.auth-right {
  position: relative;
  background: #EFF4F8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Glow blob */
.auth-glow {
  position: absolute;
  width: 420px; height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26,86,255,.14) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.auth-glow-2 {
  position: absolute;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26,86,255,.12) 0%, transparent 70%);
  top: 15%; right: 10%;
  pointer-events: none;
}

/* Floating illustration cards */
.float-card {
  position: absolute;
  background: #ffffff;
  border: 1px solid #E0E0E0;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: floatUp 3.5s ease-in-out infinite;
}
.float-card:nth-child(3) { animation-delay: -1.2s; }
.float-card:nth-child(4) { animation-delay: -2.4s; }
.float-card:nth-child(5) { animation-delay: -0.6s; }

@keyframes floatUp {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}

.fc-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.fc-text strong { display: block; font-size: 0.82rem; font-weight: 700; color: #0D0D0D; }
.fc-text span   { font-size: 0.72rem; color: #6B7280; }

/* Positioned cards */
.fc-transcribe { top: 18%; left: 12%; }
.fc-summary    { top: 42%; right: 8%; }
.fc-chat       { bottom: 20%; left: 18%; }

/* Central device illustration */
.center-device {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 2;
}
.device-screen {
  width: 220px;
  background: #ffffff;
  border: 1.5px solid rgba(26,86,255,.35);
  border-radius: 14px 14px 0 0;
  padding: 16px;
  box-shadow: 0 0 40px rgba(26,86,255,.2);
}
.screen-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.screen-dot { width: 7px; height: 7px; border-radius: 50%; }
.screen-line {
  height: 7px;
  border-radius: 4px;
  background: #E0E0E0;
  margin-bottom: 6px;
}
.screen-line.short { width: 55%; }
.screen-line.med   { width: 80%; }
.screen-line.full  { width: 100%; }
.screen-line.blue  { background: var(--blue); opacity: .7; }
.screen-wave {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
  height: 28px;
}
.wave-bar {
  width: 4px;
  border-radius: 3px;
  background: var(--blue);
  animation: wavePulse 1.2s ease-in-out infinite;
}
@keyframes wavePulse {
  0%,100% { height: 6px; opacity: .4; }
  50%      { height: 22px; opacity: 1; }
}

.device-base {
  width: 250px;
  height: 14px;
  background: linear-gradient(to bottom, rgba(26,86,255,.15), transparent);
  border-radius: 0 0 8px 8px;
}
.device-shadow {
  width: 200px;
  height: 10px;
  background: radial-gradient(ellipse, rgba(26,86,255,.25) 0%, transparent 70%);
  margin-top: 4px;
}

/* ── SNACKBAR ── */
.auth-snack {
  position: fixed;
  bottom: 28px; left: 50%;
  transform: translateX(-50%);
  background: #1a2a1a;
  border: 1px solid rgba(34,197,94,.3);
  color: #86efac;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 10px;
  z-index: 1000;
  animation: snackIn .3s ease both;
  font-family: var(--font-body);
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
}
@keyframes snackIn {
  from { opacity:0; transform: translateX(-50%) translateY(12px); }
  to   { opacity:1; transform: translateX(-50%) translateY(0); }
}

/* ── ANIMATIONS ── */
.auth-left { animation: fadeInLeft .55s ease both; }
.auth-right { animation: fadeInRight .55s .1s ease both; }
@keyframes fadeInLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:translateX(0)} }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-right { display: none; }
  .auth-left { padding: 40px 28px; }
}
`;

const WAVE_HEIGHTS = [6, 14, 20, 26, 18, 24, 16, 10, 22, 14, 8, 18];

export default function Authentication() {
  const navigate = useNavigate();
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const [formState, setFormState] = React.useState(0); // 0=login 1=register
  const [name, setName]           = React.useState('');
  const [username, setUsername]   = React.useState('');
  const [password, setPassword]   = React.useState('');
  const [showPw, setShowPw]       = React.useState(false);
  const [error, setError]         = React.useState('');
  const [message, setMessage]     = React.useState('');
  const [open, setOpen]           = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => setOpen(false), 4000);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleAuth = async () => {
    setError('');
    try {
      if (formState === 0) {
        await handleLogin(username, password);
        navigate('/home');
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
        setName(''); setUsername(''); setPassword('');
        setFormState(0);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') handleAuth(); };

  return (
    <>
      <style>{CSS}</style>

      <div className="auth-page">

        {/* ── LEFT ── */}
        <div className="auth-left">

          {/* Logo */}
          <a href="/" className="auth-logo">
            <svg className="auth-logo-mark" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="#1A56FF"/>
              <rect x="6" y="11" width="16" height="12" rx="2.5" fill="white"/>
              <circle cx="14" cy="17" r="3.5" fill="#1A56FF"/>
              <circle cx="14" cy="17" r="1.8" fill="white"/>
              <circle cx="14" cy="17" r="0.8" fill="#1A56FF"/>
              <path d="M22 14.5L29 11.5V22.5L22 19.5V14.5Z" fill="white"/>
              <path d="M27 7 Q31 7 31 11" stroke="#93B4FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="auth-logo-text">Apna <span>Video</span> Call</span>
          </a>

          {/* Heading */}
          <h1 className="auth-heading">
            {formState === 0 ? 'Welcome back' : 'Create Account'}
          </h1>
          <p className="auth-subtext">
            {formState === 0
              ? <>Don't have an account? <a href="#" onClick={e => { e.preventDefault(); setFormState(1); setError(''); setName(''); setUsername(''); setPassword(''); }}>Sign up free</a></>
              : <>Already have an account? <a href="#" onClick={e => { e.preventDefault(); setFormState(0); setError(''); setName(''); setUsername(''); setPassword(''); }}>Log in</a></>
            }
          </p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${formState === 0 ? 'active' : ''}`} onClick={() => { setFormState(0); setError(''); setName(''); setUsername(''); setPassword(''); }}>Sign In</button>
            <button className={`auth-tab ${formState === 1 ? 'active' : ''}`} onClick={() => { setFormState(1); setError(''); setName(''); setUsername(''); setPassword(''); }}>Sign Up</button>
          </div>

          {/* Form */}
          <div className="auth-form">

            {/* Sign Up extra field: Full Name */}
            {formState === 1 && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  className="auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={onKey}
                  autoFocus
                />
              </div>
            )}

            {/* Username — shown in both modes */}
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                className="auth-input"
                placeholder={formState === 0 ? 'Enter your username' : 'Choose a username'}
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={onKey}
                autoFocus={formState === 0}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="pw-wrap">
                <input
                  className="auth-input"
                  placeholder="••••••••"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={onKey}
                  style={{ paddingRight: 42 }}
                />
                <button className="pw-toggle" onClick={() => setShowPw(p => !p)} type="button" tabIndex={-1}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" onClick={handleAuth}>
              {formState === 0 ? 'Log In →' : 'Create Account →'}
            </button>

          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="auth-right">
          <div className="auth-glow" />
          <div className="auth-glow-2" />

          {/* Floating feature cards */}
          <div className="float-card fc-transcribe">
            <div className="fc-icon" style={{ background: 'rgba(26,86,255,.15)' }}>🎙️</div>
            <div className="fc-text">
              <strong>Live Transcription</strong>
              <span>Every word captured instantly</span>
            </div>
          </div>

          <div className="float-card fc-summary">
            <div className="fc-icon" style={{ background: 'rgba(99,209,181,.1)' }}>⚡</div>
            <div className="fc-text">
              <strong>AI Summaries</strong>
              <span>Key points in seconds</span>
            </div>
          </div>

          <div className="float-card fc-chat">
            <div className="fc-icon" style={{ background: 'rgba(255,159,64,.1)' }}>💬</div>
            <div className="fc-text">
              <strong>AI Chat</strong>
              <span>Ask anything about your call</span>
            </div>
          </div>

          {/* Central device */}
          <div className="center-device">
            <div className="device-screen">
              <div className="screen-header">
                <div className="screen-dot" style={{ background: '#FF5F57' }} />
                <div className="screen-dot" style={{ background: '#FEBC2E' }} />
                <div className="screen-dot" style={{ background: '#28C840' }} />
              </div>
              <div className="screen-line blue full" />
              <div className="screen-line med" />
              <div className="screen-line short" />
              <div className="screen-line med" />
              <div className="screen-line short" style={{ width: '65%' }} />
              <div className="screen-wave">
                {WAVE_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="wave-bar"
                    style={{ animationDelay: `${i * 0.1}s`, height: h }}
                  />
                ))}
              </div>
            </div>
            <div className="device-base" />
            <div className="device-shadow" />
          </div>
        </div>

      </div>

      {/* Snackbar */}
      {open && <div className="auth-snack">✓ {message || 'Account created! Please sign in.'}</div>}
    </>
  );
}   