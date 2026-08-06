"use client";

import { useState } from "react";

export interface VideoChapter {
  time: string;
  title: string;
  desc: string;
}

export default function VideoWalkthrough() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const chapters: VideoChapter[] = [
    { time: "0:00", title: "1. Upload Leads List", desc: "Upload CSV or sync Google Sheets with phone numbers in 1 click." },
    { time: "0:45", title: "2. Configure AI Persona & Script", desc: "Set custom objection handling rules, transfer numbers, and voice model." },
    { time: "1:30", title: "3. Launch Automated Campaign", desc: "Lisa initiates multi-line outbound AI cold calls simultaneously." },
    { time: "2:15", title: "4. Live Transcripts & Calendar Booking", desc: "Watch real-time sentiment analysis and direct Google Calendar booking." }
  ];

  return (
    <section id="video-walkthrough" className="video-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">
            <span className="badge-dot"></span> Step-By-Step Guide
          </span>
          <h2 className="section-title">
            Lisa AI <span className="gradient-text">Walkthrough Video</span>
          </h2>
          <p className="section-subtitle">
            See how Lisa AI places 100+ automated outbound calls per minute and books appointments directly to your calendar.
          </p>
        </div>

        <div className="video-container glass-card">
          {/* Main Video Display Screen */}
          <div className="video-screen">
            <div className={`screen-content ${isPlaying ? "playing" : ""}`}>
              <div className="screen-overlay">
                <span className="video-live-badge">📹 Walkthrough Preview: Chapter {activeChapterIndex + 1}</span>
                <h3 className="screen-title">{chapters[activeChapterIndex].title}</h3>
                <p className="screen-desc">{chapters[activeChapterIndex].desc}</p>
                
                <button 
                  className="big-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  id="btn-play-walkthrough-video"
                >
                  {isPlaying ? "⏸️ Pause Video" : "▶️ Play Walkthrough Video"}
                </button>
              </div>

              {/* Simulated Dynamic Background Graphics */}
              <div className="video-graphics">
                <div className="graphic-circle animate-float"></div>
                <div className="graphic-card glass-card">
                  <div className="status-line">
                    <span className="status-dot"></span> Call Status: Connected to Lead
                  </div>
                  <div className="waveform-line">
                    <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Sidebar */}
          <div className="video-chapters">
            <h4 className="chapters-title">🎬 Video Chapters</h4>
            <div className="chapters-list">
              {chapters.map((chap, idx) => (
                <button
                  key={idx}
                  className={`chapter-item ${activeChapterIndex === idx ? "active" : ""}`}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setIsPlaying(true);
                  }}
                  id={`video-chapter-${idx}`}
                >
                  <span className="chap-time">{chap.time}</span>
                  <div className="chap-text">
                    <span className="chap-title">{chap.title}</span>
                    <span className="chap-desc">{chap.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-section {
          padding: 80px 0;
        }

        .video-container {
          display: grid;
          grid-template-columns: 1fr 340px;
          overflow: hidden;
          padding: 0;
        }

        .video-screen {
          position: relative;
          min-height: 400px;
          background: linear-gradient(135deg, #0f111a 0%, #1a102f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .screen-content {
          width: 100%;
          height: 100%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .video-live-badge {
          display: inline-block;
          font-size: 0.8rem;
          color: var(--accent-cyan);
          font-weight: 700;
          margin-bottom: 12px;
        }

        .screen-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .screen-desc {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 500px;
          margin-bottom: 24px;
        }

        .big-play-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #fff;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
          padding: 16px 36px;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .big-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 45px rgba(236, 72, 153, 0.6);
        }

        .video-graphics {
          position: absolute;
          right: -20px;
          bottom: -20px;
          opacity: 0.4;
          pointer-events: none;
        }

        .graphic-circle {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
        }

        .graphic-card {
          position: absolute;
          bottom: 40px;
          right: 40px;
          padding: 16px;
          width: 220px;
        }

        .status-line {
          font-size: 0.75rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-emerald);
        }

        .waveform-line {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .waveform-line .bar {
          width: 4px;
          height: 20px;
          background: var(--primary-light);
          border-radius: 2px;
        }

        .video-chapters {
          background: rgba(0, 0, 0, 0.4);
          border-left: 1px solid var(--border-color);
          padding: 24px;
        }

        .chapters-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .chapters-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chapter-item {
          display: flex;
          gap: 12px;
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chapter-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--primary-light);
        }

        .chapter-item.active {
          background: rgba(139, 92, 246, 0.15);
          border-color: var(--primary);
        }

        .chap-time {
          font-family: monospace;
          color: var(--accent-cyan);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .chap-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chap-title {
          color: #fff;
          font-weight: 700;
          font-size: 0.88rem;
        }

        .chap-desc {
          color: var(--text-muted);
          font-size: 0.78rem;
          line-height: 1.3;
        }

        @media (max-width: 900px) {
          .video-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
