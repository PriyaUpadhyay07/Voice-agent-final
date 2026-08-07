"use client";

import { useState } from "react";
import { HelpCircle, ShieldCheck } from "lucide-react";

interface FAQItem {
  id: number;
  category: string;
  q: string;
  a: string;
}

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const faqs: FAQItem[] = [
    // About you / trust building
    {
      id: 1,
      category: "Founder & Setup",
      q: "Who's behind Lisa AI?",
      a: "Hi, I'm Priya Upadhyay, founder of Lisa AI. I personally set up and manage every client's calling agent — no big team, no outsourcing, just me making sure it works for you."
    },
    {
      id: 2,
      category: "Founder & Setup",
      q: "How does setup actually work?",
      a: "You fill a short form telling us about your business and what you need. I personally set up your custom AI calling agent using that information — within 24 hours."
    },

    // Product/functionality
    {
      id: 3,
      category: "Product & Calling",
      q: "Do I need any technical knowledge to use this?",
      a: "No, everything is set up for you."
    },
    {
      id: 4,
      category: "Product & Calling",
      q: "Can I change my calling script later?",
      a: "Yes, anytime, instantly."
    },
    {
      id: 5,
      category: "Product & Calling",
      q: "How many calls can it make at once?",
      a: "Multiple leads at the same time, no queues."
    },
    {
      id: 6,
      category: "Product & Calling",
      q: "Will I be able to see call recordings and transcripts?",
      a: "Yes, full visibility — every call, every conversation."
    },
    {
      id: 7,
      category: "Product & Calling",
      q: "How do I know which leads are interested?",
      a: "On your dashboard → in 'History section' → shows exactly which leads said yes, no, or need follow-up."
    },

    // Trust/compliance (important for lending industry)
    {
      id: 8,
      category: "TCPA & Legal",
      q: "Is this legal / TCPA compliant?",
      a: "Yes — we prioritize TCPA compliance and strict consent protocols. We strongly recommend using your own consent-verified lead lists. Lisa AI is a technology tool provider and supports automated DNC scrubbing and recording disclosures."
    },
    {
      id: 9,
      category: "Target Industries",
      q: "What kind of businesses is this built for?",
      a: "Business loan companies, SBA lenders, MCA companies, commercial lenders, real estate, and more."
    },

    // Pricing/practical
    {
      id: 10,
      category: "Pricing & Billing",
      q: "How much does it cost?",
      a: "One-time setup fee of $1,000 (includes 80 free calling minutes). After that, it's pay-as-you-go — $0.25/minute, no monthly contracts."
    },
    {
      id: 11,
      category: "Support & Help",
      q: "What if something goes wrong or I need help?",
      a: "Email us directly at priya@callwithlisa.in — resolved in 24-48 hours."
    },
    {
      id: 12,
      category: "Lead Management",
      q: "Do I need to upload leads myself?",
      a: "Yes — just upload via CSV or Google Sheets, rest is automatic."
    },

    // Extra Bonus FAQs
    {
      id: 13,
      category: "Advanced Features",
      q: "Can Lisa AI transfer interested leads live to my phone line?",
      a: "Yes! When Lisa AI detects a high-intent prospect during a call, she can instantly bridge and warm-transfer the prospect live to your or your sales team's phone."
    },
    {
      id: 14,
      category: "Advanced Features",
      q: "How natural does the AI voice sound during objection handling?",
      a: "Lisa AI runs on sub-600ms latency voice models that replicate human speech pauses, tone shifts, and natural conversational cadence seamlessly."
    }
  ];

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill badge-lime">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparency & Trust</span>
          </div>
          <h2 className="section-title font-serif">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about Lisa AI setup, TCPA compliance, pricing, and how we operate.
          </p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`faq-item ${isOpen ? "open" : ""}`}
                onClick={() => toggleAccordion(faq.id)}
              >
                <div className="faq-item-header">
                  <div className="faq-title-wrap">
                    <span className="faq-cat">{faq.category}</span>
                    <h3 className="faq-question">{faq.q}</h3>
                  </div>
                  <span className="toggle-icon">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="faq-item-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 90px 0;
          background: #FDFCFC;
        }

        .section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 50px auto;
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

        .faq-accordion-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px 28px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .faq-item:hover {
          border-color: #CBD5E1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .faq-item.open {
          border-color: #0F172A;
          background: #FFFFFF;
        }

        .faq-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .faq-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .faq-cat {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748B;
        }

        .faq-question {
          font-size: 1.15rem;
          font-weight: 600;
          color: #0F172A;
          margin: 0;
          line-height: 1.4;
          font-family: var(--font-body);
        }

        .toggle-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .faq-item-body {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.4rem; }
          .faq-item { padding: 18px 20px; }
          .faq-question { font-size: 1.05rem; }
        }
      `}</style>
    </section>
  );
}
