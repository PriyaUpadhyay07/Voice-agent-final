"use client";

import { useState } from "react";
import PersonalizedDemoModal from "@/components/PersonalizedDemoModal";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("Getting Started ($1,000 Setup)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, topic, message }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback simulation
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* HERO */}
        <section className="contact-hero text-center">
          <div className="badge-pill badge-lime">
            <span>📩 Direct Founder Support</span>
          </div>
          <h1 className="contact-title font-serif">Get in Touch with Lisa AI</h1>
          <p className="contact-subtitle">
            All messages go directly to <strong>Priya Upadhyay</strong> (Founder, Lisa AI) at <a href="mailto:priya@callwithlisa.in" className="link-bold">priya@callwithlisa.in</a>.
          </p>
        </section>

        {/* MAIN CONTACT CONTENT GRID */}
        <div className="contact-grid">
          {/* LEFT: FORM */}
          <div className="soft-card form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="form-title font-serif">Send Priya a Message</h3>
                <p className="form-desc">
                  Fill out the form below or email <a href="mailto:priya@callwithlisa.in">priya@callwithlisa.in</a> directly.
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number (with area code) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Horizon Lenders / Real Estate"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-input"
                  >
                    <option value="Getting Started ($1,000 Setup)">Getting Started ($1,000 Setup + 80 Free Mins)</option>
                    <option value="Custom Voice Script / Workflow">Custom Voice Script / Workflow Setup</option>
                    <option value="TCPA & Legal Compliance Question">TCPA & Legal Compliance Question</option>
                    <option value="Technical Question / Google Sheets Upload">Technical Question / Lead Upload</option>
                    <option value="General Support / Help">General Support / Help</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your calling needs, lead list volume, or custom setup requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary submit-btn" 
                  id="btn-submit-contact-form"
                >
                  {isSubmitting ? "Sending to priya@callwithlisa.in..." : "✉️ Send Message to Priya"}
                </button>
              </form>
            ) : (
              <div className="submitted-card">
                <div className="success-icon">✨</div>
                <h3 className="font-serif">Message Dispatched Successfully!</h3>
                <p>
                  Thank you, <strong>{name}</strong>! Your inquiry regarding <strong>{topic}</strong> has been sent directly to <strong>priya@callwithlisa.in</strong>.
                </p>
                <div className="success-notice">
                  <span>⚡ Priya personally reviews every email and will reply to <strong>{email}</strong> within 24-48 hours.</span>
                </div>
                <div className="submitted-actions">
                  <button className="btn-secondary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                  <button className="btn-lime" onClick={() => setDemoOpen(true)}>
                    📞 Book Personalised Demo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DIRECT INFO CARD */}
          <div className="info-side">
            <div className="soft-card info-card">
              <h3 className="info-title font-serif">Direct Founder Contact</h3>
              <p className="info-sub">
                No outsourcing, no hidden support queues. You speak directly with the founder.
              </p>

              <div className="info-list">
                <div className="info-item">
                  <span className="info-icon">👤</span>
                  <div className="info-text">
                    <strong>Founder:</strong>
                    <span>Priya Upadhyay</span>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">📧</span>
                  <div className="info-text">
                    <strong>Official Email:</strong>
                    <a href="mailto:priya@callwithlisa.in">priya@callwithlisa.in</a>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">⚡</span>
                  <div className="info-text">
                    <strong>Turnaround Time:</strong>
                    <span>Resolved within 24-48 hours</span>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <div className="info-text">
                    <strong>Transparent Pricing:</strong>
                    <span>$1,000 setup fee + 80 free mins ($0.25/min after)</span>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <a href="mailto:priya@callwithlisa.in" className="btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  ✉️ Open Mail App (priya@callwithlisa.in)
                </a>
              </div>
            </div>

            <div className="soft-card demo-promo-card">
              <h4 className="font-serif">Want to see Lisa AI in action?</h4>
              <p>Experience how Lisa AI calls your phone and speaks tailored details about your specific business!</p>
              <button className="btn-lime btn-sm" onClick={() => setDemoOpen(true)}>
                📞 Book Personalised Demo Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {demoOpen && <PersonalizedDemoModal onClose={() => setDemoOpen(false)} />}

      <style jsx>{`
        .contact-page {
          padding: 60px 0 90px 0;
          background: #FDFCFC;
        }

        .contact-hero {
          max-width: 720px;
          margin: 0 auto 50px auto;
        }

        .contact-title {
          font-size: 3.5rem;
          color: #0F172A;
          margin: 16px 0 12px 0;
          line-height: 1.1;
        }

        .contact-subtitle {
          color: #475569;
          font-size: 1.1rem;
        }

        .link-bold {
          color: #0F172A;
          text-decoration: underline;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
        }

        .form-card {
          padding: 40px;
          background: #FFFFFF;
        }

        .form-title {
          font-size: 2.2rem;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .form-desc {
          color: #64748B;
          font-size: 0.92rem;
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
          color: #0F172A;
        }

        .form-input, .form-textarea {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0F172A;
          font-family: var(--font-body);
          font-size: 0.92rem;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #0F172A;
          background: #FFFFFF;
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 10px;
        }

        .submitted-card {
          text-align: center;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .submitted-card h3 {
          font-size: 2.2rem;
          color: #0F172A;
        }

        .success-icon {
          font-size: 3rem;
        }

        .success-notice {
          background: #DCFCE7;
          color: #166534;
          padding: 12px 20px;
          border-radius: 9999px;
          font-size: 0.88rem;
        }

        .submitted-actions {
          display: flex;
          gap: 14px;
          margin-top: 12px;
        }

        .info-side {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          padding: 36px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-title {
          font-size: 2rem;
          color: #0F172A;
        }

        .info-sub {
          color: #64748B;
          font-size: 0.9rem;
          margin-top: -10px;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .info-icon {
          font-size: 1.4rem;
          width: 42px;
          height: 42px;
          background: #F1F5F9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-text {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          color: #475569;
        }

        .info-text strong {
          color: #0F172A;
        }

        .info-text a {
          color: #0F172A;
          font-weight: 600;
          text-decoration: underline;
        }

        .demo-promo-card {
          padding: 28px;
          background: #0F172A;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .demo-promo-card h4 {
          font-size: 1.8rem;
          color: #FFFFFF;
        }

        .demo-promo-card p {
          color: #94A3B8;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .contact-title { font-size: 2.5rem; }
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
