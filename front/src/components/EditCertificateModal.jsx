import React, { useState, useEffect } from 'react';

export default function EditCertificateModal({ isOpen, certificate, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    icon: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title || '',
        issuer: certificate.issuer || '',
        date: certificate.date || '',
        description: certificate.description || '',
        icon: certificate.icon || '',
        imageUrl: certificate.imageUrl || ''
      });
      setImagePreview(certificate.imageUrl || '');
    }
  }, [certificate]);

  if (!isOpen || !certificate) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer) {
      alert("Please fill in Title and Issuer!");
      return;
    }

    setSubmitting(true);
    await onUpdate(certificate._id, formData);
    setSubmitting(false);
    onClose();
  };

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
          <h3 style={{ fontSize: "22px", fontWeight: "700" }}>Edit Certificate</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-sub)", fontSize: "20px", cursor: "pointer" }}
          >X</button>
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
              placeholder="e.g. Full-Stack Web Development"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Issuer / Institution *
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="e.g. Udemy, Coursera, freeCodeCamp"
              required
              style={inputStyle}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Certificate Image (Upload)
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
              onClick={onClose}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
