import React, { useEffect, useState } from "react";

export default function EvidenceArchive(){
  const [items, setItems] = useState([]);

  useEffect(()=> {
    const cur = JSON.parse(localStorage.getItem("echo_archive") || "[]");
    setItems(cur);
  }, []);

  if(items.length === 0) return <div style={{color:'var(--muted)'}}>No evidence captured</div>;

  return (
    <div className="archive-list">
      {items.map(it => (
        <div className="evidence-item" key={it.id}>
          <img className="evidence-thumb" src={it.dataURL} alt={it.id} />
          <div style={{fontSize:13, color:'var(--muted)'}}>
            <div><strong>Feed</strong> {it.feedId}</div>
            <div style={{fontSize:12}}>{new Date(it.timestamp).toLocaleString()}</div>
            <div style={{fontSize:12}}>{it.meta?.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
