"use client";

import { useState } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import FeedbackModal from "./FeedbackModal";

export default function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-title">LISA<span className="logo-accent">.AI</span></span>
          </div>
          <p className="footer-desc">
            Next-Generation Voice AI Agent for automated cold calling, lead qualification, and 24/7 calendar appointment booking.
          </p>
          <div className="footer-socials">
            <SocialLinks variant="horizontal" />
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/#audio-demo">Audio Demo</Link></li>
            <li><Link href="/#video-walkthrough">Walkthrough Video</Link></li>
            <li><Link href="/#pdf-brochure">PDF Deck</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Support & Contact</h4>
          <ul className="footer-links">
            <li><Link href="/contact">Contact Us</Link></li>
            <li><a href="#feedback" onClick={(e) => { e.preventDefault(); setFeedbackOpen(true); }}>Give Feedback</a></li>
            <li><a href="mailto:support@lisaai.com">support@lisaai.com</a></li>
            <li><a href="tel:+18005472241">+1 (800) 547-2241</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Stay Updated</h4>
          <p className="footer-newsletter-desc">Get the latest AI cold calling updates and feature releases.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Lisa AI updates!"); }}>
            <input type="email" placeholder="Enter your email" required className="newsletter-input" />
            <button type="submit" className="btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© {new Date().getFullYear()} LISA AI - All rights reserved. LISA LIVE WEB ABOUT ME.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

      <style jsx>{`
        .footer-container {
          background: #05060a;
          border-top: 1px solid var(--border-color);
          padding-top: 70px;
          margin-top: 80px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          padding-bottom: 50px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
        }

        .logo-accent {
          color: var(--secondary);
        }

        .footer-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          max-width: 320px;
          line-height: 1.6;
        }

        .footer-socials {
          margin-top: 8px;
        }

        .footer-col-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links :global(a) {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .footer-links :global(a:hover) {
          color: var(--primary-light);
          padding-left: 4px;
        }

        .footer-newsletter-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-bottom: 14px;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
        }

        .newsletter-input:focus {
          border-color: var(--primary);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px 0;
          background: rgba(0, 0, 0, 0.4);
        }

        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        .footer-legal {
          display: flex;
          gap: 20px;
        }

        .footer-legal a {
          color: var(--text-dim);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
          .footer-bottom-content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
