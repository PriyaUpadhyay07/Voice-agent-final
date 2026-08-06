"use client";

import { useState } from "react";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import FeedbackModal from "@/components/FeedbackModal";
import TryDemoModal from "@/components/TryDemoModal";

export default function AboutPage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const pillars = [
    {
      icon: "⚡",
      title: "Sub-100ms Ultra-Low Latency",
      desc: "Instant conversational speech synthesis ensures zero uncomfortable pauses during outbound cold calls."
    },
    {
      icon: "🔒",
      title: "Multi-Tenant Data Isolation",
      desc: "Built with Supabase RLS (Row Level Security) ensuring strict enterprise privacy where every client sees only their own data."
    },
    {
      icon: "🎯",
      title: "Contextual Objection Handling",
      desc: "Dynamic script overrides automatically adapt to customer pushback on pricing, timing, or competitor features."
    },
    {
      icon: "📅",
      title: "Autonomous Calendar Booking",
      desc: "Direct integration with Google Calendar and HubSpot CRM for real-time appointment booking."
    }
  ];

  const metrics = [
    { label: "Human Pitch Accuracy", value: "99.2%" },
    { label: "Outbound Channels Parallel", value: "1,000+" },
    { label: "Average Call Cost Savings", value: "85%" },
    { label: "Setup & Onboarding Time", value: "< 5 Mins" }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* HERO */}
        <section className="about-hero">
          <span className="badge">
            <span className="badge-dot"></span> About Us & Our Mission
          </span>
          <h1 className="about-title">
            Empowering Sales Teams With <br />
            <span className="gradient-text">Autonomous Voice Intelligence</span>
          </h1>
          <p className="about-subtitle">
            Lisa AI was built with a single core mission: to replace repetitive, stressful manual cold calling with intelligent, human-like voice agents that never tire, stall, or miss a follow-up opportunity.
          </p>
        </section>

        {/* METRICS GRID */}
        <section className="metrics-section">
          <div className="metrics-grid">
            {metrics.map((m, idx) => (
              <div key={idx} className="metric-card glass-card">
                <span className="metric-val gradient-text">{m.value}</span>
                <span className="metric-lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* OUR STORY & VISION */}
        <section className="story-section">
          <div className="story-card glass-card">
            <div className="story-text">
              <h2 className="story-heading">The Story Behind Lisa AI</h2>
              <p>
                Traditional cold calling has always suffered from low connection rates, high sales rep burnout, and inconsistent follow-ups. In 2024, our team set out to engineer a voice agent that didn't sound like a clunky robotic IVR system.
              </p>
              <p>
                By pairing deep neural speech synthesis with sub-second decision engines, Lisa AI conducts natural, fluid conversations. Whether it’s real estate lead qualification, B2B SaaS demo scheduling, or appointment confirmation, Lisa delivers enterprise-grade performance.
              </p>
              <div className="story-cta-buttons">
                <button className="btn-primary" onClick={() => setDemoOpen(true)}>
                  ⚡ Try Live Demo Call
                </button>
                <button className="btn-secondary" onClick={() => setFeedbackOpen(true)}>
                  💬 Share Your Feedback
                </button>
              </div>
            </div>
            <div className="story-image-box">
              <div className="tech-badge-card glass-card">
                <span className="tech-icon">🧠</span>
                <h3>Neural Voice Engine</h3>
                <p>SignalWire & Vapi Telephony • ElevenLabs Realism • Supabase DB</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE PILLARS */}
        <section className="pillars-section">
          <div className="section-header">
            <span className="badge">
              <span className="badge-dot"></span> Built For Scale
            </span>
            <h2 className="section-title">
              Our 4 Architectural <span className="gradient-text">Pillars</span>
            </h2>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar, i) => (
              <div key={i} className="pillar-card glass-card">
                <span className="pillar-icon">{pillar.icon}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SOCIAL COMMUNITY PILLS */}
        <section className="about-socials-section">
          <div className="section-header">
            <h3 className="section-title">Connect With Us</h3>
            <p className="section-subtitle">Follow Lisa AI on our social channels for updates and live audio releases.</p>
          </div>
          <SocialLinks variant="pills" />
        </section>

        {/* BOTTOM CTA */}
        <section className="about-cta-section text-center">
          <div className="cta-card glass-card">
            <h2>Ready to transform your sales pipeline?</h2>
            <p>Get in touch with our team or schedule a live demonstration today.</p>
            <div className="cta-actions">
              <Link href="/contact" className="btn-primary">
                📩 Contact Sales Team
              </Link>
              <button className="btn-secondary" onClick={() => setDemoOpen(true)}>
                📞 Start Live Demo
              </button>
            </div>
          </div>
        </section>
      </div>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      {demoOpen && <TryDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .about-page {
          padding: 60px 0;
        }

        .about-hero {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px auto;
        }

        .about-title {
          font-size: 3.2rem;
          font-weight: 800;
          margin: 16px 0;
          line-height: 1.2;
        }

        .about-subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .metrics-section {
          margin-bottom: 70px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .metric-card {
          padding: 28px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-val {
          font-size: 2.4rem;
          font-weight: 800;
        }

        .metric-lbl {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .story-section {
          margin-bottom: 80px;
        }

        .story-card {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 40px;
          padding: 48px;
          align-items: center;
        }

        .story-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 20px;
        }

        .story-text {
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .story-cta-buttons {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        .tech-badge-card {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .tech-icon {
          font-size: 3.5rem;
        }

        .pillars-section {
          margin-bottom: 80px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .pillar-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pillar-icon {
          font-size: 2.2rem;
        }

        .pillar-title {
          font-size: 1.3rem;
          color: #fff;
          font-weight: 700;
        }

        .pillar-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .about-socials-section {
          margin-bottom: 80px;
        }

        .cta-card {
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-actions {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        @media (max-width: 900px) {
          .about-title { font-size: 2.4rem; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .story-card { grid-template-columns: 1fr; }
          .pillars-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
