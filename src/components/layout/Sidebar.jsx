import React from "react";

export const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  analysis, 
  savedAnalyses, 
  onLogout,
  userName 
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NexusHire AI</h2>
        {userName && <div className="user-badge">{userName}</div>}
      </div>
      <div className="sidebar-nav">
        <button className={activeSection === "upload" ? "active" : ""} onClick={() => onSectionChange("upload")}>
          📤 Upload
        </button>
        {analysis && (
          <>
            <button className={activeSection === "strengths" ? "active" : ""} onClick={() => onSectionChange("strengths")}>
              💪 Strengths
            </button>
            <button className={activeSection === "missing" ? "active" : ""} onClick={() => onSectionChange("missing")}>
              ⚠️ Missing
            </button>
            <button className={activeSection === "recommendations" ? "active" : ""} onClick={() => onSectionChange("recommendations")}>
              📚 Recommendations
            </button>
            <button className={activeSection === "summary" ? "active" : ""} onClick={() => onSectionChange("summary")}>
              📋 Summary
            </button>
          </>
        )}
      </div>
      <div className="sidebar-bottom">
        {savedAnalyses.length > 0 && (
          <button className={activeSection === "history" ? "active" : ""} onClick={() => onSectionChange("history")}>
            📜 History ({savedAnalyses.length})
          </button>
        )}
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};
