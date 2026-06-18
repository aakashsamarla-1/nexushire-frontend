import React, { useState } from "react";

export const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    // Demo login - accept any email/password for now
    onLogin(email, password);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Welcome to NexusHire AI</h2>
        <p className="modal-sub">Sign in to access your dashboard</p>
        
        <div className="demo-accounts">
          <p><strong>Demo Account:</strong></p>
          <div className="demo-card" onClick={() => { setEmail("recruiter@nexushire.com"); setPassword("recruiter123"); }}>
            👔 <strong>Recruiter</strong> - Full Access
            <small style={{ display: 'block', color: '#6b7280', fontSize: '12px' }}>recruiter@nexushire.com</small>
          </div>
        </div>
        
        <div className="auth-divider">OR</div>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        
        {error && <div className="error-msg">{error}</div>}
        
        <button className="login-btn" onClick={handleLogin}>Login</button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
