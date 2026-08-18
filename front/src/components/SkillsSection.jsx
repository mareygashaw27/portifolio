import React from 'react';

export default function SkillsSection() {
  const skills = [
    { name: "HTML5", tag: "HTML", color: "#e34f26" },
    { name: "CSS3", tag: "CSS", color: "#1572b6" },
    { name: "JavaScript", tag: "JS", color: "#f7df1e" },
    { name: "React.js", tag: "REACT", color: "#61dafb" },
    { name: "Node.js", tag: "NODE", color: "#339933" },
    { name: "Express.js", tag: "EX", color: "#ffffff" },
    { name: "MySQL", tag: "SQL", color: "#4479a1" },
    { name: "MongoDB", tag: "DB", color: "#47a248" },
    { name: "Java", tag: "JAVA", color: "#f89820" },
    { name: "Video Editing", tag: "VID", color: "#e040fb" }
  ];

  return (
    <section id="skills" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        <span className="gradient-text">Technologies & Skills</span>
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "16px"
      }}>
        {skills.map((skill, index) => (
          <div
            key={index}
            className="glass-card skill-card"
            style={{
              padding: "24px 16px",
              textAlign: "center",
              cursor: "default"
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 12px auto",
              borderRadius: "12px",
              background: `rgba(255, 255, 255, 0.05)`,
              border: `1px solid ${skill.color}50`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "13px",
              color: skill.color,
              letterSpacing: "0.5px"
            }}>
              {skill.tag}
            </div>
            <div style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "var(--text-main)"
            }}>
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
