import React, { useState } from "react";
import { LoginModal } from "../auth/LoginModal";

export const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing">
      <div className="hero">
        <h1>NexusHire AI</h1>
        <p className="hero-sub">Intelligent Resume Analysis</p>
        <p className="hero-tag">Powered by AI &amp; RAG Technology</p>
        <button className="hero-btn" onClick={() => setShowLogin(true)}>Get Started</button>
      </div>
      <div className="features">
        <div className="feature">
          <span>🎯</span>
          <h3>ATS Score Prediction</h3>
          <p>Get accurate match scores based on real ATS algorithms</p>
        </div>
        <div className="feature">
          <span>🔍</span>
          <h3>Skill Gap Analysis</h3>
          <p>Identify missing skills and get actionable recommendations</p>
        </div>
        <div className="feature">
          <span>🤖</span>
          <h3>AI-Powered Insights</h3>
          <p>Leverage Groq LLM and RAG for deep contextual analysis</p>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={onLogin} />}
    </div>
  );
};
