import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton = ({ type = 'analysis' }) => {
  if (type === 'analysis') {
    return (
      <motion.div 
        className="skeleton-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-circle"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="skeleton-list">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      ))}
    </div>
  );
};
