"use client";

import { useState } from "react";

export default function PdfViewerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const pdfPages = [
    {
      page: 1,
      title: "Lisa AI - Executive Overview & Architecture",
      subtitle: "The Autonomous Outbound AI Voice Sales Agent",
      content: [
        "• Built on sub-100ms ultra-low latency voice synthesis and real-time LLM reasoning.",
        "• Native integrations with Vapi, SignalWire, Twilio, Supabase, and HubSpot.",
        "• Compliant with international telecommunications and TCPA regulations."
      ]
    },
    {
      page: 2,
      title: "Core System Capabilities & Performance Benchmarks",
      subtitle: "Benchmark metrics vs traditional call centers",
      content: [
        "• Up to 1,000 parallel outbound channels operating simultaneously.",
        "• 99.2% human voice accuracy rating in double-blind sentiment studies.",
        "• 85% cost reduction per qualified meeting booked."
      ]
    },
    {
      page: 3,
      title: "Dynamic Script Overrides & Objection Handling",
      subtitle: "Contextual conversation routing engine",
      content: [
        "• Dynamic payload injection allows 10,000+ unique lead scripts without re-configuring base agents.",
        "• Instant objection resolution for pricing, timing, and competitors.",
        "• Automatic call transfer to live sales reps upon high-intent signals."
      ]
    },
    {
      page: 4,
      title: "Sheet-Style Multi-Tenant Client Dashboard",
      subtitle: "Google Sheets style lead management & credit isolation",
      content: [
        "• Grouping of leads by upload date with expandable/collapsible rows.",
        "• Isolated database RLS ensuring strict client data confidentiality.",
        "• Pay-as-you-go minute credit system with automated webhook reconciliation."
      ]
    },
    {
      page: 5,
      title: "Security, Compliance & SaaS Roadmap",
      subtitle: "Enterprise ready architecture",
      content: [
        "• Passwordless Magic Link Authentication via Supabase Auth.",
        "• Encrypted API key management and zero local log persistence.",
        "• 24/7 dedicated support SLA and custom white-label branding options."
      ]
    }
  ];

  const handleDownload = () => {
    const textContent = `LISA AI - PRODUCT OVERVIEW & DOCUMENTATION\n\n${pdfPages.map(p => `PAGE ${p.page}: ${p.title}\n${p.subtitle}\n${p.content.join('\n')}\n`).join('\n---------------------------\n')}`;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Lisa_AI_Product_Overview.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="pdf-brochure" className="pdf-section">
      <div className="container">
        <div className="pdf-card glass-card">
          <div className="pdf-info">
            <span className="badge">
              <span className="badge-dot"></span> Working PDF Brochure
            </span>
            <h2 className="pdf-title">
              Lisa AI <span className="gradient-text">Product Overview Deck</span>
            </h2>
            <p className="pdf-subtitle">
              Inspect technical architecture, benchmark metrics, security compliance, and ROI projections in our official 5-page PDF document.
            </p>
            <div className="pdf-actions">
              <button 
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
                id="btn-open-pdf-viewer"
              >
                📄 Preview Working PDF Viewer
              </button>
              <button 
                className="btn-secondary"
                onClick={handleDownload}
                id="btn-download-pdf-doc"
              >
                ⬇️ Download Product Document
              </button>
            </div>
          </div>

          <div className="pdf-preview-box" onClick={() => setIsModalOpen(true)}>
            <div className="preview-document">
              <div className="doc-header">
                <span className="doc-logo">✨ LISA.AI PDF</span>
                <span className="doc-pages-badge">5 Pages Document</span>
              </div>
              <div className="doc-body">
                <h4>{pdfPages[0].title}</h4>
                <p>{pdfPages[0].subtitle}</p>
                <div className="doc-lines">
                  <div className="line"></div>
                  <div className="line short"></div>
                  <div className="line"></div>
                </div>
              </div>
              <div className="click-overlay">
                <span>🔍 Click to View Full PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal Viewer */}
      {isModalOpen && (
        <div className="pdf-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="pdf-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <div className="header-title">
                <span>📄 Lisa_AI_Product_Overview.pdf</span>
                <span className="page-counter">Page {currentPage} of {totalPages}</span>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="pdf-page-viewer">
              <div className="pdf-paper">
                <div className="paper-top">
                  <span className="paper-brand">✨ LISA AI ENTERPRISE DOC</span>
                  <span className="paper-num">Page 0{currentPage}</span>
                </div>

                <h3 className="paper-heading">{pdfPages[currentPage - 1].title}</h3>
                <h5 className="paper-subheading">{pdfPages[currentPage - 1].subtitle}</h5>

                <div className="paper-content-list">
                  {pdfPages[currentPage - 1].content.map((point, i) => (
                    <div key={i} className="paper-point">
                      {point}
                    </div>
                  ))}
                </div>

                <div className="paper-footer">
                  <span>Confidential • LISA LIVE WEB ABOUT ME</span>
                  <span>www.lisaai.com</span>
                </div>
              </div>
            </div>

            <div className="pdf-modal-controls">
              <button 
                className="btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                ◀ Previous Page
              </button>
              
              <div className="page-pills">
                {pdfPages.map(p => (
                  <button 
                    key={p.page}
                    className={`page-pill ${currentPage === p.page ? "active" : ""}`}
                    onClick={() => setCurrentPage(p.page)}
                  >
                    {p.page}
                  </button>
                ))}
              </div>

              <button 
                className="btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next Page ▶
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pdf-section {
          padding: 60px 0;
        }

        .pdf-card {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 40px;
          padding: 40px;
          align-items: center;
        }

        .pdf-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 12px 0;
        }

        .pdf-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
          margin-bottom: 28px;
          max-width: 550px;
        }

        .pdf-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pdf-preview-box {
          cursor: pointer;
        }

        .preview-document {
          background: #ffffff;
          color: #000;
          border-radius: var(--radius-md);
          padding: 24px;
          height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }

        .preview-document:hover {
          transform: scale(1.03) rotate(-1deg);
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          color: #666;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .doc-body h4 {
          font-family: var(--font-heading);
          color: #111;
          font-size: 1.1rem;
          margin: 12px 0 6px 0;
        }

        .doc-body p {
          color: #555;
          font-size: 0.85rem;
        }

        .doc-lines {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .doc-lines .line {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
        }

        .doc-lines .line.short {
          width: 60%;
        }

        .click-overlay {
          background: rgba(139, 92, 246, 0.95);
          color: #fff;
          padding: 10px;
          border-radius: var(--radius-sm);
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Modal Styles */
        .pdf-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .pdf-modal-content {
          width: 100%;
          max-width: 750px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          background: #121622;
          padding: 24px;
          overflow: hidden;
        }

        .pdf-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #fff;
          font-weight: 700;
        }

        .page-counter {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.4rem;
          cursor: pointer;
        }

        .pdf-page-viewer {
          flex: 1;
          padding: 24px 0;
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }

        .pdf-paper {
          background: #ffffff;
          color: #1a202c;
          width: 100%;
          min-height: 400px;
          border-radius: var(--radius-sm);
          padding: 36px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .paper-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 800;
          color: #718096;
          border-bottom: 2px solid #edf2f7;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .paper-heading {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 6px;
        }

        .paper-subheading {
          font-size: 1rem;
          color: #4a5568;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .paper-content-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .paper-point {
          font-size: 0.95rem;
          color: #2d3748;
          line-height: 1.6;
          background: #f7fafc;
          padding: 12px 16px;
          border-left: 4px solid var(--primary);
          border-radius: 4px;
        }

        .paper-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #a0aec0;
          border-top: 1px solid #edf2f7;
          padding-top: 16px;
          margin-top: 32px;
        }

        .pdf-modal-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .page-pills {
          display: flex;
          gap: 6px;
        }

        .page-pill {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: #fff;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .page-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          font-weight: 700;
        }

        @media (max-width: 850px) {
          .pdf-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
