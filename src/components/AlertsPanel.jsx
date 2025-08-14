import React, { useEffect, useRef } from "react";

// Get backend URL from environment variables (for future API calls if needed)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Speech helper
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;
  window.speechSynthesis.speak(msg);
}

export default function AlertsPanel({ alerts = [] }) {
  const prevAlertsCount = useRef(0);

  useEffect(() => {
    if (alerts.length > prevAlertsCount.current) {
      const latestAlert = alerts[alerts.length - 1];
      if (latestAlert?.text) {
        speak(`Alert! ${latestAlert.text}`);
      }
    }
    prevAlertsCount.current = alerts.length;
  }, [alerts]);

  if (!alerts.length)
    return <div style={{ color: 'var(--muted)' }}>No alerts yet.</div>;

  return (
    <>
      {alerts.map((a, i) => (
        <div className="alert-item" key={i}>
          <div style={{ fontWeight: 700, color: '#fff' }}>{a.text}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {new Date(a.ts).toLocaleString()}
          </div>
        </div>
      ))}
    </>
  );
}
