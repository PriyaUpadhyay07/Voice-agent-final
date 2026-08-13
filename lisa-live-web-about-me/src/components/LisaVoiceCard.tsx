"use client";

import { useState, useEffect } from "react";
import { Mic, X, Sparkles } from "lucide-react";

export default function LisaVoiceCard() {
  const [closed, setClosed] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const scriptPhrases = [
    { prefix: "Hi! This is Lisa calling regarding your ", highlight: "outbound sales...", suffix: " Do you have 1 minute to chat?" },
    { prefix: "I help your business qualify leads and book ", highlight: "appointments...", suffix: " automatically 24/7." },
    { prefix: "You bring the leads and script — AI handles ", highlight: "everything else...", suffix: " completely by itself." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % scriptPhrases.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [scriptPhrases.length]);

  if (closed) {
    return (
      <button 
        onClick={() => setClosed(false)}
        className="reopen-card-btn"
        title="Reopen Lisa AI Demo Card"
      >
        <Sparkles className="w-4 h-4" />
        <span>Open Lisa AI Card</span>
      </button>
    );
  }

  const currentPhrase = scriptPhrases[textIndex];

  return (
    <div className="lisa-card-container">
      {/* BACKGROUND SHINY GLOWING ARC LINE / RAY */}
      <div className="shiny-background-arc"></div>

      {/* GLASSMORPHIC CARD */}
      <div className="lisa-glass-card">
        {/* TOP BAR */}
        <div className="card-top-bar">
          <div className="agent-status-tag">
            <span className="live-pulse-dot"></span>
            <span>Lisa AI Voice Active</span>
          </div>

          <button 
            className="card-close-btn" 
            onClick={() => setClosed(true)} 
            aria-label="Close card"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* DIALOGUE TEXT BOX */}
        <div className="card-speech-box">
          <p className="speech-text">
            <span>{currentPhrase.prefix}</span>
            <strong className="speech-highlight">{currentPhrase.highlight}</strong>
            <span>{currentPhrase.suffix}</span>
          </p>
        </div>

        {/* MIDDLE ANIMATED AUDIO SOUNDWAVES */}
        <div className="card-waves-container">
          <svg className="audio-wave-svg" viewBox="0 0 300 80" preserveAspectRatio="none">
            {/* Wave Layer 1 */}
            <path
              className="wave-path wave-path-1"
              d="M0,40 Q30,10 60,40 T120,40 T180,40 T240,40 T300,40"
            />
            {/* Wave Layer 2 */}
            <path
              className="wave-path wave-path-2"
              d="M0,40 Q40,65 80,40 T160,40 T240,40 T300,40"
            />
            {/* Wave Layer 3 (White Core) */}
            <path
              className="wave-path wave-path-3"
              d="M0,40 Q25,20 50,40 T100,40 T150,40 T200,40 T250,40 T300,40"
            />
          </svg>
        </div>

        {/* BOTTOM MIC BUTTON */}
        <div className="card-bottom-bar">
          <div className="mic-button-wrapper">
            <div className="mic-button-glow"></div>
            <button className="mic-circle-btn" aria-label="Mic Active">
              <Mic className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lisa-card-container {
          position: relative;
          width: 340px;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        /* BACKGROUND SHINY GLOWING ARC LINE / RAY SWEEPING BEHIND CARD */
        .shiny-background-arc {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-bottom-color: #C4F135;
          border-left-color: rgba(16, 185, 129, 0.6);
          filter: drop-shadow(0 0 18px rgba(196, 241, 53, 0.8));
          animation: arcRotateSweep 8s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes arcRotateSweep {
          0% {
            transform: rotate(0deg) scale(0.92);
            opacity: 0.7;
          }
          50% {
            transform: rotate(180deg) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(0.92);
            opacity: 0.7;
          }
        }

        /* GLASSMORPHIC CARD CONTAINER */
        .lisa-glass-card {
          position: relative;
          z-index: 2;
          width: 320px;
          height: 390px;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(196, 241, 53, 0.28);
          border-radius: 28px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(196, 241, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lisa-glass-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(196, 241, 53, 0.55);
          box-shadow: 
            0 30px 60px -15px rgba(0, 0, 0, 0.6),
            0 0 45px rgba(196, 241, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        /* TOP BAR */
        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .agent-status-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          background: rgba(255, 255, 255, 0.08);
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .live-pulse-dot {
          width: 7px;
          height: 7px;
          background: #C4F135;
          border-radius: 50%;
          box-shadow: 0 0 8px #C4F135;
          animation: dotPulse 1.5s infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }

        .card-close-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        /* SPEECH TEXT BOX */
        .card-speech-box {
          min-height: 90px;
          display: flex;
          align-items: center;
          padding: 8px 0;
        }

        .speech-text {
          color: rgba(255, 255, 255, 0.82);
          font-size: 1.05rem;
          line-height: 1.55;
          font-weight: 400;
          transition: all 0.3s ease;
        }

        .speech-highlight {
          color: #FFFFFF;
          font-weight: 700;
          background: linear-gradient(120deg, rgba(196, 241, 53, 0.3), rgba(196, 241, 53, 0.1));
          padding: 2px 6px;
          border-radius: 6px;
          box-shadow: 0 0 12px rgba(196, 241, 53, 0.3);
          border-bottom: 2px solid #C4F135;
        }

        /* AUDIO SOUNDWAVES */
        .card-waves-container {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .audio-wave-svg {
          width: 100%;
          height: 100%;
        }

        .wave-path {
          fill: none;
          stroke-linecap: round;
        }

        .wave-path-1 {
          stroke: rgba(196, 241, 53, 0.8);
          stroke-width: 2.5;
          animation: waveMotion1 2.5s ease-in-out infinite alternate;
        }

        .wave-path-2 {
          stroke: rgba(16, 185, 129, 0.7);
          stroke-width: 2;
          animation: waveMotion2 3s ease-in-out infinite alternate;
        }

        .wave-path-3 {
          stroke: #FFFFFF;
          stroke-width: 2.2;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
          animation: waveMotion3 2s ease-in-out infinite alternate;
        }

        @keyframes waveMotion1 {
          0% { d: path("M0,40 Q30,15 60,40 T120,40 T180,40 T240,40 T300,40"); }
          100% { d: path("M0,40 Q30,65 60,40 T120,40 T180,40 T240,40 T300,40"); }
        }

        @keyframes waveMotion2 {
          0% { d: path("M0,40 Q40,65 80,40 T160,40 T240,40 T300,40"); }
          100% { d: path("M0,40 Q40,15 80,40 T160,40 T240,40 T300,40"); }
        }

        @keyframes waveMotion3 {
          0% { d: path("M0,40 Q25,20 50,40 T100,40 T150,40 T200,40 T250,40 T300,40"); }
          100% { d: path("M0,40 Q25,60 50,40 T100,40 T150,40 T200,40 T250,40 T300,40"); }
        }

        /* BOTTOM MIC BUTTON */
        .card-bottom-bar {
          display: flex;
          justify-content: center;
          padding-top: 10px;
        }

        .mic-button-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mic-button-glow {
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(196, 241, 53, 0.4);
          filter: blur(10px);
          animation: micPulseGlow 2s ease-in-out infinite alternate;
        }

        @keyframes micPulseGlow {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.25); opacity: 0.9; }
        }

        .mic-circle-btn {
          position: relative;
          z-index: 2;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(196, 241, 53, 0.5);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .mic-circle-btn:hover {
          transform: scale(1.08);
          background: #C4F135;
        }

        .reopen-card-btn {
          background: #0F172A;
          color: #C4F135;
          border: 1px solid rgba(196, 241, 53, 0.4);
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.25s ease;
        }

        .reopen-card-btn:hover {
          background: #1E293B;
          transform: translateY(-2px);
        }

        @media (max-width: 960px) {
          .lisa-card-container {
            width: 300px;
            height: 380px;
          }
          .lisa-glass-card {
            width: 290px;
            height: 360px;
          }
          .shiny-background-arc {
            width: 360px;
            height: 360px;
          }
        }
      `}</style>
    </div>
  );
}
