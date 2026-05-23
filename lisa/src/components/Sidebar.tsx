"use client";

import { useState, useRef, useEffect } from "react";
import { PhoneCall, Users, History, CreditCard, Search, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import type { Tab, Campaign } from "@/app/page";

interface Props {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  campaigns: Campaign[];
  activeCampaignId: string;
  onNewCampaign: () => void;
  onSelectCampaign: (id: string) => void;
  onRenameCampaign: (id: string, name: string) => void;
  onDeleteCampaign: (id: string) => void;
  userName?: string;
  userEmail?: string;
}

const bottomNav = [
  { id: "leads"   as Tab, icon: Users,      label: "Pending Calls" },
  { id: "history" as Tab, icon: History,    label: "Call History" },
  { id: "credits" as Tab, icon: CreditCard, label: "Credits" },
];

export default function Sidebar({ activeTab, setActiveTab, campaigns, activeCampaignId, onNewCampaign, onSelectCampaign, onRenameCampaign, onDeleteCampaign, userName, userEmail }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const startRename = (c: Campaign) => {
    setRenamingId(c.id);
    setRenameVal(c.name);
    setMenuId(null);
  };

  const confirmRename = (id: string) => {
    if (renameVal.trim()) onRenameCampaign(id, renameVal.trim());
    setRenamingId(null);
  };

  return (
    <aside style={{
      width: 260, minWidth: 260,
      background: "var(--sidebar-bg)",
      display: "flex", flexDirection: "column",
      padding: "12px 10px 16px",
      borderRight: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {/* Logo row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 6px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#10a37f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhoneCall size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Lisa AI</span>
        </div>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          style={{ background: showSearch ? "#333" : "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 6, borderRadius: 6 }}>
          <Search size={16} />
        </button>
      </div>

      {showSearch && (
        <div style={{ padding: "0 4px 12px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#2a2a2a", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px" }}>
            <Search size={13} color="var(--text-dim)" />
            <input 
              autoFocus
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, width: "100%" }}
            />
          </div>
        </div>
      )}

      {/* New Campaign button */}
      <button
        onClick={onNewCampaign}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8,
          border: "1px solid var(--border)",
          background: "transparent", color: "var(--text)",
          cursor: "pointer", fontSize: 13, fontWeight: 500,
          marginBottom: 16, transition: "background .15s", width: "100%",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#222")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <PhoneCall size={13} />
        New Campaign
      </button>

      {/* Past campaigns */}
      {campaigns.length > 0 && (
        <>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", padding: "0 6px", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recents
          </p>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, marginBottom: 12 }}>
            {campaigns
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(c => {
              const isActive = c.id === activeCampaignId;
              const isRenaming = renamingId === c.id;
              return (
                <div
                  key={c.id}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => { setHoveredId(null); }}
                >
                  <button
                    onClick={() => onSelectCampaign(c.id)}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "8px 8px 8px 10px", borderRadius: 8,
                      border: "none", cursor: "pointer", fontSize: 13,
                      background: isActive ? "#3a3a3a" : "transparent",
                      color: isActive ? "var(--text)" : "var(--text-muted)",
                      transition: "all .15s", textAlign: "left", width: "100%",
                      fontWeight: isActive ? 600 : 400,
                      boxShadow: isActive ? "inset 0 0 0 1px #444" : "none",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#2a2a2a"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    {isRenaming ? (
                      <input
                        autoFocus
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") confirmRename(c.id); if (e.key === "Escape") setRenamingId(null); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", borderRadius: 4, outline: "none", color: "var(--text)", fontSize: 13, padding: "1px 6px", fontFamily: "inherit" }}
                      />
                    ) : (
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </span>
                    )}

                    {/* Pencil icon — show on hover for easier rename */}
                    {(hoveredId === c.id) && !isRenaming && (
                      <span
                        onClick={e => { e.stopPropagation(); startRename(c); }}
                        style={{ padding: "2px 4px", borderRadius: 4, color: "var(--text-muted)", display: "flex", cursor: "pointer", flexShrink: 0, marginLeft: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        <Pencil size={13} />
                      </span>
                    )}

                    {/* 3-dot button — show on hover */}
                    {(hoveredId === c.id || menuId === c.id) && !isRenaming && (
                      <span
                        onClick={e => { e.stopPropagation(); setMenuId(menuId === c.id ? null : c.id); }}
                        style={{ padding: "2px 3px", borderRadius: 4, color: "var(--text-muted)", display: "flex", cursor: "pointer", flexShrink: 0, marginLeft: 2 }}
                      >
                        <MoreHorizontal size={14} />
                      </span>
                    )}

                    {isRenaming && (
                      <span style={{ display: "flex", gap: 4, marginLeft: 4, flexShrink: 0 }}>
                        <span onClick={e => { e.stopPropagation(); confirmRename(c.id); }} style={{ cursor: "pointer", color: "#10a37f" }}><Check size={14} /></span>
                        <span onClick={e => { e.stopPropagation(); setRenamingId(null); }} style={{ cursor: "pointer", color: "var(--red)" }}><X size={14} /></span>
                      </span>
                    )}
                  </button>

                  {/* Context menu — Fixed Toggle */}
                  {menuId === c.id && (
                      <div ref={menuRef} style={{
                        position: "absolute", left: "100%", top: 0, marginLeft: 4,
                        background: "#2a2a2a", border: "1px solid var(--border)",
                        borderRadius: 10, overflow: "hidden", minWidth: 140, zIndex: 200,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      }}>
                        <button
                          onClick={() => startRename(c)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--text)", width: "100%", transition: "background .15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Pencil size={13} /> <span>Rename</span>
                        </button>
                        <button
                          onClick={() => { onDeleteCampaign(c.id); setMenuId(null); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--red)", width: "100%", transition: "background .15s", borderTop: "1px solid var(--border)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#331a1a")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Trash2 size={13} /> <span>Delete</span>
                        </button>
                      </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom nav */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 1 }}>
        {bottomNav.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13,
                background: active ? "#2a2a2a" : "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                fontWeight: active ? 500 : 400, transition: "all .15s", textAlign: "left", width: "100%",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#202020"; e.currentTarget.style.color = "var(--text)"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
            >
              <Icon size={14} />{label}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 8px 0", marginTop: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {(userName || "Priya").charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName || "Priya"}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10a37f", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail || "Connected"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
