import React from "react";

export const SummarySection = ({ analysis, onClear }) => {
  return (
    <div className="results-section">
      <div className="card summary-card">
        <h3>📋 Executive Summary</h3>
        <p>{analysis.summary}</p>
        <div className="summary-metrics">
          <div><span>Experience Match</span> <strong>{analysis.experienceMatch}%</strong></div>
          <div><span>Education Match</span> <strong>{analysis.educationMatch}%</strong></div>
          <div><span>Skills Match</span> <strong>{analysis.score}%</strong></div>
        </div>
      </div>
      <button className="new-analysis" onClick={onClear}>New Analysis</button>
    </div>
  );
};
