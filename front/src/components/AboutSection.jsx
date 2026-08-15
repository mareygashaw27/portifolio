import React from 'react';

export default function AboutSection() {
  const techStack = [
    "HTML", "CSS", "JavaScript", "React.js", "Node.js",
    "Express.js", "Laravel", "PHP", "MySQL"
  ];

  return (
    <section id="about" style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", textAlign: "center" }}>
        🙋‍♂️ <span className="gradient-text">About Me</span>
      </h2>

      <div className="glass-card about-card" style={{
        padding: "clamp(16px, 5vw, 40px)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative glow */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }}></div>

        <div style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "160px",
          height: "160px",
          background: "radial-gradient(circle, rgba(97, 218, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none"
        }}></div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Greeting badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "20px",
            background: "rgba(97, 218, 255, 0.1)",
            border: "1px solid var(--border-accent)",
            color: "var(--primary)",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "20px"
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#10b981", display: "inline-block",
              boxShadow: "0 0 8px #10b981",
              animation: "pulseGreen 2s ease-in-out infinite"
            }}></span>
            IT Student & Full-Stack Developer
          </div>

          <h3 style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "16px",
            lineHeight: "1.3"
          }}>
            Hi, I'm <span className="gradient-text">Marey Gashaw</span>.
          </h3>

          <p style={{
            color: "var(--text-sub)",
            fontSize: "17px",
            lineHeight: "1.8",
            marginBottom: "16px",
            maxWidth: "700px"
          }}>
            I am an Information Technology student and passionate Full-Stack Web Developer who enjoys creating modern, responsive, and user-friendly web applications. I have experience working with HTML, CSS, JavaScript, React.js, Node.js, Express.js, Laravel, PHP, and MySQL.
          </p>

          <p style={{
            color: "var(--text-sub)",
            fontSize: "17px",
            lineHeight: "1.8",
            marginBottom: "28px",
            maxWidth: "700px"
          }}>
            I enjoy solving real-world problems through technology, learning new tools, and turning ideas into functional applications. My goal is to continuously improve my skills and build innovative software solutions that make a meaningful impact.
          </p>

          {/* Tech stack tags */}
          <div style={{ marginBottom: "8px" }}>
            <span style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "12px",
              display: "block"
            }}>Tech Stack</span>
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="about-tech-tag"
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  cursor: "default"
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
