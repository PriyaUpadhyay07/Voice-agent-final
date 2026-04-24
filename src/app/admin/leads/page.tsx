'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, Activity, Users, LogOut, CheckCircle, XCircle, 
  Trash2, Phone, Loader2, Plus, Upload, FileText, Eye, Clock,
  Home, X
} from 'lucide-react';
import { resilientFetch } from '@/lib/fetch-utils';

type Call = {
  id: string;
  duration: number;
  costDeducted: number;
  transcript: string | null;
  status: string | null;
  summary: string | null;
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ userId: '', name: '', phone: '', company: '' });
  const [addLoading, setAddLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [batches, setBatches] = useState<string[]>([]);
  const [clientScript, setClientScript] = useState('');
  const [scriptSaving, setScriptSaving] = useState(false);

  // Transcript modal
  const [selectedTranscript, setSelectedTranscript] = useState<{
    call: Call;
    leadName: string;
    leadPhone: string;
  } | null>(null);

  useEffect(() => { fetchData(); }, []);

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
      const uniqueBatches = Array.from(new Set(leadsData.map((l: any) => l.batchId).filter(Boolean))) as string[];
      setBatches(uniqueBatches);
      if (clientsData.length > 0 && !addFormData.userId) {
        const firstClient = clientsData[0];
        setAddFormData(prev => ({ ...prev, userId: firstClient.id }));
        setClientScript(firstClient.script || '');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch data.');
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
        alert('✅ Script saved!');
        setClients(prev => prev.map(c => c.id === addFormData.userId ? { ...c, script: clientScript } : c));
      }
    } catch (e: any) { alert(e.message); }
    finally { setScriptSaving(false); }
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
    if (!file || !addFormData.userId) { alert('Select a client first'); return; }
    setAddLoading(true);
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const leadsToAdd: { name: string; phone: string; company?: string }[] = [];
    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) leadsToAdd.push({ name: parts[0], phone: parts[1], company: parts[2] || undefined });
    }
    if (leadsToAdd.length === 0) { alert('No valid leads. Format: name,phone,company'); setAddLoading(false); return; }
    const batchName = file.name.replace('.csv', '') + '_' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: addFormData.userId, leads: leadsToAdd, batchId: batchName }),
    });
    if (res.ok) {
      const data = await res.json();
      alert(`✅ ${data.count} leads uploaded!`);
      await fetchData();
    } else { alert('Upload failed'); }
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

  async function initiateCall(leadId: string) {
    setActionLoading(leadId);
    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Call failed'); }
      else { alert(`✅ Call initiated! ID: ${data.vapiCallId || data.callId}`); }
      await fetchData();
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Unknown'));
    } finally { setActionLoading(null); }
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead?')) return;
    setActionLoading(id);
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    await fetchData();
    setActionLoading(null);
  }

  const filteredByStatus = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const filtered = selectedBatch === 'all' ? filteredByStatus : filteredByStatus.filter(l => l.batchId === selectedBatch);

  const statusCounts = {
    all: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    interested: leads.filter(l => l.status === 'interested').length,
    calling: leads.filter(l => l.status === 'calling').length,
    busy: leads.filter(l => l.status === 'busy').length,
    rejected: leads.filter(l => l.status === 'rejected').length,
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><Phone size={16} /></div>
          <div>
            <h2>VoiceAgent</h2>
            <span>Admin Portal</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className="sidebar-link"><Activity size={16} /> Dashboard</Link>
          <Link href="/admin/leads" className="sidebar-link active"><PhoneCall size={16} /> Leads & Calls</Link>
          <Link href="/admin/clients" className="sidebar-link"><Users size={16} /> Clients</Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/" className="sidebar-link"><LogOut size={16} /> Exit</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Transcript Modal */}
        {selectedTranscript && (
          <div className="modal-overlay" onClick={() => setSelectedTranscript(null)}>
            <div className="modal-content animate-in" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Call Transcript</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{selectedTranscript.leadName} • {selectedTranscript.leadPhone}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => setSelectedTranscript(null)}><X size={18} /></button>
              </div>
              {selectedTranscript.call.summary && (
                <div className="alert alert-info" style={{ marginBottom: '12px' }}>
                  <strong>Summary:</strong> {selectedTranscript.call.summary}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-default">
                  <Clock size={12} /> {selectedTranscript.call.duration > 0 ? `${Math.floor(selectedTranscript.call.duration / 60)}m ${selectedTranscript.call.duration % 60}s` : 'N/A'}
                </span>
                <span className="badge badge-default">${selectedTranscript.call.costDeducted.toFixed(2)}</span>
              </div>
              <div className="transcript-box">
                {selectedTranscript.call.transcript || 'No transcript available yet.'}
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Leads & Calls</h1>
            <p>Manage leads, approve, reject, and run AI calls.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary"><Plus size={16} /> Add Lead</button>
            <input type="file" ref={fileInputRef} onChange={handleCSVUpload} accept=".csv" style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline" disabled={addLoading}>
              <Upload size={16} /> {addLoading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            ⚠️ {error}
            <button onClick={fetchData} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>Retry</button>
          </div>
        )}

        {/* Script Editor */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div className="card-title">🤖 AI Agent Script</div>
              <div className="card-subtitle">Write what the AI agent says during calls.</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={addFormData.userId}
                onChange={e => {
                  const client = clients.find(c => c.id === e.target.value);
                  setAddFormData({ ...addFormData, userId: e.target.value });
                  if (client) setClientScript(client.script || '');
                }}
                style={{ width: 'auto', minWidth: '160px' }}
              >
                {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              <button onClick={saveScript} className="btn btn-primary btn-sm" disabled={scriptSaving}>
                {scriptSaving ? <Loader2 size={14} className="spinner" /> : 'Save Script'}
              </button>
            </div>
          </div>
          <textarea
            value={clientScript}
            onChange={e => setClientScript(e.target.value)}
            placeholder="Example: Hello, I am Jessica from ABC Corp. I'm calling about our marketing services..."
            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        {/* Add Lead Form */}
        {showAddForm && (
          <div className="card animate-in" style={{ marginBottom: '24px' }}>
            <div className="card-title" style={{ marginBottom: '12px' }}>Add a New Lead</div>
            <form onSubmit={addLead} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label>Client *</label>
                <select value={addFormData.userId} onChange={e => setAddFormData({ ...addFormData, userId: e.target.value })} required>
                  {clients.map(c => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label>Name *</label>
                <input type="text" value={addFormData.name} onChange={e => setAddFormData({ ...addFormData, name: e.target.value })} required placeholder="Lead name" />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label>Phone *</label>
                <input type="text" value={addFormData.phone} onChange={e => setAddFormData({ ...addFormData, phone: e.target.value })} required placeholder="+1234567890" />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label>Company</label>
                <input type="text" value={addFormData.company} onChange={e => setAddFormData({ ...addFormData, company: e.target.value })} placeholder="Optional" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={addLoading}>
                {addLoading ? <Loader2 size={14} className="spinner" /> : 'Add Lead'}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-outline'}`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
            </button>
          ))}
        </div>

        {/* Batch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Batch:</span>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} style={{ width: 'auto', minWidth: '180px' }}>
            <option value="all">All Uploads</option>
            {batches.map(b => (<option key={b} value={b}>{b}</option>))}
          </select>
          {selectedBatch !== 'all' && (
            <Link href={`/admin/leads/view?batch=${encodeURIComponent(selectedBatch)}`} target="_blank" className="btn btn-outline btn-sm">
              <Eye size={14} /> Full Sheet
            </Link>
          )}
        </div>

        {/* Leads Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Loader2 size={24} className="spinner" />
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Phone</th>
                    <th>Batch</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>History</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>No leads found</td></tr>
                  ) : filtered.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: '500' }}>{lead.name}</td>
                      <td style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px' }}>{lead.phone}</td>
                      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{lead.batchId || 'Manual'}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{lead.user?.name || '—'}</td>
                      <td>
                        <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                      </td>
                      <td>
                        {lead.calls.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{lead.calls.length} call{lead.calls.length > 1 ? 's' : ''}</span>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setSelectedTranscript({
                                call: lead.calls[0],
                                leadName: lead.name,
                                leadPhone: lead.phone,
                              })}
                            >
                              <FileText size={13} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted-light)' }}>No calls</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {actionLoading === lead.id ? (
                            <Loader2 size={16} className="spinner" />
                          ) : (
                            <>
                              {lead.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus(lead.id, 'approved')} className="btn btn-success btn-sm">
                                    <CheckCircle size={13} /> Approve
                                  </button>
                                  <button onClick={() => { const r = prompt('Reason?'); if (r) updateStatus(lead.id, 'rejected', r); }} className="btn btn-danger btn-sm">
                                    <XCircle size={13} />
                                  </button>
                                </>
                              )}
                              {(lead.status === 'approved' || lead.status === 'busy') && (
                                <button onClick={() => initiateCall(lead.id)} className="btn btn-primary btn-sm">
                                  <Phone size={13} /> Call
                                </button>
                              )}
                              <button onClick={() => deleteLead(lead.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
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
