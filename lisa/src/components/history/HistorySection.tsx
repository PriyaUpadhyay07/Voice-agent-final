"use client";
import { useState, useEffect } from "react";
import { History, Calendar, Phone, ArrowRightLeft, Clock, DollarSign, ExternalLink, Play, X, Loader2, FileSpreadsheet } from "lucide-react";

interface CallLog {
  id: string;
  assistantId: string;
  phoneNumberId: string;
  type: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  durationSeconds?: number;
  cost: number;
  status: string;
  endedReason: string;
  recordingUrl?: string;
  transcript?: string;
  customer?: { number: string; name?: string };
  assistant?: { number: string };
  messages?: any[];
}

const getCallOutcome = (log: CallLog) => {
  const messages = log.messages || [];
  const customerMessages = messages
    .filter((m: any) => m.role === "user" || m.role === "customer")
    .map((m: any) => (m.message || m.content || "").toLowerCase());
  
  const text = customerMessages.join(" ");
  const reason = (log.endedReason || "").toLowerCase();
  const duration = log.duration || log.durationSeconds || 0;
  const hasSpoken = customerMessages.length > 0 && customerMessages.join("").trim().length > 0;

  // 1. Pending Conditions (No pickup, busy line, voicemail, or explicitly asked to call back/busy)
  const isNoAnswer = 
    reason.includes("no-answer") || 
    reason.includes("did-not-answer") || 
    reason.includes("busy") || 
    reason.includes("rejected") ||
    reason.includes("voicemail") ||
    (duration < 10 && !hasSpoken); // Very short call with no customer speech is likely a no-pickup/voicemail

  const askedToCallBack = 
    text.includes("busy") || 
    text.includes("call back") || 
    text.includes("later") || 
    text.includes("not now") || 
    text.includes("meeting") || 
    text.includes("driving") || 
    text.includes("another time") || 
    text.includes("tomorrow") || 
    text.includes("next week") || 
    // Hindi/Hinglish keywords
    text.includes("baad me") || 
    text.includes("baad mein") || 
    text.includes("busy hu") || 
    text.includes("busy hoon") || 
    text.includes("kal baat") || 
    text.includes("parso") || 
    text.includes("meeting mein") || 
    text.includes("meeting me") ||
    reason.includes("voicemail");

  if (isNoAnswer || askedToCallBack) {
    return { label: "Pending", color: "var(--orange)", bg: "rgba(245,158,11,0.15)" };
  }

  // 2. Interested Conditions (Intent shown)
  const hasInterest = 
    text.includes("book") || 
    text.includes("schedule") || 
    text.includes("appointment") || 
    text.includes("demo") || 
    text.includes("send me") || 
    text.includes("email me") || 
    text.includes("pricing") || 
    text.includes("interested") || 
    // Hindi/Hinglish keywords
    text.includes("bhej do") || 
    text.includes("bhej dena") || 
    text.includes("theek hai") || 
    text.includes("thek hai") || 
    text.includes("dilchaspi") || 
    text.includes("achha hai") || 
    (text.includes("yes") && (text.includes("please") || text.includes("sure") || text.includes("work")));

  if (hasInterest) {
    return { label: "Interested", color: "var(--green)", bg: "rgba(16,163,127,0.15)" };
  }

  // 3. Not Interested (Default fallback for any active conversation that hung up without interest)
  return { label: "Not Interested", color: "var(--red)", bg: "rgba(239,68,68,0.15)" };
};

