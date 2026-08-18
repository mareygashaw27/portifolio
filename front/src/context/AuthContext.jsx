import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-4t3v.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("portfolio_admin_token");
      const savedUser = localStorage.getItem("portfolio_admin_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Error loading auth state:", e);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    const trimmedUser = (username || '').trim();
    const trimmedPass = (password || '').trim();

    try {
      // 1. Try Backend Auth API
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUser, password: trimmedPass })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("portfolio_admin_token", data.token);
          localStorage.setItem("portfolio_admin_user", JSON.stringify(data.user));
          return { success: true, message: data.message || "Login successful!" };
        }
      }
    } catch (apiErr) {
      console.warn("Backend auth failed or unreachable, checking credentials directly...", apiErr);
    }

    // 2. Client fallback matching for credentials 'mar' / '4225'
    if (trimmedUser === "mar" && trimmedPass === "4225") {
      // Create local session token
      const fallbackToken = "local_admin_" + btoa(JSON.stringify({ username: "mar", timestamp: Date.now() }));
      const adminUser = { username: "mar", role: "admin" };
      setToken(fallbackToken);
      setUser(adminUser);
      localStorage.setItem("portfolio_admin_token", fallbackToken);
      localStorage.setItem("portfolio_admin_user", JSON.stringify(adminUser));
      return { success: true, message: "Login successful!" };
    }

    return { 
      success: false, 
      message: "Invalid username or password! Please try again." 
    };
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
  };

  // Helper to get auth header
  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      "Authorization": `Bearer ${token}`
    };
  };

  const isAdmin = !!user && user.username === "mar";

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin,
      isAuthChecking,
      login,
      logout,
      getAuthHeaders,
      API_BASE_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
