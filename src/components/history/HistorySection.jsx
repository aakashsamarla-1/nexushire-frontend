import React from "react";

export const HistorySection = ({ savedAnalyses, onLoadHistory }) => {
  return (
    <div className="history-section">
      <h2>Analysis History</h2>
      <div className="history-list">
        {savedAnalyses.map((item, i) => (
          <div key={i} className="history-item" onClick={() => onLoadHistory(item)}>
            <strong>{item.resumeName || "Resume"}</strong>
            <span>Score: {item.score}%</span>
            <small>{new Date(item.timestamp).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
