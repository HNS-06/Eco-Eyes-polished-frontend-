import React from "react";
import CameraTile from "./CameraTile.jsx";

export default function CameraGrid({ feeds = {}, feedCount = 6 }){
  const ids = Array.from({length: feedCount}, (_,i) => i+1);
  return (
    <div className="camera-grid">
      {ids.map(id => <CameraTile key={id} id={id} frame={feeds[id]} />)}
    </div>
  );
}
