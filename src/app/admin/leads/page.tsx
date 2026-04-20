'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { PhoneCall, Activity, Users, LogOut, CheckCircle, XCircle, Trash2, Phone, Loader2, Plus, Upload, FileText, Eye, Clock } from 'lucide-react';
import { resilientFetch } from '@/lib/fetch-utils';

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
  userId: string;
  phone: string;
  name: string;
  company: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  calls: Call[];
  batchId: string | null;
  user?: { name: string; email: string };
};

type Client = {
  id: string;
  name: string;
  email: string;
  script: string | null;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Add lead form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ userId: '', name: '', phone: '', company: '' });
  const [addLoading, setAddLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  // Batch management
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [batches, setBatches] = useState<string[]>([]);
  
  // Script management
  const [clientScript, setClientScript] = useState('');
  const [scriptSaving, setScriptSaving] = useState(false);

  // Transcript modal
  const [selectedTranscript, setSelectedTranscript] = useState<{
    call: Call;
    leadName: string;
    leadPhone: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [leadsData, clientsData] = await Promise.all([
        resilientFetch('/api/admin/leads'),
        resilientFetch('/api/clients'),
      ]);
      setLeads(leadsData);
      setClients(clientsData);
      
      // Extract unique batches
      const uniqueBatches = Array.from(new Set(leadsData.map((l: any) => l.batchId).filter(Boolean))) as string[];
      setBatches(uniqueBatches);

      if (clientsData.length > 0 && !addFormData.userId) {
        const firstClient = clientsData[0];
        setAddFormData(prev => ({ ...prev, userId: firstClient.id }));
        setClientScript(firstClient.script || '');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch data. Please check your tunnel/connection.');
    } finally {
      setLoading(false);
    }
  }


  async function saveScript() {
    if (!addFormData.userId) return;
    setScriptSaving(true);
    try {
      const res = await fetch(`/api/clients/${addFormData.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: clientScript }),
      });
      if (res.ok) {
        alert('✅ Script saved successfully!');
        // Update client list local state
        setClients(prev => prev.map(c => c.id === addFormData.userId ? { ...c, script: clientScript } : c));
      } else {
        alert('Failed to save script');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setScriptSaving(false);
    }
  }

  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addFormData),
    });
    if (res.ok) {
      setShowAddForm(false);
      setAddFormData({ userId: addFormData.userId, name: '', phone: '', company: '' });
      await fetchData();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to add lead');
    }
    setAddLoading(false);
  }

  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !addFormData.userId) {
      alert('Please select a client first');
      return;
    }

    setAddLoading(true);
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const leadsToAdd: { name: string; phone: string; company?: string }[] = [];

    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        leadsToAdd.push({ name: parts[0], phone: parts[1], company: parts[2] || undefined });
      }
    }

    if (leadsToAdd.length === 0) {
      alert('No valid leads found in CSV. Format: name,phone,company');
      setAddLoading(false);
      return;
    }

    const batchName = file.name.replace('.csv', '') + '_' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: addFormData.userId, 
        leads: leadsToAdd,
        batchId: batchName
      }),
    });

    if (res.ok) {
      const data = await res.json();
      alert(`✅ ${data.count} leads uploaded successfully to batch: ${batchName}!`);
      await fetchData();
    } else {
      alert('Failed to upload CSV');
    }

    setAddLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function updateStatus(id: string, status: string, rejectReason?: string) {
    setActionLoading(id);
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectReason }),
    });
    await fetchData();
    setActionLoading(null);
  }

  async function syncTranscript(callId: string) {
    setActionLoading(callId);
    try {
      const res = await fetch(`/api/call/${callId}/sync`);
      const data = await res.json();
      if (res.ok) {
        await fetchData();
        // Update modal if open
        if (selectedTranscript?.call.id === callId) {
          setSelectedTranscript(prev => prev ? { ...prev, call: { ...prev.call, transcript: data.transcript } } : null);
        }
      } else {
        alert(data.error || 'Failed to sync');
      }
    } catch (e) {
      alert('Error syncing transcript');
    }
    setActionLoading(null);
  }

  async function initiateCall(leadId: string) {
    setActionLoading(leadId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Call failed');
      } else {
        alert(`✅ Call initiated! SID: ${data.callSid}`);
      }
      await fetchData();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        alert('⌛ Request timed out. The call might still be processing on the server, please check status in a moment.');
      } else {
        alert('Error: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead permanently?')) return;
    setActionLoading(id);
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    await fetchData();
    setActionLoading(null);
  }

  async function runAllCalls() {
    // Filter by status AND batch if selected
    let leadsToCall = leads.filter(l => !l.phone.includes('@'));
    
    if (filter !== 'all') {
      leadsToCall = leadsToCall.filter(l => l.status === filter);
    }
    
    if (selectedBatch !== 'all') {
      leadsToCall = leadsToCall.filter(l => l.batchId === selectedBatch);
    }

    if (leadsToCall.length === 0) {
      alert("No callable leads found matching your filters.");
      return;
    }
    
    if (!confirm(`Run AI agent on ${leadsToCall.length} leads? Each call will wait 60 seconds before the next one starts.`)) return;

    for (let i = 0; i < leadsToCall.length; i++) {
      const lead = leadsToCall[i];
      setActionLoading(lead.id);
      
      // Initiate call
      try {
        const res = await fetch('/api/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`Call failed for ${lead.name}: ` + (data.error || 'Unknown error'));
        } else {
          // Wait 60 seconds for AI to have conversation before next call
          if (i < leadsToCall.length - 1) {
            for (let sec = 60; sec > 0; sec--) {
              setActionLoading(lead.id);
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }
      } catch (e: any) {
        alert(`Error calling ${lead.name}: ${e.message}`);
      }
      
      await fetchData();
    }
    setActionLoading(null);
    alert("All calls completed!");
  }


  const filteredByStatus = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const filtered = selectedBatch === 'all' ? filteredByStatus : filteredByStatus.filter(l => l.batchId === selectedBatch);

  const statusCounts = {
    all: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    approved: leads.filter(l => l.status === 'approved').length,
    calling: leads.filter(l => l.status === 'calling').length,
    waiting: leads.filter(l => l.status === 'waiting').length,
    rejected: leads.filter(l => l.status === 'rejected').length,
  };

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
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Admin Portal</span>
        </div>
        <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <Activity size={16} /> Dashboard
        </Link>
        <Link href="/admin/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
          <PhoneCall size={16} /> Leads & Calls
        </Link>
        <Link href="/admin/clients" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <Users size={16} /> Clients
        </Link>
        <div style={{ marginTop: 'auto' }}>
          <Link href="/" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
            <LogOut size={16} /> Exit
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Leads & Calls Management</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
              Add leads, approve, reject, and initiate AI calls.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>

            <button onClick={runAllCalls} className="btn-primary" style={{ background: '#ec4899', borderColor: '#ec4899' }}>
              <Phone size={18} /> Run Agent on All
            </button>
            <button 
              onClick={() => {
                setFilter('pending');
                setTimeout(() => runAllCalls(), 100);
              }} 
              className="btn-outline" 
              style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}
            >
              <Clock size={18} /> Recall All Pending
            </button>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
              <Plus size={18} /> Add Lead
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCSVUpload}
              accept=".csv"
              style={{ display: 'none' }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="btn-outline" 
              style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}
              disabled={addLoading}
            >
              <Upload size={18} /> {addLoading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>

        {/* Script Editor Section */}
        <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>🤖 AI Agent Script</h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>Write the instructions/script the AI agent should follow for this client.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select
                value={addFormData.userId}
                onChange={e => {
                  const client = clients.find(c => c.id === e.target.value);
                  setAddFormData({ ...addFormData, userId: e.target.value });
                  if (client) setClientScript(client.script || '');
                }}
                style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button 
                onClick={saveScript} 
                className="btn-primary" 
                disabled={scriptSaving}
                style={{ background: '#6366f1' }}
              >
                {scriptSaving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Update Script'}
              </button>
            </div>
          </div>
          <textarea
            value={clientScript}
            onChange={e => setClientScript(e.target.value)}
            placeholder="Example: Hello, I am Jesscia from ABC Corp. I am calling to tell you about our new marketing services..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid hsla(var(--border), 0.5)',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', 
            color: '#f87171', padding: '1rem', borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>⚠️ {error}</span>
            <button onClick={fetchData} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Retry</button>
          </div>
        )}

        {/* Add Lead Form */}
        {showAddForm && (
          <div className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Add a New Lead</h3>
            <form onSubmit={addLead} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Assign to Client *</label>
                <select
                  value={addFormData.userId}
                  onChange={e => setAddFormData({ ...addFormData, userId: e.target.value })}
                  required
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Lead Name *</label>
                <input type="text" value={addFormData.name} onChange={e => setAddFormData({ ...addFormData, name: e.target.value })} required placeholder="Lead name" />
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Phone *</label>
                <input type="text" value={addFormData.phone} onChange={e => setAddFormData({ ...addFormData, phone: e.target.value })} required placeholder="+1234567890" />
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Company</label>
                <input type="text" value={addFormData.company} onChange={e => setAddFormData({ ...addFormData, company: e.target.value })} placeholder="Optional" />
              </div>
              <button type="submit" className="btn-primary" disabled={addLoading}>
                {addLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Add Lead'}
              </button>
            </form>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              📄 For CSV uploads, select a client above first, then use the "Upload CSV" button. Format: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>name,phone,company</code>
            </p>
          </div>
        )}

        {/* Transcript Modal */}
        {selectedTranscript && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
          }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '650px', width: '100%', maxHeight: '80vh', overflow: 'auto', background: 'hsl(var(--card))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '1.15rem' }}>📞 Call Transcript</h3>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {selectedTranscript.leadName} • {selectedTranscript.leadPhone}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {!selectedTranscript.call.transcript && (
                    <button
                      onClick={() => syncTranscript(selectedTranscript.call.id)}
                      className="btn-primary"
                      disabled={actionLoading === selectedTranscript.call.id}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#6366f1' }}
                    >
                      {actionLoading === selectedTranscript.call.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sync Transcript'}
                    </button>
                  )}
                  <button onClick={() => setSelectedTranscript(null)} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}>×</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(59,130,246,0.1)', fontSize: '0.8rem', color: '#60a5fa'
                }}>
                  ⏱ Duration: {selectedTranscript.call.duration > 0 ? `${Math.floor(selectedTranscript.call.duration / 60)}m ${selectedTranscript.call.duration % 60}s` : 'N/A'}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(16,185,129,0.1)', fontSize: '0.8rem', color: '#34d399'
                }}>
                  💰 Cost: ${selectedTranscript.call.costDeducted.toFixed(2)}
                </div>
                <div style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'rgba(156,163,175,0.1)', fontSize: '0.8rem', color: '#9ca3af'
                }}>
                  📅 {new Date(selectedTranscript.call.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                fontSize: '0.9rem',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                color: 'hsl(var(--foreground))',
                border: '1px solid rgba(255,255,255,0.05)',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {selectedTranscript.call.transcript || '⏳ No transcript available yet.\n\nTranscripts are typically available within a few minutes after the call completes. If the call is still in progress, check back shortly.'}
              </div>
            </div>
          </div>
        )}

        {/* Tab System */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setActiveTab('all'); setFilter('all'); }}
            style={{ 
              padding: '1rem 0.5rem', background: 'none', border: 'none', 
              borderBottom: activeTab === 'all' ? '2px solid #5b6efe' : 'none',
              color: activeTab === 'all' ? '#5b6efe' : 'hsl(var(--muted-foreground))',
              fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            All Leads & Uploads
          </button>
          <button 
            onClick={() => { setActiveTab('pending'); setFilter('pending'); }}
            style={{ 
              padding: '1rem 0.5rem', background: 'none', border: 'none', 
              borderBottom: activeTab === 'pending' ? '2px solid #f59e0b' : 'none',
              color: activeTab === 'pending' ? '#f59e0b' : 'hsl(var(--muted-foreground))',
              fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            Pending Follow-up <span style={{ background: '#f59e0b', color: 'black', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>{statusCounts.pending}</span>
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="animate-fade-in">
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {Object.entries(statusCounts).map(([key, count]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: filter === key ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    background: filter === key ? 'hsla(var(--primary), 0.15)' : 'transparent',
                    color: filter === key ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                </button>
              ))}
            </div>
            
            {/* Batch Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Filter by Script/Sheet:</span>
                <select
                  value={selectedBatch}
                  onChange={e => setSelectedBatch(e.target.value)}
                  style={{ width: 'auto', minWidth: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }}
                >
                  <option value="all">All Uploads (Mixed)</option>
                  {batches.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
                {selectedBatch !== 'all' && (
                  <Link href={`/admin/leads/view?batch=${encodeURIComponent(selectedBatch)}`} target="_blank" className="btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Eye size={14} /> Full Sheet View
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '700', color: '#f59e0b', marginBottom: '0.25rem' }}>Pending Follow-ups Pool</h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>These leads are busy or asked for a callback. Ready to retry?</p>
            </div>
            <button 
              onClick={() => runAllCalls()} 
              className="btn-primary" 
              style={{ background: '#f59e0b', border: 'none', color: 'black', fontWeight: '700' }}
              disabled={statusCounts.pending === 0}
            >
              <Phone size={18} /> Recall All {statusCounts.pending} Pending Leads
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Batch/Sheet</th>
                    <th>Company</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>History / Transcript</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>No leads found</td></tr>
                  ) : filtered.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: '500' }}>{lead.name}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}>{lead.phone}</td>
                      <td style={{ fontSize: '0.75rem', color: '#6366f1' }}>{lead.batchId || 'Manual'}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{lead.company || '—'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                        {lead.user?.name || 'Unknown'}
                      </td>
                      <td>
                        <span className={`status-badge status-${lead.status}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {lead.calls.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem' }}>{lead.calls.length} call{lead.calls.length > 1 ? 's' : ''}</span>
                            <button
                              onClick={() => setSelectedTranscript({
                                call: lead.calls[lead.calls.length - 1],
                                leadName: lead.name,
                                leadPhone: lead.phone,
                              })}
                              className="btn-outline"
                              style={{
                                padding: '0.2rem 0.6rem', fontSize: '0.75rem', 
                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                              }}
                              title="View transcript"
                            >
                              <FileText size={13} /> View Transcript
                            </button>
                            {!lead.calls[lead.calls.length - 1].transcript && (
                              <button
                                onClick={(e) => { e.stopPropagation(); syncTranscript(lead.calls[lead.calls.length - 1].id); }}
                                className="btn-outline"
                                disabled={actionLoading === lead.calls[lead.calls.length - 1].id}
                                style={{ padding: '0.3rem', borderRadius: '50%', color: '#6366f1', borderColor: 'rgba(99,102,241,0.2)' }}
                                title="Sync from ElevenLabs"
                              >
                                <Activity size={13} style={actionLoading === lead.calls[lead.calls.length - 1].id ? { animation: 'spin 2s linear infinite' } : {}} />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>No history yet</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {actionLoading === lead.id ? (
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <>
                              {lead.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={async () => {
                                      await updateStatus(lead.id, 'approved');
                                    }} 
                                    className="btn-primary" 
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: '#059669' }}
                                  >
                                    <CheckCircle size={13} /> Approve
                                  </button>
                                  <button 
                                    disabled
                                    className="btn-primary" 
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', opacity: 0.5, cursor: 'not-allowed' }}
                                    title="You must Approve the lead before running a call"
                                  >
                                    <Phone size={13} /> Run Call
                                  </button>
                                  <button onClick={() => {
                                    const reason = prompt('Rejection reason?');
                                    if (reason) updateStatus(lead.id, 'rejected', reason);
                                  }} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} title="Reject Lead">
                                    <XCircle size={13} />
                                  </button>
                                </>
                              )}
                              {lead.status === 'approved' && (
                                <button onClick={() => initiateCall(lead.id)} className="btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', background: 'hsl(var(--primary))' }}>
                                  <Phone size={14} /> Run Call
                                </button>
                              )}
                              <button onClick={() => deleteLead(lead.id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} title="Delete Lead">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
