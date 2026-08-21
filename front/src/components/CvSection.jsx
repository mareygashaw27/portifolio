import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CvSection() {
  const { API_BASE_URL } = useAuth();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return () => {
      window.removeEventListener('cvUpdated', handleCvUpdated);
    };
  }, []);

  const secureUrl = cv && cv.fileUrl
    ? (cv.fileUrl.startsWith('http://') ? cv.fileUrl.replace('http://', 'https://') : cv.fileUrl)
    : null;

  // Cloudinary image transformation for PDF page 1 preview
  const previewImageUrl = cv && secureUrl
    ? (secureUrl.includes('cloudinary.com')
        ? secureUrl
            .replace('/raw/upload/', '/image/upload/fl_inline,f_jpg,pg_1,w_1000/')
            .replace('/image/upload/', '/image/upload/fl_inline,f_jpg,pg_1,w_1000/')
            .replace(/\.pdf$/i, '.jpg')
        : (secureUrl.startsWith('data:image') ? secureUrl : null))
    : null;

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    if (secureUrl && secureUrl.startsWith('data:')) {
      try {
        const parts = secureUrl.split(';base64,');
        const contentType = parts[0].replace('data:', '') || 'application/pdf';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (e) {
        setPdfBlobUrl(secureUrl);
      }
    } else {
      setPdfBlobUrl(secureUrl);
    }
  }, [secureUrl]);

  const openCvFile = () => {
    if (!pdfBlobUrl && !secureUrl) return;
    window.open(pdfBlobUrl || secureUrl, '_blank');
  };

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
            ✨ Upload your CV from the admin panel to display it here.
          </p>
        </div>
      )}

      {/* Uploaded CV Card displaying PDF Directly */}
      {!loading && cv && (
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <div
            className="glass-card"
            style={{
              padding: "20px",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              background: "#0d1117",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
            }}
          >
            {/* Header info */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0", color: "#fff" }}>
                  📄 {cv.fileName || "Marey cv.pdf"}
                </h3>
              </div>

              <button
                onClick={openCvFile}
                className="btn-primary"
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                ↗ Open Full Screen
              </button>
            </div>

            {/* Direct Document Display Box */}
            <div style={{
              width: "100%",
              height: "75vh",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#161b22",
              border: "1px solid var(--border-color)",
              position: "relative"
            }}>
              {previewImageUrl ? (
                <img
                  src={previewImageUrl}
                  alt={cv.fileName || "Uploaded CV"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block"
                  }}
                />
              ) : (
                <iframe
                  src={pdfBlobUrl || secureUrl || `${API_BASE_URL}/api/cv/file`}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                    background: "#161b22"
                  }}
                  title={cv.fileName || "Curriculum Vitae"}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
