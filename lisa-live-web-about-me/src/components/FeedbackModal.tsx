"use client";

import { useState } from "react";

export interface FeedbackModalProps {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>("Voice Quality");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const categories = ["Voice Quality", "Features", "Pricing & Plans", "Usability", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <span className="badge">
                <span className="badge-dot"></span> User Feedback
              </span>
              <h3 className="modal-title">Share Your <span className="gradient-text">Feedback</span></h3>
              <p className="modal-subtitle">Help us shape the future of Lisa AI. Your thoughts matter to us!</p>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Star Rating */}
              <div className="form-group">
                <label className="form-label">How would you rate Lisa AI?</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= rating ? "active" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="form-group">
                <label className="form-label">Feedback Category</label>
                <div className="category-pills">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-pill ${category === cat ? "active" : ""}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="form-group">
                <label className="form-label">Your Feedback / Suggestions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you loved or what we can improve..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn-primary form-submit-btn" id="btn-submit-feedback">
                🚀 Submit Feedback
              </button>
            </form>
          </>
        ) : (
          <div className="submitted-view">
            <div className="success-icon">🎉</div>
            <h3 className="success-title">Thank You for Your Feedback!</h3>
            <p className="success-desc">
              We received your {rating}-star rating for <strong>{category}</strong>. Your feedback has been sent directly to our product development team.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Close Window
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
          max-width: 520px;
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

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .star-rating {
          display: flex;
          gap: 8px;
        }

        .star-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          width: 44px;
          height: 44px;
          font-size: 1.5rem;
          color: #444;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star-btn.active {
          color: #f59e0b;
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .category-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cat-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 0.8rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-pill.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--primary);
          color: #fff;
          font-weight: 600;
        }

        .form-textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          resize: vertical;
        }

        .form-textarea:focus {
          border-color: var(--primary);
        }

        .form-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
        }

        .submitted-view {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .success-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
        }

        .success-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 24px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
