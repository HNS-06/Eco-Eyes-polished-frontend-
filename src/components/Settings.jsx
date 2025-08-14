import React, { useState, useEffect } from "react";

export default function Settings({ config, onSave }) {
  const [formData, setFormData] = useState(config);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("echo_settings", JSON.stringify(formData));
    onSave(formData);
  };

  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Camera Source URL:
          <input
            type="text"
            name="cameraUrl"
            value={formData.cameraUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Enable Anomaly Detection:
          <input
            type="checkbox"
            name="detectAnomalies"
            checked={formData.detectAnomalies}
            onChange={handleChange}
          />
        </label>

        <label>
          Alert Sound URL:
          <input
            type="text"
            name="alertSound"
            value={formData.alertSound}
            onChange={handleChange}
          />
        </label>

        <label>
          Refresh Interval (ms):
          <input
            type="number"
            name="refreshInterval"
            value={formData.refreshInterval}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
