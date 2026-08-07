"use client";

import { useState } from "react";
import PersonalizedDemoModal from "./PersonalizedDemoModal";

export interface VoiceModel {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  gradient: string;
  sampleText: string;
}

export default function AudioDemo() {
  const [activeVoiceId, setActiveVoiceId] = useState<string>("conversational");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);

  const voices: VoiceModel[] = [
    {
      id: "conversational",
      name: "Lisa - Conversational Sales",
      category: "Outbound Sales",
      tagline: "Natural, engaging voice for cold lead qualification & appointment setting.",
      description: "Handles interruptions and objection handling smoothly with sub-600ms latency.",
      gradient: "radial-gradient(circle, #F59E0B 0%, #EF4444 60%, #881337 100%)",
      sampleText: "Hi! This is Lisa calling on behalf of your sales team. I noticed you inquired about our growth services — do you have 1 minute for a quick chat?"
    },
    {
      id: "real-estate",
      name: "Maya - Real Estate Specialist",
      category: "Real Estate",
      tagline: "Polished & friendly tone for buyer qualification & property tour bookings.",
      description: "Speaks naturally about property listings, pricing, and scheduling video walkthroughs.",
      gradient: "radial-gradient(circle, #10B981 0%, #06B6D4 60%, #1E3A8A 100%)",
      sampleText: "Hello! This is Maya from Apex Realty. I saw your request regarding modern 3-bedroom villas downtown. Are you looking to move in immediately or investing for yield?"
    },
    {
      id: "lending",
      name: "Alex - Business Loans & MCA",
      category: "Lending & Finance",
      tagline: "Professional, compliance-ready tone for commercial loan lead screening.",
      description: "TCPA-compliant introduction, pre-screens monthly revenue, and checks funding urgency.",
      gradient: "radial-gradient(circle, #8B5CF6 0%, #EC4899 60%, #4C1D95 100%)",
      sampleText: "Good morning! This is Alex with Commercial Capital. We help small businesses secure fast working capital up to $250,000. How much funding are you looking for?"
    },
    {
      id: "support",
      name: "Sarah - Customer Support",
      category: "Follow-Up & Support",
      tagline: "Warm, empathetic voice for post-call feedback & appointment confirmation.",
      description: "Reschedules missed appointments, confirms times, and gathers instant feedback.",
      gradient: "radial-gradient(circle, #3B82F6 0%, #6366F1 60%, #1E1B4B 100%)",
      sampleText: "Hi there! Sarah calling to confirm your appointment for tomorrow at 2:30 PM. Would you like me to keep this slot or adjust the timing for you?"
    }
  ];

  const activeVoice = voices.find(v => v.id === activeVoiceId) || voices[0];

  const handlePlayVoice = () => {
    if (typeof window === "undefined") return;

    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeVoice.sampleText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 4000);
    }
  };

  return (
    <section id="voices" className="voices-section">
      <div className="container">
        {/* ElevenLabs Style Title & Header */}
        <div className="section-header">
          <div className="badge-pill badge-lime">
            <span>🎙️ AI Voice Generator & Models</span>
          </div>
          <h2 className="section-title font-serif">Bringing Technology to Life</h2>
          <p className="section-subtitle">
            Experience ultra-realistic voice models tailored for conversational sales, lending outreach, and real estate.
          </p>
          <div className="header-cta-wrap">
            <button className="btn-primary" onClick={() => setDemoModalOpen(true)}>
              📞 Book a Personalised Demo Call
            </button>
          </div>
        </div>

        {/* ElevenLabs Style Main Box */}
        <div className="soft-card voices-card">
          {/* Top Voice Category Tabs */}
          <div className="voice-tabs">
            {voices.map((v) => (
              <button
                key={v.id}
                className={`voice-tab ${activeVoiceId === v.id ? "active" : ""}`}
                onClick={() => {
                  if (isPlaying && typeof window !== "undefined") window.speechSynthesis?.cancel();
                  setIsPlaying(false);
                  setActiveVoiceId(v.id);
                }}
              >
                <span className="tab-dot" style={{ background: v.gradient }}></span>
                {v.name.split("-")[0]}
              </button>
            ))}
          </div>

          {/* Main Visualizer Stage (Image 3 inspired) */}
          <div className="voice-stage">
            <div className="spheres-row">
              {voices.map((v) => {
                const isActive = v.id === activeVoiceId;
                return (
                  <div
                    key={v.id}
                    className={`sphere-wrapper ${isActive ? "active-sphere" : ""}`}
                    onClick={() => {
                      if (isPlaying && typeof window !== "undefined") window.speechSynthesis?.cancel();
                      setIsPlaying(false);
                      setActiveVoiceId(v.id);
                    }}
                  >
                    <div 
                      className={`voice-sphere ${isActive && isPlaying ? "pulsing-sphere" : ""}`}
                      style={{ background: v.gradient }}
                    >
                      {isActive && (
                        <button className="play-icon-btn" onClick={handlePlayVoice}>
                          {isPlaying ? "⏸" : "▶"}
                        </button>
                      )}
                    </div>
                    <span className="sphere-label">{v.category}</span>
                  </div>
                );
              })}
            </div>

            {/* Voice Details & Live Preview Box */}
            <div className="voice-details-box">
              <div className="voice-meta">
                <span className="voice-cat-badge">{activeVoice.category}</span>
                <h3 className="voice-name font-serif">{activeVoice.name}</h3>
                <p className="voice-tagline">{activeVoice.tagline}</p>
              </div>

              <div className="sample-text-box">
                <p className="sample-label">🎙️ Live AI Voice Script Preview:</p>
                <p className="sample-quote">&ldquo;{activeVoice.sampleText}&rdquo;</p>
              </div>

              <div className="voice-actions">
                <button className="btn-lime" onClick={handlePlayVoice}>
                  {isPlaying ? "⏸️ Pause Voice Audio" : "▶️ Listen Voice Sample"}
                </button>
                <button className="btn-secondary" onClick={() => setDemoModalOpen(true)}>
                  📞 Book Demo Call For Your Business
                </button>
              </div>
            </div>

            {/* Bottom Feature Tags (Image 3 style) */}
            <div className="feature-tags-row">
              <span className="ft-tag active-tag">AI Voice Generator</span>
              <span className="ft-tag">Text to Speech</span>
              <span className="ft-tag">TCPA Compliance</span>
              <span className="ft-tag">Google Sheets Sync</span>
              <span className="ft-tag">Voice Cloning</span>
              <span className="ft-tag">Call Recordings</span>
            </div>
          </div>
        </div>
      </div>

      {demoModalOpen && <PersonalizedDemoModal onClose={() => setDemoModalOpen(false)} />}

      <style jsx>{`
        .voices-section {
          padding: 90px 0;
          background: #FDFCFC;
        }

        .section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 50px auto;
        }

        .section-title {
          font-size: 3.5rem;
          color: #0F172A;
          margin: 16px 0 12px 0;
          line-height: 1.1;
        }

        .section-subtitle {
          color: #475569;
          font-size: 1.1rem;
          margin-bottom: 24px;
        }

        .header-cta-wrap {
          display: flex;
          justify-content: center;
        }

        .voices-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 32px;
          padding: 36px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
        }

        .voice-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 20px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .voice-tab {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 9999px;
          padding: 8px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-tab:hover {
          border-color: #0F172A;
          color: #0F172A;
        }

        .voice-tab.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        .tab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .voice-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .spheres-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .sphere-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .sphere-wrapper:hover {
          transform: translateY(-6px);
        }

        .voice-sphere {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
          position: relative;
          transition: all 0.3s ease;
        }

        .active-sphere .voice-sphere {
          transform: scale(1.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        .pulsing-sphere {
          animation: pulse-glow 1.5s infinite ease-in-out alternate;
        }

        @keyframes pulse-glow {
          0% { transform: scale(1.15); }
          100% { transform: scale(1.25); }
        }

        .play-icon-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.2rem;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .sphere-label {
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 500;
        }

        .voice-details-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 32px;
          max-width: 800px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: center;
        }

        .voice-cat-badge {
          background: #C4F135;
          color: #0F172A;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 9999px;
          display: inline-block;
        }

        .voice-name {
          font-size: 2.2rem;
          color: #0F172A;
          margin: 6px 0 2px 0;
        }

        .voice-tagline {
          color: #475569;
          font-size: 0.98rem;
        }

        .sample-text-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          text-align: left;
        }

        .sample-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .sample-quote {
          font-size: 1rem;
          color: #0F172A;
          font-style: italic;
          line-height: 1.6;
        }

        .voice-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .feature-tags-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .ft-tag {
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          color: #64748B;
          font-size: 0.82rem;
          padding: 6px 16px;
          border-radius: 9999px;
          font-weight: 500;
        }

        .active-tag {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        @media (max-width: 768px) {
          .section-title { font-size: 2.5rem; }
          .voices-card { padding: 20px; }
          .spheres-row { gap: 20px; }
          .voice-sphere { width: 85px; height: 85px; }
          .voice-name { font-size: 1.8rem; }
        }
      `}</style>
    </section>
  );
}
