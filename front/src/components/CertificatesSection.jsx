import React, { useState, useEffect } from 'react';

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    icon: '📜',
    imageUrl: ''
  });

  const API_URL = "http://localhost:5000/api/certificates";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("የፋይሉ መጠን ከ 5MB በታች መሆን አለበት!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer) {
      alert("እባክዎን Title እና Issuer ይሙሉ!");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((newCert) => {
        setCertificates([newCert, ...certificates]);
        setShowModal(false);
        setFormData({ title: '', issuer: '', date: '', description: '', icon: '📜', imageUrl: '' });
        setImagePreview('');
      })
      .catch((err) => console.error("Error adding certificate:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("እርግጠኛ ነዎት ይህን certificate ማጥፋት ይፈልጋሉ?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setCertificates(certificates.filter((c) => c._id !== id));
      })
      .catch((err) => console.error("Error deleting certificate:", err));
  };

  const iconOptions = ['📜', '🏆', '🎨', '⚙️', '🎓', '💻', '🌟', '🔥'];

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  };

  return (
    <section id="certificates" style={{ marginBottom: "80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center" }}>
          📜 <span className="gradient-text">Certificates & Achievements</span>
        </h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ fontSize: "14px", padding: "10px 20px" }}
        >
          ➕ Certificate ጨምር
        </button>
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
          <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📜</span>
          <p style={{ color: "var(--text-sub)", fontSize: "16px", marginBottom: "16px" }}>
            ገና certificate አልተጨመረም
          </p>
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{ fontSize: "14px" }}
          >
            ➕ የመጀመሪያውን Certificate ጨምር
          </button>
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
              style={{
                padding: "clamp(16px, 4vw, 28px)",
                position: "relative",
                overflow: "hidden"
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

              {/* Delete button */}
              <button
                onClick={() => handleDelete(cert._id)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  zIndex: 5,
                  transition: "all 0.2s ease"
                }}
                title="Delete certificate"
              >🗑️</button>

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Certificate image */}
                {cert.imageUrl && (
                  <div style={{
                    marginBottom: "16px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)"
                  }}>
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}

                {/* Icon and title row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <span style={{
                    fontSize: "32px",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    background: "rgba(97, 218, 255, 0.08)",
                    border: "1px solid var(--border-accent)",
                    flexShrink: 0
                  }}>
                    {cert.icon}
                  </span>
                  <div>
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
                      marginTop: "4px"
                    }}>
                      <span style={{
                        fontSize: "13px",
                        color: "var(--primary)",
                        fontWeight: "600"
                      }}>
                        {cert.issuer}
                      </span>
                      {cert.date && (
                        <>
                          <span style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "var(--text-sub)",
                            display: "inline-block"
                          }}></span>
                          <span style={{
                            fontSize: "13px",
                            color: "var(--text-sub)"
                          }}>
                            {cert.date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {cert.description && (
                  <p style={{
                    fontSize: "14px",
                    color: "var(--text-sub)",
                    lineHeight: "1.7"
                  }}>
                    {cert.description}
                  </p>
                )}

                {/* Verified badge */}
                <div style={{
                  marginTop: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#10b981"
                }}>
                  ✓ Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Certificate Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: "100%",
            maxWidth: "540px",
            padding: "30px",
            background: "#161821",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "22px", fontWeight: "700" }}>📜 አዲስ Certificate ጨምር</h3>
              <button
                onClick={() => { setShowModal(false); setImagePreview(''); }}
                style={{ background: "none", border: "none", color: "var(--text-sub)", fontSize: "20px", cursor: "pointer" }}
              >✖</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  Certificate Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ለአብነት: Full-Stack Web Development"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  Issuer (ያወጣው ተቋም) *
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="ለአብነት: Udemy, Coursera, freeCodeCamp"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  📅 Date (ዓመት)
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="2025"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  መግለጫ (Description)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="ስለ certificate ያጭር መግለጫ..."
                  rows="3"
                  style={inputStyle}
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  🎯 Icon ምረጥ
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        border: formData.icon === icon
                          ? "2px solid var(--primary)"
                          : "1px solid var(--border-color)",
                        background: formData.icon === icon
                          ? "rgba(97, 218, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.3)",
                        fontSize: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificate Image Upload */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                  📷 Certificate ፎቶ (Image Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "rgba(0, 0, 0, 0.4)",
                    color: "#ccc"
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "8px", border: "1px solid var(--border-accent)" }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowModal(false); setImagePreview(''); }}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  ሰርዝ (Cancel)
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  💾 ወደ MongoDB መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
