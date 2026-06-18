import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const HistorySearch = ({ analyses, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, filterScore);
  };

  const handleFilter = (score) => {
    setFilterScore(score);
    applyFilters(searchTerm, score);
  };

  const applyFilters = (term, score) => {
    const filtered = analyses.filter(item => {
      const matchesSearch = item.resumeName?.toLowerCase().includes(term.toLowerCase()) || 
                           item.summary?.toLowerCase().includes(term.toLowerCase());
      const matchesScore = score === 'all' || 
                          (score === 'high' && item.score >= 80) ||
                          (score === 'medium' && item.score >= 60 && item.score < 80) ||
                          (score === 'low' && item.score < 60);
      return matchesSearch && matchesScore;
    });
    onFilter(filtered);
  };

  return (
    <motion.div 
      className="history-search"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or keywords..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterScore} 
          onChange={(e) => handleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Scores</option>
          <option value="high">⭐ High (80%+)</option>
          <option value="medium">📊 Medium (60-79%)</option>
          <option value="low">📉 Low (&lt;60%)</option>
        </select>
      </div>
    </motion.div>
  );
};
