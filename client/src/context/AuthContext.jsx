import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token on mount
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        // Parse JWT to get user info (optional - get from /api/auth/me)
        try {
          const payload = JSON.parse(atob(savedToken.split(".")[1]));
          setUser(payload);
        } catch (e) {
          console.error("Invalid token");
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
