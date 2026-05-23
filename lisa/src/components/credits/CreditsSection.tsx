"use client";
import { useState, useEffect } from "react";
import { CreditCard, Plus, Download, History, Box, Coins } from "lucide-react";
import UsageChart from "./UsageChart";
import PurchaseModal from "./PurchaseModal";

export default function CreditsSection({ userId }: { userId?: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/credits?userId=${userId || ""}`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance);
        setMinutes(data.minutes);
        setHistory(data.history || []);
      });
  }, [userId]);

  const downloadStatement = () => {
    try {
      if (!history || history.length === 0) {
        alert("No purchase history available to download!");
        return;
      }
      // Add UTF-8 BOM so Excel on Windows opens it with correct encoding
      const csvContent = "\uFEFFDate,Amount,Status\n" + history.map(h => {
        const rawDate = h.createdAt || h.date || new Date();
        const dateObj = new Date(rawDate);
        const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : new Date().toLocaleDateString();
        const amountStr = h.amount !== undefined ? `$${h.amount}` : "$0";
        const statusStr = h.status || "Completed";
        return `"${dateStr}","${amountStr}","${statusStr}"`;
      }).join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `monthly_statement_${new Date().toISOString().slice(0, 7)}.csv`);
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Delay revoking the object URL so the browser has time to initiate the download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      console.error("Error downloading statement:", err);
      alert("Failed to download statement. Please try again.");
    }
  };

  return (
    <div style={{ flex: 1, padding: "40px 60px", background: "var(--main-bg)", overflowY: "auto" }}>
      <PurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <Box size={20} color="#888" />
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>Billing</h1>
      </div>

      <div style={{ maxWidth: 1000 }}>
        {/* Billing Card */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>PAYG</h2>
            <span style={{ 
              background: "rgba(16, 185, 129, 0.1)", 
              color: "var(--green)", 
              padding: "4px 12px", 
              borderRadius: 20, 
              fontSize: 12, 
              fontWeight: 500 
            }}>● Current plan</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>Credit Balance:</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Coins size={28} color="var(--green)" />
              {balance === null ? (
                <div className="pulse" style={{ width: 140, height: 50, background: "rgba(255,255,255,0.05)", borderRadius: 12, backdropFilter: "blur(4px)" }} />
              ) : (
                <span style={{ fontSize: 42, fontWeight: 700 }}>${balance.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onClick={() => setShowModal(true)}
              style={{ 
                background: "var(--green)", 
                color: "#fff", 
                padding: "12px 24px", 
                borderRadius: 12, 
                border: "none", 
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 15
              }}
            >
              Buy More Credits
            </button>
          </div>
        </div>

        {/* Minutes Section */}
        <div style={{ 
          background: "rgba(255,255,255,0.02)", 
          border: "1px solid var(--border)", 
          borderRadius: 24, 
          padding: 32,
          marginBottom: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <h3 style={{ fontSize: 24, fontWeight: 600 }}>Minutes</h3>
            {minutes === null ? (
              <div className="pulse" style={{ width: 90, height: 32, background: "rgba(255,255,255,0.05)", borderRadius: 8, backdropFilter: "blur(4px)" }} />
            ) : (
              <span style={{ fontSize: 24, fontWeight: 600 }}>{minutes.toFixed(0)}</span>
            )}
          </div>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>The total number of Vapi minutes used</p>
          
          <UsageChart userId={userId} />
        </div>

        {/* History Sections */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 24 }}>
          {/* Purchase History */}
          <div style={{ 
            background: "var(--card-bg)", 
            border: "1px solid var(--border)", 
            borderRadius: 24, 
            padding: 32 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Credit Purchase History</h3>
                <p style={{ color: "#888", fontSize: 13 }}>Credit purchases are charged to your payment method.</p>
              </div>
              <button 
                onClick={downloadStatement}
                style={{ 
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", 
                  borderRadius: 10, background: "#222", border: "1px solid #333", color: "#fff", fontSize: 13,
                  cursor: "pointer"
                }}
              >
                <Download size={14} /> Download Monthly Statement
              </button>
            </div>

            <div style={{ marginTop: 24 }}>
              {balance === null ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="pulse" style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #222" }}>
                      <div style={{ width: "30%", height: 18, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                      <div style={{ width: "20%", height: 18, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                      <div style={{ width: "20%", height: 18, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div style={{ padding: "60px 0", textAlign: "center", color: "#444" }}>
                  No data available
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                      <th style={{ padding: "12px 0", color: "#888", fontWeight: 500, fontSize: 13 }}>Date</th>
                      <th style={{ padding: "12px 0", color: "#888", fontWeight: 500, fontSize: 13 }}>Amount</th>
                      <th style={{ padding: "12px 0", color: "#888", fontWeight: 500, fontSize: 13 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h: any, i: number) => (
                      <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                        <td style={{ padding: "16px 0", fontSize: 14 }}>{new Date(h.createdAt || h.date).toLocaleDateString()}</td>
                        <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 600 }}>${h.amount}</td>
                        <td style={{ padding: "16px 0" }}>
                          <span style={{ 
                            color: 'var(--green)',
                            fontSize: 12, textTransform: 'capitalize'
                          }}>Completed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
