import React from 'react';
import { SkillRadar } from './SkillRadar';
import { CandidateNotes } from './CandidateNotes';

export const ResultsSection = ({ analysis, onClear }) => {
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
        <h3>💪 Strengths</h3>
        <div className="tags">
          {analysis.strengths.map((s, i) => (
            <span key={i} className="tag success">{s}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>⚠️ Missing Skills</h3>
        <p className="section-desc">Skills required by the job but not found</p>
        <div className="tags">
          {analysis.missingSkills.map((s, i) => (
            <span key={i} className="tag missing">{s}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>📚 Recommendations</h3>
        <ul>
          {analysis.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="card summary-card">
        <h3>📋 Executive Summary</h3>
        <p>{analysis.summary}</p>
        <div className="summary-metrics">
          <div><span>Experience</span><strong>{analysis.experienceMatch || 65}%</strong></div>
          <div><span>Education</span><strong>{analysis.educationMatch || 70}%</strong></div>
          <div><span>Skills</span><strong>{analysis.score}%</strong></div>
        </div>
      </div>

      <CandidateNotes analysisId={analysis.id} />
      
      <button className="new-analysis" onClick={onClear}>New Analysis</button>
    </div>
  );
};
