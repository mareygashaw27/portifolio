import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CvSection() {
  const { API_BASE_URL } = useAuth();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  const [blobUrl, setBlobUrl] = useState(null);
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
    
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    const handleKey = (e) => {
      if (e.key === 'Escape') setCvFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    
    return () => {
      window.removeEventListener('cvUpdated', handleCvUpdated);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);


  const secureUrl = cv && cv.fileUrl
    ? (cv.fileUrl.startsWith('http://') ? cv.fileUrl.replace('http://', 'https://') : cv.fileUrl)
    : null;

  const inlineUrl = cv && secureUrl
    ? (secureUrl.includes('cloudinary.com')
        ? (secureUrl.includes('/raw/upload/')
            ? secureUrl.replace('/raw/upload/', '/image/upload/fl_inline/')
            : (!secureUrl.includes('/fl_inline/')
                ? secureUrl.replace('/image/upload/', '/image/upload/fl_inline/')
                : secureUrl))
        : secureUrl)
    : null;

  const isPdf = cv && (
    cv.fileType?.includes('pdf') ||
    secureUrl?.startsWith('data:application/pdf') ||
    cv.fileName?.toLowerCase().endsWith('.pdf') ||
    secureUrl?.toLowerCase().includes('.pdf') ||
    (secureUrl && !secureUrl?.startsWith('data:image'))
  );
  
  useEffect(() => {
    if (cv && secureUrl && isPdf) {
      if (secureUrl.startsWith('blob:')) {
        setBlobUrl(secureUrl);
        return;
      }
      fetch(secureUrl)
        .then(res => res.blob())
        .then(blob => {
          const fileBlob = new Blob([blob], { type: 'application/pdf' });
          setBlobUrl(URL.createObjectURL(fileBlob));
        })
        .catch(err => {
          console.error("Error creating Blob URL for CV", err);
          setBlobUrl(secureUrl);
        });
    } else {
      setBlobUrl(null);
    }
  }, [cv, isPdf, secureUrl]);

  const isImage = cv && (cv.fileType?.startsWith('image') || secureUrl?.startsWith('data:image'));

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

          {/* CV Viewer */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "#161b22",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}
          >
            {/* Header Bar */}
            <div style={{
              padding: "12px 20px",
              background: "rgba(13, 17, 23, 0.95)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                📄 {cv?.fileName || "Curriculum Vitae"}
              </span>
              <a
                href={secureUrl?.startsWith('data:') ? secureUrl : `${API_URL}/file`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#61dafb",
                  fontSize: "12px",
                  textDecoration: "none",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  background: "rgba(97, 218, 255, 0.1)",
                  border: "1px solid rgba(97, 218, 255, 0.2)"
                }}
              >
                ↗ Fullscreen
              </a>
            </div>

            {isPdf ? (
              <iframe
                src={secureUrl?.startsWith('data:') ? secureUrl : `${API_URL}/file`}
                style={{
                  width: "100%",
                  height: "85vh",
                  border: "none",
                  display: "block",
                  background: "#161b22"
                }}
                title="Curriculum Vitae PDF"
              />
            ) : isImage ? (
              <img
                src={secureUrl}
                alt={cv.fileName || "CV Image"}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "16px"
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-sub)" }}>
                <p style={{ fontSize: "16px" }}>📄 CV Document</p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
