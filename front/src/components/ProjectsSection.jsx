import React from 'react';

export default function ProjectsSection({ projects, loading, fetchProjects }) {
  return (
    <section id="projects" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        <span className="gradient-text">Featured Projects</span>
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-sub)" }}>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
          <h3 style={{ marginBottom: "10px" }}>No projects added yet</h3>
          <p style={{ color: "var(--text-sub)" }}>New projects will be published here soon!</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {projects.map((item) => (
            <div key={item._id} className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Project Image */}
              <div style={{
                width: "100%",
                height: "190px",
                background: "linear-gradient(135deg, #1e2029 0%, #0b0c10 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                borderBottom: "1px solid var(--border-color)"
              }}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                )}
              </div>

              {/* Card Content */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>{item.title}</h3>
                
                <p style={{ color: "var(--text-sub)", fontSize: "14px", marginBottom: "16px", flex: 1 }}>
                  {item.description}
                </p>

                {/* Technologies tags */}
                {item.technologies && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {item.technologies.split(',').map((tech, i) => (
                      <span key={i} style={{
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "rgba(168, 85, 247, 0.12)",
                        color: "var(--purple)",
                        border: "1px solid rgba(168, 85, 247, 0.25)"
                      }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                <div style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                  {item.projectUrl && (
                    <a href={item.projectUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "8px 14px", fontSize: "13px", textDecoration: "none", flex: 1, justifyContent: "center" }}>
                      Live Demo
                    </a>
                  )}
                  {item.githubUrl && (
                    <a href={item.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "13px", textDecoration: "none", flex: 1, justifyContent: "center" }}>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
