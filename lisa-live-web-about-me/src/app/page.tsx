"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Sparkles, PhoneCall, Scale } from "lucide-react";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import AudioDemo from "@/components/AudioDemo";
import FaqSection from "@/components/FaqSection";
import PersonalizedDemoModal from "@/components/PersonalizedDemoModal";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge badge-pill badge-lime animate-float">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Outbound Calling Agent</span>
          </div>

          <h1 className="hero-title font-serif">
            LISA AI
          </h1>

          <div className="hero-sub-block">
            <h2 className="sub-tag font-serif">Lisa AI</h2>
            <p className="sub-text">
              You bring the leads and the script — AI handles everything else by itself.
            </p>
          </div>

          <div className="hero-actions">
            <Link href="/contact" className="btn-primary">
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
            <a href="#why-us" className="btn-secondary">
              <Sparkles className="w-4 h-4" />
              <span>Why Choose Us</span>
            </a>
            <button 
              className="btn-lime"
              onClick={() => setDemoModalOpen(true)}
              id="btn-hero-personalised-demo"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book Personalised Demo</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
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

      {/* ELEVENLABS STYLE VOICE DEMO SECTION */}
      <AudioDemo />

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
              <Link href="/contact" className="btn-primary">
                <Mail className="w-4 h-4" />
                <span>Contact Priya (priya@callwithlisa.in)</span>
              </Link>
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
          padding: 70px 0 60px 0;
          text-align: center;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 900px;
        }

        .hero-title {
          font-size: 5.5rem;
          font-weight: 400;
          color: #0F172A;
          letter-spacing: -0.03em;
          margin: 20px 0 10px 0;
          line-height: 1;
        }

        .hero-sub-block {
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .sub-tag {
          font-size: 2.2rem;
          color: #0F172A;
          font-style: italic;
        }

        .sub-text {
          font-size: 1.25rem;
          color: #475569;
          max-width: 680px;
          line-height: 1.5;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 50px;
        }

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }

        .stat-card {
          padding: 24px 16px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-num {
          font-size: 2.2rem;
          color: #0F172A;
        }

        .stat-lbl {
          font-size: 0.82rem;
          color: #64748B;
          font-family: var(--font-body);
        }

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

        @media (max-width: 900px) {
          .hero-title { font-size: 3.8rem; }
          .sub-text { font-size: 1.1rem; }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-heading { font-size: 2.4rem; }
        }
      `}</style>
    </div>
  );
}
