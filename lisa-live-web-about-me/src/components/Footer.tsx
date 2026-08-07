"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-title font-serif">LISA AI</span>
          </div>
          <p className="footer-desc">
            You bring the leads and the script — AI handles everything else by itself. Built and managed for you.
          </p>
          <div className="founder-badge">
            Founder: <strong>Priya Upadhyay</strong>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#why-us">Why Choose Us</Link></li>
            <li><Link href="/#voices">Voice Demos</Link></li>
            <li><Link href="/#faq">FAQ & Trust</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Direct Contact</h4>
          <ul className="footer-links">
            <li><Link href="/contact">Contact Page</Link></li>
            <li>
              <a href="mailto:priya@callwithlisa.in" className="email-highlight">
                priya@callwithlisa.in
              </a>
            </li>
            <li><span className="response-tag">⚡ 24-48 hr response guaranteed</span></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Lisa AI Pricing</h4>
          <p className="footer-pricing-desc">
            <strong>$1,000</strong> one-time setup fee (includes 80 free calling minutes).
          </p>
          <p className="footer-pricing-desc">
            After that: <strong>$0.25/minute</strong> pay-as-you-go. No contracts.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© {new Date().getFullYear()} LISA AI (callwithlisa.in). All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/contact">Support</Link>
            <a href="mailto:priya@callwithlisa.in">Email Priya</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-container {
          background: #F8F9FA;
          border-top: 1px solid #E2E8F0;
          padding-top: 70px;
          margin-top: 80px;
          color: #0F172A;
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
          font-size: 1.4rem;
        }

        .logo-title {
          font-size: 1.8rem;
          font-style: italic;
          color: #0F172A;
          line-height: 1;
        }

        .footer-desc {
          color: #475569;
          font-size: 0.92rem;
          max-width: 320px;
          line-height: 1.6;
        }

        .founder-badge {
          display: inline-block;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: #0F172A;
          width: fit-content;
        }

        .footer-col-title {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links :global(a) {
          color: #475569;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .footer-links :global(a:hover) {
          color: #0F172A;
          padding-left: 4px;
        }

        .email-highlight {
          font-weight: 600;
          color: #0F172A !important;
          text-decoration: underline !important;
        }

        .response-tag {
          font-size: 0.8rem;
          color: #166534;
          background: #DCFCE7;
          padding: 4px 10px;
          border-radius: 9999px;
          display: inline-block;
        }

        .footer-pricing-desc {
          color: #475569;
          font-size: 0.9rem;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .footer-bottom {
          border-top: 1px solid #E2E8F0;
          padding: 24px 0;
          background: #FFFFFF;
        }

        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #64748B;
        }

        .footer-legal {
          display: flex;
          gap: 20px;
        }

        .footer-legal :global(a), .footer-legal a {
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal :global(a:hover), .footer-legal a:hover {
          color: #0F172A;
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
