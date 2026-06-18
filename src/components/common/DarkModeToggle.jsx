import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexushire_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nexushire_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('nexushire_theme', 'light');
    }
  }, [isDark]);

  return (
    <button 
      className="dark-mode-toggle" 
      onClick={() => setIsDark(!isDark)}
      style={{
        background: isDark ? '#374151' : '#e5e7eb',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        padding: '8px',
        width: '40px',
        height: '40px',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <motion.span
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>
    </button>
  );
};
