import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

let rawApiUrl = import.meta.env.VITE_API_URL;
if (!rawApiUrl) {
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    rawApiUrl = ""; // Use relative /api endpoint on Vercel deployment
  } else {
    rawApiUrl = "https://portfolio-backend-4t3v.onrender.com";
  }
}
if (typeof window !== "undefined" && window.location.protocol === "https:" && rawApiUrl.startsWith("http://")) {
  rawApiUrl = rawApiUrl.replace("http://", "https://");
}
const API_BASE_URL = rawApiUrl;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLocalToken, setIsLocalToken] = useState(false); // true when backend is unreachable
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("portfolio_admin_token");
      const savedUser = localStorage.getItem("portfolio_admin_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Detect if this is a local fallback token
        if (savedToken.startsWith("local_admin_")) {
          setIsLocalToken(true);
        }
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
          setIsLocalToken(false); // Real JWT from backend
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
      // Create local session token (offline mode — uploads won't persist to cloud)
      const fallbackToken = "local_admin_" + btoa(JSON.stringify({ username: "mar", timestamp: Date.now() }));
      const adminUser = { username: "mar", role: "admin" };
      setToken(fallbackToken);
      setUser(adminUser);
      setIsLocalToken(true); // Flag: backend unreachable
      localStorage.setItem("portfolio_admin_token", fallbackToken);
      localStorage.setItem("portfolio_admin_user", JSON.stringify(adminUser));
      return { 
        success: true, 
        message: "Login successful! ⚠️ Backend server is starting up — uploads will retry automatically.",
        isOffline: true
      };
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
    setIsLocalToken(false);
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
  };

  // Helper to get auth header
  // Returns empty object when using local fallback token (backend would reject it)
  const getAuthHeaders = () => {
    if (!token) return {};
    if (isLocalToken) return {}; // Don't send fake token to backend
    return {
      "Authorization": `Bearer ${token}`
    };
  };

  // Re-authenticate with real backend (call when backend may have woken up)
  const refreshAuth = async () => {
    if (!isLocalToken) return true; // Already using real token
    try {
      const savedUser = localStorage.getItem("portfolio_admin_user");
      if (!savedUser) return false;
      const { username } = JSON.parse(savedUser);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: "4225" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          setToken(data.token);
          setIsLocalToken(false);
          localStorage.setItem("portfolio_admin_token", data.token);
          return true;
        }
      }
    } catch (e) { /* still offline */ }
    return false;
  };

  const isAdmin = !!user && user.username === "mar";

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin,
      isAuthChecking,
      isLocalToken,
      login,
      logout,
      getAuthHeaders,
      refreshAuth,
      API_BASE_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
