'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, PhoneCall, Activity, LogOut, Plus, DollarSign, Trash2, Loader2, Eye } from 'lucide-react';

type Client = {
  id: string;
  name: string;
  email: string;
  walletAmount: number;
  createdAt: string;
  leads: { id: string; status: string; calls: { id: string }[] }[];
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [walletModal, setWalletModal] = useState<{ clientId: string; name: string } | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchClients(); }, []);

  async function fetchClients() {
    setLoading(true);
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
    setLoading(false);
  }

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to create client');
    } else {
      setShowForm(false);
      setFormData({ name: '', email: '' });
      await fetchClients();
    }
    setActionLoading(false);
  }

  async function addWalletCredits() {
    if (!walletModal) return;
    setActionLoading(true);
    const res = await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: walletModal.clientId, amount: walletAmount }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to add credits');
    } else {
      const data = await res.json();
      alert(`Added $${data.added}. New balance: $${data.newBalance.toFixed(2)}`);
      setWalletModal(null);
      setWalletAmount('');
      await fetchClients();
    }
    setActionLoading(false);
  }

  async function deleteClient(id: string) {
    if (!confirm('Delete this client and all their leads/calls permanently?')) return;
    setActionLoading(true);
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    await fetchClients();
    setActionLoading(false);
  }

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
        <Link href="/admin/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
          <PhoneCall size={16} /> Leads & Calls
        </Link>
        <Link href="/admin/clients" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Client Management</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
              Add clients, manage wallets, and view their portfolios.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={18} /> New Client
          </button>
        </div>

        {/* New Client Form */}
        {showForm && (
          <div className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Create New Client</h3>
            <form onSubmit={createClient} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="john@company.com" />
              </div>
              <button type="submit" className="btn-primary" disabled={actionLoading}>
                {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create'}
              </button>
            </form>
          </div>
        )}

        {/* Wallet Modal */}
        {walletModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', width: '100%', background: 'hsl(var(--card))' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Add Credits</h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Top up wallet for <strong>{walletModal.name}</strong>
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.4rem' }}>Amount ($)</label>
                <input type="number" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} placeholder="25.00" min="1" step="0.01" required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={addWalletCredits} className="btn-primary" style={{ flex: 1 }} disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><DollarSign size={16}/> Add Credits</>}
                </button>
                <button onClick={() => { setWalletModal(null); setWalletAmount(''); }} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Wallet</th>
                    <th>Leads</th>
                    <th>Calls</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>No clients yet</td></tr>
                  ) : clients.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '500' }}>{c.name}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{c.email}</td>
                      <td style={{ color: '#10b981', fontWeight: '600' }}>${c.walletAmount.toFixed(2)}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{c.leads.length}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{c.leads.reduce((sum, l) => sum + l.calls.length, 0)}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => window.open(`/client?userId=${c.id}`, '_blank')} 
                            className="btn-outline" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title="View Client Portal"
                          >
                            <Eye size={13} />
                          </button>
                          <button onClick={() => setWalletModal({ clientId: c.id, name: c.name })} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: '#059669' }}>
                            <DollarSign size={13} /> Top Up
                          </button>
                          <button onClick={() => deleteClient(c.id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                            <Trash2 size={13} />
                          </button>
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
