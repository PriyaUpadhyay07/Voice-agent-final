"use client";

import { useState } from "react";

export interface TryDemoModalProps {
  onClose: () => void;
}

export default function TryDemoModal({ onClose }: TryDemoModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("Real Estate");
  const [callState, setCallState] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const [callLog, setCallLog] = useState<string[]>([]);

  const handleStartSimulatedCall = (e: React.FormEvent) => {
    e.preventDefault();
    setCallState("calling");
    setCallLog(["Dialing +1 (800) LISA-AI...", "Connecting to Vapi / SignalWire Telephony Gateway..."]);

    setTimeout(() => {
      setCallState("connected");
      setCallLog(prev => [
        ...prev,
        "Call Answered by Lead! Handshake complete.",
        `Lisa (AI): "Hello ${name || 'there'}! I'm Lisa calling from Lisa AI Voice Automation for ${businessType}. How are you doing today?"`
      ]);

      // Speech synthesis simulation
      if ("speechSynthesis" in window) {
        const text = `Hello ${name || 'there'}! I am Lisa calling from Lisa A I Voice Automation for ${businessType}. I am excited to demonstrate our automated outbound AI cold calling system!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }, 2500);
  };

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    setCallState("ended");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {callState === "idle" && (
          <>
            <div className="modal-header">
              <span className="badge">
                <span className="badge-dot"></span> Live Voice AI Simulation
              </span>
              <h3 className="modal-title">Try <span className="gradient-text">Lisa AI Live Demo</span></h3>
              <p className="modal-subtitle">Experience how Lisa AI sounds and responds in real-time during a cold call.</p>
            </div>

            <form onSubmit={handleStartSimulatedCall} className="demo-form">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Upadhyay"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (For Demo Record)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry / Business Type</label>
                <select 
                  value={businessType} 
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="form-input"
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="B2B SaaS">B2B SaaS</option>
                  <option value="Healthcare & Dental">Healthcare & Dental</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Financial Services">Financial Services</option>
                </select>
              </div>

              <button type="submit" className="btn-primary form-submit-btn" id="btn-start-live-demo-call">
                📞 Trigger Instant Demo Call
              </button>
            </form>
          </>
        )}

        {(callState === "calling" || callState === "connected") && (
          <div className="calling-view">
            <div className="caller-avatar pulse">
              🤖
            </div>
            <h3 className="calling-title">
              {callState === "calling" ? "Initiating AI Call..." : `Connected to Lisa (AI Agent)`}
            </h3>
            <span className="phone-num-display">{phone}</span>

            <div className="call-console">
              {callLog.map((log, i) => (
                <div key={i} className="log-line">{log}</div>
              ))}
            </div>

            <button className="btn-secondary hangup-btn" onClick={handleEndCall}>
              🔴 End Demo Call
            </button>
          </div>
        )}

        {callState === "ended" && (
          <div className="ended-view">
            <div className="ended-icon">✅</div>
            <h3>Demo Call Completed!</h3>
            <p>Lisa AI successfully demonstrated live cold call conversation logic and objection handling.</p>
            <button className="btn-primary" onClick={onClose}>
              Close Demo Window
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 36px;
          position: relative;
          background: #121622;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.4rem;
          cursor: pointer;
        }

        .modal-header {
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-top: 8px;
        }

        .modal-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
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

        .form-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary);
        }

        .form-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 6px;
        }

        .calling-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          padding: 20px 0;
        }

        .caller-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }

        .calling-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #fff;
        }

        .phone-num-display {
          color: var(--accent-cyan);
          font-family: monospace;
          font-size: 0.9rem;
        }

        .call-console {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 16px;
          text-align: left;
          font-family: monospace;
          font-size: 0.8rem;
          max-height: 150px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .log-line {
          color: var(--text-muted);
        }

        .hangup-btn {
          border-color: #ef4444;
          color: #ef4444;
        }

        .ended-view {
          text-align: center;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .ended-icon {
          font-size: 3rem;
        }
      `}</style>
    </div>
  );
}
