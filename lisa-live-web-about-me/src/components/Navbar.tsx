"use client";

import { useState } from "react";
import Link from "next/link";
import FeedbackModal from "./FeedbackModal";
import TryDemoModal from "./TryDemoModal";

export default function Navbar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar-container">
        <div className="container nav-content">
          {/* Logo */}
          <Link href="/" className="logo-brand">
            <div className="logo-icon">✨</div>
            <div className="logo-text">
              <span className="logo-title">LISA<span className="logo-accent">.AI</span></span>
              <span className="logo-subtitle">Live Web & About</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/#audio-demo" onClick={() => setMobileMenuOpen(false)}>Audio Demo</Link>
            <Link href="/#video-walkthrough" onClick={() => setMobileMenuOpen(false)}>Walkthrough Video</Link>
            <Link href="/#pdf-brochure" onClick={() => setMobileMenuOpen(false)}>PDF Overview</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
          </nav>

          {/* Action Buttons */}
          <div className="nav-actions">
            <button 
              className="btn-secondary btn-sm"
              onClick={() => setFeedbackOpen(true)}
              id="btn-nav-feedback"
            >
              💬 Feedback
            </button>
            <button 
              className="btn-primary btn-sm"
              onClick={() => setDemoOpen(true)}
              id="btn-nav-demo"
            >
              ⚡ Try Demo
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      {demoOpen && <TryDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(7, 9, 14, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 0;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .logo-accent {
          color: #ec4899;
        }

        .logo-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-links :global(a) {
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-links :global(a:hover) {
          color: var(--primary-light);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(18, 22, 34, 0.98);
            border-bottom: 1px solid var(--border-color);
            flex-direction: column;
            padding: 24px;
            gap: 20px;
          }

          .nav-links.active {
            display: flex;
          }

          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
