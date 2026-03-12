import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Badge, Button, IconButton } from "@mui/material";
import { io } from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import server from "../environment";

const server_url = server;
var connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

/* ─── Inline styles (matches landing page tokens) ─── */
const S = {
  // fonts injected once
  fontLink: `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');`,

  /* LOBBY */
  lobbyWrap: {
    minHeight: "100vh",
    background: "#0D0D0D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  lobbyBg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,86,255,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  lobbyCard: {
    position: "relative", zIndex: 1,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 440,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  lobbyLogo: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 4,
  },
  lobbyLogoText: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: "1rem", color: "#fff",
  },
  lobbyLogoSpan: { color: "#1A56FF" },
  lobbyHeading: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: "2rem",
    fontWeight: 400,
    color: "#fff",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    marginBottom: 4,
  },
  lobbyHeadingBlue: { color: "#1A56FF" },
  lobbySub: {
    fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 4,
  },
  divider: {
    height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0",
  },
  lobbyInput: { /* MUI overrides via sx */ },
  connectBtn: {
    padding: "13px 0",
    background: "#1A56FF",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
    width: "100%",
  },
  lobbyVideoWrap: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#111",
    position: "relative",
  },
  lobbyVideoLabel: {
    position: "absolute", bottom: 10, left: 12,
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
    color: "#fff", fontSize: "0.7rem", fontWeight: 500,
    padding: "3px 10px", borderRadius: 20,
  },

  /* MEET ROOM */
  roomWrap: {
    minHeight: "100vh",
    background: "#0D0D0D",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
  },

  /* Top bar */
  topBar: {
    height: 56,
    display: "flex", alignItems: "center",
    padding: "0 24px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(13,13,13,0.95)",
    backdropFilter: "blur(8px)",
    gap: 14,
    zIndex: 10,
    flexShrink: 0,
  },
  topBarLogo: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, fontSize: "0.9rem", color: "#fff",
  },
  topBarLogoSpan: { color: "#1A56FF" },
  topBarTitle: {
    fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 400,
  },
  topBarDot: {
    width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
    boxShadow: "0 0 6px rgba(34,197,94,0.8)",
  },
  topBarLive: {
    fontSize: "0.72rem", fontWeight: 600, color: "#22c55e", letterSpacing: 1,
  },
  topBarSpacer: { flex: 1 },
  topBarTime: {
    fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", fontWeight: 400,
  },

  /* Main content */
  mainContent: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },

  /* Videos area */
  videosArea: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    alignContent: "flex-start",
    gap: 12,
    padding: 16,
    overflowY: "auto",
    alignItems: "flex-start",
  },

  /* Remote video tile */
  remoteTile: {
    borderRadius: 16,
    overflow: "hidden",
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    flex: "1 1 300px",
    maxWidth: "calc(50% - 6px)",
    aspectRatio: "16/9",
  },
  remoteTileVideo: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
  },
  tileGradient: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 60,
    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
    pointerEvents: "none",
  },
  tileLabel: {
    position: "absolute", bottom: 10, left: 12,
    color: "#fff", fontSize: "0.72rem", fontWeight: 500,
  },

  /* Local pip */
  localPip: {
    position: "fixed",
    bottom: 96,
    right: 24,
    width: 200,
    aspectRatio: "16/9",
    borderRadius: 14,
    overflow: "hidden",
    border: "2px solid rgba(26,86,255,0.6)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    background: "#111",
    zIndex: 50,
  },
  localPipVideo: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
  },
  localPipLabel: {
    position: "absolute", bottom: 6, left: 8,
    background: "rgba(0,0,0,0.6)",
    color: "#fff", fontSize: "0.62rem", fontWeight: 500,
    padding: "2px 8px", borderRadius: 20,
  },

  /* Chat panel */
  chatPanel: {
    width: 320,
    borderLeft: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    background: "#111",
    flexShrink: 0,
  },
  chatHeader: {
    height: 52,
    display: "flex", alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    gap: 10,
  },
  chatHeaderTitle: {
    fontWeight: 600, fontSize: "0.88rem", color: "#fff",
  },
  chatHeaderClose: {
    marginLeft: "auto", color: "rgba(255,255,255,0.4)",
    background: "none", border: "none", cursor: "pointer",
    fontSize: "1.1rem", lineHeight: 1,
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  chatEmpty: {
    margin: "auto",
    textAlign: "center",
    color: "rgba(255,255,255,0.25)",
    fontSize: "0.8rem",
  },
  chatMsgWrap: {
    display: "flex", flexDirection: "column", gap: 4,
  },
  chatMsgSender: {
    fontSize: "0.7rem", fontWeight: 600, color: "#1A56FF",
  },
  chatMsgText: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "4px 12px 12px 12px",
    padding: "8px 12px",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.55,
    alignSelf: "flex-start",
    maxWidth: "90%",
  },
  chatMsgTextOwn: {
    background: "rgba(26,86,255,0.2)",
    borderRadius: "12px 4px 12px 12px",
    alignSelf: "flex-end",
  },
  chatInputRow: {
    display: "flex", gap: 8, padding: "12px 14px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  chatSendBtn: {
    padding: "9px 16px",
    background: "#1A56FF",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "0.8rem",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s",
  },

  /* Control bar */
  controlBar: {
    height: 80,
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10,
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(13,13,13,0.97)",
    backdropFilter: "blur(8px)",
    flexShrink: 0,
    padding: "0 24px",
    zIndex: 10,
  },
  ctrlBtn: {
    width: 52, height: 52,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.12s",
    color: "#fff",
    flexShrink: 0,
  },
  ctrlBtnOff: {
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.35)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  ctrlBtnEnd: {
    width: 56, height: 56,
    borderRadius: "50%",
    background: "#ef4444",
    border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.12s",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
  },
  ctrlBtnActive: {
    background: "rgba(26,86,255,0.2)",
    border: "1px solid rgba(26,86,255,0.5)",
    color: "#1A56FF",
  },

  /* Empty grid state */
  emptyGrid: {
    flex: 1,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.2)",
    gap: 12,
  },
  emptyIcon: { fontSize: "3rem", opacity: 0.3 },
  emptyText: { fontSize: "0.85rem", fontWeight: 500 },
};

