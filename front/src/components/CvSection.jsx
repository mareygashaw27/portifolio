import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CvSection() {
  const { API_BASE_URL } = useAuth();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvFullscreen, setCvFullscreen] = useState(false);

  const API_URL = `${API_BASE_URL}/api/cv`;

  const fetchCv = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CV");
        return res.json();
      })
      .then((data) => {
        if (data && data.fileUrl) {
          setCv(data);
          try { localStorage.setItem('portfolio_local_cv', JSON.stringify(data)); } catch (e) {}
        } else {
          const local = localStorage.getItem('portfolio_local_cv');
          setCv(local ? JSON.parse(local) : null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching CV from backend, using local fallback:", err);
        const local = localStorage.getItem('portfolio_local_cv');
        setCv(local ? JSON.parse(local) : null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCv();
    const handleCvUpdated = () => fetchCv();
    window.addEventListener('cvUpdated', handleCvUpdated);
    return () => window.removeEventListener('cvUpdated', handleCvUpdated);
  }, []);


  const handleCvDownload = () => {
    if (!cv || !cv.fileUrl) {
      alert("No CV is currently available for download.");
      return;
    }

    const link = document.createElement("a");
    link.href = cv.fileUrl;
    link.download = cv.fileName || "Marey_Gashaw_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const isPdf = cv && (
    cv.fileType?.includes('pdf') ||
    cv.fileUrl?.startsWith('data:application/pdf') ||
    cv.fileName?.toLowerCase().endsWith('.pdf') ||
    cv.fileUrl?.toLowerCase().includes('.pdf') ||
    (cv.fileUrl && !cv.fileUrl?.startsWith('data:image'))
  );
  const isImage = cv && (cv.fileType?.startsWith('image') || cv.fileUrl?.startsWith('data:image'));

  return (
    <section id="cv" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        <span className="gradient-text">Curriculum Vitae (CV)</span>
      </h2>
      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-sub)" }}>
          <p>⏳ Loading CV document...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !cv && (
        <div className="glass-card" style={{
          padding: "60px 24px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>📁</div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>No CV Uploaded Yet</h3>
          <p style={{ color: "var(--text-sub)", fontSize: "14px", margin: 0 }}>
            ✨ The uploaded CV document will be displayed here once available.
          </p>
        </div>
      )}

      {/* Uploaded CV View */}
      {!loading && cv && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Download bar — above the CV viewer */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px"
          }}>
            <button
              className="btn-primary"
              onClick={handleCvDownload}
              style={{
                fontSize: "13.5px",
                padding: "9px 22px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              📥 Download CV
            </button>
          </div>

          {/* CV Viewer */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "rgba(11, 16, 30, 0.7)",
              position: "relative"
            }}
          >
            {isPdf ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(cv.fileUrl)}&embedded=true`}
                style={{
                  width: "100%",
                  height: "80vh",
                  minHeight: "500px",
                  border: "none",
                  display: "block",
                  background: "#fff"
                }}
                title="CV PDF Viewer"
              />
            ) : isImage ? (
              <img
                src={cv.fileUrl}
                alt={cv.fileName}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none"
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-sub)" }}>
                <p style={{ marginBottom: "16px" }}>Preview not available for this file type.</p>
                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleCvDownload(); }}>
                  Download CV
                </button>
              </div>
            )}
          </div>

          </div>
        </div>
      )}

    </section>
  );
}
