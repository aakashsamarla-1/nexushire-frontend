import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { format } from 'date-fns';

export const AnalyticsDashboard = ({ analyses }) => {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="analytics-empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>No Data to Analyze</h3>
          <p>Start analyzing resumes to see insights</p>
        </div>
      </div>
    );
  }

  const total = analyses.length;
  const avgScore = Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / total);
  const highScore = Math.max(...analyses.map(a => a.score));
  const lowScore = Math.min(...analyses.map(a => a.score));
  
  const highCount = analyses.filter(a => a.score >= 80).length;
  const mediumCount = analyses.filter(a => a.score >= 60 && a.score < 80).length;
  const lowCount = analyses.filter(a => a.score < 60).length;

  // Score distribution data
  const distribution = [
    { range: '0-20%', count: analyses.filter(a => a.score < 20).length },
    { range: '21-40%', count: analyses.filter(a => a.score >= 20 && a.score < 40).length },
    { range: '41-60%', count: analyses.filter(a => a.score >= 40 && a.score < 60).length },
    { range: '61-80%', count: analyses.filter(a => a.score >= 60 && a.score < 80).length },
    { range: '81-100%', count: analyses.filter(a => a.score >= 80).length },
  ];

  // Re  // Top skills
  const skillFreq = {};
  analyses.forEach(a => {
    a.strengths?.forEach(s => {
      skillFreq[s] = (skillFreq[s] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const COLORS = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="analytics-dashboard">
      <h2 className="analytics-title">📊 Analytics Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid-4">
        <div className="stat-card-4">
          <span className="stat-icon-4">📄</span>
          <div>
            <div className="stat-value-4">{total}</div>
            <div className="stat-label-4">Total Analyses</div>
          </div>
        </div>
        <div className="stat-card-4">
          <span className="stat-icon-4">⭐</span>
          <div>
            <div className="stat-value-4">{avgScore}%</div>
            <div className="stat-label-4">Average Score</div>
          </div>
        </div>
        <div className="stat-card-4">
          <span className="stat-icon-4">🏆</span>
          <div>
            <div className="stat-value-4">{highCount}</div>
            <div className="stat-label-4">High Scores (80%+)</div>
          </div>
        </div>
        <div className="stat-card-4">
          <span className="stat-icon-4">📉</span>
          <div>
            <div className="stat-value-4">{lowCount}</div>
            <div className="stat-label-4">Needs Improvement</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid-2">
        <div className="chart-card">
          <h4>Score Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Recent Activity Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Top Skills Found</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topSkills}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="count"
                label
              >
                {topSkills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Quick Insights</h4>
          <div className="quick-insights">
            <div className="insight-item">
              <span>📈 Best Score</span>
              <strong>{highScore}%</strong>
            </div>
            <div className="insight-item">
              <span>📉 Lowest Score</span>
              <strong>{lowScore}%</strong>
            </div>
            <div className="insight-item">
              <span>📅 Latest Analysis</span>
              <strong>{format(new Date(analyses[analyses.length-1]?.timestamp || Date.now()), 'MMM dd, yyyy')}</strong>
            </div>
            <div className="insight-item">
              <span>⏱️ Total Time Saved</span>
              <strong>{total * 15} mins</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
