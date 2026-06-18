import { useState, useEffect } from "react";

// API URL - Hardcoded to Render backend
const API_URL = "https://nexushire-backend.onrender.com";

export const useResumeAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [activeSection, setActiveSection] = useState("upload");

  useEffect(() => {
    const saved = sessionStorage.getItem("resumeAnalyses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedAnalyses(parsed);
        console.log("Loaded saved analyses:", parsed.length);
      } catch (e) {
        console.error("Failed to parse saved analyses", e);
        sessionStorage.removeItem("resumeAnalyses");
      }
    }
  }, []);

  const analyze = async (resumeFile, jobDescription, resumeFileName) => {
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please provide a job description");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      
      const blob = new Blob([jobDescription], { type: 'text/plain' });
      const jdFile = new File([blob], "job-description.txt", { type: 'text/plain' });
      formData.append("jobDescriptionFile", jdFile);

      console.log("Calling backend for:", resumeFileName);
      
      const response = await fetch(`${API_URL}/api/upload-resume`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);
      
      const result = {
        score: data.score || data.overallScore || 70,
        atsScore: data.atsScore || data.score || 65,
        keywordMatch: data.keywordMatch || 60,
        experienceMatch: data.experienceMatch || 50,
        educationMatch: data.educationMatch || 70,
        summary: data.summary || data.recruiterSummary || "Analysis completed successfully",
        strengths: data.strengths || ["Strong technical skills", "Good communication", "Team player"],
        missingSkills: data.missingSkills || data.skillGaps || ["Advanced algorithms", "Cloud architecture"],
        recommendations: data.improvements || data.recommendations || ["Keep learning", "Practice coding", "Build projects"],
        improvements: data.improvements || data.recommendations || ["Keep learning", "Practice coding", "Build projects"],
        id: Date.now(),
        timestamp: new Date().toISOString(),
        resumeName: resumeFileName
      };
      
      setAnalysis(result);
      setActiveSection("strengths");
      
      const updatedHistory = [result, ...savedAnalyses].slice(0, 10);
      setSavedAnalyses(updatedHistory);
      sessionStorage.setItem("resumeAnalyses", JSON.stringify(updatedHistory));
      
      console.log("Saved to sessionStorage. Total analyses:", updatedHistory.length);
      
      return result;
      
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Analysis failed. Please try again.");
      
      const fallbackResult = {
        score: Math.floor(Math.random() * 25) + 65,
        atsScore: Math.floor(Math.random() * 25) + 60,
        keywordMatch: Math.floor(Math.random() * 25) + 60,
        experienceMatch: Math.floor(Math.random() * 25) + 50,
        educationMatch: Math.floor(Math.random() * 25) + 60,
        summary: "Analysis completed with demo data. Please check your backend connection.",
        strengths: ["React.js", "JavaScript/ES6", "Node.js", "Express.js", "MongoDB"],
        missingSkills: ["TypeScript", "GraphQL", "AWS", "Docker"],
        recommendations: [
          "Learn TypeScript to improve code quality and catch errors early",
          "Get AWS certification for cloud expertise",
          "Build projects with Docker containers for deployment",
          "Study GraphQL for modern API development"
        ],
        improvements: [
          "Learn TypeScript to improve code quality and catch errors early",
          "Get AWS certification for cloud expertise",
          "Build projects with Docker containers for deployment",
          "Study GraphQL for modern API development"
        ],
        id: Date.now(),
        timestamp: new Date().toISOString(),
        resumeName: resumeFileName
      };
      
      setAnalysis(fallbackResult);
      setActiveSection("strengths");
      
      const updated = [fallbackResult, ...savedAnalyses].slice(0, 10);
      setSavedAnalyses(updated);
      sessionStorage.setItem("resumeAnalyses", JSON.stringify(updated));
      
      return fallbackResult;
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setAnalysis(null);
    setError("");
    setActiveSection("upload");
  };

  const loadHistory = (item) => {
    setAnalysis(item);
    setActiveSection("strengths");
  };

  const deleteHistory = (id) => {
    const updated = savedAnalyses.filter(item => item.id !== id);
    setSavedAnalyses(updated);
    sessionStorage.setItem("resumeAnalyses", JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    setSavedAnalyses([]);
    sessionStorage.removeItem("resumeAnalyses");
  };

  return { 
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
  };
};
