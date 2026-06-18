import React from "react";

export const MissingSkillsSection = ({ analysis, onClear }) => {
  return (
    <div className="results-section">
      <div className="card">
        <h3>⚠️ Missing Skills</h3>
        <p className="section-desc">Skills required by the job but not found in your resume</p>
        <div className="tags">
          {analysis.missingSkills.map((s, i) => (
            <span key={i} className="tag missing">{s}</span>
          ))}
        </div>
      </div>
      <button className="new-analysis" onClick={onClear}>New Analysis</button>
    </div>
  );
};
