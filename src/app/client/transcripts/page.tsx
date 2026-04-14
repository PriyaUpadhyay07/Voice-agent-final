'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Upload, Activity, FileText, Wallet, LogOut, Loader2, PhoneCall, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  calls: Call[];
};

type ClientData = {
  id: string;
  name: string;
  email: string;
  walletAmount: number;
  leads: Lead[];
};

export default function ClientTranscriptsPage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<(Call & { leadName: string; leadPhone: string; leadCompany: string | null }) | null>(null);
  const [filter, setFilter] = useState('all');
  const [syncing, setSyncing] = useState<string | null>(null);

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchClient();
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [sessionStatus]);

  async function fetchClient() {
    setLoading(true);
    const userId = (session?.user as any)?.id;
    if (!userId) return;

    try {
      const detailRes = await fetch(`/api/clients/${userId}`);
      if (detailRes.ok) {
        const data = await detailRes.json();
        setClient(data);
        
        // Update selected call if it's open to show new transcript
        if (selectedCall && data.leads) {
          for (const lead of data.leads) {
            const matched = lead.calls.find((cc: Call) => cc.id === selectedCall.id);
            if (matched) {
              setSelectedCall({
                ...matched,
                leadName: lead.name,
                leadPhone: lead.phone,
                leadCompany: lead.company
              });
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch client data", error);
    }
    setLoading(false);
  }

  async function syncTranscript(callId: string) {
    setSyncing(callId);
    try {
      const res = await fetch(`/api/call/${callId}/sync`);
      const data = await res.json();
      if (res.ok) {
        await fetchClient();
      } else {
        alert(data.error || 'Failed to sync');
      }
    } catch (e) {
      alert('Error syncing transcript');
    }
    setSyncing(null);
  }

  const allCalls: (Call & { leadName: string; leadPhone: string; leadCompany: string | null })[] = [];
  if (client && client.leads) {
    for (const lead of client.leads) {
      if (lead.calls) {
        for (const call of lead.calls) {
          allCalls.push({
            ...call,
            leadName: lead.name,
            leadPhone: lead.phone,
            leadCompany: lead.company,
          });
        }
      }
    }
  }
  allCalls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredCalls = filter === 'all' ? allCalls : allCalls.filter(c => c.status === filter);

  const statusIcon = (status: string | null) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} color="#10b981" />;
      case 'failed': return <XCircle size={14} color="#f87171" />;
      default: return <AlertCircle size={14} color="#fbbf24" />;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (!client) return null;

  const totalCost = allCalls.reduce((sum, c) => sum + c.costDeducted, 0);
  const totalDuration = allCalls.reduce((sum, c) => sum + c.duration, 0);

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
        <Link href="/client" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <Activity size={16} /> Dashboard
        </Link>
        <Link href="/client/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <Upload size={16} /> My Leads
        </Link>
        <Link href="/client/transcripts" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
          <FileText size={16} /> Transcripts
        </Link>
        <div style={{ marginTop: 'auto' }}>
          <div className="glass-card" style={{ marginBottom: '0.75rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Wallet size={16} color="#10b981" />
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Wallet Balance</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>${client.walletAmount.toFixed(2)}</span>
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Call Transcripts</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
            Review detailed transcripts, durations, and costs for every AI call.
          </p>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <PhoneCall size={14} /> Total Calls
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{allCalls.length}</span>
          </div>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <Clock size={14} /> Total Duration
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {totalDuration > 0 ? `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s` : '0s'}
            </span>
          </div>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <DollarSign size={14} /> Total Cost
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>${totalCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'completed', 'failed', 'initiated'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: filter === f ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                background: filter === f ? 'hsla(var(--primary), 0.15)' : 'transparent',
                color: filter === f ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500', transition: 'all 0.2s ease',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transcript Detail View */}
        {selectedCall && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
          }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '700px', width: '100%', maxHeight: '85vh', overflow: 'auto', background: 'hsl(var(--card))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '1.15rem' }}>📞 Call Transcript</h3>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {selectedCall.leadName} • {selectedCall.leadPhone}
                    {selectedCall.leadCompany && ` • ${selectedCall.leadCompany}`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {!selectedCall.transcript && selectedCall.status === 'completed' && (
                    <button
                      onClick={() => syncTranscript(selectedCall.id)}
                      className="btn-primary"
                      disabled={syncing === selectedCall.id}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#6366f1' }}
                    >
                      {syncing === selectedCall.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sync Transcript'}
                    </button>
                  )}
                  <button onClick={() => setSelectedCall(null)} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}>×</button>
                </div>
              </div>

              {/* Call Metadata */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(59,130,246,0.1)', fontSize: '0.8rem', color: '#60a5fa',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  <Clock size={13} /> {selectedCall.duration > 0 ? `${Math.floor(selectedCall.duration / 60)}m ${selectedCall.duration % 60}s` : 'N/A'}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(16,185,129,0.1)', fontSize: '0.8rem', color: '#34d399',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  <DollarSign size={13} /> ${selectedCall.costDeducted.toFixed(2)}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: selectedCall.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  fontSize: '0.8rem',
                  color: selectedCall.status === 'completed' ? '#34d399' : '#f87171',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  {statusIcon(selectedCall.status)} {selectedCall.status || 'unknown'}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(156,163,175,0.1)', fontSize: '0.8rem', color: '#9ca3af',
                }}>
                  📅 {new Date(selectedCall.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Transcript Content */}
              <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>
                TRANSCRIPT
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                fontSize: '0.9rem',
                lineHeight: '1.9',
                whiteSpace: 'pre-wrap',
                color: 'hsl(var(--foreground))',
                border: '1px solid rgba(255,255,255,0.05)',
                maxHeight: '400px',
                overflowY: 'auto',
                fontFamily: "'Inter', sans-serif",
              }}>
                {selectedCall.transcript || '⏳ No transcript available yet.\n\nTranscripts are typically available within a few minutes after the call ends.\nIf the call is still in progress, please check back shortly.'}
              </div>
            </div>
          </div>
        )}

        {/* Calls List */}
        {filteredCalls.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <PhoneCall size={48} color="hsl(var(--muted-foreground))" style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No calls yet</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
              Transcripts will appear here after calls are completed. Upload leads and get them approved to start calling!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredCalls.map(call => (
              <div
                key={call.id}
                className="glass-card"
                style={{ cursor: 'pointer', padding: '1.25rem' }}
                onClick={() => setSelectedCall(call)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Left side — lead info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      background: call.status === 'completed'
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))'
                        : call.status === 'failed'
                          ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.1))'
                          : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(96,165,250,0.1))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {statusIcon(call.status)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{call.leadName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}>
                        {call.leadPhone}
                        {call.leadCompany && <span style={{ fontFamily: 'Inter, sans-serif' }}> • {call.leadCompany}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right side — stats */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.15rem' }}>DURATION</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        {call.duration > 0 ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '—'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.15rem' }}>COST</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>
                        {call.costDeducted > 0 ? `$${call.costDeducted.toFixed(2)}` : '—'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.15rem' }}>DATE</div>
                      <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                        {new Date(call.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                      background: call.transcript ? 'rgba(99,102,241,0.15)' : 'rgba(156,163,175,0.1)',
                      color: call.transcript ? '#818cf8' : '#6b7280',
                      display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                      <FileText size={12} />
                      {call.transcript ? 'View Transcript' : 'No Transcript'}
                    </div>
                    {!call.transcript && call.status === 'completed' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); syncTranscript(call.id); }}
                        className="btn-outline"
                        disabled={syncing === call.id}
                        style={{ padding: '0.35rem', borderRadius: '50%', color: '#6366f1', borderColor: 'rgba(99,102,241,0.2)' }}
                        title="Sync from ElevenLabs"
                      >
                        <Activity size={14} style={syncing === call.id ? { animation: 'spin 2s linear infinite' } : {}} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
