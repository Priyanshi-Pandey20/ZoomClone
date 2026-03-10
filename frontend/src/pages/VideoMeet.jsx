import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Badge,Button, IconButton } from "@mui/material";
import { io } from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import {useNavigate} from "react-router-dom"
import server from "../environment";


import styles from "../styles/videoComponent.module.css";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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


  let[screen, setScreen] = useState();
  let[showModal, setModal] = useState(true);
  let[screenAvailable, setScreenAvailable] = useState(false);
  let[messages, setMessages] = useState([]);
  let[message, setMessage] = useState("");
  let[newMessages, setNewMessages] = useState(3);

  // ─── silence / black helpers ───────────────────────────────────────────────
  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const blackSilence = () => new MediaStream([black(), silence()]);

  // ─── get camera/mic permission ─────────────────────────────────────────────
  const getPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoAvailable(true);
      setAudioAvailable(true);
      setVideo(true);
      setAudio(true);
      window.localStream = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Permission error:", err);
      setVideoAvailable(false);
      setAudioAvailable(false);
      window.localStream = blackSilence();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = window.localStream;
      }
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  // ─── toggle video/audio ────────────────────────────────────────────────────
  useEffect(() => {
    if (!window.localStream) return;
    window.localStream.getVideoTracks().forEach((t) => (t.enabled = video));
  }, [video]);

  useEffect(() => {
    if (!window.localStream) return;
    window.localStream.getAudioTracks().forEach((t) => (t.enabled = audio));
  }, [audio]);

  useEffect(() => {
    if(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia){
      setScreenAvailable(true);
    }else{
      setScreenAvailable(false);
    }
  },[]);

  // ─── create a peer connection for a given remote socket id ─────────────────
  const createPeerConnection = (remoteId) => {
    if (connections[remoteId]) return connections[remoteId];

    const pc = new RTCPeerConnection(peerConfigConnections);
    connections[remoteId] = pc;

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit(
          "signal",
          remoteId,
          JSON.stringify({ ice: event.candidate })
        );
      }
    };

    // ✅ Use ontrack instead of deprecated onaddstream
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream) return;

      setVideos((prev) => {
        const exists = prev.find((v) => v.socketId === remoteId);
        let updated;
        if (exists) {
          updated = prev.map((v) =>
            v.socketId === remoteId ? { ...v, stream } : v
          );
        } else {
          updated = [...prev, { socketId: remoteId, stream }];
        }
        videoRef.current = updated;
        return updated;
      });
    };

    // Add local tracks to the connection
    const localStream = window.localStream || blackSilence();
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    return pc;
  };

  // ─── handle incoming signals ───────────────────────────────────────────────
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
          socketRef.current.emit(
            "signal",
            fromId,
            JSON.stringify({ sdp: pc.localDescription })
          );
        }
      } catch (e) {
        console.error("SDP error:", e);
      }
    }

    if (signal.ice) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
      } catch (e) {
        console.error("ICE error:", e);
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
   
    setMessages((prevMessages) => [
      ...prevMessages,
      {sender: sender, data: data}
    ]);

    if(socketIdSender !== socketIdRef.current){
      setNewMessages((prevMessages) => prevMessages + 1)
    }
  }

  // ─── socket connection ─────────────────────────────────────────────────────
  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      console.log("✅ Connected, socket id:", socketRef.current.id);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.emit("join-call", window.location.href);

      // chat messages
      socketRef.current.on("chat-message", addMessage)

      // user left
      socketRef.current.on("user-left", (id) => {
        if (connections[id]) {
          connections[id].close();
          delete connections[id];
        }
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });

      // user joined — `clients` is the full list of people in the room
      socketRef.current.on("user-joined", (id, clients) => {
        if (!Array.isArray(clients)) {
          console.warn("clients is not an array:", clients);
          return;
        }

        // Create peer connections for everyone already in the room
        clients.forEach((remoteId) => {
          if (remoteId === socketIdRef.current) return;
          createPeerConnection(remoteId);
        });

        // If WE just joined, send offers to everyone else
        if (id === socketIdRef.current) {
          clients.forEach((remoteId) => {
            if (remoteId === socketIdRef.current) return;
            const pc = connections[remoteId];
            if (!pc) return;

            pc.createOffer()
              .then((desc) => pc.setLocalDescription(desc))
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  remoteId,
                  JSON.stringify({ sdp: connections[remoteId].localDescription })
                );
              })
              .catch((e) => console.error("Offer error:", e));
          });
        }
      });
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });
  };

  // ─── connect button ────────────────────────────────────────────────────────
  const connect = async () => {
    setAskForUsername(false);
    await getPermission();
    connectToSocketServer();
  };

  // ─── attach remote stream to video element ─────────────────────────────────
  const attachRef = (ref, stream) => {
    if (ref && stream && ref.srcObject !== stream) {
      ref.srcObject = stream;
    }
  };



