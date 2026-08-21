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
                  <object
                    data={blobUrl || secureUrl}
                    type="application/pdf"
                    style={{
                      width: "100%",
                      height: "90vh",
                      border: "none",
                      display: "block",
                      background: "#fff",
                      pointerEvents: "none"
                    }}
                  >
                    <p style={{ textAlign: "center", padding: "40px", color: "#555" }}>
                      PDF preview not available in this browser.
                      <br/>
                      <span style={{ color: "#0070f3", textDecoration: "underline" }}>Click to open PDF</span>
                    </p>
                  </object>
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
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(11, 12, 16, 0.98)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* Close button */}
          <button 
            onClick={() => setCvFullscreen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100000,
              transition: "background 0.3s"
            }}
          >
            ✕
          </button>
          
          <div style={{ width: "90%", height: "80%", background: "#fff", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
            {isPdf ? (
              <iframe
                src={blobUrl || secureUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="CV PDF"
              />
            ) : isImage ? (
              <img
                src={secureUrl}
                alt={cv.fileName}
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#0b0c10" }}
              />
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "#000" }}>Cannot display this file type.</div>
            )}
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button 
              onClick={() => window.open(blobUrl || secureUrl, '_blank')}
              className="btn-secondary"
              style={{ fontSize: "14px", padding: "8px 16px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: "8px", cursor: "pointer" }}
            >
              ↗ Open in New Tab
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
