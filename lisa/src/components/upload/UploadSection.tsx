"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import {
  Upload,
  Link2,
  X,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import type { Lead } from "@/app/page";
import ScriptEditor from "./ScriptEditor";

interface Props {
  leads: Lead[];
  setLeads: (l: Lead[]) => void;
  script: string;
  setScript: (s: string) => void;
}

export default function UploadSection({ leads, setLeads, script, setScript }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"file" | "sheet">("file");

  const processCSV = (text: string, name: string) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }: { data: any[] }) => {
        setLeads(data as Lead[]);
        setFileName(name);
        setError("");
      },
      error: () => setError("Could not parse file. Please check the CSV format."),
    });
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => processCSV(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleGoogleSheet = async () => {
    setError("");
    setLoading(true);
    try {
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) throw new Error("Invalid Google Sheet link.");
      const id = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error("Make sure the sheet is publicly accessible (Anyone with link → Viewer).");
      const text = await res.text();
      processCSV(text, "Google Sheet");
    } catch (err: any) {
      setError(err.message || "Failed to fetch sheet.");
    } finally {
      setLoading(false);
    }
  };

  const columns = leads.length > 0 ? Object.keys(leads[0]) : [];

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", margin: 0, marginBottom: 6 }}>
          New Campaign
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>
          Upload your leads and define the script your AI agent will follow.
        </p>
      </div>

      {/* ── STEP 1 ── */}
      <StepCard step={1} title="Upload Leads" subtitle="CSV file or Google Sheet link">
        {/* Tab toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface-2)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {(["file", "sheet"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                background: tab === t ? "var(--surface)" : "transparent",
                color: tab === t ? "var(--text)" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              {t === "file" ? "📄 CSV File" : "🔗 Google Sheet"}
            </button>
          ))}
        </div>

        {/* File drop zone */}
        {tab === "file" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("csv-input")?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--blue-light)" : "var(--border)"}`,
              borderRadius: 14,
              padding: "40px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging ? "var(--blue-glow)" : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            <input
              id="csv-input"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div style={{ marginBottom: 12 }}>
              <Upload size={28} color="var(--text-dim)" style={{ margin: "0 auto" }} />
            </div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>
              {fileName ? `✓ ${fileName}` : "Drop your CSV here or click to browse"}
            </p>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 12 }}>
              Columns: name, phone (required)
            </p>
          </div>
        )}

        {/* Google Sheet */}
        {tab === "sheet" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>
              Sheet must be public: <b>Share → Anyone with link → Viewer</b>
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0 14px" }}>
                <Link2 size={14} color="var(--text-dim)" />
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text)",
                    fontSize: 13,
                    padding: "12px 0",
                  }}
                />
              </div>
              <button
                onClick={handleGoogleSheet}
                disabled={!sheetUrl || loading}
                style={{
                  padding: "0 20px",
                  borderRadius: 10,
                  border: "none",
                  cursor: sheetUrl && !loading ? "pointer" : "not-allowed",
                  background: "var(--blue)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  opacity: !sheetUrl || loading ? 0.6 : 1,
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Fetching..." : "Fetch Leads"}
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 8, color: "var(--red)", fontSize: 12 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Preview Table */}
        {leads.length > 0 && (
          <div style={{ marginTop: 20, borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }} className="animate-fade-in">
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                <FileSpreadsheet size={13} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                {leads.length} leads loaded — showing first 5
              </span>
              <button
                onClick={() => { setLeads([]); setFileName(""); setSheetUrl(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 2, display: "flex" }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)" }}>
                    {columns.map((col) => (
                      <th key={col} style={{ padding: "8px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 500, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead, i) => (
                    <tr key={i} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                      {columns.map((col) => (
                        <td key={col} style={{ padding: "9px 16px", color: "var(--text)", whiteSpace: "nowrap" }}>
                          {lead[col] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StepCard>

      {/* ── STEP 2 ── */}
      <StepCard step={2} title="AI Script" subtitle="Your agent will follow exactly what you write here">
        <ScriptEditor script={script} setScript={setScript} />
      </StepCard>

      {/* Start button */}
      {leads.length > 0 && script.trim() && (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }} className="animate-fade-in">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 36px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: "var(--blue)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.2px",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(37,99,235,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(37,99,235,0.35)";
            }}
          >
            Start Calling — {leads.length} leads
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function StepCard({ step, title, subtitle, children }: { step: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        padding: "28px 28px",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          {step}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
