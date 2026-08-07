"use client";

import { useState } from "react";
import Link from "next/link";
import PersonalizedDemoModal from "@/components/PersonalizedDemoModal";

export default function AboutPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="about-page">
      <div className="container">
        {/* HERO */}
        <section className="about-hero">
          <div className="badge-pill badge-lime">
            <span>✨ Founder & Mission</span>
          </div>
          <h1 className="about-title font-serif">About Lisa AI</h1>
          <p className="about-subtitle">
            You bring the leads and the script — AI handles everything else by itself. Built & managed personally for every client.
          </p>
        </section>

        {/* FOUNDER CARD */}
        <section className="founder-section">
          <div className="soft-card founder-card">
            <div className="founder-info">
              <span className="badge-pill badge-lime">Founder & Lead Architect</span>
              <h2 className="founder-name font-serif">Hi, I&apos;m Priya Upadhyay</h2>
              <p className="founder-bio">
                &ldquo;I personally set up and manage every client&apos;s calling agent — no big team, no outsourcing, just me making sure it works for you.&rdquo;
              </p>
              <p className="founder-detail">
                Whether you run a business loan company, SBA lending firm, MCA brokerage, commercial lending business, or real estate agency, I ensure your voice script, TCPA compliance guidelines, and lead integrations work seamlessly within 24 hours.
              </p>
              <div className="founder-actions">
                <a href="mailto:priya@callwithlisa.in" className="btn-primary">
                  📩 Email Priya Directly (priya@callwithlisa.in)
                </a>
                <button className="btn-lime" onClick={() => setDemoOpen(true)}>
                  📞 Book Personalised Demo
                </button>
              </div>
            </div>

            <div className="founder-badge-side">
              <div className="founder-box soft-card">
                <span className="box-icon">✨</span>
                <h3 className="font-serif">24-Hour Delivery</h3>
                <p>Fill out our short setup form and your custom AI calling agent goes live within 1 business day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & PRACTICAL */}
        <section className="pricing-overview-section">
          <div className="section-header text-center">
            <div className="badge-pill badge-lime">
              <span>💰 Simple, Transparent Pricing</span>
            </div>
            <h2 className="section-title font-serif">No Hidden Fees. No Contracts.</h2>
          </div>

          <div className="pricing-card-box soft-card">
            <div className="pricing-header">
              <span className="price-tag font-serif">$1,000</span>
              <span className="price-sub">One-time Setup Fee</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Includes 80 FREE Calling Minutes</li>
              <li>✓ Custom AI Voice Agent built & managed for you</li>
              <li>✓ Full transcript & call recording dashboard access</li>
              <li>✓ Instant script editing anytime</li>
              <li>✓ Upload leads via CSV or Google Sheets</li>
              <li>✓ After free minutes: pay-as-you-go at $0.25/minute</li>
            </ul>
            <div className="pricing-action">
              <Link href="/contact" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                🚀 Get Started ($1,000 Setup)
              </Link>
            </div>
          </div>
        </section>
      </div>

      {demoOpen && <PersonalizedDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .about-page {
          padding: 60px 0 90px 0;
          background: #FDFCFC;
        }

        .about-hero {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 50px auto;
        }

        .about-title {
          font-size: 3.5rem;
          color: #0F172A;
          margin: 16px 0 10px 0;
        }

        .about-subtitle {
          color: #475569;
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .founder-section {
          margin-bottom: 70px;
        }

        .founder-card {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          padding: 48px;
          background: #FFFFFF;
          align-items: center;
        }

        .founder-name {
          font-size: 2.8rem;
          color: #0F172A;
          margin: 12px 0 16px 0;
        }

        .founder-bio {
          font-size: 1.15rem;
          color: #0F172A;
          font-style: italic;
          margin-bottom: 16px;
          line-height: 1.6;
          border-left: 3px solid #C4F135;
          padding-left: 16px;
        }

        .founder-detail {
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .founder-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .founder-box {
          padding: 36px;
          text-align: center;
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .founder-box h3 {
          font-size: 1.8rem;
          color: #FFFFFF;
        }

        .founder-box p {
          color: #94A3B8;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .box-icon {
          font-size: 2.5rem;
        }

        .pricing-overview-section {
          max-width: 650px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.8rem;
          color: #0F172A;
          margin-top: 12px;
        }

        .pricing-card-box {
          padding: 40px;
          background: #FFFFFF;
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pricing-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding-bottom: 20px;
          border-bottom: 1px solid #E2E8F0;
        }

        .price-tag {
          font-size: 3.5rem;
          color: #0F172A;
        }

        .price-sub {
          color: #64748B;
          font-size: 0.95rem;
        }

        .pricing-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: #334155;
          font-size: 0.95rem;
        }

        @media (max-width: 850px) {
          .about-title { font-size: 2.5rem; }
          .founder-card { grid-template-columns: 1fr; padding: 28px; }
          .founder-name { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
}
