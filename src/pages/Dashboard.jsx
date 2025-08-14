import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import CameraGrid from "../components/CameraGrid.jsx";
import AlertsPanel from "../components/AlertsPanel.jsx";
import EvidenceArchive from "../components/EvidenceArchive.jsx";

export default function Dashboard() {
  const [feeds, setFeeds] = useState({});
  const [feedCount, setFeedCount] = useState(6);
  const [alerts, setAlerts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [operatorMode, setOperatorMode] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("socket connected"));
    socket.on("init", (d) => {
      if (d.feedCount) setFeedCount(d.feedCount);
    });
    socket.on("frame", (frame) => {
      setFeeds((prev) => ({ ...prev, [frame.feedId]: frame }));
      if (frame.anomaly) {
        setAlerts((prev) => [
          {
            text: `Anomaly on feed #${frame.feedId}: ${
              frame.event?.desc || frame.meta?.note
            }`,
            ts: Date.now(),
            frame,
          },
          ...prev,
        ].slice(0, 60));
      }
    });
    socket.on("captureAck", (ack) => {
      console.log("captureAck", ack);
    });

    return () => socket.removeAllListeners();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const count = parseInt(e.target.feedCount.value);
    if (!isNaN(count) && count > 0) {
      setFeedCount(count);
      socket.emit("updateFeedCount", count); // optional: notify backend
    }
    setShowSettings(false);
  };

  return (
    <div className={`app ${operatorMode ? "operator-mode" : ""}`}>
      <div className="header">
        <div className="brand">
          <div className="logo">EE</div>
          <div>
            <div className="title">Echo Eyes</div>
            <div className="subtitle">
              City Surveillance Live — Neon District
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>
          <button
            className={`btn ${operatorMode ? "btn-danger" : "btn-accent"}`}
            onClick={() => setOperatorMode((prev) => !prev)}
          >
            {operatorMode ? "Exit Operator Mode" : "Operator Mode"}
          </button>
        </div>
      </div>

      <div className="main-grid">
        <div>
          <CameraGrid feeds={feeds} feedCount={feedCount} />
        </div>

        <div className="right-panel">
          <div className="panel">
            <h3 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>
              Live Alerts
            </h3>
            <div className="alert-list">
              <AlertsPanel alerts={alerts} />
            </div>
          </div>

          <div className="panel">
            <h3 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>
              Evidence Archive
            </h3>
            <EvidenceArchive />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Settings</h2>
            <form onSubmit={handleSaveSettings}>
              <label>
                Number of Feeds:
                <input
                  type="number"
                  name="feedCount"
                  defaultValue={feedCount}
                  min="1"
                />
              </label>
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button type="submit" className="btn btn-accent">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
