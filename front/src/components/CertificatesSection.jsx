import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CertificatesSection() {
  const { API_BASE_URL } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${API_BASE_URL}/api/certificates`;

  // Fetch certificates from MongoDB
  const fetchCertificates = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCertificates(data);
          try { localStorage.setItem('portfolio_local_certificates', JSON.stringify(data)); } catch (e) {}
        } else {
          const local = localStorage.getItem('portfolio_local_certificates');
          setCertificates(local ? JSON.parse(local) : (Array.isArray(data) ? data : []));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching certificates, using local fallback:", err);
        const local = localStorage.getItem('portfolio_local_certificates');
        setCertificates(local ? JSON.parse(local) : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Open certificate in a new full page/tab
  const openCertificatePage = (cert) => {
    if (!cert.imageUrl) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cert.title} — Certificate</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #070b14; min-height: 100vh; display: flex; flex-direction: column; align-items: center; font-family: -apple-system, sans-serif; color: #f3f4f6; }
    .header { width: 100%; padding: 16px 20px; background: rgba(6,19,37,0.97); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 12px; position: sticky; top: 0; z-index: 100; flex-wrap: wrap; }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
    .title-wrap h2 { font-size: 16px; font-weight: 700; color: #fff; }
    .title-wrap p { font-size: 13px; color: #ff6b35; font-weight: 600; margin-top: 2px; }
    .badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 20px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35); font-size: 13px; font-weight: 600; color: #10b981; }
    .cert-container { flex: 1; width: 100%; display: flex; align-items: flex-start; justify-content: center; padding: 28px 16px; }
    .cert-frame { max-width: 860px; width: 100%; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.6); }
    .cert-frame img { width: 100%; display: block; object-fit: contain; }
    .dl-btn { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg,#ff6b35,#ff8c55); border: none; color: #fff; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <button class="back-btn" onclick="window.close()">← Close</button>
    <div class="title-wrap"><h2>${cert.title}</h2><p>${cert.issuer}</p></div>
    <div style="display:flex;align-items:center;gap:10px;">
      <a class="dl-btn" href="${cert.imageUrl}" download="${cert.title}.jpg">⬇ Download</a>
      <span class="badge">✓ Verified</span>
    </div>
  </div>
  <div class="cert-container">
    <div class="cert-frame"><img src="${cert.imageUrl}" alt="${cert.title}" /></div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

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
              onClick={() => openCertificatePage(cert)}
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
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center" }} className="cert-img-overlay">
                      <span className="cert-view-label" style={{ background: "rgba(255,107,53,0.9)", color: "#fff", fontSize: "12px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px", opacity: 0, transition: "opacity 0.2s" }}>🔍 View Full</span>
                    </div>
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
                {cert.imageUrl && (
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#6e829f", display: "flex", alignItems: "center", gap: "4px" }}>
                    🔗 Tap to view full certificate
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}



      <style>{`
        .cert-card:hover .cert-img-overlay {
          background: rgba(0,0,0,0.45) !important;
        }
        .cert-card:hover .cert-view-label {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
