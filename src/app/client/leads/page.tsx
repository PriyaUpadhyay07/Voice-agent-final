'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Upload, Activity, FileText, Wallet, LogOut, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Lead = {
  id: string;
  phone: string;
  name: string;
  company: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  calls: { id: string }[];
};

type ClientData = {
  id: string;
  name: string;
  email: string;
  walletAmount: number;
  leads: Lead[];
};

export default function ClientLeadsPage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', company: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      }
    } catch (error) {
      console.error("Failed to fetch client data", error);
    }
    setLoading(false);
  }

  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    setActionLoading(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData }),
    });
    if (res.ok) {
      setShowForm(false);
      setFormData({ name: '', phone: '', company: '' });
      setUploadResult({ type: 'success', message: 'Lead added successfully! It will be reviewed by admin.' });
      await fetchClient();
    } else {
      const data = await res.json();
      setUploadResult({ type: 'error', message: data.error || 'Failed to add lead' });
    }
    setActionLoading(false);
    setTimeout(() => setUploadResult(null), 5000);
  }

  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !client) return;

    setActionLoading(true);
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());

    // Expect CSV: name,phone,company (skip header if present)
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const leads: { name: string; phone: string; company?: string }[] = [];

    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        leads.push({
          name: parts[0],
          phone: parts[1],
          company: parts[2] || undefined,
        });
      }
    }

    if (leads.length === 0) {
      setUploadResult({ type: 'error', message: 'No valid leads found in CSV. Format: name,phone,company' });
      setActionLoading(false);
      return;
    }

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads }),
    });

    if (res.ok) {
      const data = await res.json();
      setUploadResult({ type: 'success', message: `${data.count} leads uploaded successfully!` });
      await fetchClient();
    } else {
      const data = await res.json();
      setUploadResult({ type: 'error', message: data.error || 'Failed to upload leads' });
    }

    setActionLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setUploadResult(null), 5000);
  }

  async function deleteLead(id: string) {
    if (!confirm('Remove this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    await fetchClient();
  }

  const [viewMode, setViewMode] = useState<'compact' | 'medium' | 'large'>('compact');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (!client) return null;

  const renderLeadsTable = (isMaximized = false) => (
    <div className="table-container" style={{ 
      maxHeight: isMaximized ? '70vh' : '300px', 
      overflowY: 'auto',
      borderRadius: 'var(--radius)',
      border: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(0,0,0,0.2)'
    }}>
      <table style={{ fontSize: isMaximized ? '0.9rem' : '0.8rem' }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'hsl(var(--card))' }}>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {client.leads.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>No leads yet.</td></tr>
          ) : client.leads.map(lead => (
            <tr key={lead.id}>
              <td style={{ fontWeight: '500' }}>{lead.name}</td>
              <td style={{ fontFamily: 'monospace' }}>{lead.phone}</td>
              <td>{lead.company || '—'}</td>
              <td><span className={`status-badge status-${lead.status}`}>{lead.status}</span></td>
              <td>
                <button onClick={() => deleteLead(lead.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
        <Link href="/client/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
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
        {/* MEDIUM VIEW MODAL (POPUP) */}
        {viewMode === 'medium' && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, 
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '900px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: '700', fontSize: '1.25rem' }}>Leads Quick View</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setViewMode('compact')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '0.5rem', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' }}>
                    ✕ Close
                  </button>
                </div>
              </div>
              {renderLeadsTable(true)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Leads</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>Manage your AI calling pipeline.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus size={18} /> Add Lead
            </button>
            <label className="btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} /> Upload CSV
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {uploadResult && (
          <div className="animate-fade-in" style={{
            padding: '1rem 1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: uploadResult.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${uploadResult.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: uploadResult.type === 'success' ? '#34d399' : '#f87171',
          }}>
            {uploadResult.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {uploadResult.message}
          </div>
        )}

        {showForm && (
          <div className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Add a New Lead</h3>
            <form onSubmit={addLead} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Phone *</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" disabled={actionLoading}>
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Submit'}
              </button>
            </form>
          </div>
        )}

        {/* COMPACT SHEET CARD (The ChatGPT style view) */}
        <div className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#10b981', color: 'white', padding: '0.3rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>EXCEL</div>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>leads_database.xlsx</span>
              <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>({client.leads.length} leads)</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setViewMode('medium')}
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid hsl(var(--border))', borderRadius: '6px', cursor: 'pointer', color: 'hsl(var(--muted-foreground))' }}
                title="Expand View"
              >
                ⤢
              </button>
              <a 
                href="/client/leads/full" 
                target="_blank" 
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid hsl(var(--border))', borderRadius: '6px', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', textDecoration: 'none', display: 'flex' }}
                title="Open in Full Page"
              >
                🚀
              </a>
            </div>
          </div>
          
          {renderLeadsTable(false)}
        </div>

        <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(59,130,246,0.06)' }}>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>
            📄 <strong>CSV Format:</strong> Name, Phone, Company.
          </p>
        </div>
      </main>
    </div>
  );
}