let routeTo = useNavigate();

  let handleVideo = () => {
    setVideo(!video);
  }
  let handleAudio= () => {
    setAudio(!audio);
  }
 let getDisplayMediaSuccess = (stream) => {
  try {
    window.localStream.getTracks().forEach(track => track.stop());
  } catch(e) { console.log(e); }

  window.localStream = stream;
  localVideoRef.current.srcObject = stream;

  for (let id in connections) {
    if (id === socketIdRef.current) continue;
    connections[id].getSenders().forEach(sender => {
      if (sender.track && stream.getTracks().find(t => t.kind === sender.track.kind)) {
        sender.replaceTrack(stream.getTracks().find(t => t.kind === sender.track.kind));
      }
    });
  }

  // ✅ When screen share stops (user clicks browser's "Stop sharing"), restore camera
  stream.getVideoTracks()[0].onended = async () => {
    setScreen(false);
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      window.localStream = cameraStream;
      localVideoRef.current.srcObject = cameraStream;

      for (let id in connections) {
        if (id === socketIdRef.current) continue;
        connections[id].getSenders().forEach(sender => {
          const replacement = cameraStream.getTracks().find(t => t.kind === sender.track?.kind);
          if (replacement) sender.replaceTrack(replacement);
        });
      }
    } catch(e) { console.log(e); }
  };
};
  let getDisplayMedia = () => {
  if (navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then(getDisplayMediaSuccess)
      .catch((e) => console.log(e));
  }
};

  useEffect(() => {
  if (screen === true) {
    getDisplayMedia();
  }
}, [screen]);

  let handleScreen = () =>{
    setScreen(!screen)
  }

  let sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage(""); 
  }

  let handleEndCall = () =>{
    try{
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop())

    }catch(e){  }
    routeTo("/home")
  }
  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div >
      {askForUsername ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 400 }}>
          <h2>Enter into Lobby</h2>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: 8 }} />
        </div>
      ) : (
        <div>
          {/* Local video */}
          <div className={styles.meetVideoContainer}>

            {showModal ? <div className={styles.chatRoom}>
              

              <div className={styles.chatContainer}>
                 <h1>Chat</h1>

                 <div className={styles.chattingDisplay}>

                  {messages.length > 0 ? messages.map((item, index) => {
                    return(
                      <div style={{marginBottom: "20px"}} key ={index}>
                        <p style={{fontWeight:"bold"}}>{item.sender}</p>
                        <p>{item.data}</p>
                      </div>
                    )
                  }): <p>No Messages Yet</p>}
                 </div>
                 <div className={styles.chattingArea}>
                 <TextField  value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                 <Button variant='contained' onClick={sendMessage}>Send</Button>
                 </div>
                </div>
            </div> : <></>}
            <div className={styles.buttonContainers}>
              <IconButton onClick={handleVideo} style={{color:"white"}}>
                {(video === true) ? <VideocamIcon/>: <VideocamOffIcon/>}
              </IconButton>
               <IconButton onClick={handleEndCall} style={{color:"red"}}>
                <CallEndIcon/>
              </IconButton>
               <IconButton onClick={handleAudio} style={{color:"white"}}>
                {(audio === true) ? <MicIcon/>: <MicOffIcon/>}
              </IconButton>

              {screenAvailable === true ? <IconButton onClick={handleScreen} style={{color:"white"}}> {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon/> }</IconButton> : <></>}

              <Badge badgeContent={newMessages} max={999} color="secondary">
                <IconButton onClick={() => setModal(!showModal)} style={{color:"white"}}>
                  <ChatIcon/>
                </IconButton>
              </Badge>
              
            </div>
            {/* <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
              You ({socketIdRef.current?.slice(0, 8)})
            </p> */}
            <video className={styles.meetUserVideo}
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{borderRadius: 20,height:220 }}
            />
            {/* <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
              <Button
                size="small"
                variant={video ? "contained" : "outlined"}
                onClick={() => setVideo((v) => !v)}
              >
                {video ? "Cam On" : "Cam Off"}
              </Button>
              <Button
                size="small"
                variant={audio ? "contained" : "outlined"}
                onClick={() => setAudio((a) => !a)}
              >
                {audio ? "Mic On" : "Mic Off"}
              </Button>
            </div> */}
          

          {/* Remote videos */}
          <div  className={styles.conferenceView}>
          {videos.map((v) => (
            <div key={v.socketId} >
              {/* <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
                {v.socketId.slice(0, 8)}
              </p> */}
              <video
                autoPlay
                playsInline
                ref={(ref) => attachRef(ref, v.stream)}
                style={{ width: 320, borderRadius: 8, background: "#000" }}
              />
            </div>
          ))}
           </div>
          </div>
        </div>
      )}
    </div>
  );
}