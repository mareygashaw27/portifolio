import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CertificatesSection() {
  const { API_BASE_URL } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  const API_URL = `${API_BASE_URL}/api/certificates`;

  // Fetch certificates from MongoDB
  const fetchCertificates = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCertificates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
        setCertificates([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section id="certificates" style={{ marginBottom: "80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          <span className="gradient-text">Certificates & Achievements</span>
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-sub)" }}>
          Loading certificates...
        </div>
      )}

      {/* Empty State */}
      {!loading && certificates.length === 0 && (
        <div className="glass-card" style={{
          padding: "48px 24px",
          textAlign: "center"
        }}>
          <p style={{ color: "var(--text-sub)", fontSize: "16px" }}>
            No certificates published yet
          </p>
        </div>
      )}

      {/* Certificate Cards Grid */}
      {!loading && certificates.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="glass-card cert-card"
              onClick={() => cert.imageUrl && setSelectedCert(cert)}
              style={{
                padding: "clamp(16px, 4vw, 28px)",
                position: "relative",
                overflow: "hidden",
                cursor: cert.imageUrl ? "pointer" : "default",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (cert.imageUrl) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(168, 85, 247, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* Accent corner glow */}
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
                pointerEvents: "none"
              }}></div>

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Certificate image */}
                {cert.imageUrl && (
                  <div style={{
                    marginBottom: "16px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                    position: "relative"
                  }}>
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />

                  </div>
                )}

                {/* Title and details */}
                <div style={{ marginBottom: "12px" }}>
                  <h3 style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    lineHeight: "1.3",
                    color: "var(--text-main)"
                  }}>
                    {cert.title}
                  </h3>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "6px"
                  }}>
                    <span style={{
                      fontSize: "13px",
                      color: "var(--primary)",
                      fontWeight: "600"
                    }}>
                      {cert.issuer}
                    </span>
                  </div>
                </div>

                {/* Verified badge */}
                <div style={{
                  marginTop: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#10b981"
                }}>
                  Verified Certificate
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== LIGHTBOX MODAL ===== */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "certFadeIn 0.2s ease"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "900px",
              width: "100%",
              background: "rgba(15, 20, 40, 0.97)",
              borderRadius: "20px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              overflow: "hidden",
              animation: "certSlideUp 0.25s ease"
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                zIndex: 10,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                color: "#fff",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
            >
              ✕
            </button>

            {/* Certificate Image - Full size */}
            <div style={{ background: "#fff", lineHeight: 0 }}>
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </div>

            {/* Info bar */}
            <div style={{
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 4px" }}>
                  {selectedCert.title}
                </h3>
                <span style={{ fontSize: "14px", color: "var(--primary)", fontWeight: "600" }}>
                  {selectedCert.issuer}
                </span>
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#10b981"
              }}>
                ✓ Verified Certificate
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes certFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes certSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cert-card:hover .cert-img-overlay {
          background: rgba(0,0,0,0.45) !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
