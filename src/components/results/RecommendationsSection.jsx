import React from "react";

export const RecommendationsSection = ({ analysis, onClear }) => {
  return (
    <div className="results-section">
      <div className="card">
        <h3>📚 Recommendations</h3>
        <ul>
          {analysis.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
      <button className="new-analysis" onClick={onClear}>New Analysis</button>
    </div>
  );
};