export default function VideoMeetComponent() {
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const localVideoRef = useRef(null);
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);

  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  const [time, setTime] = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start(); ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    return Object.assign(canvas.captureStream().getVideoTracks()[0], { enabled: false });
  };
  const blackSilence = () => new MediaStream([black(), silence()]);

  const getPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoAvailable(true); setAudioAvailable(true);
      setVideo(true); setAudio(true);
      window.localStream = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch {
      setVideoAvailable(false); setAudioAvailable(false);
      window.localStream = blackSilence();
      if (localVideoRef.current) localVideoRef.current.srcObject = window.localStream;
    }
  };

  useEffect(() => { getPermission(); }, []);

  useEffect(() => {
    if (!window.localStream) return;
    window.localStream.getVideoTracks().forEach((t) => (t.enabled = video));
  }, [video]);

  useEffect(() => {
    if (!window.localStream) return;
    window.localStream.getAudioTracks().forEach((t) => (t.enabled = audio));
  }, [audio]);

  useEffect(() => {
    setScreenAvailable(!!(navigator.mediaDevices?.getDisplayMedia));
  }, []);

  const createPeerConnection = (remoteId) => {
    if (connections[remoteId]) return connections[remoteId];
    const pc = new RTCPeerConnection(peerConfigConnections);
    connections[remoteId] = pc;
    pc.onicecandidate = (e) => {
      if (e.candidate)
        socketRef.current.emit("signal", remoteId, JSON.stringify({ ice: e.candidate }));
    };
    pc.ontrack = (e) => {
      const stream = e.streams[0]; if (!stream) return;
      setVideos((prev) => {
        const exists = prev.find((v) => v.socketId === remoteId);
        const updated = exists
          ? prev.map((v) => v.socketId === remoteId ? { ...v, stream } : v)
          : [...prev, { socketId: remoteId, stream }];
        videoRef.current = updated; return updated;
      });
    };
    const localStream = window.localStream || blackSilence();
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
    return pc;
  };

  const gotMessageFromServer = async (fromId, message) => {
    if (fromId === socketIdRef.current) return;
    const signal = JSON.parse(message);
    const pc = createPeerConnection(fromId);
    if (signal.sdp) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: pc.localDescription }));
        }
      } catch (e) { console.error("SDP error:", e); }
    }
    if (signal.ice) {
      try { await pc.addIceCandidate(new RTCIceCandidate(signal.ice)); }
      catch (e) { console.error("ICE error:", e); }
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) setNewMessages((n) => n + 1);
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", window.location.href);
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        if (connections[id]) { connections[id].close(); delete connections[id]; }
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });
      socketRef.current.on("user-joined", (id, clients) => {
        if (!Array.isArray(clients)) return;
        clients.forEach((remoteId) => {
          if (remoteId !== socketIdRef.current) createPeerConnection(remoteId);
        });
        if (id === socketIdRef.current) {
          clients.forEach((remoteId) => {
            if (remoteId === socketIdRef.current) return;
            const pc = connections[remoteId]; if (!pc) return;
            pc.createOffer()
              .then((d) => pc.setLocalDescription(d))
              .then(() => socketRef.current.emit("signal", remoteId, JSON.stringify({ sdp: connections[remoteId].localDescription })))
              .catch((e) => console.error("Offer error:", e));
          });
        }
      });
    });
  };

  const connect = async () => {
    setAskForUsername(false);
    await getPermission();
    connectToSocketServer();
  };

  const attachRef = (ref, stream) => {
    if (ref && stream && ref.srcObject !== stream) ref.srcObject = stream;
  };

  let routeTo = useNavigate();

  const getDisplayMediaSuccess = (stream) => {
    try { window.localStream.getTracks().forEach((t) => t.stop()); } catch { }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      connections[id].getSenders().forEach((sender) => {
        const t = stream.getTracks().find((t) => t.kind === sender.track?.kind);
        if (t) sender.replaceTrack(t);
      });
    }
    stream.getVideoTracks()[0].onended = async () => {
      setScreen(false);
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        window.localStream = cam; localVideoRef.current.srcObject = cam;
        for (let id in connections) {
          if (id === socketIdRef.current) continue;
          connections[id].getSenders().forEach((sender) => {
            const t = cam.getTracks().find((t) => t.kind === sender.track?.kind);
            if (t) sender.replaceTrack(t);
          });
        }
      } catch { }
    };
  };

  const getDisplayMedia = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then(getDisplayMediaSuccess).catch(() => { });
  };

  useEffect(() => { if (screen === true) getDisplayMedia(); }, [screen]);

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const handleEndCall = () => {
    try { localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop()); } catch { }
    routeTo("/home");
  };

  /* ── Logo SVG ── */
  const LogoSVG = () => (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="#1A56FF" />
      <rect x="6" y="11" width="16" height="12" rx="2.5" fill="white" />
      <circle cx="14" cy="17" r="3.5" fill="#1A56FF" />
      <circle cx="14" cy="17" r="1.8" fill="white" />
      <circle cx="14" cy="17" r="0.8" fill="#1A56FF" />
      <path d="M22 14.5L29 11.5V22.5L22 19.5V14.5Z" fill="white" />
    </svg>
  );

  /* ── Control button helper ── */
  const CtrlBtn = ({ onClick, off, end, active, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        ...(end ? S.ctrlBtnEnd : S.ctrlBtn),
        ...(off ? S.ctrlBtnOff : {}),
        ...(active ? S.ctrlBtnActive : {}),
      }}
      onMouseEnter={(e) => { if (!end) e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );

  /* ── LOBBY ── */
  if (askForUsername) {
    return (
      <>
        <style>{S.fontLink}</style>
        <div style={S.lobbyWrap}>
          <div style={S.lobbyBg} />
          <div style={S.lobbyCard}>
            {/* Logo */}
            <div style={S.lobbyLogo}>
              <LogoSVG />
              <span style={S.lobbyLogoText}>
                Apna <span style={S.lobbyLogoSpan}>Video</span> Call
              </span>
            </div>

            <div>
              <h2 style={S.lobbyHeading}>
                Join the <span style={S.lobbyHeadingBlue}>meeting</span>
              </h2>
              <p style={S.lobbySub}>Enter your name and connect to start or join a call.</p>
            </div>

            <div style={S.divider} />

            {/* Camera preview */}
            <div style={S.lobbyVideoWrap}>
              <video
                ref={localVideoRef}
                autoPlay muted playsInline
                style={{ width: "100%", display: "block", borderRadius: 12, aspectRatio: "16/9", objectFit: "cover", background: "#111" }}
              />
              <span style={S.lobbyVideoLabel}>Preview</span>
            </div>

            {/* Name input */}
            <TextField
              label="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && username && connect()}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                  "&:hover fieldset": { borderColor: "rgba(26,86,255,0.6)" },
                  "&.Mui-focused fieldset": { borderColor: "#1A56FF" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  "&.Mui-focused": { color: "#1A56FF" },
                },
              }}
            />

            <button
              style={S.connectBtn}
              onClick={connect}
              disabled={!username}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1243D6"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1A56FF"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Join Meeting →
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── MEETING ROOM ── */
  return (
    <>
      <style>{S.fontLink + `
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      <div style={S.roomWrap}>

        {/* TOP BAR */}
        <div style={S.topBar}>
          <div style={S.topBarLogo}>
            <LogoSVG />
            <span>Apna <span style={S.topBarLogoSpan}>Video</span> Call</span>
          </div>
          <span style={S.topBarTitle}>/ Live Meeting</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
            <div style={S.topBarDot} />
            <span style={S.topBarLive}>LIVE</span>
          </div>
          <div style={S.topBarSpacer} />
          <span style={S.topBarTime}>{time}</span>
        </div>

        {/* MAIN */}
        <div style={S.mainContent}>

          {/* Videos grid */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {videos.length === 0 ? (
              <div style={S.emptyGrid}>
                <div style={S.emptyIcon}>🎥</div>
                <span style={S.emptyText}>Waiting for others to join…</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.15)" }}>
                  Share your meeting link to invite
                </span>
              </div>
            ) : (
              <div style={S.videosArea}>
                {videos.map((v) => (
                  <div key={v.socketId} style={{
                    ...S.remoteTile,
                    maxWidth: videos.length === 1 ? "70%" : "calc(50% - 6px)",
                  }}>
                    <video
                      autoPlay playsInline
                      ref={(ref) => attachRef(ref, v.stream)}
                      style={S.remoteTileVideo}
                    />
                    <div style={S.tileGradient} />
                    <span style={S.tileLabel}>{v.socketId.slice(0, 8)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat panel */}
          {showModal && (
            <div style={S.chatPanel}>
              <div style={S.chatHeader}>
                <ChatIcon style={{ color: "#1A56FF", fontSize: 18 }} />
                <span style={S.chatHeaderTitle}>Meeting Chat</span>
                <button style={S.chatHeaderClose} onClick={() => { setModal(false); setNewMessages(0); }}>✕</button>
              </div>

              <div style={S.chatMessages}>
                {messages.length === 0 ? (
                  <div style={S.chatEmpty}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>💬</div>
                    <div>No messages yet</div>
                    <div style={{ fontSize: "0.72rem", marginTop: 4, opacity: 0.6 }}>Be the first to say hi!</div>
                  </div>
                ) : messages.map((item, i) => {
                  const isOwn = item.sender === username;
                  return (
                    <div key={i} style={{ ...S.chatMsgWrap, alignItems: isOwn ? "flex-end" : "flex-start" }}>
                      {!isOwn && <span style={S.chatMsgSender}>{item.sender}</span>}
                      <div style={{ ...S.chatMsgText, ...(isOwn ? S.chatMsgTextOwn : {}) }}>
                        {item.data}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={S.chatInputRow}>
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && message && sendMessage()}
                  placeholder="Message…"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.8rem",
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&:hover fieldset": { borderColor: "rgba(26,86,255,0.4)" },
                      "&.Mui-focused fieldset": { borderColor: "#1A56FF" },
                      backgroundColor: "rgba(255,255,255,0.04)",
                    },
                    "& input::placeholder": { color: "rgba(255,255,255,0.3)" },
                  }}
                />
                <button
                  style={S.chatSendBtn}
                  onClick={sendMessage}
                  disabled={!message}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1243D6"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1A56FF"}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOCAL PIP */}
        <div style={S.localPip}>
          <video ref={localVideoRef} autoPlay muted playsInline style={S.localPipVideo} />
          <span style={S.localPipLabel}>You</span>
        </div>

        {/* CONTROL BAR */}
        <div style={S.controlBar}>
          <CtrlBtn onClick={() => setVideo(!video)} off={!video} title={video ? "Turn off camera" : "Turn on camera"}>
            {video ? <VideocamIcon style={{ fontSize: 22 }} /> : <VideocamOffIcon style={{ fontSize: 22 }} />}
          </CtrlBtn>

          <CtrlBtn onClick={() => setAudio(!audio)} off={!audio} title={audio ? "Mute mic" : "Unmute mic"}>
            {audio ? <MicIcon style={{ fontSize: 22 }} /> : <MicOffIcon style={{ fontSize: 22 }} />}
          </CtrlBtn>

          {screenAvailable && (
            <CtrlBtn onClick={() => setScreen(!screen)} active={screen} title={screen ? "Stop sharing" : "Share screen"}>
              {screen ? <ScreenShareIcon style={{ fontSize: 22 }} /> : <StopScreenShareIcon style={{ fontSize: 22 }} />}
            </CtrlBtn>
          )}

          <CtrlBtn
            onClick={() => { setModal(!showModal); if (!showModal) setNewMessages(0); }}
            active={showModal}
            title="Toggle chat"
          >
            <Badge badgeContent={!showModal ? newMessages : 0} max={99} color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem", minWidth: 16, height: 16, padding: "0 4px" } }}>
              <ChatIcon style={{ fontSize: 22 }} />
            </Badge>
          </CtrlBtn>

          <CtrlBtn onClick={handleEndCall} end title="End call">
            <CallEndIcon style={{ fontSize: 24 }} />
          </CtrlBtn>
        </div>

      </div>
    </>
  );
}