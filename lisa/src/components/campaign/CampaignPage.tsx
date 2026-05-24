"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { Plus, X, FileSpreadsheet, Link2, ArrowUp, Loader2, CheckCircle2, PhoneCall, AlertCircle, Pause, Play, Square } from "lucide-react";
import type { Campaign, CampaignMessage, Lead, UploadedFile } from "@/app/page";

interface Props {
  campaign: Campaign;
  updateCampaign: (updater: (c: Campaign) => Campaign) => void;
  userId?: string;
}

function genId() { return Math.random().toString(36).slice(2, 9); }

export default function CampaignPage({ campaign, updateCampaign, userId }: Props) {
  const [firstMessage, setFirstMessage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [pendingLeads, setPendingLeads] = useState<Lead[]>([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showSheetInput, setShowSheetInput] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [fetchingSheet, setFetchingSheet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const cancelledCampaignsRef = useRef<Set<string>>(new Set());
  const pausedCampaignsRef = useRef<Set<string>>(new Set());

  const handlePauseCampaign = useCallback((msgId: string) => {
    pausedCampaignsRef.current.add(msgId);
    updateCampaign(c => ({
      ...c,
      messages: c.messages.map(m =>
        m.id === msgId ? { ...m, status: "paused" } : m
      ),
    }));
  }, [updateCampaign]);

  const handleResumeCampaign = useCallback((msgId: string) => {
    pausedCampaignsRef.current.delete(msgId);
    updateCampaign(c => ({
      ...c,
      messages: c.messages.map(m =>
        m.id === msgId ? { ...m, status: "calling" } : m
      ),
    }));
  }, [updateCampaign]);

  const handleStopCampaign = useCallback((msgId: string) => {
    cancelledCampaignsRef.current.add(msgId);
    pausedCampaignsRef.current.delete(msgId);
    updateCampaign(c => ({
      ...c,
      messages: c.messages.map(m =>
        m.id === msgId ? { ...m, status: "error", errorDetails: "Campaign stopped by user." } : m
      ),
    }));
  }, [updateCampaign]);

  // Reset input when campaign changes
  useEffect(() => {
    setFirstMessage("");
    setDescription("");
    setUploadedFile(null);
    setPendingLeads([]);
    setShowSheetInput(false);
    setSheetUrl("");
  }, [campaign.id]);

  const existingPendingCount = (campaign.leads || []).filter(l => !l.status || l.status === "pending").length;

  // Close upload menu on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUploadMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [campaign.messages.length]);

  const processCSV = (text: string, name: string, url?: string, dataUrl?: string) => {
    (Papa as any).parse(text, {
      header: true, skipEmptyLines: true,
      complete: ({ data }: { data: any }) => {
        setPendingLeads(data);
        setUploadedFile({ name, type: dataUrl ? "csv" : "sheet", url, dataUrl, count: data.length });
      },
    });
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) return;
    const dataUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = (e) => processCSV(e.target?.result as string, file.name, undefined, dataUrl);
    reader.readAsText(file);
    setShowUploadMenu(false);
  };

  const handleSheetFetch = async () => {
    setFetchingSheet(true);
    try {
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) throw new Error("Invalid Google Sheet link.");
      const id = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error("Make the sheet public first (Share → Anyone with link).");
      const text = await res.text();
      processCSV(text, "Google Sheet", sheetUrl, undefined);
      setShowSheetInput(false);
      setSheetUrl("");
      setShowUploadMenu(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setFetchingSheet(false);
    }
  };

  const canSend = (firstMessage.trim().length > 0 && (uploadedFile !== null || existingPendingCount > 0));

  const handleSend = async () => {
    if (!canSend) return;

    const msgId = genId();
    const msgScript = JSON.stringify({
      firstMessage: firstMessage.trim(),
      description: description.trim()
    });
    const msgFile = uploadedFile;
    // Capture leads: from file OR existing pending leads in campaign
    const msgLeads = uploadedFile ? [...pendingLeads] : (campaign.leads || []).filter(l => !l.status || l.status === "pending");

    console.log(`[Lisa] Sending: ${msgLeads.length} leads, script JSON length: ${msgScript.length}`);

    // 1. Add message to campaign immediately (optimistic)
    const newMsg: CampaignMessage = {
      id: msgId,
      file: msgFile,
      script: msgScript,
      status: "calling",
      calledCount: 0,
      errorDetails: undefined,
    };

    updateCampaign(c => ({
      ...c,
      leads: [...c.leads, ...msgLeads],
      messages: [...c.messages, newMsg],
    }));

    // 2. Clear input AFTER capturing
    setFirstMessage("");
    setDescription("");
    setUploadedFile(null);
    setPendingLeads([]);

    // 3. Guard — if no leads, show error immediately
    if (msgLeads.length === 0 && msgScript) {
      updateCampaign(c => ({
        ...c,
        messages: c.messages.map(m =>
          m.id === msgId ? { ...m, status: "error", errorDetails: "No leads uploaded. Please upload a CSV or Google Sheet first." } : m
        ),
      }));
      return;
    }

    // 4. Start Calling Loop (Real-time Progress)
    try {
      let successCount = 0;
      const errorLogs: string[] = [];

      for (let i = 0; i < msgLeads.length; i++) {
        // 1. Check if stopped
        if (cancelledCampaignsRef.current.has(msgId)) {
          break;
        }

        // 2. Check if paused, block/sleep until unpaused or stopped
        while (pausedCampaignsRef.current.has(msgId)) {
          if (cancelledCampaignsRef.current.has(msgId)) {
            break;
          }
          await new Promise(r => setTimeout(r, 1000));
        }

        // Re-check stopped state after waking up from pause
        if (cancelledCampaignsRef.current.has(msgId)) {
          break;
        }

        const lead = msgLeads[i];
        
        // Find phone
        const phoneKey = Object.keys(lead).find(k => /phone|mobile|contact/i.test(k));
        const rawPhone = phoneKey ? String(lead[phoneKey]).trim().replace(/\s+/g, "") : "";

        let leadStatus: "called" | "pending" | "interested" = "pending";

        if (!rawPhone) {
          errorLogs.push(`Row ${i + 1}: Phone column missing or empty.`);
        } else {
          // Attempt call
          try {
            const res = await fetch("/api/make-call", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lead, script: msgScript, phone: rawPhone, userId }),
            });
            const data = await res.json();
            
            if (!res.ok) {
              let errMsg = data.error || "Failed";
              if (errMsg.includes("E.164")) errMsg = "❌ Invalid Format: Country code (+91, etc) missing.";
              errorLogs.push(`${rawPhone}: ${errMsg}`);
            } else {
              successCount++;
              leadStatus = "called"; // Or mock "interested" for demo
              if (Math.random() > 0.7) leadStatus = "interested"; 
            }
          } catch (e: any) {
            errorLogs.push(`${rawPhone}: Connection error`);
          }
        }

        // Update campaign state (Progress + Leads Status)
        updateCampaign(c => {
          const updatedLeads = [...c.leads];
          // Find the lead index to update its status
          const leadIdx = updatedLeads.findIndex(l => 
            (l.phone === rawPhone || l.Phone === rawPhone || l.PHONE === rawPhone) && l.status === "pending"
          );
          if (leadIdx !== -1) {
            updatedLeads[leadIdx] = { ...updatedLeads[leadIdx], status: leadStatus };
          }

          return {
            ...c,
            leads: updatedLeads,
            messages: c.messages.map(m =>
              m.id === msgId ? { 
                ...m, 
                calledCount: successCount,
                errorDetails: errorLogs.length > 0 ? errorLogs.join("\n") : undefined 
              } : m
            ),
          };
        });

        // Tiny delay
        await new Promise(r => setTimeout(r, 600));
      }

      // Mark as done
      if (!cancelledCampaignsRef.current.has(msgId)) {
        updateCampaign(c => ({
          ...c,
          messages: c.messages.map(m =>
            m.id === msgId ? { ...m, status: "done" } : m
          ),
        }));
      }

    } catch (err: any) {
      console.error("[Lisa] Campaign loop error:", err);
      updateCampaign(c => ({
        ...c,
        messages: c.messages.map(m =>
          m.id === msgId ? { ...m, status: "error", errorDetails: err.message } : m
        ),
      }));
    }
  };

  const isEmpty = campaign.messages.length === 0;

  return (
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "var(--main-bg)", position: "relative" }}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
    >
      {/* Chat messages area */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 20px" }}>

        {/* Empty state or Pending leads state */}
        {isEmpty && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }} className="fade-up">
            {existingPendingCount > 0 ? (
              <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: "30px", maxWidth: 400 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <PhoneCall size={28} color="var(--orange)" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{existingPendingCount} Pending Leads</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>We found pending leads from your previous run or history. Enter a script below to start calling them.</p>
                <div style={{ fontSize: 12, color: "var(--orange)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Ready to Resume</div>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Ready when you are.</h1>
                <p style={{ color: "var(--text-dim)", fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>Upload leads and write your script below to start calling.</p>
              </>
            )}
          </div>
        )}

        {/* Messages */}
        {campaign.messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            msg={msg} 
            onStop={() => handleStopCampaign(msg.id)} 
            onPause={() => handlePauseCampaign(msg.id)}
            onResume={() => handleResumeCampaign(msg.id)}
          />
        ))}

        <div ref={chatBottomRef} />
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.08)", border: "2px dashed #2563eb", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <p style={{ color: "#2563eb", fontWeight: 600, fontSize: 18 }}>Drop CSV here</p>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "12px 20px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {/* Google Sheet URL input */}
          {showSheetInput && (
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }} className="fade-up">
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 12, padding: "0 12px" }}>
                <Link2 size={14} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                <input
                  autoFocus type="text"
                  placeholder="Paste Google Sheet link (must be public)..."
                  value={sheetUrl} onChange={e => setSheetUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSheetFetch(); if (e.key === "Escape") setShowSheetInput(false); }}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, padding: "11px 0", fontFamily: "inherit" }}
                />
              </div>
              <button onClick={handleSheetFetch} disabled={fetchingSheet || !sheetUrl}
                style={{ padding: "0 16px", borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 13, cursor: fetchingSheet || !sheetUrl ? "not-allowed" : "pointer", opacity: fetchingSheet || !sheetUrl ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                {fetchingSheet ? <Loader2 size={13} className="spin" /> : null}
                {fetchingSheet ? "Fetching..." : "Fetch"}
              </button>
              <button onClick={() => setShowSheetInput(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0 4px", display: "flex", alignItems: "center" }}>
                <X size={15} />
              </button>
            </div>
          )}

          {/* File card preview (before sending) */}
          {uploadedFile && (
            <div style={{ marginBottom: 8 }} className="fade-up">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 12, padding: "8px 12px", cursor: "pointer" }}
                onClick={() => { const u = uploadedFile.dataUrl || uploadedFile.url; if (u) window.open(u, "_blank"); }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1e6b4a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileSpreadsheet size={18} color="#4ade80" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploadedFile.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Spreadsheet · {uploadedFile.count} leads</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setPendingLeads([]); }}
                  style={{ marginLeft: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", display: "flex", padding: 2, flexShrink: 0 }}>
                  <X size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Main input box */}
          <div style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 24, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
            
            {/* Box 1: First Message */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#10a37f", letterSpacing: 0.5, display: "flex", gap: 4 }}>
                First Message <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>(AI Assistant speak first)</span>
              </label>
              <textarea
                value={firstMessage}
                onChange={e => setFirstMessage(e.target.value)}
                placeholder="Write what the AI agent speaks immediately when the call is answered..."
                rows={1}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, outline: "none", resize: "none", color: "var(--text)", fontSize: 14, lineHeight: 1.5, fontFamily: "inherit", width: "100%", minHeight: 36, maxHeight: 80, overflowY: "auto", padding: "8px 12px" }}
              />
            </div>

            {/* Box 2: Description / Script */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: 0.5 }}>
                Description / Script
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your business, FAQ, rules and details the AI should use to converse..."
                rows={2}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, outline: "none", resize: "none", color: "var(--text)", fontSize: 14, lineHeight: 1.5, fontFamily: "inherit", width: "100%", minHeight: 60, maxHeight: 150, overflowY: "auto", padding: "8px 12px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {/* + button */}
              <div style={{ position: "relative" }} ref={menuRef}>
                <button onClick={() => setShowUploadMenu(v => !v)}
                  style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "#3a3a3a", cursor: "pointer", color: "var(--text-sub)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#444")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#3a3a3a")}>
                  <Plus size={18} />
                </button>
                {showUploadMenu && (
                  <div className="fade-up" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "#2a2a2a", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", minWidth: 200, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", cursor: "pointer", fontSize: 13, color: "var(--text)", transition: "background .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <FileSpreadsheet size={15} color="var(--text-muted)" />
                      Upload CSV file
                      <input type="file" accept=".csv" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    </label>
                    <button onClick={() => { setShowSheetInput(true); setShowUploadMenu(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--text)", width: "100%", transition: "background .15s", borderTop: "1px solid var(--border)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Link2 size={15} color="var(--text-muted)" />
                      Google Sheet link
                    </button>
                  </div>
                )}
              </div>

              {/* Send button */}
              <button onClick={handleSend} disabled={!canSend}
                style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: canSend ? "#fff" : "#3a3a3a", cursor: canSend ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
                onMouseEnter={e => { if (canSend) e.currentTarget.style.background = "#e5e5e5"; }}
                onMouseLeave={e => { if (canSend) e.currentTarget.style.background = "#fff"; }}>
                <ArrowUp size={16} color={canSend ? "#000" : "#555"} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ 
  msg, 
  onStop, 
  onPause, 
  onResume 
}: { 
  msg: CampaignMessage; 
  onStop?: () => void; 
  onPause?: () => void; 
  onResume?: () => void; 
}) {
  return (
    <div style={{ width: "100%", maxWidth: 720, marginBottom: 24 }} className="fade-up">
      {/* File card */}
      {msg.file && (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#2a2a2a", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 12px", cursor: "pointer" }}
            onClick={() => { const u = msg.file!.dataUrl || msg.file!.url; if (u) window.open(u, "_blank"); }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1e6b4a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileSpreadsheet size={18} color="#4ade80" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.file.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Spreadsheet · {msg.file.count} leads</p>
            </div>
          </div>
        </div>
      )}

      {/* Script text */}
      {(() => {
        let displayFirstMessage = "";
        let displayDescription = "";
        try {
          const parsed = JSON.parse(msg.script);
          if (parsed && typeof parsed === "object") {
            displayFirstMessage = parsed.firstMessage || "";
            displayDescription = parsed.description || "";
          } else {
            displayFirstMessage = msg.script;
          }
        } catch (e) {
          displayFirstMessage = msg.script;
        }

        return (
          <>
            {displayFirstMessage && (
              <div style={{ background: "#2a2a2a", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                <p style={{ margin: "0 0 6px 0", fontSize: 11, fontWeight: 700, color: "#10a37f", textTransform: "uppercase", letterSpacing: 0.5 }}>First Message (AI Assistant speak first)</p>
                <p style={{ margin: 0, color: "var(--text-sub)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{displayFirstMessage}</p>
              </div>
            )}
            {displayDescription && (
              <div style={{ background: "#2a2a2a", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                <p style={{ margin: "0 0 6px 0", fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5 }}>Description / Script</p>
                <p style={{ margin: 0, color: "var(--text-sub)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{displayDescription}</p>
              </div>
            )}
          </>
        );
      })()}

      {/* Status row */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {msg.status === "calling" && (
            <>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #10a37f", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                Calling Leads: <span style={{ color: "#10a37f" }}>{msg.calledCount}</span> / {msg.file?.count ?? 0}
              </span>
              <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                {onPause && (
                  <button
                    onClick={onPause}
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      color: "var(--orange)",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(245, 158, 11, 0.25)";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(245, 158, 11, 0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Pause size={12} /> Pause
                  </button>
                )}
                {onStop && (
                  <button
                    onClick={onStop}
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "var(--red)",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Square size={12} fill="currentColor" /> Stop
                  </button>
                )}
              </div>
            </>
          )}

          {msg.status === "paused" && (
            <>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)" }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                Campaign Paused: <span style={{ color: "var(--orange)" }}>{msg.calledCount}</span> / {msg.file?.count ?? 0}
              </span>
              <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                {onResume && (
                  <button
                    onClick={onResume}
                    style={{
                      background: "rgba(16, 163, 127, 0.15)",
                      border: "1px solid rgba(16, 163, 127, 0.3)",
                      color: "#10a37f",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(16, 163, 127, 0.25)";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(16, 163, 127, 0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(16, 163, 127, 0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Play size={12} fill="currentColor" /> Resume
                  </button>
                )}
                {onStop && (
                  <button
                    onClick={onStop}
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "var(--red)",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Square size={12} fill="currentColor" /> Stop
                  </button>
                )}
              </div>
            </>
          )}

          {msg.status === "done" && (
            <>
              <CheckCircle2 size={20} color="#10a37f" />
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                Called {msg.calledCount} leads successfully
              </span>
            </>
          )}

          {msg.status === "error" && (
            <>
              <AlertCircle size={20} color="var(--red)" />
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--red)" }}>Campaign Stopped</span>
            </>
          )}
        </div>

        {/* Show per-lead errors in a clean way */}
        {msg.errorDetails && (
          <div style={{ background: "rgba(255, 77, 77, 0.05)", border: "1px solid rgba(255, 77, 77, 0.2)", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ margin: "0 0 6px 0", fontSize: 12, fontWeight: 700, color: "var(--red)", textTransform: "uppercase" }}>Action Required / Errors</p>
            <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
              {msg.errorDetails.split("\n").map((err, i) => (
                <p key={i} style={{ margin: 0, fontSize: 13, color: "var(--text-sub)", display: "flex", gap: 6 }}>
                  <span style={{ color: "var(--red)" }}>•</span> {err}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
