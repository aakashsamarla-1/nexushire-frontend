import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const SkillRadar = ({ analysis }) => {
  if (!analysis) return null;
  
  const data = [
    { skill: 'Overall', score: Math.min(100, analysis.score || 70) },
    { skill: 'ATS', score: Math.min(100, analysis.atsScore || 60) },
    { skill: 'Keywords', score: Math.min(100, analysis.keywordMatch || 60) },
    { skill: 'Experience', score: Math.min(100, analysis.experienceMatch || 50) },
    { skill: 'Education', score: Math.min(100, analysis.educationMatch || 60) },
    { skill: 'Skills', score: Math.min(100, analysis.score || 70) },
  ];

  return (
    <div className="radar-container">
      <h3 className="radar-title">📊 Skill Score Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(102, 126, 234, 0.2)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
          <Radar 
            name="Score" 
            dataKey="score" 
            stroke="#667eea" 
            fill="#667eea" 
            fillOpacity={0.2}
            strokeWidth={3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
