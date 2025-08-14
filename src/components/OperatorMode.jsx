import React from "react";

export default function OperatorMode({ feeds, onMarkAnomaly, onPause }) {
  return (
    <div className="operator-mode">
      <h2>Operator Mode</h2>
      <button onClick={onPause}>Pause Monitoring</button>
      <div className="feeds-list">
        {feeds.map((feed, index) => (
          <div key={index} className="feed-card">
            <img src={feed.dataURL} alt={`Feed ${feed.feedId}`} />
            <p>Feed #{feed.feedId}</p>
            <button onClick={() => onMarkAnomaly(feed.feedId)}>Mark Anomaly</button>
          </div>
        ))}
      </div>
    </div>
  );
}
