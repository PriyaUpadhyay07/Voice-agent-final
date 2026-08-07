"use client";

import { useState } from "react";
import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";
import PersonalizedDemoModal from "./PersonalizedDemoModal";

export default function Navbar() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar-wrapper">
        <header className="floating-navbar">
          {/* Nav Links (No Logo) */}
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/#why-us" onClick={() => setMobileMenuOpen(false)}>Why Choose Us</Link>
            <Link href="/#voices" onClick={() => setMobileMenuOpen(false)}>Voices</Link>
            <Link href="/#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
          </nav>

          {/* Action Pills inspired by uploaded Image 1 */}
          <div className="nav-actions">
            <a href="mailto:priya@callwithlisa.in" className="email-capsule-btn">
              <Mail className="w-3.5 h-3.5" />
              <span>priya@callwithlisa.in</span>
            </a>
            
            <button 
              className="demo-capsule-btn"
              onClick={() => setDemoOpen(true)}
              id="btn-nav-demo"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Demo</span>
            </button>

            {/* Mobile Hamburger */}
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </header>
      </div>

      {/* Demo Modal */}
      {demoOpen && <PersonalizedDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .navbar-wrapper {
          position: sticky;
          top: 20px;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          pointer-events: none;
        }

        .floating-navbar {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 8px 12px 8px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
          max-width: 960px;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-links :global(a) {
          color: rgba(255, 255, 255, 0.85);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-links :global(a:hover) {
          color: #C4F135;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .email-capsule-btn {
          background: #FFFFFF;
          color: #0F172A;
          border-radius: 9999px;
          padding: 8px 18px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .email-capsule-btn:hover {
          background: #F1F5F9;
          transform: translateY(-1px);
        }

        .demo-capsule-btn {
          background: #C4F135;
          color: #0F172A;
          border-radius: 9999px;
          padding: 8px 18px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(196, 241, 53, 0.3);
        }

        .demo-capsule-btn:hover {
          background: #B2E421;
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 1.4rem;
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 900px) {
          .email-capsule-btn {
            display: none;
          }
          .nav-links {
            display: none;
            position: absolute;
            top: calc(100% + 12px);
            left: 16px;
            right: 16px;
            background: #0F172A;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            flex-direction: column;
            padding: 24px;
            gap: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
