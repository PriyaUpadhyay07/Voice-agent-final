"use client";

import { useState } from "react";
import { PhoneCall, AlertTriangle, Mail, X, Loader2, CheckCircle2, Building2, User, Phone, MessageSquare } from "lucide-react";

interface PersonalizedDemoModalProps {
  onClose: () => void;
}

export default function PersonalizedDemoModal({ onClose }: PersonalizedDemoModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage("Please fill in all required fields marked with *");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim() || "N/A",
          topic: "Book a Personalised Demo Call",
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error("Demo modal submit error:", err);
      setErrorMessage("An unexpected error occurred. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content soft-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div className="modal-body">
            <div className="modal-badge badge-pill badge-lime">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Personalised AI Call Demo</span>
            </div>
            <h2 className="modal-title font-serif">Book a Personalised Demo Call</h2>
            <p className="modal-sub">
              Enter your contact & business details below. Founder <strong>Priya Upadhyay</strong> & the Lisa AI team will review your requirement and reach out with a tailored AI demo!
            </p>

            {errorMessage && (
              <div className="error-box">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="demo-form">
              <div className="form-group">
                <label className="form-label">
                  <User className="w-3.5 h-3.5 text-slate-500 inline mr-1" />
                  Your Name *
                </label>
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
                <label className="form-label">
                  <Mail className="w-3.5 h-3.5 text-slate-500 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="w-3.5 h-3.5 text-slate-500 inline mr-1" />
                  Mobile / Phone Number (With Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210 or +1 555 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 inline mr-1" />
                  Business Name / Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunshine Bakery / Horizon Lenders"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 inline mr-1" />
                  Describe Your Business & Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Example: We run an outpatient clinic / real estate agency and want Lisa AI to handle our outbound lead calling..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-lime submit-btn">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Book Demo Call</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-body success-body">
            <div className="success-icon">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="modal-title font-serif">Demo Request Submitted!</h2>
            <p className="modal-sub">
              Thank you, <strong>{name}</strong>! We have successfully received your demo request for <strong>{company || "your business"}</strong>.
            </p>

            <div className="success-info-card">
              <p className="info-text">
                Founder <strong>Priya Upadhyay</strong> & Lisa AI engineering team will review your requirements and get in touch with you at:
              </p>
              <div className="contact-details">
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Email:</strong> {email}</p>
              </div>
            </div>

            <button className="btn-lime close-modal-btn" onClick={onClose}>
              Done & Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: #FFFFFF;
          max-width: 520px;
          width: 100%;
          border-radius: 28px;
          padding: 32px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-height: 90vh;
          overflow-y: auto;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #F1F5F9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #E2E8F0;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-title {
          font-size: 1.85rem;
          color: #0F172A;
          margin-top: 2px;
          line-height: 1.15;
          font-weight: 700;
        }

        .modal-sub {
          color: #64748B;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .error-box {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 6px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #0F172A;
          display: flex;
          align-items: center;
        }

        .form-input, .form-textarea {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          color: #0F172A;
          transition: border-color 0.2s, background 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #0F172A;
          background: #FFFFFF;
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 14px;
        }

        .success-body {
          text-align: center;
          align-items: center;
          padding: 20px 10px;
        }

        .success-icon {
          width: 68px;
          height: 68px;
          background: #DCFCE7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .success-info-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px;
          width: 100%;
          text-align: left;
          margin: 10px 0;
        }

        .info-text {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.45;
        }

        .contact-details {
          margin-top: 10px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          color: #0F172A;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .close-modal-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-weight: 700;
          border-radius: 14px;
        }
      `}</style>
    </div>
  );
}
