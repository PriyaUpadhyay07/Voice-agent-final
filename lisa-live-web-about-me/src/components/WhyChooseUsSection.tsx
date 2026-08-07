"use client";

import { Check, Sparkles, Zap } from "lucide-react";

export default function WhyChooseUsSection() {
  const whyChooseUs = [
    { title: "Set up within 24 hours", desc: "Just fill a short form, we handle everything else." },
    { title: "Calls multiple leads at once", desc: "No queues, no waiting, instant outreach." },
    { title: "Works 24/7 non-stop", desc: "No breaks, no sick days, no missed leads." },
    { title: "Ultra cost-effective", desc: "Way cheaper than hiring and managing a human calling team." },
    { title: "Full call recordings & transcripts", desc: "100% transparency for every conversation." },
    { title: "Complete call history dashboard", desc: "Track every lead and every conversation in one place." },
    { title: "Instant lead intent tracking", desc: "Know immediately which leads said YES, NO, or need follow-up." },
    { title: "Instant script updates", desc: "Edit your script anytime with zero delay." },
  ];

  const whyWereDifferent = [
    { title: "No coding or complex setup", desc: "We build and configure it for you — not you." },
    { title: "Not a rigid fixed-script bot", desc: "Fully customizable — your words, your natural brand tone." },
    { title: "Instant script changes", desc: "Update your pitch immediately without waiting on support." },
    { title: "Fully managed service", desc: "Not a complicated DIY software platform; we manage it end-to-end." },
    { title: "Zero friction lead upload", desc: "You just upload leads via CSV or Google Sheets — rest is automated." },
    { title: "Rapid support turnaround", desc: "Any question or issue? Email us, resolved within 24-48 hours." },
  ];

  return (
    <section id="why-us" className="why-us-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill badge-lime">
            <Zap className="w-3.5 h-3.5" />
            <span>Unmatched Outbound Power</span>
          </div>
          <h2 className="section-title font-serif">Why Choose Lisa AI?</h2>
          <p className="section-subtitle">
            Designed specifically for lending, real estate, and high-volume outbound sales teams.
          </p>
        </div>

        {/* 2-Card Grid inspired by Tennis Training Cards */}
        <div className="cards-grid">
          {/* Card 1: Why Choose Us */}
          <div className="soft-card feature-card card-lime">
            <div className="card-header">
              <span className="card-badge badge-black">8 Core Reasons</span>
              <h3 className="card-title font-serif">Why Choose Us</h3>
              <p className="card-sub">Everything you need to automate outbound calling effortlessly.</p>
            </div>
            <ul className="reasons-list">
              {whyChooseUs.map((item, idx) => (
                <li key={idx} className="reason-item">
                  <span className="check-icon">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <div>
                    <strong>{item.title}</strong> — {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Why We're Different */}
          <div className="soft-card feature-card card-dark">
            <div className="card-header">
              <span className="card-badge badge-lime-pill">The Lisa AI Edge</span>
              <h3 className="card-title font-serif text-white">Why We&apos;re Different</h3>
              <p className="card-sub text-muted-dark">How we outpace generic DIY bot platforms.</p>
            </div>
            <ul className="reasons-list list-dark">
              {whyWereDifferent.map((item, idx) => (
                <li key={idx} className="reason-item">
                  <span className="star-icon">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <strong className="text-white">{item.title}</strong> — <span className="text-dim-dark">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-us-section {
          padding: 90px 0;
          background: #FDFCFC;
        }

        .section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 60px auto;
        }

        .section-title {
          font-size: 3.2rem;
          color: #0F172A;
          margin: 16px 0 12px 0;
          line-height: 1.1;
        }

        .section-subtitle {
          color: #475569;
          font-size: 1.1rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .feature-card {
          padding: 40px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .card-lime {
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
        }

        .card-dark {
          background: #0F172A;
          border: 1px solid #1E293B;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-badge {
          display: inline-block;
          width: fit-content;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .badge-black {
          background: #0F172A;
          color: #FFFFFF;
        }

        .badge-lime-pill {
          background: #C4F135;
          color: #0F172A;
        }

        .card-title {
          font-size: 2.5rem;
          color: #0F172A;
          line-height: 1.15;
        }

        .card-sub {
          color: #64748B;
          font-size: 0.95rem;
        }

        .text-white {
          color: #FFFFFF !important;
        }

        .text-muted-dark {
          color: #94A3B8 !important;
        }

        .text-dim-dark {
          color: #CBD5E1 !important;
        }

        .reasons-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reason-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.5;
        }

        .check-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #C4F135;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .star-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(196, 241, 53, 0.15);
          color: #C4F135;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 960px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .feature-card {
            padding: 28px;
          }
          .section-title {
            font-size: 2.4rem;
          }
          .card-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
