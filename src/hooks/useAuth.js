import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("nexushire_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        sessionStorage.removeItem("nexushire_user");
      }
    }
  }, []);

  const login = (email, password) => {
    // Accept any email/password for demo
    const userData = { 
      name: "Sarah Johnson", 
      email: email,
      role: "Recruiter"
    };
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem("nexushire_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("nexushire_user");
    sessionStorage.removeItem("resumeAnalyses");
  };

  return { user, isAuthenticated, login, logout };
};
