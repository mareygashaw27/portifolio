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

  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' by default so uploaded PDF is shown directly

  return (
    <section id="cv" style={{ marginBottom: "80px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
          <span className="gradient-text">Curriculum Vitae (CV)</span>
        </h2>

        {/* Action Controls & Tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* View Toggle */}
          <div style={{
            display: "inline-flex",
            padding: "4px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-color)"
          }}>
            <button
              onClick={() => setActiveTab('card')}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === 'card' ? "var(--primary-gradient)" : "transparent",
                color: activeTab === 'card' ? "#000" : "var(--text-sub)",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              📄 CV Overview
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === 'pdf' ? "var(--primary-gradient)" : "transparent",
                color: activeTab === 'pdf' ? "#000" : "var(--text-sub)",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              👁️ PDF Viewer
            </button>
          </div>

          {/* Download Button */}
          {secureUrl && (
            <a
              href={secureUrl}
              download={cv?.fileName || "Marey_Gashaw_CV.pdf"}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: "var(--primary-gradient, linear-gradient(135deg, #61dafb 0%, #a855f7 100%))",
                color: "#000",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 15px rgba(97, 218, 255, 0.3)"
              }}
            >
              📥 Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-sub)" }}>
          <p>⏳ Loading CV document...</p>
        </div>
      )}

      {/* Main CV Content Display */}
      {!loading && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* TAB 1: Responsive Interactive CV Card (100% mobile & PC compatible) */}
          {activeTab === 'card' && (
            <div className="glass-card" style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)",
              background: "#0d1117",
              color: "#fff"
            }}>
              {/* Header Bar */}
              <div style={{
                background: "linear-gradient(135deg, #0b2545 0%, #134074 100%)",
                padding: "24px 30px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                borderBottom: "3px solid #61dafb"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                  <img
                    src="/mar.jpg"
                    alt="Marey Gashaw"
                    style={{
                      width: "85px",
                      height: "85px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #61dafb",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
                    }}
                    onError={(e) => { e.target.src = "/mar.png"; }}
                  />
                  <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 6px 0", color: "#ffffff", letterSpacing: "0.5px" }}>
                      Marey Gashaw
                    </h1>
                    <p style={{ fontSize: "15px", color: "#61dafb", margin: 0, fontWeight: "600" }}>
                      Information Technology Student & Full-Stack Developer
                    </p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.9)"
                }}>
                  <div>📞 +251 943 454 397</div>
                  <div>📧 mareygashaw21@gmail.com</div>
                  <div>📍 Kombolcha, Ethiopia</div>
                </div>
              </div>

              {/* Body Content */}
              <div style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* Education Section */}
                <div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderBottom: "2px solid rgba(97, 218, 255, 0.2)",
                    paddingBottom: "8px",
                    marginBottom: "16px"
                  }}>
                    <span style={{ fontSize: "20px" }}>🎓</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#61dafb" }}>
                      Education
                    </h3>
                  </div>

                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "20px"
                  }}>
                    <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#fff", margin: "0 0 6px 0" }}>
                      Bachelor of Science in Information Technology
                    </h4>
                    <p style={{ fontSize: "15px", color: "var(--text-sub)", margin: "0 0 10px 0", fontWeight: "500" }}>
                      Wollo University, Ethiopia
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        background: "rgba(97, 218, 255, 0.15)",
                        color: "#61dafb",
                        fontSize: "13px",
                        fontWeight: "600"
                      }}>
                        3rd Year Student
                      </span>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        fontSize: "13px",
                        fontWeight: "600"
                      }}>
                        Current CGPA: 3.37
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderBottom: "2px solid rgba(97, 218, 255, 0.2)",
                    paddingBottom: "8px",
                    marginBottom: "16px"
                  }}>
                    <span style={{ fontSize: "20px" }}>📝</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#61dafb" }}>
                      Summary
                    </h3>
                  </div>
                  <p style={{
                    fontSize: "15px",
                    lineHeight: "1.8",
                    color: "var(--text-sub)",
                    margin: 0
                  }}>
                    Passionate Information Technology student with hands-on experience in Full-Stack Web Development, building modern web applications using HTML, CSS, JavaScript, React.js, Node.js, Express.js, PHP, Laravel, and MySQL. Problem solver focused on creating scalable digital solutions.
                  </p>
                </div>

                {/* Technical Skills */}
                <div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderBottom: "2px solid rgba(97, 218, 255, 0.2)",
                    paddingBottom: "8px",
                    marginBottom: "16px"
                  }}>
                    <span style={{ fontSize: "20px" }}>💻</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#61dafb" }}>
                      Key Skills & Technologies
                    </h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["React.js", "Node.js", "Express.js", "JavaScript", "HTML/CSS", "PHP", "Laravel", "MySQL", "Java", "Git", "REST APIs", "Video Editing"].map((skill, i) => (
                      <span key={i} style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--border-color)",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "500"
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Direct PDF Viewer / Embedded PDF View */}
          {activeTab === 'pdf' && (
            <div style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "#161b22",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}>
              {/* PDF Header Bar */}
              <div style={{
                padding: "12px 20px",
                background: "rgba(13, 17, 23, 0.95)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                  📄 {cv?.fileName || "Marey cv.pdf"}
                </span>

                {secureUrl && (
                  <a
                    href={isPdf ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(secureUrl)}` : secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: "rgba(97, 218, 255, 0.15)",
                      border: "1px solid var(--border-accent)",
                      color: "var(--primary)",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none"
                    }}
                  >
                    ↗️ Open PDF in New Tab
                  </a>
                )}
              </div>

              {isPdf ? (
                <div style={{ width: "100%", background: "#161b22", minHeight: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* High-res Cloudinary Rendered PDF Image (100% reliable on all devices & browsers) */}
                  {secureUrl?.includes('cloudinary.com') ? (
                    <div style={{ width: "100%", overflowX: "auto", padding: "16px", display: "flex", justifyContent: "center" }}>
                      <img
                        src={secureUrl
                          .replace('/raw/upload/', '/image/upload/fl_inline,f_jpg,pg_1,w_1200/')
                          .replace('/image/upload/', '/image/upload/fl_inline,f_jpg,pg_1,w_1200/')
                          .replace(/\.pdf$/i, '.jpg')
                        }
                        alt="Uploaded CV Document"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          display: "block"
                        }}
                        onError={(e) => {
                          // Fallback to Mozilla PDF.js viewer if Cloudinary image transform fails
                          e.target.style.display = 'none';
                          const iframe = document.getElementById('cv-pdf-js-iframe');
                          if (iframe) iframe.style.display = 'block';
                        }}
                      />
                      <iframe
                        id="cv-pdf-js-iframe"
                        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(secureUrl)}`}
                        style={{
                          width: "100%",
                          height: "80vh",
                          border: "none",
                          display: "none",
                          background: "#161b22"
                        }}
                        title="CV PDF Viewer"
                      />
                    </div>
                  ) : (
                    <iframe
                      src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(blobUrl || secureUrl || `${API_BASE_URL}/api/cv/file`)}`}
                      style={{
                        width: "100%",
                        height: "80vh",
                        border: "none",
                        display: "block",
                        background: "#161b22"
                      }}
                      title="CV PDF Viewer"
                    />
                  )}
                </div>
              ) : isImage ? (
                <img
                  src={secureUrl}
                  alt={cv?.fileName || "CV Image"}
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "16px" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-sub)" }}>
                  <p style={{ fontSize: "16px" }}>📄 Standard PDF Document View</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </section>
  );
}
