"use client";

import { useState } from "react";
import Link from "next/link";
import AudioDemo from "@/components/AudioDemo";
import VideoWalkthrough from "@/components/VideoWalkthrough";
import PdfViewerModal from "@/components/PdfViewerModal";
import SocialLinks from "@/components/SocialLinks";
import TryDemoModal from "@/components/TryDemoModal";
import FeedbackModal from "@/components/FeedbackModal";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge badge animate-float">
            <span className="badge-dot"></span> ⚡ Sub-100ms Ultra-Fast Voice AI Agent
          </div>

          <h1 className="hero-title">
            Supercharge Cold Calling With <br />
            <span className="gradient-text">Human-Like AI Agents</span>
          </h1>

          <p className="hero-subtitle">
            Lisa AI places outbound calls, handles tough objections, qualifies leads, and books appointments directly to your Google Calendar 24/7.
          </p>

          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => setDemoModalOpen(true)}
              id="btn-hero-try-demo"
            >
              ⚡ Try Live Voice Demo
            </button>
            <a href="#video-walkthrough" className="btn-secondary">
              📹 Watch Walkthrough Video
            </a>
          </div>

          {/* Social Links Bar */}
          <div className="hero-socials">
            <span className="socials-label">Connect & Follow Us:</span>
            <SocialLinks variant="horizontal" />
          </div>

          {/* Key Metrics Grid */}
          <div className="hero-metrics-grid">
            <div className="metric-card glass-card">
              <span className="metric-val gradient-text">10,000+</span>
              <span className="metric-lbl">Outbound Calls Automated</span>
            </div>
            <div className="metric-card glass-card">
              <span className="metric-val gradient-text-cyan">99.2%</span>
              <span className="metric-lbl">Human Pitch Accuracy</span>
            </div>
            <div className="metric-card glass-card">
              <span className="metric-val gradient-text">&lt; 100ms</span>
              <span className="metric-lbl">Real-Time Voice Latency</span>
            </div>
            <div className="metric-card glass-card">
              <span className="metric-val gradient-text-cyan">85%</span>
              <span className="metric-lbl">Cost Saved Per Lead</span>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIO DEMO FEATURE (#6) */}
      <AudioDemo />

      {/* WALKTHROUGH VIDEO FEATURE (#8) */}
      <VideoWalkthrough />

      {/* WORKING PDF FEATURE (#7) */}
      <PdfViewerModal />

      {/* ABOUT US FEATURE SNIPPET (#1) */}
      <section className="about-snippet-section">
        <div className="container">
          <div className="about-card glass-card">
            <div className="about-content">
              <span className="badge">
                <span className="badge-dot"></span> About Lisa AI
              </span>
              <h2 className="about-heading">
                Reinventing Cold Outreach for <span className="gradient-text">Modern Sales Teams</span>
              </h2>
              <p className="about-text">
                Lisa AI was engineered to eliminate the manual grind of outbound cold calling. By integrating deep speech neural models with Vapi, SignalWire, and Supabase RLS multi-tenant security, Lisa delivers high-converting conversations at scale.
              </p>
              <div className="about-actions">
                <Link href="/about" className="btn-primary">
                  📖 Read Full About Us Story
                </Link>
                <button 
                  className="btn-secondary"
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  💬 Give Product Feedback
                </button>
              </div>
            </div>

            <div className="about-visual">
              <div className="visual-box glass-card">
                <span className="visual-icon">🚀</span>
                <h4 className="visual-title">100% Automated Workflow</h4>
                <p className="visual-desc">From CSV upload to calendar slot booked—zero human intervention needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL LINKS PILLS FEATURE (#5) */}
      <section className="socials-feature-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">
              <span className="badge-dot"></span> Community & Channels
            </span>
            <h2 className="section-title">
              Join the <span className="gradient-text">Lisa AI Community</span>
            </h2>
            <p className="section-subtitle">
              Follow our official channels for live product updates, tutorial videos, and voice AI benchmarks.
            </p>
          </div>
          <SocialLinks variant="pills" />
        </div>
      </section>

      {/* CONTACT US FEATURE SNIPPET (#2) */}
      <section className="contact-snippet-section">
        <div className="container text-center">
          <div className="cta-box glass-card">
            <span className="badge">
              <span className="badge-dot"></span> Ready to Scale?
            </span>
            <h2 className="cta-title">Start Your AI Voice Journey Today</h2>
            <p className="cta-desc">
              Have custom enterprise requirements or need a tailored voice agent script? Talk to our voice automation architects.
            </p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn-primary">
                📩 Contact Us Now
              </Link>
              <button className="btn-secondary" onClick={() => setDemoModalOpen(true)}>
                ⚡ Try Interactive Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {demoModalOpen && <TryDemoModal onClose={() => setDemoModalOpen(false)} />}
      {feedbackModalOpen && <FeedbackModal onClose={() => setFeedbackModalOpen(false)} />}

      <style jsx>{`
        .hero-section {
          padding: 100px 0 60px 0;
          text-align: center;
          position: relative;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-title {
          font-size: 3.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
          line-height: 1.15;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 720px;
          margin-bottom: 36px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }

        .hero-socials {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 60px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          padding: 8px 24px;
          border-radius: var(--radius-full);
        }

        .socials-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .hero-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }

        .metric-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .metric-val {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
        }

        .metric-lbl {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .about-snippet-section {
          padding: 60px 0;
        }

        .about-card {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          padding: 48px;
          align-items: center;
        }

        .about-heading {
          font-size: 2.4rem;
          font-weight: 800;
          margin: 12px 0 16px 0;
        }

        .about-text {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .about-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .visual-box {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .visual-icon {
          font-size: 3.5rem;
        }

        .visual-title {
          font-size: 1.3rem;
          color: #fff;
        }

        .visual-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .socials-feature-section {
          padding: 80px 0;
        }

        .contact-snippet-section {
          padding: 60px 0;
        }

        .cta-box {
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 800;
        }

        .cta-desc {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 600px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        @media (max-width: 900px) {
          .hero-title {
            font-size: 2.6rem;
          }
          .hero-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
