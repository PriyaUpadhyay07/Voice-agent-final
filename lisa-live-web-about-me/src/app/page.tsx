"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, PhoneCall, Scale, Zap } from "lucide-react";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FaqSection from "@/components/FaqSection";
import PersonalizedDemoModal from "@/components/PersonalizedDemoModal";
import LisaVoiceCard from "@/components/LisaVoiceCard";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="home-page">
      {/* HERO SECTION WITH HORIZONTAL FACE-TO-FACE TOP ROW + 4 HORIZONTAL STAT CARDS BELOW */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* TOP HORIZONTAL ROW: LEFT TEXT + RIGHT LISA VOICE GLASS CARD */}
          <div className="hero-top-row">
            {/* LEFT COLUMN */}
            <div className="hero-left">
              <h1 className="hero-title font-serif">
                LISA AI
              </h1>

              <div className="hero-sub-block">
                <h2 className="sub-tag font-serif">Lisa AI</h2>
                <p className="sub-text">
                  You bring the leads and the script — AI handles everything else by itself.
                </p>
              </div>

              {/* Strictly 2 Action Buttons */}
              <div className="hero-actions">
                <Link href="/contact" className="btn-primary" id="btn-hero-contact">
                  <Mail className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>
                <button 
                  className="btn-lime"
                  onClick={() => setDemoModalOpen(true)}
                  id="btn-hero-personalised-demo"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Book Personalised Demo</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: LISA AI VOICE CALL GLASS CARD */}
            <div className="hero-right">
              <LisaVoiceCard />
            </div>
          </div>

          {/* BOTTOM HORIZONTAL ROW: ALL 4 STAT CARDS IN A SINGLE HORIZONTAL LINE (1st | 2nd | 3rd | 4th) */}
          <div className="hero-stats-grid">
            <div className="stat-card soft-card">
              <span className="stat-num font-serif">24 Hours</span>
              <span className="stat-lbl">Full Agent Setup Time</span>
            </div>
            <div className="stat-card soft-card">
              <span className="stat-num font-serif">100% 24/7</span>
              <span className="stat-lbl">Non-stop Outbound Calls</span>
            </div>
            <div className="stat-card soft-card">
              <span className="stat-num font-serif">$1,000</span>
              <span className="stat-lbl">Setup (Includes 80 Free Mins)</span>
            </div>
            <div className="stat-card soft-card">
              <span className="stat-num font-serif">$0.25</span>
              <span className="stat-lbl">Pay-As-You-Go per Minute</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & WHY WE'RE DIFFERENT SECTION */}
      <WhyChooseUsSection />

      {/* COMPREHENSIVE FAQ SECTION */}
      <FaqSection />

      {/* FINAL CONTACT CTA SECTION */}
      <section className="final-cta-section">
        <div className="container">
          <div className="soft-card cta-box text-center">
            <div className="badge-pill badge-lime">
              <Zap className="w-3.5 h-3.5" />
              <span>Ready to Automate Your Calls?</span>
            </div>
            <h2 className="cta-heading font-serif">Let Lisa AI Handle Your Outbound Calls</h2>
            <p className="cta-desc">
              Setup is completed within 24 hours by founder <strong>Priya Upadhyay</strong>. Just fill out our simple onboarding form, and we handle everything else.
            </p>
            <div className="cta-btn-group">
              <a href="mailto:priya@callwithlisa.in" className="btn-primary">
                <Mail className="w-4 h-4" />
                <span>Contact Priya (priya@callwithlisa.in)</span>
              </a>
              <button className="btn-lime" onClick={() => setDemoModalOpen(true)}>
                <PhoneCall className="w-4 h-4" />
                <span>Book Personalised Demo Call</span>
              </button>
              <Link href="/terms" className="btn-secondary">
                <Scale className="w-4 h-4" />
                <span>View Terms & Conditions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO MODAL */}
      {demoModalOpen && <PersonalizedDemoModal onClose={() => setDemoModalOpen(false)} />}

      <style jsx>{`
        .home-page {
          background: #FDFCFC;
        }

        .hero-section {
          padding: 60px 0 70px 0;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        /* TOP ROW: LEFT TEXT + RIGHT VISUAL FACE TO FACE */
        .hero-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          flex: 1;
        }

        .hero-title {
          font-size: 5.2rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.03em;
          margin: 0 0 10px 0;
          line-height: 1;
        }

        .hero-sub-block {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .sub-tag {
          font-size: 2.2rem;
          color: #0F172A;
          font-weight: 700;
        }

        .sub-text {
          font-size: 1.2rem;
          color: #475569;
          max-width: 560px;
          line-height: 1.5;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        /* BOTTOM ROW: ALL 4 CARDS HORIZONTALLY SIDE BY SIDE IN 1 SINGLE ROW */
        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }

        .stat-card {
          padding: 22px 18px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          transition: all 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: #CBD5E1;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .stat-num {
          font-size: 1.85rem;
          font-weight: 700;
          color: #0F172A;
        }

        .stat-lbl {
          font-size: 0.82rem;
          color: #64748B;
          font-family: var(--font-body);
        }

        /* CTA SECTION */
        .final-cta-section {
          padding: 80px 0;
        }

        .cta-box {
          padding: 60px 40px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          border-radius: 32px;
        }

        .cta-heading {
          font-size: 3.2rem;
          color: #0F172A;
          line-height: 1.1;
        }

        .cta-desc {
          color: #475569;
          font-size: 1.1rem;
          max-width: 640px;
          line-height: 1.6;
        }

        .cta-btn-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 10px;
        }

        @media (max-width: 960px) {
          .hero-top-row {
            flex-direction: column;
            text-align: center;
          }
          .hero-left {
            align-items: center;
            text-align: center;
          }
          .hero-title, .sub-tag, .sub-text {
            text-align: center;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-card {
            align-items: center;
          }
          .cta-heading { font-size: 2.4rem; }
        }

        @media (max-width: 600px) {
          .hero-title { font-size: 3.6rem; }
          .sub-text { font-size: 1.05rem; }
          .hero-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
