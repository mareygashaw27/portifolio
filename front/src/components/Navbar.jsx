import React, { useState } from 'react';

export default function Navbar({ onOpenModal, activeSection, setActiveSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Me" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certificates", label: "Certificates" },
    { id: "cv", label: "CV" }
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
          src="/mar.jpg"
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
            if (e.target.src.endsWith('/mar.jpg')) {
              e.target.src = "/mar.png";
            } else if (e.target.src.endsWith('/mar.png')) {
              e.target.src = "/mar.svg";
            }
          }}
        />
        <span style={{ fontSize: "20px", fontWeight: "700" }} className="gradient-text">
          Marey Gashaw
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
        <button
          className="btn-primary"
          onClick={onOpenModal}
          style={{ marginLeft: "8px", fontSize: "14px", padding: "8px 18px" }}
        >
          ➕ ፕሮጀክት ጨምር
        </button>
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
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: "69px",
          left: 0,
          right: 0,
          background: "rgba(11, 12, 16, 0.95)",
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
          <button
            className="btn-primary"
            onClick={() => {
              setMobileOpen(false);
              onOpenModal();
            }}
            style={{ marginTop: "8px", fontSize: "14px" }}
          >
            ➕ ፕሮጀክት ጨምር
          </button>
        </div>
      )}
    </nav>
  );
}
