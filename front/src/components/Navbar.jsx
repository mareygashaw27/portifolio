import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenModal, onOpenLogin, onOpenAdminPanel, activeSection, setActiveSection, profile = {} }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const displayName = profile.name || 'Marey Gashaw';
  const photoUrl = profile.photoUrl || '/mar.jpg';

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Me" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certificates", label: "Certificates" },
    { id: "cv", label: "CV" },
    { id: "videos", label: "🎬 Videos" }
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(11, 12, 16, 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-color)",
      padding: "14px clamp(16px, 4vw, 40px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {/* Logo */}
      <div 
        onClick={() => setActiveSection('home')}
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <img
          src={photoUrl}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid var(--primary)",
            objectFit: "cover",
            boxShadow: "0 0 10px rgba(97, 218, 255, 0.3)"
          }}
          onError={(e) => {
            if (!e.target.src.endsWith('/mar.png')) {
              e.target.src = "/mar.png";
            }
          }}
        />
        <span style={{ fontSize: "20px", fontWeight: "700" }} className="gradient-text">
          {displayName}
        </span>
      </div>

      {/* Desktop Nav Links */}
      <div className="nav-links-desktop" style={{
        display: "flex",
        gap: "8px",
        alignItems: "center"
      }}>
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              if (link.id === 'cv') {
                window.open(`${API_BASE_URL}/api/cv/file`, '_blank');
              }
              setActiveSection(link.id);
            }}
            className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
            style={{
              color: activeSection === link.id ? "var(--primary)" : "var(--text-sub)",
              background: activeSection === link.id ? "rgba(97, 218, 255, 0.12)" : "transparent",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
          >
            {link.label}
          </a>
        ))}

        {/* Admin Controls */}
        {isAdmin ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "10px" }}>
            <button
              onClick={onOpenAdminPanel}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#ff6b35",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(255, 107, 53, 0.4)",
                transition: "transform 0.2s ease"
              }}
            >
              Admin Dashboard
            </button>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="btn-secondary"
            style={{
              marginLeft: "8px",
              fontSize: "13px",
              padding: "7px 14px",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              background: "rgba(97, 218, 255, 0.06)",
              color: "var(--primary)"
            }}
          >
            Admin Login
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: "none",
          background: "none",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          color: "var(--text-main)",
          fontSize: "20px"
        }}
      >
        {mobileOpen ? "X" : "Menu"}
      </button>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: "69px",
          left: 0,
          right: 0,
          background: "rgba(11, 12, 16, 0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-color)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 99,
          animation: "fadeIn 0.3s ease"
        }}>
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                if (link.id === 'cv') {
                  window.open(`${API_BASE_URL}/api/cv/file`, '_blank');
                }
                setActiveSection(link.id);
              }}
              style={{
                color: activeSection === link.id ? "var(--primary)" : "var(--text-sub)",
                background: activeSection === link.id ? "rgba(97, 218, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                transition: "all 0.3s ease"
              }}
            >
              {link.label}
            </a>
          ))}

          {isAdmin ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAdminPanel();
                }}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#ff6b35",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                Open Admin Dashboard
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Logout (Admin)
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenLogin();
              }}
              className="btn-secondary"
              style={{
                marginTop: "8px",
                fontSize: "14px",
                justifyContent: "center",
                border: "1px solid rgba(97, 218, 255, 0.3)",
                color: "var(--primary)"
              }}
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

