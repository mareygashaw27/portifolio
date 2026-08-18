import React from 'react';

export default function Hero({ onOpenModal, profile = {} }) {
  const name = profile.name || 'Marey Gashaw';
  const subtitle = profile.subtitle || 'Information Technology Student';
  const description = profile.description || 'Passionate about building modern web applications and exploring new technologies. Turning ideas into digital experiences.';
  const photoUrl = profile.photoUrl || '/mar.jpg';
  return (
    <section style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "40px",
      padding: "40px 0 60px 0",
      flexWrap: "wrap-reverse"
    }}>
      {/* Left Column: Intro Text */}
      <div style={{ flex: "1 1 400px", position: "relative" }}>
        {/* Animated Glowing Backdrop */}
        <div className="hero-text-glow"></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Status Badge */}
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
            marginBottom: "20px",
            backdropFilter: "blur(8px)"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
              animation: "pulseGreen 2s ease-in-out infinite"
            }}></span>
            Available for opportunities
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "800",
            lineHeight: "1.15",
            marginBottom: "16px",
            color: "var(--text-main)"
          }}>
            Hi, I'm{' '}
            <span className="gradient-text" style={{
              fontSize: "inherit",
              fontWeight: "inherit"
            }}>
              {name.split(' ')[0]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle" style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            color: "var(--text-sub)",
            fontWeight: "500",
            marginBottom: "24px",
            lineHeight: "1.5"
          }}>
            {subtitle}
          </p>

          {/* Description */}
          <p style={{
            fontSize: "16px",
            color: "var(--text-sub)",
            lineHeight: "1.7",
            marginBottom: "32px",
            maxWidth: "520px"
          }}>
            {description}
          </p>

        </div>
      </div>

      {/* Right Column: Profile Image with Dynamic Background Animations */}
      <div style={{ flex: "0 0 auto", margin: "0 auto", padding: "20px" }}>
        <div className="profile-container">
          {/* Animated Background Glowing Aura */}
          <div className="profile-bg-aura"></div>

          {/* Animated Rotating Gradient Ring */}
          <div className="profile-ring">
            <div className="profile-inner-img">
              <img
                src={photoUrl}
                alt="Developer Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                onError={(e) => {
                  if (!e.target.src.endsWith('/mar.png')) {
                    e.target.src = "/mar.png";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
