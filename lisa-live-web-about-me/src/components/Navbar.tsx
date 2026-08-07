"use client";

import { useState } from "react";
import Link from "next/link";
import PersonalizedDemoModal from "./PersonalizedDemoModal";

export default function Navbar() {
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
              <span className="logo-title font-serif">LISA AI</span>
              <span className="logo-subtitle">Autonomous Outbound Agent</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/#why-us" onClick={() => setMobileMenuOpen(false)}>Why Choose Us</Link>
            <Link href="/#voices" onClick={() => setMobileMenuOpen(false)}>Voices</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
          </nav>

          {/* Action Buttons */}
          <div className="nav-actions">
            <Link href="/contact" className="btn-secondary btn-sm nav-hide-mobile">
              Contact Us
            </Link>
            <button 
              className="btn-lime btn-sm"
              onClick={() => setDemoOpen(true)}
              id="btn-nav-demo"
            >
              📞 Book Personalised Demo
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

      {/* Demo Modal */}
      {demoOpen && <PersonalizedDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(253, 253, 252, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #E2E8F0;
          padding: 14px 0;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: #0F172A;
          color: #C4F135;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.6rem;
          font-style: italic;
          font-weight: 600;
          color: #0F172A;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 0.7rem;
          color: #64748B;
          font-family: var(--font-body);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-links :global(a) {
          color: #475569;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-links :global(a:hover) {
          color: #0F172A;
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
          color: #0F172A;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px;
        }

        .btn-sm {
          padding: 8px 18px;
          font-size: 0.85rem;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #FFFFFF;
            border-bottom: 1px solid #E2E8F0;
            flex-direction: column;
            padding: 24px;
            gap: 18px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          }

          .nav-links.active {
            display: flex;
          }

          .nav-hide-mobile {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
