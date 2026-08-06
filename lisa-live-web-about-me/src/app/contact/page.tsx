"use client";

import { useState } from "react";
import SocialLinks from "@/components/SocialLinks";
import FeedbackModal from "@/components/FeedbackModal";
import TryDemoModal from "@/components/TryDemoModal";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("Sales & Enterprise Plan");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "How fast can Lisa AI be integrated into our sales workflow?",
      a: "Lisa AI can be set up in under 5 minutes. Simply upload your leads list via CSV or sync Google Sheets, configure your voice script, and launch outbound calling immediately."
    },
    {
      q: "Does Lisa AI support multi-tenant data isolation?",
      a: "Yes! Every account is secured via Supabase Row Level Security (RLS). Each client can only access their own leads, campaigns, and audio call logs."
    },
    {
      q: "Can I try a demo call before purchasing credits?",
      a: "Absolutely! You can use our interactive Live Voice Demo modal on this website to test Lisa AI in real-time."
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        {/* HERO */}
        <section className="contact-hero text-center">
          <span className="badge">
            <span className="badge-dot"></span> Get In Touch
          </span>
          <h1 className="contact-title">
            Let's Talk About Your <br />
            <span className="gradient-text">AI Voice Automation Needs</span>
          </h1>
          <p className="contact-subtitle">
            Whether you want a custom voice model, high-volume enterprise plan, or technical integration help, our team is here for you 24/7.
          </p>
        </section>

        {/* MAIN CONTACT CONTENT GRID */}
        <div className="contact-grid">
          {/* LEFT: FORM */}
          <div className="form-card glass-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="form-title">📩 Send Us a Message</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Upadhyay"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      placeholder="Apex Realty / SaaS Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-input"
                  >
                    <option value="Sales & Enterprise Plan">Sales & Enterprise Plan</option>
                    <option value="Custom Voice Model / Script">Custom Voice Model / Script</option>
                    <option value="API Integration & SignalWire">API Integration & SignalWire</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your team size, expected call volume, or specific requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-primary submit-btn" id="btn-submit-contact-form">
                  🚀 Send Inquiry Message
                </button>
              </form>
            ) : (
              <div className="submitted-card">
                <div className="success-icon">✨</div>
                <h3>Message Sent Successfully!</h3>
                <p>
                  Thank you, <strong>{name}</strong>! We received your message regarding <strong>{topic}</strong>. Our voice team will respond to <strong>{email}</strong> within 2 hours.
                </p>
                <div className="submitted-actions">
                  <button className="btn-primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                  <button className="btn-secondary" onClick={() => setDemoOpen(true)}>
                    ⚡ Try Live Demo Call
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CONTACT INFO & CARDS */}
          <div className="info-side">
            {/* DIRECT INFO CARD */}
            <div className="info-card glass-card">
              <h3 className="info-title">📍 Direct Contact Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div className="info-text">
                    <strong>Email Support:</strong>
                    <a href="mailto:support@lisaai.com">support@lisaai.com</a>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <div className="info-text">
                    <strong>Toll-Free Phone:</strong>
                    <a href="tel:+18005472241">+1 (800) 547-2241</a>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">💬</span>
                  <div className="info-text">
                    <strong>WhatsApp Support:</strong>
                    <a href="https://wa.me/18005472241" target="_blank" rel="noopener noreferrer">
                      Instant WhatsApp Chat
                    </a>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button className="btn-secondary btn-sm" onClick={() => setFeedbackOpen(true)}>
                  💬 Submit Feedback
                </button>
                <button className="btn-primary btn-sm" onClick={() => setDemoOpen(true)}>
                  ⚡ Live Demo
                </button>
              </div>
            </div>

            {/* SOCIAL LINKS PILLS */}
            <div className="socials-box glass-card">
              <h4 className="socials-box-title">Follow Lisa AI Official Channels</h4>
              <SocialLinks variant="horizontal" />
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="faq-section">
          <div className="section-header">
            <span className="badge">
              <span className="badge-dot"></span> Got Questions?
            </span>
            <h2 className="section-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-card glass-card">
                <h4 className="faq-q">❓ {faq.q}</h4>
                <p className="faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      {demoOpen && <TryDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .contact-page {
          padding: 60px 0;
        }

        .contact-hero {
          max-width: 750px;
          margin: 0 auto 50px auto;
        }

        .contact-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 16px 0;
        }

        .contact-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          margin-bottom: 80px;
        }

        .form-card {
          padding: 40px;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 24px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-input, .form-textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: var(--primary);
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
        }

        .submitted-card {
          text-align: center;
          padding: 30px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          font-size: 3.5rem;
        }

        .submitted-actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .info-side {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-title {
          font-size: 1.25rem;
          color: #fff;
          font-weight: 700;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .info-icon {
          font-size: 1.8rem;
          width: 45px;
          height: 45px;
          background: rgba(139, 92, 246, 0.12);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-text {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .info-text strong {
          color: #fff;
        }

        .info-text a {
          color: var(--primary-light);
          text-decoration: none;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }

        .socials-box {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .socials-box-title {
          font-size: 1rem;
          color: #fff;
        }

        .faq-section {
          margin-top: 60px;
        }

        .faq-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-card {
          padding: 24px;
        }

        .faq-q {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .faq-a {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .contact-title { font-size: 2.3rem; }
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
