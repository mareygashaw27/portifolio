import React from 'react';

export default function SkillsSection() {
  const skills = [
    { name: "HTML", icon: "🌐" },
    { name: "CSS", icon: "🎨" },
    { name: "JavaScript", icon: "🟨" },
    { name: "React.js", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Express.js", icon: "🚀" },
    { name: "MySQL", icon: "🗄️" },
    { name: "MongoDB", icon: "🍃" }
  ];

  return (
    <section id="skills" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        🛠️ የምጠቀማቸው <span className="gradient-text">Technologies & Skills</span>
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
              fontSize: "36px",
              marginBottom: "10px",
              transition: "transform 0.3s ease"
            }}>
              {skill.icon}
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
