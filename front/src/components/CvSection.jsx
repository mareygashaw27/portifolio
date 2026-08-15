import React, { useState, useEffect } from 'react';

export default function CvSection() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-4t3v.onrender.com";
  const API_URL = `${API_BASE_URL}/api/cv`;

  // Fetch the latest CV on mount
  const fetchCv = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CV");
        return res.json();
      })
      .then((data) => {
        setCv(data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CV:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCv();
  }, []);

  // Handle CV upload
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert("የፋይሉ መጠን ከ 8MB በታች መሆን አለበት!");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;

      // Send to backend
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: base64Data,
          fileType: file.type
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        })
        .then((data) => {
          setCv(data);
          setUploading(false);
          alert("CV በተሳካ ሁኔታ ተጭኗል! / CV uploaded successfully!");
        })
        .catch((err) => {
          console.error("Error uploading CV:", err);
          setUploading(false);
          alert("CV መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።");
        });
    };
    reader.readAsDataURL(file);
  };

  // Handle CV download
  const handleCvDownload = () => {
    if (!cv || !cv.fileUrl) {
      alert("እባክዎን መጀመሪያ CV ይጫኑ! / Please upload a CV first!");
      return;
    }

    // Trigger download of base64 content
    const link = document.createElement("a");
    link.href = cv.fileUrl;
    link.download = cv.fileName || "Marey_Gashaw_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CV deletion
  const handleCvDelete = () => {
    if (!cv || !cv._id) return;
    if (!window.confirm("እርግጠኛ ነዎት CV ማጥፋት ይፈልጋሉ?")) return;

    setLoading(true);
    fetch(`${API_URL}/${cv._id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete CV");
        return res.json();
      })
      .then(() => {
        setCv(null);
        setLoading(false);
        alert("CV በተሳካ ሁኔታ ጠፍቷል።");
      })
      .catch((err) => {
        console.error("Error deleting CV:", err);
        setLoading(false);
        alert("CV ማጥፋት አልተቻለም።");
      });
  };

  const skillCategories = [
    {
      label: "Frontend",
      skills: ["HTML", "CSS", "JavaScript", "React.js"],
      color: "#61dafb"
    },
    {
      label: "Backend",
      skills: ["Node.js", "Express.js"],
      color: "#a855f7"
    },
    {
      label: "Database",
      skills: ["MySQL", "MongoDB"],
      color: "#10b981"
    }
  ];

  return (
    <section id="cv" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        📄 <span className="gradient-text">Curriculum Vitae</span>
      </h2>

      {/* CV Header Card */}
      <div className="glass-card" style={{
        padding: "clamp(16px, 4vw, 32px)",
        marginBottom: "24px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-30px",
          left: "-30px",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(97, 218, 255, 0.12) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none"
        }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px"
          }}>
            <div>
              <h3 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px" }}>
                <span className="gradient-text">Marey Gashaw</span>
              </h3>
              <p style={{ color: "var(--primary)", fontSize: "16px", fontWeight: "600" }}>
                Full-Stack Web Developer
              </p>
              <p style={{ color: "var(--text-sub)", fontSize: "14px", marginTop: "4px" }}>
                Information Technology Student
              </p>

              {/* Status & Filename info */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: cv ? "#10b981" : "#ef4444",
                  display: "inline-block"
                }}></span>
                <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>
                  {loading ? "Checking CV..." : cv ? `የተጫነው CV: ${cv.fileName}` : "CV አልተጫነም (No CV uploaded)"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              {/* Hidden file input */}
              <input
                type="file"
                id="cv-file-input"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleCvUpload}
                style={{ display: "none" }}
              />

              {/* Upload Trigger Button */}
              <label
                htmlFor="cv-file-input"
                className="btn-secondary"
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px"
                }}
              >
                {uploading ? "⏳ Uploading..." : "📤 Upload CV (PDF/Image)"}
              </label>

              {/* Download CV Button */}
              <button
                className="btn-primary"
                onClick={handleCvDownload}
                disabled={!cv}
                style={{
                  opacity: cv ? 1 : 0.6,
                  cursor: cv ? "pointer" : "not-allowed"
                }}
              >
                📥 Download CV
              </button>

              {/* Delete CV Button */}
              {cv && (
                <button
                  onClick={handleCvDelete}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: "10px",
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                  title="Delete CV"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px"
      }}>
        {/* Left: Info */}
        <div>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "rgba(97, 218, 255, 0.1)",
              border: "1px solid rgba(97, 218, 255, 0.3)",
              fontSize: "14px"
            }}>🎓</span>
            Education & Background
          </h3>

          <div className="glass-card" style={{
            padding: "24px",
            borderLeft: "3px solid var(--primary)"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
              BSc in Information Technology
            </h4>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px"
            }}>
              <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>
                University Student
              </span>
              <span style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "var(--text-sub)", display: "inline-block"
              }}></span>
              <span style={{ fontSize: "13px", color: "var(--text-sub)" }}>
                Currently Studying
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              Focusing on software engineering, database management, and building user-centric responsive web applications.
            </p>
          </div>
        </div>

        {/* Right: Skills Breakdown */}
        <div>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              fontSize: "14px"
            }}>🛠️</span>
            Skills Breakdown
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {skillCategories.map((cat, index) => (
              <div key={index} className="glass-card" style={{
                padding: "20px",
                borderLeft: `3px solid ${cat.color}`
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: cat.color,
                  marginBottom: "10px",
                  display: "block"
                }}>
                  {cat.label}
                </span>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      background: `${cat.color}12`,
                      border: `1px solid ${cat.color}30`,
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: "500"
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
