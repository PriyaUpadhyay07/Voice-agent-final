"use client";

import { useState, useEffect } from "react";

interface PersonalizedDemoModalProps {
  onClose: () => void;
}

export default function PersonalizedDemoModal({ onClose }: PersonalizedDemoModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "limit_reached">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Check if number has already used the demo call
  const checkCallLimit = (num: string) => {
    if (typeof window === "undefined") return false;
    const usedNumbers = JSON.parse(localStorage.getItem("lisa_demo_called_numbers") || "[]");
    return usedNumbers.includes(num.trim());
  };

  const handleStartCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setErrorMessage("Please enter a valid phone number with area code.");
      return;
    }

    if (checkCallLimit(phone)) {
      setCallState("limit_reached");
      return;
    }

    setErrorMessage("");
    setCallState("dialing");

    // Simulate dialing -> connecting flow
    setTimeout(() => {
      setCallState("connected");

      // Save number to localStorage to enforce 1-call limit
      const usedNumbers = JSON.parse(localStorage.getItem("lisa_demo_called_numbers") || "[]");
      usedNumbers.push(phone.trim());
      localStorage.setItem("lisa_demo_called_numbers", JSON.stringify(usedNumbers));

      // Build custom speech script based on business details
      const bName = businessName.trim() || "your business";
      const bDesc = businessDesc.trim() || "your products and special offers";
      const userName = name.trim() || "there";

      const dialogue = [
        `Ring... Ring... Call Connected!`,
        `Lisa AI: "Hi ${userName}! This is Lisa AI calling on behalf of ${bName}."`,
        `Lisa AI: "I was looking over your business details — ${bDesc}."`,
        `Lisa AI: "Our autonomous system handles all lead qualification, answers customer questions, and books appointments 24/7."`,
        `Lisa AI: "Priya Upadhyay (our founder) will set up your dedicated agent within 24 hours. Check your inbox for setup instructions!"`
      ];

      setTranscriptLines(dialogue);

      // Trigger Web Speech API speech synthesis if available
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const fullSpeech = `Hi ${userName}! This is Lisa AI calling on behalf of ${bName}. I noticed your business details: ${bDesc}. Our autonomous system handles lead calls, answers customer questions, and books calendar appointments automatically. Priya Upadhyay will set up your dedicated agent within 24 hours!`;
        const utterance = new SpeechSynthesisUtterance(fullSpeech);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    }, 2500);
  };

  const handleEndCall = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content soft-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleEndCall}>✕</button>

        {callState === "idle" && (
          <div className="modal-body">
            <div className="modal-badge badge-pill badge-lime">
              <span>📞 Live AI Call Generator</span>
            </div>
            <h2 className="modal-title font-serif">Book a Personalised Demo Call</h2>
            <p className="modal-sub">
              Give us your phone number and business details. Lisa AI will call your phone and speak a custom pitch tailored specifically to your business!
            </p>

            {errorMessage && <div className="error-box">{errorMessage}</div>}

            <form onSubmit={handleStartCall} className="demo-form">
              <div className="form-group">
                <label className="form-label">Your Name *</label>
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
                <label className="form-label">Your Phone Number (For 1-Time Demo Call) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
                <span className="field-note">⚠️ Limit: Strictly 1 demo call per phone number.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunshine Bakery / Horizon Lenders"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Describe Your Business & Offers *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Example: I run a bakery at xyz.com and we hold special Sunday sales on fresh cakes..."
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn-lime submit-btn">
                📞 Call Me Now (Trigger Personalised Demo)
              </button>
            </form>
          </div>
        )}

        {callState === "dialing" && (
          <div className="modal-body call-status-body">
            <div className="phone-pulse-icon animate-float">📞</div>
            <h2 className="modal-title font-serif">Dialing {phone}...</h2>
            <p className="modal-sub">Initiating secure SignalWire AI outbound connection to your phone...</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        {callState === "connected" && (
          <div className="modal-body call-status-body">
            <div className="live-call-badge">
              <span className="badge-dot"></span> LIVE DEMO CALL IN PROGRESS
            </div>
            <h2 className="modal-title font-serif">Lisa AI Connected!</h2>
            <p className="modal-sub">Listening to live personalised AI voice response...</p>

            <div className="live-transcript-box">
              {transcriptLines.map((line, idx) => (
                <p key={idx} className="transcript-line">{line}</p>
              ))}
            </div>

            <button className="btn-primary" onClick={handleEndCall}>
              Hang Up Call & Close
            </button>
          </div>
        )}

        {callState === "limit_reached" && (
          <div className="modal-body call-status-body">
            <div className="limit-icon">⚠️</div>
            <h2 className="modal-title font-serif">1-Call Limit Reached</h2>
            <p className="modal-sub">
              You have already received your 1 free demo call for number <strong>{phone}</strong>.
            </p>
            <p className="limit-desc">
              To setup Lisa AI for your business ($1,000 setup fee + 80 free mins), email founder <strong>Priya Upadhyay</strong> directly at:
            </p>
            <a href="mailto:priya@callwithlisa.in" className="email-btn btn-lime">
              ✉️ Email priya@callwithlisa.in
            </a>
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
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: #FFFFFF;
          max-width: 540px;
          width: 100%;
          border-radius: 28px;
          padding: 36px;
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
          font-size: 1rem;
          color: #0F172A;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .modal-title {
          font-size: 2.2rem;
          color: #0F172A;
          margin-top: 4px;
          line-height: 1.1;
        }

        .modal-sub {
          color: #64748B;
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .error-box {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.88rem;
        }

        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 10px;
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
        }

        .form-input, .form-textarea {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          padding: 10px 14px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          outline: none;
          color: #0F172A;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #0F172A;
          background: #FFFFFF;
        }

        .field-note {
          font-size: 0.75rem;
          color: #B45309;
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 10px;
        }

        .call-status-body {
          text-align: center;
          align-items: center;
          padding: 20px 0;
        }

        .phone-pulse-icon {
          font-size: 3.5rem;
          width: 80px;
          height: 80px;
          background: #C4F135;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px auto;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #E2E8F0;
          border-top-color: #0F172A;
          border-radius: 50%;
          animation: spin 1s infinite linear;
          margin-top: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .live-call-badge {
          background: #DCFCE7;
          color: #166534;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .live-transcript-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 18px;
          text-align: left;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .transcript-line {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.5;
        }

        .limit-icon {
          font-size: 3rem;
        }

        .limit-desc {
          font-size: 0.9rem;
          color: #475569;
        }

        .email-btn {
          width: 100%;
          justify-content: center;
          text-decoration: none;
          padding: 12px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
