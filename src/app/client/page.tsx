'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { PhoneCall, Upload, FileText, Wallet, LogOut, Activity, Loader2, TrendingUp, Clock, CheckCircle, MessageSquare, Save, AlertTriangle } from 'lucide-react';

type Call = {
  id: string;
  duration: number;
  costDeducted: number;
  transcript: string | null;
  status: string | null;
  createdAt: string;
};

type Lead = {
  id: string;
  phone: string;
  name: string;
  company: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  calls: Call[];
};

type ClientData = {
  id: string;
  name: string;
  email: string;
  walletAmount: number;
  script: string;
  leads: Lead[];
};

export default function ClientDashboard() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <ClientDashboardContent />
    </Suspense>
  );
}

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');

  const { data: session, status: sessionStatus } = useSession();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState('');
  const [scriptSaving, setScriptSaving] = useState(false);
  const [scriptSaved, setScriptSaved] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchClient();
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [sessionStatus]);

  async function fetchClient() {
    setLoading(true);
    let userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;

    // Allow admin to view client dashboard if userId is in URL
    if (userRole === 'admin' && userIdFromUrl) {
      userId = userIdFromUrl;
    }

    if (!userId) return;

    try {
      const detailRes = await fetch(`/api/clients/${userId}`);
      if (detailRes.ok) {
        const data = await detailRes.json();
        setClient(data);
        setScript(data.script || '');
      }
    } catch (error) {
      console.error("Failed to fetch client data", error);
    }
    setLoading(false);
  }

  async function saveScript() {
    if (!client) return;
    setScriptSaving(true);
    const res = await fetch('/api/script', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: client.id, script }),
    });
    if (res.ok) {
      setScriptSaved(true);
      setTimeout(() => setScriptSaved(false), 3000);
    }
    setScriptSaving(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (client?.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <AlertTriangle size={64} color="#fbbf24" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
          <h2 style={{ marginBottom: '1rem' }}>Account Pending Approval</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Hi {client.name}, your account is currently pending activation. Our team will review your request and activate your account once the setup is complete.
          </p>
          <button onClick={() => signOut()} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginInline: 'auto' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    );
  }

  if (!client && !loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '1rem' }}>No Client Found</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>Please contact admin to set up your account.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const totalCalls = client.leads.reduce((sum, l) => sum + l.calls.length, 0);
  const totalSpent = client.leads.reduce((sum, l) => sum + l.calls.reduce((s, c) => s + c.costDeducted, 0), 0);
  const pendingLeads = client.leads.filter(l => l.status === 'pending').length;
  const completedCalls = client.leads.reduce((sum, l) => sum + l.calls.filter(c => c.status === 'completed').length, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid hsl(var(--border))',
        padding: '2rem 1rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem'
      }}>
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>🎙 VoiceAgent</h2>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Client Portal</span>
        </div>
        <Link href="/client" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
          <Activity size={16} /> Dashboard
        </Link>
        <Link href="/client/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <Upload size={16} /> My Leads
        </Link>
        <Link href="/client/transcripts" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <FileText size={16} /> Transcripts
        </Link>
        <div style={{ marginTop: 'auto' }}>
          <div className="glass-card" style={{ marginBottom: '0.75rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Wallet size={16} color="#10b981" />
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Wallet Balance</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>${client.walletAmount.toFixed(2)}</span>
              <button 
                onClick={() => alert("To add credits, please pay via Razorpay/PayPal and share screenshot with admin.\n\nAdmin Email: admin@voiceagent.com")}
                className="btn-recharge"
                style={{ 
                  background: 'rgba(16,185,129,0.2)', 
                  border: '1px solid rgba(16,185,129,0.3)', 
                  borderRadius: '999px', 
                  padding: '0.2rem 0.6rem', 
                  fontSize: '0.7rem', 
                  color: '#10b981', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                + Add
              </button>
            </div>
            <p style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Pay-as-you-go billing enabled.
            </p>
          </div>
          <button 
            onClick={() => signOut()} 
            style={{ 
              width: '100%',
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'hsl(var(--muted-foreground))',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              font: 'inherit'
            }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome, {client.name} 👋</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
            Track your leads, calls, and spending.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Total Leads</span>
              <Upload size={18} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700' }}>{client.leads.length}</h2>
            <span style={{ color: '#60a5fa', fontSize: '0.8rem' }}>{pendingLeads} pending approval</span>
          </div>

          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Calls Made</span>
              <PhoneCall size={18} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700' }}>{totalCalls}</h2>
            <span style={{ color: '#34d399', fontSize: '0.8rem' }}>{completedCalls} completed</span>
          </div>

          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Total Spent</span>
              <TrendingUp size={18} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700' }}>${totalSpent.toFixed(2)}</h2>
            <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>Across all calls</span>
          </div>

          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Avg Call Duration</span>
              <Clock size={18} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700' }}>
              {totalCalls > 0
                ? `${Math.round(client.leads.reduce((sum, l) => sum + l.calls.reduce((s, c) => s + c.duration, 0), 0) / totalCalls)}s`
                : '0s'
              }
            </h2>
            <span style={{ color: '#a78bfa', fontSize: '0.8rem' }}>Per call average</span>
          </div>
        </div>

        {/* ========================================= */}
        {/* CALLING SCRIPT SECTION                    */}
        {/* ========================================= */}
        <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MessageSquare size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Voice Agent Script</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                  Write the script your AI agent will follow during calls
                </p>
              </div>
            </div>
            <button
              onClick={saveScript}
              className="btn-primary"
              disabled={scriptSaving}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            >
              {scriptSaving ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : scriptSaved ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Script</>
              )}
            </button>
          </div>

          {/* Example template hint */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            color: 'hsl(var(--muted-foreground))',
            lineHeight: '1.6'
          }}>
            💡 <strong>Tip:</strong> Write exactly what the agent should say. Use <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{'{{lead_name}}'}</code> for the lead's name and <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{'{{lead_company}}'}</code> for their company. The agent will follow this script and adapt naturally.
          </div>

          <textarea
            value={script}
            onChange={e => setScript(e.target.value)}
            placeholder={`Example script:\n\nHi {{lead_name}}, this is calling from [Your Company]. I'm reaching out because we help businesses like {{lead_company}} automate their outbound sales process.\n\nI'd love to schedule a quick 15-minute demo to show you how we can help. Would you be available this week?\n\n[If interested]: Great! I'll send you a calendar invite. What email should I use?\n[If not interested]: No problem at all! Would it be okay if I followed up in a couple of weeks?`}
            style={{
              width: '100%',
              minHeight: '200px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: 'hsl(var(--foreground))',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              fontSize: '0.9rem',
              lineHeight: '1.7',
              fontFamily: "'Inter', sans-serif",
              resize: 'vertical',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)'}
          />

          {scriptSaved && (
            <div className="animate-fade-in" style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={16} /> Script saved! Your AI agent will use this during calls.
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Leads</h3>
            <Link href="/client/leads" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Upload size={16} /> Upload Leads
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Calls</th>
                </tr>
              </thead>
              <tbody>
                {client.leads.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>
                    No leads uploaded yet. <Link href="/client/leads" style={{ color: 'hsl(var(--primary))' }}>Upload your first leads</Link>
                  </td></tr>
                ) : client.leads.slice(0, 10).map(lead => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: '500' }}>{lead.name}</td>
                    <td style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}>{lead.phone}</td>
                    <td style={{ color: 'hsl(var(--muted-foreground))' }}>{lead.company || '—'}</td>
                    <td>
                      <span className={`status-badge status-${lead.status}`}>
                        {lead.status}
                        {lead.status === 'rejected' && lead.rejectReason && (
                          <span title={lead.rejectReason}> ⓘ</span>
                        )}
                      </span>
                    </td>
                    <td style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {lead.calls.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle size={14} color="#10b981" />
                          {lead.calls.length}
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
