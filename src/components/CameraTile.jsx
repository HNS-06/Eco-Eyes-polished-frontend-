import React, { useState } from "react";
import socket from "../utils/socket";

// Get backend URL from environment variables (fallback to localhost for dev)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Speech helper
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;
  window.speechSynthesis.speak(msg);
}

export default function CameraTile({ id, frame }) {
  const [open, setOpen] = useState(false);

  const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='100%' height='100%' fill='#02111e'/><text x='50%' y='50%' fill='#66fff0' font-size='22' font-family='Orbitron' text-anchor='middle'>FEED ${id} — WAIT</text></svg>`;
  const placeholder = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

  // Map feed IDs to local videos (place videos in /public/videos)
  const videoMap = {
    1: "/videos/camera1.mp4",
    2: "/videos/camera2.mp4",
    3: "/videos/camera3.mp4",
    4: "/videos/camera4.mp4",
    5: "/videos/camera5.mp4",
    6: "/videos/camera6.mp4",
  };

  const handleCapture = () => {
    if (!frame) return;
    const entry = {
      id: `${frame.feedId}-${frame.timestamp}`,
      feedId: frame.feedId,
      timestamp: frame.timestamp,
      dataURL: frame.dataURL,
      meta: frame.meta
    };
    const cur = JSON.parse(localStorage.getItem("echo_archive") || "[]");
    localStorage.setItem("echo_archive", JSON.stringify([entry, ...cur].slice(0, 50)));
    socket.emit("capture", entry);
    try { navigator.vibrate && navigator.vibrate(50); } catch (e) {}
  };

  const videoSrc = videoMap[id];

  return (
    <div className="camera-card">
      <div className="head">
        <div>Feed #{id}</div>
        <div>{frame?.anomaly ? <span className="badge">ANOMALY</span> : <span style={{ color: 'var(--muted)' }}>OK</span>}</div>
      </div>

      <div
        className="camera-thumb"
        onClick={() => {
          setOpen(true);
          speak(`Checking Feed ${id}`);
        }}
        role="button"
        tabIndex={0}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
            autoPlay
            loop
            muted
          />
        ) : (
          <img
            src={frame?.dataURL || placeholder}
            alt={`feed-${id}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
          />
        )}
      </div>

      {open &&
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--accent)' }}>Feed #{id} — {frame?.meta?.note || 'Live'}</h3>
            <p style={{ color: 'var(--muted)' }}>Location: {frame?.meta?.location || 'Unknown'}</p>

            {videoSrc ? (
              <video
                src={videoSrc}
                style={{ width: '100%', borderRadius: 6, marginTop: 8 }}
                controls
              />
            ) : (
              <img
                src={frame?.dataURL || placeholder}
                alt="frame"
                style={{ width: '100%', borderRadius: 6, marginTop: 8 }}
              />
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
              <button className="btn btn-accent" onClick={handleCapture}>Capture Evidence</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
