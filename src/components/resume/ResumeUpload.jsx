import React from "react";

export const ResumeUpload = ({
  resumeFile,
  resumeFileName,
  onFileChange,
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  loading
}) => {
  return (
    <div className="upload-section">
      <h2>Upload Your Resume</h2>
      <div className="upload-box">
        <div className="upload-icon">📄</div>
        <input type="file" id="resume" accept=".pdf,.doc,.docx" onChange={onFileChange} />
        <label htmlFor="resume" className="upload-label">Choose Resume</label>
        {resumeFileName && <p className="file-name">✓ {resumeFileName}</p>}
      </div>

      <h2>Job Description</h2>
      <textarea 
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={onJobDescriptionChange}
        rows="8"
      />

      <button className="analyze-btn" onClick={onAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
};
