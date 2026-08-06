"use client";

import { useState, useRef, useEffect } from "react";

export interface DemoSample {
  id: string;
  title: string;
  category: string;
  duration: string;
  speaker: string;
  transcript: { time: string; speaker: string; text: string }[];
}

export default function AudioDemo() {
  const [activeSampleId, setActiveSampleId] = useState<string>("real-estate");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const samples: DemoSample[] = [
    {
      id: "real-estate",
      title: "Real Estate Buyer Qualification",
      category: "Real Estate",
      duration: "0:45",
      speaker: "Lisa (AI Agent)",
      transcript: [
        { time: "0:02", speaker: "Lisa (AI)", text: "Hi! This is Lisa calling from Apex Realty. I noticed you recently inquired about modern 3-bedroom villas in Downtown. Is now a good time for a quick 1-minute chat?" },
        { time: "0:12", speaker: "Lead (John)", text: "Oh hi Lisa, yes I was looking at that property. What's the asking price?" },
        { time: "0:18", speaker: "Lisa (AI)", text: "Great question! The price starts at $450,000 with flexible payment plans. Are you looking to move in immediately, or investing for rental yield?" },
        { time: "0:30", speaker: "Lead (John)", text: "Looking for rental investment mainly." },
        { time: "0:35", speaker: "Lisa (AI)", text: "Perfect! I can schedule a quick 10-minute video tour with our senior investment advisor tomorrow at 3 PM or Friday at 11 AM. Which works best for you?" }
      ]
    },
    {
      id: "saas-booking",
      title: "B2B SaaS Demo Appointment Booking",
      category: "Software / B2B",
      duration: "0:38",
      speaker: "Lisa (AI Agent)",
      transcript: [
        { time: "0:02", speaker: "Lisa (AI)", text: "Hello! I'm Lisa from CloudScale Systems. We help sales teams automate their lead follow-ups. Would you be open to seeing how we cut response times by 80%?" },
        { time: "0:14", speaker: "Lead (Sarah)", text: "We already have a CRM system in place, so not really looking right now." },
        { time: "0:22", speaker: "Lisa (AI)", text: "I completely understand Sarah! We actually integrate directly into HubSpot and Salesforce in under 5 minutes without replacing your CRM. Should I send a 2-minute video preview to your email?" },
        { time: "0:32", speaker: "Lead (Sarah)", text: "Yeah, sure, send it over." }
      ]
    },
    {
      id: "healthcare",
      title: "Patient Appointment Confirmation",
      category: "Healthcare",
      duration: "0:32",
      speaker: "Lisa (AI Agent)",
      transcript: [
        { time: "0:02", speaker: "Lisa (AI)", text: "Good morning! This is Lisa from Dental Care Center calling to confirm your appointment scheduled for tomorrow at 2:30 PM with Dr. Miller." },
        { time: "0:12", speaker: "Lead (David)", text: "Ah thanks for calling! Can I reschedule to Thursday morning?" },
        { time: "0:18", speaker: "Lisa (AI)", text: "Of course David! I have Thursday morning open at 9:15 AM or 10:45 AM. Which one fits your schedule better?" }
      ]
    }
  ];

  const activeSample = samples.find(s => s.id === activeSampleId) || samples[0];

  // Speech synthesis fallback for audio demonstration
  const handlePlayToggle = () => {
    if (typeof window === "undefined") return;

    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentTime(0);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const fullSpeech = activeSample.transcript.map(t => `${t.speaker}: ${t.text}`).join(". ");
      const utterance = new SpeechSynthesisUtterance(fullSpeech);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
  };

  return (
    <section id="audio-demo" className="audio-demo-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">
            <span className="badge-dot"></span> Interactive Audio Samples
          </span>
          <h2 className="section-title">
            Listen to <span className="gradient-text">Lisa AI Cold Calls</span>
          </h2>
          <p className="section-subtitle">
            Experience ultra-realistic human pitch, natural pauses, and instant objection handling in action.
          </p>
        </div>

        <div className="audio-demo-wrapper glass-card">
          {/* Sample Category Tabs */}
          <div className="sample-tabs">
            {samples.map(sample => (
              <button
                key={sample.id}
                className={`sample-tab ${activeSampleId === sample.id ? "active" : ""}`}
                onClick={() => {
                  if (isPlaying) window.speechSynthesis?.cancel();
                  setIsPlaying(false);
                  setActiveSampleId(sample.id);
                }}
                id={`sample-tab-${sample.id}`}
              >
                <span className="tab-category">{sample.category}</span>
                <span className="tab-title">{sample.title}</span>
              </button>
            ))}
          </div>

          {/* Player Main Area */}
          <div className="player-main">
            <div className="player-header">
              <div className="player-info">
                <span className="playing-badge">{activeSample.category}</span>
                <h3 className="sample-name">{activeSample.title}</h3>
                <span className="speaker-name">🎙️ Agent: {activeSample.speaker}</span>
              </div>

              {/* Play Button */}
              <button 
                className="play-btn"
                onClick={handlePlayToggle}
                id="btn-play-audio-sample"
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Listen Audio Demo"}
              </button>
            </div>

            {/* Waveform Visualization */}
            <div className="waveform-container">
              <div className={`wave-bars ${isPlaying ? "playing" : ""}`}>
                {Array.from({ length: 32 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="wave-bar" 
                    style={{ 
                      animationDelay: `${(i % 5) * 0.2}s`,
                      height: isPlaying ? `${Math.floor(Math.random() * 35) + 10}px` : "12px"
                    }} 
                  />
                ))}
              </div>
              <span className="duration-label">{isPlaying ? "Live Audio Playing..." : `Duration: ${activeSample.duration}`}</span>
            </div>

            {/* Live Transcript View */}
            <div className="transcript-box">
              <h4 className="transcript-heading">💬 Call Transcript</h4>
              <div className="transcript-list">
                {activeSample.transcript.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`transcript-item ${line.speaker.includes("AI") ? "ai-speaker" : "lead-speaker"}`}
                  >
                    <span className="timestamp">{line.time}</span>
                    <div className="msg-content">
                      <strong className="speaker-label">{line.speaker}:</strong>
                      <p className="speaker-text">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .audio-demo-section {
          padding: 80px 0;
        }

        .audio-demo-wrapper {
          display: grid;
          grid-template-columns: 300px 1fr;
          overflow: hidden;
          padding: 0;
        }

        .sample-tabs {
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .sample-tab {
          padding: 20px;
          text-align: left;
          background: none;
          border: none;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sample-tab:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
        }

        .sample-tab.active {
          background: rgba(139, 92, 246, 0.12);
          border-left: 4px solid var(--primary);
          color: #fff;
        }

        .tab-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-light);
          font-weight: 700;
        }

        .tab-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .player-main {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .playing-badge {
          display: inline-block;
          font-size: 0.75rem;
          background: rgba(236, 72, 153, 0.15);
          color: var(--secondary);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 700;
          margin-bottom: 8px;
        }

        .sample-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }

        .speaker-name {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .play-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #fff;
          font-family: var(--font-heading);
          font-weight: 700;
          padding: 14px 28px;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-glow);
          white-space: nowrap;
        }

        .play-btn:hover {
          transform: scale(1.05);
        }

        .waveform-container {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .wave-bars {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 45px;
          flex: 1;
        }

        .duration-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .transcript-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
        }

        .transcript-heading {
          font-size: 1rem;
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .transcript-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 240px;
          overflow-y: auto;
        }

        .transcript-item {
          display: flex;
          gap: 12px;
          font-size: 0.9rem;
          padding: 10px;
          border-radius: var(--radius-sm);
        }

        .transcript-item.ai-speaker {
          background: rgba(139, 92, 246, 0.08);
          border-left: 3px solid var(--primary);
        }

        .transcript-item.lead-speaker {
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid var(--accent-cyan);
        }

        .timestamp {
          font-family: monospace;
          color: var(--text-dim);
          font-size: 0.8rem;
        }

        .msg-content {
          display: flex;
          flex-direction: column;
        }

        .speaker-label {
          color: var(--text-main);
          font-size: 0.85rem;
        }

        .speaker-text {
          color: var(--text-muted);
        }

        @media (max-width: 850px) {
          .audio-demo-wrapper {
            grid-template-columns: 1fr;
          }
          .sample-tabs {
            flex-direction: row;
            overflow-x: auto;
          }
          .player-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