export default function HistorySection({ campaigns }: { campaigns: any[] }) {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [timeRange, setTimeRange] = useState("7D");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [callType, setCallType] = useState("All");
  const [resultFilter, setResultFilter] = useState("All Results");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history?limit=100");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Isolation Logic: Filter calls to only show those that belong to our leads
        const allLeadsNumbers = new Set(
          campaigns.flatMap(c => c.leads.map((l: any) => {
            const pk = Object.keys(l).find(k => /phone|mobile/i.test(k));
            const raw = pk ? String(l[pk]).replace(/\s+/g, "") : "";
            // Normalize to match Vapi (+91, etc)
            let p = raw.replace(/[^0-9+]/g, "");
            if (p && !p.startsWith("+")) {
              p = p.replace(/^(0|91)/, "");
              if (p.length === 10) p = "+91" + p;
              else p = "+" + p;
            }
            return p;
          })).filter(p => p)
        );

        // Fallback: Show all logs if no campaigns are found, or just show all for now
        // const isolated = data.filter(log => 
        //   log.customer?.number && allLeadsNumbers.has(log.customer.number)
        // );
        setLogs(data); // Show all logs for transparency
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    // 1. Call Type Filter
    if (callType !== "All Types" && !log.type.toLowerCase().includes(callType.toLowerCase())) return false;

    // 2. Time Range Filter
    const now = new Date();
    const callDate = new Date(log.startedAt);
    const diffDays = (now.getTime() - callDate.getTime()) / (1000 * 3600 * 24);

    if (timeRange === "7D" && diffDays > 7) return false;
    if (timeRange === "2W" && diffDays > 14) return false;
    if (timeRange === "4W" && diffDays > 28) return false;
    if (timeRange === "3M" && diffDays > 90) return false;
    if (timeRange === "1Y" && diffDays > 365) return false;

    // 3. Custom Date Range
    if (timeRange === "Custom") {
      if (customDates.start && new Date(log.startedAt) < new Date(customDates.start)) return false;
      if (customDates.end && new Date(log.startedAt) > new Date(customDates.end)) return false;
    }

    // 4. Result Filter
    if (resultFilter !== "All Results") {
      const outcome = getCallOutcome(log);
      if (outcome.label !== resultFilter) return false;
    }

    return true;
  });

  const formatDate = (iso: string) => {
    if (!iso || iso === "N/A") return "N/A";
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatDuration = (sec: number) => {
    if (!sec) return "-";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getCallDuration = (log: CallLog) => {
    if (log.duration) return log.duration;
    if (log.durationSeconds) return log.durationSeconds;
    if (log.startedAt && log.endedAt) {
      const start = new Date(log.startedAt).getTime();
      const end = new Date(log.endedAt).getTime();
      if (!isNaN(start) && !isNaN(end)) {
        return Math.max(0, (end - start) / 1000);
      }
    }
    return 0;
  };

  const downloadPendingLeads = () => {
    // 1. Get unique pending numbers with names
    const pendingLeadsMap = new Map();
    filteredLogs.forEach(log => {
      const outcome = getCallOutcome(log);
      if (outcome.label === "Pending") {
        const phone = log.customer?.number;
        const name = log.customer?.name || "Unknown";
        if (phone) {
          // If we find the same number again but with a name, update it
          if (!pendingLeadsMap.has(phone) || (pendingLeadsMap.get(phone).name === "Unknown" && name !== "Unknown")) {
            pendingLeadsMap.set(phone, { phone, name });
          }
        }
      }
    });

    const pendingList = Array.from(pendingLeadsMap.values());
    if (pendingList.length === 0) return alert("No pending leads found to download!");

    // 2. Convert to CSV (Name, Phone)
    const csvContent = "name,phone\n" + pendingList.map(l => `"${l.name}","${l.phone}"`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pending_leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--main-bg)", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Call History</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>Monitor and analyze your AI agent calls</p>
        </div>
        <button 
          onClick={downloadPendingLeads}
          style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "var(--orange)", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <FileSpreadsheet size={16} /> Download Pending Leads (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--card-bg)", padding: "4px", borderRadius: 10, border: "1px solid var(--border)" }}>
          {["7D", "2W", "4W", "3M", "1Y", "Custom"].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              style={{ padding: "6px 12px", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: timeRange === t ? "#fff" : "transparent", color: timeRange === t ? "#000" : "var(--text-muted)", transition: "all .2s" }}
            >
              {t}
            </button>
          ))}
        </div>

        {timeRange === "Custom" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="date" value={customDates.start} onChange={e => setCustomDates({...customDates, start: e.target.value})} style={{ background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
            <span style={{ color: "var(--text-dim)", fontSize: 12 }}>to</span>
            <input type="date" value={customDates.end} onChange={e => setCustomDates({...customDates, end: e.target.value})} style={{ background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
          </div>
        )}

        <select 
          value={callType} onChange={e => setCallType(e.target.value)}
          style={{ background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none" }}
        >
          <option>All Types</option>
          <option>Outbound</option>
          <option>Inbound</option>
          <option>Web Call</option>
        </select>

        <select 
          value={resultFilter} onChange={e => setResultFilter(e.target.value)}
          style={{ background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none" }}
        >
          <option>All Results</option>
          <option>Interested</option>
          <option>Not Interested</option>
          <option>Pending</option>
        </select>

        <button onClick={fetchLogs} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Refresh
        </button>
      </div>

      {/* Table Area */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", padding: "0 32px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, color: "var(--text-muted)" }}>
            <Loader2 size={20} className="spin" /> Loading logs...
          </div>
        ) : (
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ position: "sticky", top: 0, background: "var(--main-bg)", zIndex: 10 }}>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>ASSISTANT NUMBER</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>CUSTOMER NUMBER</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>TYPE</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>ENDED REASON</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>START TIME (GMT+5:30)</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>DURATION</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>COST</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>OUTCOME</th>
                <th style={{ padding: "16px 8px", color: "var(--text-muted)", fontWeight: 500 }}>RECORDING</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const outcome = getCallOutcome(log);
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border)", transition: "background .15s" }} className="table-row-hover">
                    <td style={{ padding: "14px 8px" }}>
                      <div style={{ fontWeight: 600 }}>{log.assistant?.number || "Web Call"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Lisa AI Agent</div>
                    </td>
                    <td style={{ padding: "14px 8px", fontWeight: 500 }}>{log.customer?.number || "-"}</td>
                    <td style={{ padding: "14px 8px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", background: "rgba(37,99,235,0.1)", color: "var(--blue)", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        <ArrowRightLeft size={10} /> {log.type}
                      </span>
                    </td>
                    <td style={{ padding: "14px 8px" }}>
                      <span style={{ padding: "4px 8px", background: "#333", color: "#ccc", borderRadius: 6, fontSize: 11 }}>{log.endedReason || "-"}</span>
                    </td>
                    <td style={{ padding: "14px 8px", color: "var(--text-sub)" }}>{formatDate(log.startedAt)}</td>
                    <td style={{ padding: "14px 8px", color: "var(--text-sub)" }}>{formatDuration(getCallDuration(log))}</td>
                    <td style={{ padding: "14px 8px", fontWeight: 600 }}>
                      ${((getCallDuration(log) / 60) * 0.10).toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 8px" }}>
                      <span style={{ 
                        padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, 
                        background: outcome.bg, color: outcome.color, textTransform: "uppercase" 
                      }}>
                        {outcome.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 8px" }}>
                      <button 
                        onClick={() => setSelectedCall(log)}
                        style={{ background: "rgba(16,163,127,0.15)", color: "var(--green)", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Transcript Sidebar Overlay */}
      {selectedCall && (
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 500, background: "#1a1a1a", borderLeft: "1px solid var(--border)", zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(0,0,0,0.5)" }} className="fade-right">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Call Recording & Transcript</h3>
              <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "var(--text-dim)" }}>{selectedCall.customer?.number} · {formatDate(selectedCall.startedAt)}</p>
            </div>
            <button onClick={() => setSelectedCall(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {/* Audio Player */}
            {selectedCall.recordingUrl ? (
              <div style={{ background: "#2a2a2a", borderRadius: 16, padding: "20px", marginBottom: 24 }}>
                <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RECORDING</p>
                <audio controls src={selectedCall.recordingUrl} style={{ width: "100%" }} />
              </div>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", background: "#222", borderRadius: 12, marginBottom: 24, color: "var(--text-dim)", fontSize: 13 }}>No recording available</div>
            )}

            {/* Transcript */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>TRANSCRIPT</p>
              {selectedCall.messages && selectedCall.messages.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {selectedCall.messages.map((m: any, i: number) => {
                    const content = m.message || m.content || "";
                    // Filter out System Prompt
                    if (
                      m.role === "system" || 
                      content.includes("You are Lisa") || 
                      content.includes("professional cold calling assistant") || 
                      content.includes("# Appointment") || 
                      content.includes("Identity & Purpose") || 
                      content.includes("You are Riley")
                    ) return null;
                    
                    const isAi = m.role === "assistant" || m.role === "bot";
                    if (!content) return null;
                    return (
                      <div key={i} style={{ padding: "12px 16px", borderRadius: 12, background: isAi ? "rgba(16,163,127,0.1)" : "#2a2a2a", border: isAi ? "1px solid rgba(16,163,127,0.2)" : "1px solid var(--border)", alignSelf: isAi ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-sub)" }}>{content}</p>
                      </div>
                    );
                  })}
                </div>
              ) : selectedCall.transcript ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {selectedCall.transcript.split("\n").map((line, i) => {
                    if (
                      line.includes("You are Lisa") || 
                      line.includes("professional cold calling assistant") || 
                      line.includes("# Appointment") || 
                      line.includes("Identity & Purpose")
                    ) return null;
                    const isAi = line.toLowerCase().startsWith("ai:") || line.toLowerCase().startsWith("assistant:");
                    return (
                      <div key={i} style={{ padding: "12px 16px", borderRadius: 12, background: isAi ? "rgba(16,163,127,0.1)" : "#2a2a2a", border: isAi ? "1px solid rgba(16,163,127,0.2)" : "1px solid var(--border)", alignSelf: isAi ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-sub)" }}>{line.replace(/^(ai|assistant|user|customer):\s*/i, "")}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Transcript not available for this call.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

