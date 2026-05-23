"use client";
import { useState } from "react";
import { X, Loader2, ChevronLeft, CreditCard } from "lucide-react";

export default function PurchaseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [showCardInput, setShowCardInput] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), minutes: Number(amount) * 10 }),
      });
      const order = await res.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Lisa AI",
        description: `Purchase ${Number(amount) * 10} Calling Minutes`,
        order_id: order.orderId,
        handler: async function (response: any) {
           // Sync with database immediately
           await fetch("/api/razorpay/success", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               orderId: response.razorpay_order_id,
               paymentId: response.razorpay_payment_id,
               amount: Number(amount),
               minutes: Number(amount) * 10
             })
           });
           
           alert("Credits Added Successfully!");
           onClose();
           window.location.reload();
        },
        prefill: { email: "upadhyaypriya974@gmail.com" },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: 32,
        width: "100%",
        maxWidth: 440,
        padding: "32px 24px",
        position: "relative",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        color: "#000"
      }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button 
            onClick={() => showCardInput ? setShowCardInput(false) : onClose()} 
            style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronLeft size={20} color="#000" />
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {showCardInput ? "Add a card" : "Purchase Minutes"}
          </h3>
          <button onClick={onClose} style={{ width: 40, height: 40, background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} />
          </button>
        </div>

        <div className="fade-up">
          <div style={{ background: "#f9fafb", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #e5e7eb" }}>
            <label style={{ display: "block", color: "#6b7280", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Amount (USD)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700 }}>$</span>
              <input 
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                style={{ width: "100%", background: "transparent", border: "none", color: "#000", fontSize: 24, fontWeight: 700, outline: "none" }}
              />
            </div>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(16, 185, 129, 0.05)", borderRadius: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#10b981", fontSize: 14, fontWeight: 600 }}>Total Minutes</span>
              <span style={{ color: "#000", fontSize: 18, fontWeight: 700 }}>{Number(amount) * 10}</span>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={handlePurchase}
            style={{ 
              width: "100%", padding: "18px", borderRadius: 18, border: "none", 
              background: "#111827", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Proceed to Payment"}
          </button>
          
          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
            International cards and UPI supported via Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
