"use client";
import { useState, useMemo } from "react";
import type { Lead } from "@/app/page";
import { Users, Search, Trash2, Clock, Play, X } from "lucide-react";

export default function TaggingSection({ leads, onRunPending, logs = [] }: { leads: Lead[], onRunPending: () => void, logs?: any[] }) {
  const [q, setQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // Stores phone number to delete
  const [deletedPhones, setDeletedPhones] = useState<Set<string>>(new Set());

  // Merge leads from campaign sheet and history logs, ensuring uniqueness by phone number
  const allLeads = useMemo(() => {
    const map = new Map();
    
    // 1. Add leads from the campaign sheet
    leads.forEach(l => {
      const phoneKey = Object.keys(l).find(k => /phone|mobile/i.test(k));
      const phone = phoneKey ? String(l[phoneKey]).replace(/[^0-9+]/g, "") : null;
      if (phone && !deletedPhones.has(phone)) {
        const matchingLog = logs.find(log => log.customer?.number === phone);
        const date = l.date || l.createdAt || matchingLog?.startedAt || "N/A";
        map.set(phone, { ...l, phone, date });
      }
    });

    // 2. Fallback: Add from logs if sheet is empty or to complement
    logs.forEach(log => {
      const phone = log.customer?.number;
      if (phone && !map.has(phone) && !deletedPhones.has(phone)) {
        map.set(phone, { phone, status: "pending", date: log.startedAt });
      }
    });

    return Array.from(map.values());
  }, [leads, logs, deletedPhones]);

  const filtered = allLeads.filter(l => 
    Object.values(l).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
  );

  const stats = {
    total: allLeads.length,
    pending: allLeads.filter(l => !l.status || l.status === "pending").length,
  };

  const handleDelete = () => {
    if (confirmDelete) {
      setDeletedPhones(new Set([...deletedPhones, confirmDelete]));
      setConfirmDelete(null);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso || iso === "N/A") return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--main-bg)", overflow: "hidden", position: "relative" }}>
      
      {/* Glassmorphism Confirmation Popup */}
      {confirmDelete && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            width: 320, padding: 24, borderRadius: 24,
            background: "rgba(40, 40, 40, 0.7)", border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            textAlign: "center"
          }}>
            <div style={{ background: "rgba(239,68,68,0.1)", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={24} color="var(--red)" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>Delete Lead?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.5 }}>
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: "var(--red)", color: "white", fontWeight: 600, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "var(--text)" }}>Pending Calls</h1>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Easily retry all your pending calls. Just click the "Run Pending Calls" button to start.
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 600 }}>
          <StatCard icon={Users} label="Total Unreached Calls" val={stats.total} color="var(--blue)" />
          
          {/* Pending Card with Run Button */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Clock size={16} color="var(--orange)" />
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Pending Calls</span>
              </div>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{stats.pending}</p>
            </div>
            {stats.pending > 0 && (
              <button 
                onClick={onRunPending}
                style={{ marginTop: 12, width: "100%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "var(--orange)", padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
              >
                <Play size={12} fill="currentColor" /> Run Pending Calls
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 10, padding: "0 12px" }}>
          <Search size={16} color="var(--text-dim)" />
          <input 
            placeholder="Search by phone number..." 
            value={q} onChange={e => setQ(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 14, padding: "10px 0", width: "100%" }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 32px" }}>
        {allLeads.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
            <p>No leads found in history or current campaign.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>PHONE NUMBER</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>DATE ADDED</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>STATUS</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500, textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 8px", fontWeight: 600, color: "var(--text)" }}>{l.phone}</td>
                  <td style={{ padding: "14px 8px", color: "var(--text-muted)" }}>{formatDate(l.date)}</td>
                  <td style={{ padding: "14px 8px" }}>
                    <span style={{ 
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                      background: l.status === "interested" ? "rgba(16,163,127,0.15)" : l.status === "not-interested" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.1)",
                      color: l.status === "interested" ? "var(--green)" : l.status === "not-interested" ? "var(--red)" : "var(--orange)"
                    }}>
                      {l.status || "pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 8px", textAlign: "right" }}>
                    <button 
                      onClick={() => setConfirmDelete(l.phone)}
                      style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, val, color }: any) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{val}</p>
    </div>
  );
}
