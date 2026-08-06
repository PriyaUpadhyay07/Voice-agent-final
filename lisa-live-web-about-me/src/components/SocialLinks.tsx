"use client";

export interface SocialLinksProps {
  variant?: "horizontal" | "pills";
}

export default function SocialLinks({ variant = "horizontal" }: SocialLinksProps) {
  const socials = [
    { name: "Twitter / X", icon: "𝕏", url: "https://twitter.com", color: "#1DA1F2", handle: "@LisaAIVoice" },
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com", color: "#0A66C2", handle: "Lisa AI Inc." },
    { name: "YouTube", icon: "▶", url: "https://youtube.com", color: "#FF0000", handle: "Lisa AI Demos" },
    { name: "Instagram", icon: "📸", url: "https://instagram.com", color: "#E4405F", handle: "@lisa_voice_ai" },
    { name: "WhatsApp Support", icon: "💬", url: "https://wa.me", color: "#25D366", handle: "+1 (800) LISA-AI" },
  ];

  if (variant === "pills") {
    return (
      <div className="social-pills-container">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill glass-card"
            id={`social-link-${social.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="social-icon" style={{ color: social.color }}>{social.icon}</span>
            <div className="social-pill-info">
              <span className="social-pill-name">{social.name}</span>
              <span className="social-pill-handle">{social.handle}</span>
            </div>
          </a>
        ))}

        <style jsx>{`
          .social-pills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
          }
          .social-pill {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            border-radius: var(--radius-full);
            text-decoration: none;
            color: var(--text-main);
            font-size: 0.9rem;
          }
          .social-icon {
            font-size: 1.3rem;
          }
          .social-pill-info {
            display: flex;
            flex-direction: column;
          }
          .social-pill-name {
            font-weight: 700;
            font-family: var(--font-heading);
          }
          .social-pill-handle {
            font-size: 0.78rem;
            color: var(--text-muted);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="social-bar">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon-btn"
          title={social.name}
          id={`social-icon-${social.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <span>{social.icon}</span>
        </a>
      ))}

      <style jsx>{`
        .social-bar {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .social-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          font-size: 1.1rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .social-icon-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
