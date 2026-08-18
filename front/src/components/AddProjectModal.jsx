import React from 'react';

export default function AddProjectModal({
  showModal,
  onClose,
  handleSubmit,
  formData,
  handleChange,
  handleImageUpload,
  imagePreview
}) {
  if (!showModal) return null;

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
          <h3 style={{ fontSize: "22px", fontWeight: "700" }}>Add New Project</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-sub)", fontSize: "20px", cursor: "pointer" }}
          >X</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Web App"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "#fff"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a brief description of the project..."
              rows="3"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "#fff"
              }}
            />
          </div>

          {/* Image File Upload */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Project Image (Upload)
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

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Technologies (comma separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, Express, MongoDB"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "#fff"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Live Demo Link (Project URL)
            </label>
            <input
              type="url"
              name="projectUrl"
              value={formData.projectUrl}
              onChange={handleChange}
              placeholder="https://myproject.com"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "#fff"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              GitHub Link
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "#fff"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
