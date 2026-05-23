"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  script: string;
  setScript: (s: string) => void;
}

type SaveState = "idle" | "saving" | "saved";

export default function ScriptEditor({ script, setScript }: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 260) + "px";
  }, [script]);

  const handleSave = async () => {
    if (!script.trim()) return;
    setSaveState("saving");
    try {
      // This updates VAPI assistant's systemPrompt via our backend API
      const res = await fetch("/api/update-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch {
      setSaveState("idle");
    }
  };

  const hasScript = script.trim().length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Info banner */}
      <div
        style={{
          background: "rgba(37,99,235,0.06)",
          border: "1px solid rgba(37,99,235,0.2)",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        💡 <b style={{ color: "var(--text)" }}>How it works:</b> When you click Save, your script will be automatically pushed to your Vapi assistant. The AI agent will follow your exact script on every call — no Vapi access needed.
      </div>

      {/* Input Box */}
      <div
        style={{
          background: "var(--surface-2)",
          border: `1px solid ${hasScript ? "var(--border-hover)" : "var(--border)"}`,
          borderRadius: 16,
          padding: "4px 6px 6px 6px",
          transition: "border-color 0.2s",
        }}
        onFocus={() => {}}
      >
        <textarea
          ref={textareaRef}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder={`Write your AI agent's script here...

Example:
"Hello {{name}}, I'm Lisa calling from [Company]. I'm reaching out because..."`}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "var(--text)",
            fontSize: 13,
            lineHeight: 1.7,
            padding: "12px 14px 8px",
            fontFamily: "inherit",
            minHeight: 100,
            maxHeight: 260,
            overflowY: "auto",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSave();
            }
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px 4px",
            borderTop: "1px solid var(--border)",
            marginTop: 2,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            {script.length > 0 ? `${script.length} chars` : "Tip: Use {{name}} to personalize"}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {saveState === "saved" && (
              <span style={{ fontSize: 11, color: "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={12} />
                Saved to Vapi
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasScript || saveState === "saving"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 10,
                border: "none",
                cursor: hasScript && saveState !== "saving" ? "pointer" : "not-allowed",
                background: hasScript ? "var(--blue)" : "var(--surface)",
                color: hasScript ? "#fff" : "var(--text-dim)",
                fontSize: 12,
                fontWeight: 600,
                opacity: saveState === "saving" ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {saveState === "saving" ? (
                <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Send size={13} />
              )}
              {saveState === "saving" ? "Saving..." : "Save Script"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
