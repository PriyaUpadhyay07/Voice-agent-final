"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="terms-page">
      <div className="container">
        {/* Header */}
        <div className="terms-header">
          <div className="badge-pill badge-lime">
            <span>⚖️ Legal & Policy Guidelines</span>
          </div>
          <h1 className="terms-title font-serif">Terms & Conditions</h1>
          <p className="terms-date">Effective Date: August 2026 | Lisa AI (callwithlisa.in)</p>
        </div>

        {/* Content Box */}
        <div className="soft-card terms-card">
          <p className="terms-intro">
            Welcome to <strong>Lisa AI</strong> (callwithlisa.in). By using our services, uploading lead data, or requesting setup, you agree to comply with the following Terms & Conditions. Please read them carefully.
          </p>

          <div className="terms-sections">
            {/* 1. Compliance Responsibility */}
            <div className="term-block">
              <div className="term-num">1</div>
              <div className="term-content">
                <h3 className="font-serif">Compliance Responsibility</h3>
                <p>
                  &quot;Client is solely responsible for ensuring all uploaded leads have provided proper consent to be contacted and for compliance with all applicable laws, including but not limited to the TCPA. Lisa AI is a technology tool provider and does not verify consent or lead sourcing.&quot;
                </p>
              </div>
            </div>

            {/* 2. Right to Suspend */}
            <div className="term-block">
              <div className="term-num">2</div>
              <div className="term-content">
                <h3 className="font-serif">Right to Suspend</h3>
                <p>
                  &quot;Lisa AI reserves the right to immediately suspend or terminate service if it becomes aware of any non-compliant use, without prior notice.&quot;
                </p>
              </div>
            </div>

            {/* 3. Limitation of Liability */}
            <div className="term-block">
              <div className="term-num">3</div>
              <div className="term-content">
                <h3 className="font-serif">Limitation of Liability</h3>
                <p>
                  &quot;Lisa AI is not liable for any claims, fines, or damages arising from client&apos;s use of uploaded lead data or resulting calls.&quot;
                </p>
              </div>
            </div>

            {/* 4. No Guarantee of Results */}
            <div className="term-block">
              <div className="term-num">4</div>
              <div className="term-content">
                <h3 className="font-serif">No Guarantee of Results</h3>
                <p>
                  &quot;Lisa AI does not guarantee specific call outcomes, conversion rates, or lead responses.&quot;
                </p>
              </div>
            </div>

            {/* 5. Refund Policy */}
            <div className="term-block">
              <div className="term-num">5</div>
              <div className="term-content">
                <h3 className="font-serif">Refund Policy</h3>
                <p>
                  &quot;There is a one-time setup fee, which includes 80 free minutes of calling. Both the setup fee and the included minutes are non-refundable. Additional call credits can be purchased anytime, at your own pace, with no fixed schedule.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="terms-footer-contact">
            <h4>Questions regarding these terms?</h4>
            <p>
              Contact Founder <strong>Priya Upadhyay</strong> directly at{" "}
              <a href="mailto:priya@callwithlisa.in">priya@callwithlisa.in</a>.
            </p>
            <div className="terms-actions">
              <Link href="/" className="btn-secondary">
                ← Back to Home
              </Link>
              <Link href="/contact" className="btn-primary">
                📩 Contact Priya
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .terms-page {
          padding: 60px 0 90px 0;
          background: #FDFCFC;
        }

        .terms-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px auto;
        }

        .terms-title {
          font-size: 3.5rem;
          color: #0F172A;
          margin: 16px 0 8px 0;
        }

        .terms-date {
          color: #64748B;
          font-size: 0.9rem;
        }

        .terms-card {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px;
          background: #FFFFFF;
        }

        .terms-intro {
          font-size: 1.05rem;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #E2E8F0;
        }

        .terms-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .term-block {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 24px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
        }

        .term-num {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0F172A;
          color: #C4F135;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .term-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .term-content h3 {
          font-size: 1.8rem;
          color: #0F172A;
        }

        .term-content p {
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.6;
          font-style: italic;
        }

        .terms-footer-contact {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #E2E8F0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .terms-footer-contact h4 {
          font-size: 1.2rem;
          color: #0F172A;
        }

        .terms-footer-contact p {
          color: #64748B;
        }

        .terms-footer-contact a {
          color: #0F172A;
          font-weight: 600;
        }

        .terms-actions {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .terms-title { font-size: 2.5rem; }
          .terms-card { padding: 24px; }
          .term-block { padding: 18px; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
