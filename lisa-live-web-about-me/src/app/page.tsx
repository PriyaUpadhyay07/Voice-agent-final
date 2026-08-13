"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, PhoneCall, Scale, Zap, Volume2 } from "lucide-react";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FaqSection from "@/components/FaqSection";
import PersonalizedDemoModal from "@/components/PersonalizedDemoModal";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="home-page">
      {/* HERO SECTION WITH LEFT ALIGNMENT & ANIMATED GREEN VOICE ORB */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* LEFT COLUMN: TEXT CONTENT & ACTIONS */}
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

            {/* Strictly 2 Action Buttons as requested */}
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

          {/* RIGHT COLUMN: ANIMATED GLOWING GREEN VOICE CIRCLE (VOICE ORB) */}
          <div className="hero-right">
            <div className="voice-orb-container">
              {/* Outer Pulsating Audio Wave Rings */}
              <div className="wave-ring ring-1"></div>
              <div className="wave-ring ring-2"></div>
              <div className="wave-ring ring-3"></div>

              {/* Dynamic Sound Frequency Bars Orbit */}
              <div className="equalizer-ring">
                <span className="eq-bar bar-1"></span>
                <span className="eq-bar bar-2"></span>
                <span className="eq-bar bar-3"></span>
                <span className="eq-bar bar-4"></span>
                <span className="eq-bar bar-5"></span>
                <span className="eq-bar bar-6"></span>
                <span className="eq-bar bar-7"></span>
                <span className="eq-bar bar-8"></span>
              </div>

              {/* Central Glowing Voice Sphere */}
              <div className="glowing-orb">
                <div className="orb-inner-core">
                  <Volume2 className="w-10 h-10 text-slate-950 animate-pulse" />
                </div>
                <div className="orb-ambient-glow"></div>
              </div>

              {/* Live Voice Status Pill */}
              <div className="voice-status-pill">
                <span className="pulse-dot"></span>
                <span>Lisa AI Voice Active 24/7</span>
              </div>
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
          text-align: left;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-title {
          font-size: 5.2rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.03em;
          margin: 0 0 10px 0;
          line-height: 1;
          text-align: left;
        }

        .hero-sub-block {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          text-align: left;
        }

        .sub-tag {
          font-size: 2.2rem;
          color: #0F172A;
          font-weight: 700;
          text-align: left;
        }

        .sub-text {
          font-size: 1.2rem;
          color: #475569;
          max-width: 580px;
          line-height: 1.5;
          text-align: left;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-bottom: 44px;
        }

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 580px;
        }

        .stat-card {
          padding: 20px 18px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
        }

        .stat-num {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        .stat-lbl {
          font-size: 0.82rem;
          color: #64748B;
          font-family: var(--font-body);
        }

        /* HERO RIGHT: GLOWING GREEN ANIMATED VOICE ORB */
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .voice-orb-container {
          position: relative;
          width: 380px;
          height: 380px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Concentric Pulsating Rings */
        .wave-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(196, 241, 53, 0.4);
          animation: wavePulse 4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          pointer-events: none;
        }

        .ring-1 {
          width: 220px;
          height: 220px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 300px;
          height: 300px;
          animation-delay: 1.3s;
          border-color: rgba(196, 241, 53, 0.25);
        }

        .ring-3 {
          width: 370px;
          height: 370px;
          animation-delay: 2.6s;
          border-color: rgba(196, 241, 53, 0.15);
        }

        @keyframes wavePulse {
          0% {
            transform: scale(0.75);
            opacity: 0.9;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.18);
            opacity: 0;
          }
        }

        /* Equalizer Soundwave Bars */
        .equalizer-ring {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: orbRotate 20s linear infinite;
        }

        .eq-bar {
          position: absolute;
          width: 6px;
          background: #C4F135;
          border-radius: 9999px;
          box-shadow: 0 0 10px rgba(196, 241, 53, 0.8);
          animation: barBounce 1.4s ease-in-out infinite alternate;
        }

        .bar-1 { height: 35px; transform: rotate(0deg) translateY(-120px); animation-delay: 0.1s; }
        .bar-2 { height: 45px; transform: rotate(45deg) translateY(-120px); animation-delay: 0.3s; }
        .bar-3 { height: 28px; transform: rotate(90deg) translateY(-120px); animation-delay: 0.5s; }
        .bar-4 { height: 50px; transform: rotate(135deg) translateY(-120px); animation-delay: 0.2s; }
        .bar-5 { height: 32px; transform: rotate(180deg) translateY(-120px); animation-delay: 0.6s; }
        .bar-6 { height: 42px; transform: rotate(225deg) translateY(-120px); animation-delay: 0.4s; }
        .bar-7 { height: 36px; transform: rotate(270deg) translateY(-120px); animation-delay: 0.7s; }
        .bar-8 { height: 48px; transform: rotate(315deg) translateY(-120px); animation-delay: 0.25s; }

        @keyframes barBounce {
          0% { height: 20px; opacity: 0.4; }
          100% { height: 55px; opacity: 1; }
        }

        @keyframes orbRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Central Glowing Orb Core */
        .glowing-orb {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #E2FF75 0%, #C4F135 45%, #10B981 85%, #0F172A 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 
            0 0 50px rgba(196, 241, 53, 0.65),
            0 0 100px rgba(16, 185, 129, 0.35),
            inset 0 0 20px rgba(255, 255, 255, 0.8);
          animation: orbGlow 3s ease-in-out infinite alternate;
          z-index: 2;
        }

        .orb-inner-core {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #C4F135;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.3);
        }

        .orb-ambient-glow {
          position: absolute;
          inset: -15px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196, 241, 53, 0.4) 0%, transparent 70%);
          filter: blur(12px);
          z-index: -1;
          animation: ambientPulse 2.5s ease-in-out infinite alternate;
        }

        @keyframes orbGlow {
          0% {
            transform: scale(0.96);
            box-shadow: 0 0 40px rgba(196, 241, 53, 0.5), 0 0 80px rgba(16, 185, 129, 0.25);
          }
          100% {
            transform: scale(1.04);
            box-shadow: 0 0 70px rgba(196, 241, 53, 0.85), 0 0 120px rgba(16, 185, 129, 0.5);
          }
        }

        @keyframes ambientPulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.15); }
        }

        /* Status Pill Below Orb */
        .voice-status-pill {
          position: absolute;
          bottom: 0px;
          background: #0F172A;
          color: #FFFFFF;
          border: 1px solid rgba(196, 241, 53, 0.5);
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 3;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #C4F135;
          border-radius: 50%;
          box-shadow: 0 0 8px #C4F135;
          animation: dotPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes dotPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
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
          .hero-container {
            grid-template-columns: 1fr;
            gap: 40px;
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
            max-width: 100%;
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
          .voice-orb-container { width: 300px; height: 300px; }
          .ring-3 { display: none; }
        }
      `}</style>
    </div>
  );
}
