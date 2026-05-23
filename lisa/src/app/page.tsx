"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CampaignPage from "@/components/campaign/CampaignPage";
import TaggingSection from "@/components/tagging/TaggingSection";
import CreditsSection from "@/components/credits/CreditsSection";
import HistorySection from "@/components/history/HistorySection";

export type Tab = "campaign" | "leads" | "history" | "credits";

export interface Lead { 
  [key: string]: any; 
  status?: "pending" | "interested" | "not-interested" | "called";
  lastCallId?: string;
}

export interface UploadedFile {
  name: string;
  type: "csv" | "sheet";
  url?: string;
  dataUrl?: string;
  count: number;
}

export interface CampaignMessage {
  id: string;
  file: UploadedFile | null;
  script: string;
  status: "calling" | "done" | "error";
  calledCount: number;
  errorDetails?: string;
}

export interface Campaign {
  id: string;
  name: string;
  messages: CampaignMessage[];
  leads: Lead[];
}

function genId() { return Math.random().toString(36).slice(2, 9); }

function newCampaign(): Campaign {
  return { id: genId(), name: "New Campaign", messages: [], leads: [] };
}

const STORAGE_KEY = "lisa_campaigns";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>("campaign");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [userName, setUserName] = useState<string>("Priya");
  const [userEmail, setUserEmail] = useState<string>("upadhyaypriya974@gmail.com");

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || searchParams.get("id") || "";

  // 1. Load User Profile & Campaigns from Database
  useEffect(() => {
    // Load profile
    fetch(`/api/credits?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setUserName(data.name);
          if (data.email) setUserEmail(data.email);
        }
      })
      .catch(err => console.error("Failed to load profile:", err));

    // Load campaigns
    if (userId) {
      fetch(`/api/campaigns?userId=${userId}`)
        .then(res => res.json())
        .then((data: Campaign[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setCampaigns(data);
            setActiveCampaignId(data[0].id);
          } else {
            const first = newCampaign();
            setCampaigns([first]);
            setActiveCampaignId(first.id);
            saveCampaign(first);
          }
          setHasLoaded(true);
        })
        .catch(err => {
          console.error("Failed to load campaigns from DB:", err);
          const first = newCampaign();
          setCampaigns([first]);
          setActiveCampaignId(first.id);
          setHasLoaded(true);
        });
    } else {
      const first = newCampaign();
      setCampaigns([first]);
      setActiveCampaignId(first.id);
      setHasLoaded(true);
    }
  }, [userId]);

  // Background save helper
  const saveCampaign = async (campaign: Campaign) => {
    if (!userId) return;
    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, campaign }),
      });
    } catch (err) {
      console.error("Failed to save campaign to DB:", err);
    }
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) ?? campaigns[0];

  const handleNewCampaign = () => {
    const c = newCampaign();
    setCampaigns(prev => [c, ...prev]);
    setActiveCampaignId(c.id);
    setActiveTab("campaign");
    saveCampaign(c);
  };

  const handleSelectCampaign = (id: string) => {
    setActiveCampaignId(id);
    setActiveTab("campaign");
  };

  const handleRenameCampaign = (id: string, name: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, name };
        saveCampaign(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => {
      const next = prev.filter(c => c.id !== id);
      if (next.length === 0) {
        const c = newCampaign();
        setActiveCampaignId(c.id);
        saveCampaign(c);
        return [c];
      }
      if (id === activeCampaignId) setActiveCampaignId(next[0].id);
      return next;
    });
    if (userId) {
      fetch(`/api/campaigns?id=${id}`, { method: "DELETE" }).catch(err => console.error("Error deleting campaign:", err));
    }
  };

  const updateCampaign = (id: string, updater: (c: Campaign) => Campaign) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const updated = updater(c);
        saveCampaign(updated);
        return updated;
      }
      return c;
    }));
  };

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/history?limit=100")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setLogs(data); });
  }, [activeCampaign]);

  const runPendingCalls = () => {
    // 1. Identify all unique leads (merged sheet + history)
    const map = new Map();
    if (activeCampaign) {
      activeCampaign.leads.forEach(l => {
        const phoneKey = Object.keys(l).find(k => /phone|mobile/i.test(k));
        const phone = phoneKey ? String(l[phoneKey]).replace(/[^0-9+]/g, "") : null;
        if (phone) map.set(phone, { ...l, phone });
      });
    }
    logs.forEach(log => {
      const phone = log.customer?.number;
      if (phone && !map.has(phone)) map.set(phone, { phone, status: "pending" });
    });

    const allMergedLeads = Array.from(map.values());
    const pendingLeads = allMergedLeads.filter(l => !l.status || l.status === "pending");

    if (pendingLeads.length === 0) return alert("No pending leads to call!");
    
    // 2. We'll simulate starting the campaign with ONLY these pending leads
    if (activeCampaign) {
      updateCampaign(activeCampaign.id, (prev) => ({
        ...prev,
        leads: pendingLeads // Temp switch to pending leads for calling
      }));
    }
    
    setActiveTab("campaign");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        campaigns={campaigns}
        activeCampaignId={activeCampaign?.id ?? ""}
        onNewCampaign={handleNewCampaign}
        onSelectCampaign={handleSelectCampaign}
        onRenameCampaign={handleRenameCampaign}
        onDeleteCampaign={handleDeleteCampaign}
        userName={userName}
        userEmail={userEmail}
      />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "campaign" && activeCampaign && (
          <CampaignPage
            campaign={activeCampaign}
            updateCampaign={(updater) => updateCampaign(activeCampaign.id, updater)}
            userId={userId}
          />
        )}
        {activeTab === "leads" && (
          <TaggingSection 
            leads={activeCampaign?.leads ?? []} 
            logs={logs}
            onRunPending={runPendingCalls}
          />
        )}
        {activeTab === "history" && <HistorySection campaigns={campaigns} />}
        {activeTab === "credits" && <CreditsSection userId={userId} />}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--main-bg)", color: "var(--text)" }}>
        Loading Lisa Dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
