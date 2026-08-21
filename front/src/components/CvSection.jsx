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
      // Fetch the file and create a local Blob URL to force application/pdf MIME type
      // This prevents the browser from forcing a download due to missing .pdf extensions from the backend
      fetch(secureUrl)
        .then(res => res.blob())
        .then(blob => {
          const fileBlob = new Blob([blob], { type: 'application/pdf' });
          setBlobUrl(URL.createObjectURL(fileBlob));
        })
        .catch(err => {
          console.error("Error creating Blob URL for CV", err);
          setBlobUrl(secureUrl); // fallback
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

          {/* Download bar removed as requested */}

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
              isMobile ? (
                <div 
                  onClick={() => setCvFullscreen(true)}
                  style={{
                    width: "100%",
                    padding: "60px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1e2029 0%, #0b0c10 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    textAlign: "center",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: "60px", marginBottom: "16px" }}>📄</span>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>PDF Document</h3>
                  <p style={{ color: "var(--text-sub)", marginBottom: "24px", fontSize: "14px" }}>
                    Tap here to open and read the full CV.
                  </p>
                  <div className="btn-primary" style={{ padding: "10px 24px", pointerEvents: "none", fontSize: "14px" }}>
                    {blobUrl ? "Open Full CV" : "Loading PDF..."}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setCvFullscreen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(secureUrl)}&embedded=true`}
                    style={{
                      width: "100%",
                      height: "90vh",
                      border: "none",
                      display: "block",
                      background: "#fff",
                      pointerEvents: "none"
                    }}
                    title="CV PDF Inline"
                  />
                </div>
              )
            ) : isImage ? (
              <img
                src={secureUrl}
                alt={cv.fileName}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none"
                }}
                onClick={() => setCvFullscreen(true)}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-sub)" }} onClick={() => setCvFullscreen(true)}>
                <p style={{ marginBottom: "16px" }}>Preview not available for this file type.</p>
                <button className="btn-primary">
                  View CV
                </button>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen CV Modal */}
      {cvFullscreen && cv && (
        <div
          onClick={() => setCvFullscreen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', animation: 'cvFadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', width: '100%', maxWidth: '950px',
              height: '85vh',
              background: 'rgba(13,17,23,0.98)', borderRadius: '20px',
              border: '1px solid rgba(97,218,255,0.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              animation: 'cvSlideUp 0.25s ease'
            }}
          >
            {/* Close */}
            <button
              onClick={() => setCvFullscreen(false)}
              style={{
                position: 'absolute', top: '14px', right: '14px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '36px', height: '36px',
                cursor: 'pointer', color: '#fff', fontSize: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            {/* Content area */}
            <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
              {isPdf ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(secureUrl)}&embedded=true`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="CV PDF"
                />
              ) : isImage ? (
                <img
                  src={secureUrl}
                  alt={cv.fileName}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0b0c10' }}
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#000' }}>Cannot display this file type.</div>
              )}
            </div>

            {/* Info bar at bottom */}
            <div style={{
              padding: '18px 24px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
              background: 'rgba(13,17,23,0.98)'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0', color: '#fff' }}>
                  {cv.fileName || "Curriculum Vitae"}
                </h3>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes cvFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes cvSlideUp {
              from { opacity: 0; transform: translateY(30px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}

    </section>
  );
}
