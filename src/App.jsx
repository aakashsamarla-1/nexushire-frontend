import React, { useState } from "react";
import "./App.css";
import { ToastProvider, showToast } from "./components/common/ToastProvider";
import { DarkModeToggle } from "./components/common/DarkModeToggle";
import { LoadingSkeleton } from "./components/common/LoadingSkeleton";
import { ExportButton } from "./components/common/ExportButton";
import { useAuth } from "./hooks/useAuth";
import { useResumeAnalysis } from "./hooks/useResumeAnalysis";
import { LandingPage } from "./components/landing/LandingPage";
import { Sidebar } from "./components/layout/Sidebar";
import { DragDropUpload } from "./components/resume/DragDropUpload";
import { SkillRadar } from "./components/results/SkillRadar";
import { CandidateNotes } from "./components/results/CandidateNotes";
import { HistorySearch } from "./components/history/HistorySearch";

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { 
    loading, 
    analysis, 
    error, 
    savedAnalyses, 
    activeSection,
    setActiveSection,
    analyze, 
    clearAll, 
    loadHistory,
    deleteHistory,
    clearAllHistory
  } = useResumeAnalysis();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);

  const handleFileDrop = (file) => {
    setResumeFile(file);
    setResumeFileName(file.name);
    showToast.success("? " + file.name + " uploaded successfully!");
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      showToast.error("Please upload a resume");
      return;
    }
    if (!jobDescription.trim()) {
      showToast.error("Please provide a job description");
      return;
    }

    showToast.loading("Analyzing your resume with AI...");
    await analyze(resumeFile, jobDescription, resumeFileName);
    showToast.dismiss();
    showToast.success("Analysis complete!");
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={login} />;
  }

  const renderSection = () => {
    if (activeSection === "upload") {
      return (
        <div className="upload-section">
          <div className="upload-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Upload Resume</h2>
                <p>Upload a resume and paste the job description</p>
              </div>
              <DarkModeToggle />
            </div>
          </div>
          
          <DragDropUpload 
            onFileDrop={handleFileDrop}
            fileName={resumeFileName}
            loading={loading}
          />

          <div className="jd-section">
            <h3>Job Description</h3>
            <textarea 
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="6"
            />
          </div>

          <button 
            className="analyze-btn" 
            onClick={handleAnalyze} 
            disabled={loading || !resumeFile}
            style={{ marginTop: "20px" }}
          >
            {loading ? "Processing..." : "Analyze Resume"}
          </button>

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    if (analysis && activeSection === "strengths") {
      return (
        <div className="results-section">
          <div className="score-grid">
            <div className="score-card">
              <div className="score-value">{analysis.score}%</div>
              <p>Overall Match</p>
            </div>
            <div className="score-card">
              <div className="score-value">{analysis.atsScore || analysis.score - 5}%</div>
              <p>ATS Score</p>
            </div>
            <div className="score-card">
              <div className="score-value">{analysis.keywordMatch || analysis.score - 8}%</div>
              <p>Keyword Match</p>
            </div>
          </div>

          <SkillRadar analysis={analysis} />

          <div className="card">
            <h3>Strengths</h3>
            <div className="tags">
              {analysis.strengths.map((s, i) => (
                <span key={i} className="tag success">{s}</span>
              ))}
            </div>
          </div>

          <CandidateNotes analysisId={analysis.id} />
          
          <button className="new-analysis" onClick={clearAll}>New Analysis</button>

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    if (analysis && activeSection === "missing") {
      return (
        <div className="results-section">
          <div className="card">
            <h3>Missing Skills</h3>
            <p className="section-desc">Skills required by the job but not found</p>
            <div className="tags">
              {analysis.missingSkills.map((s, i) => (
                <span key={i} className="tag missing">{s}</span>
              ))}
            </div>
          </div>
          <CandidateNotes analysisId={analysis.id} />
          <button className="new-analysis" onClick={clearAll}>New Analysis</button>

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    if (analysis && activeSection === "recommendations") {
      return (
        <div className="results-section">
          <div className="card">
            <h3>Recommendations</h3>
            <ul>
              {analysis.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <button className="new-analysis" onClick={clearAll}>New Analysis</button>

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    if (analysis && activeSection === "summary") {
      return (
        <div className="results-section">
          <div className="card summary-card">
            <h3>Executive Summary</h3>
            <p>{analysis.summary}</p>
            <div className="summary-metrics">
              <div><span>Experience</span><strong>{analysis.experienceMatch || 65}%</strong></div>
              <div><span>Education</span><strong>{analysis.educationMatch || 70}%</strong></div>
              <div><span>Skills</span><strong>{analysis.score}%</strong></div>
            </div>
          </div>
          <CandidateNotes analysisId={analysis.id} />
          <button className="new-analysis" onClick={clearAll}>New Analysis</button>

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    if (activeSection === "history" && savedAnalyses.length > 0) {
      const historyData = filteredHistory.length > 0 ? filteredHistory : savedAnalyses;
      return (
        <div className="history-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Analysis History</h2>
            <button className="clear-history" onClick={clearAllHistory}>Clear All</button>
          </div>
          <HistorySearch analyses={savedAnalyses} onFilter={setFilteredHistory} />
          {historyData.map((item, i) => (
            <div key={i} className="history-item" onClick={() => loadHistory(item)}>
              <div className="history-info">
                <strong>{item.resumeName || "Resume"}</strong>
                <span>Score: {item.score}%</span>
                <small>{new Date(item.timestamp).toLocaleString()}</small>
              </div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}>???</button>
            </div>
          ))}

          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ExportButton analyses={savedAnalyses} currentAnalysis={analysis} />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <ToastProvider />
      <div className="dashboard">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          analysis={analysis}
          savedAnalyses={savedAnalyses}
          onLogout={logout}
          userName={user?.name}
        />

        <div className="main-content">
          {error && <div className="error">{error}</div>}
          {loading ? <LoadingSkeleton /> : renderSection()}
        </div>
      </div>
    </>
  );
}

export default App;

