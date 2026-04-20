'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, PhoneCall, DollarSign, Activity, LogOut, CheckCircle, XCircle, Clock, Zap, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!stats || stats.error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card text-center" style={{ maxWidth: '500px' }}>
          <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Dashboard Error</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>{stats?.error || 'Possible database connection issue.'}</p>
          <button onClick={fetchStats} className="btn-primary" style={{ marginTop: '1.5rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
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
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <Activity size={16} /> Dashboard
          </Link>
          <Link href="/admin/leads" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
            <PhoneCall size={16} /> Leads & Calls
          </Link>
          <Link href="/admin/clients" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
            <Users size={16} /> Clients
          </Link>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', cursor: 'pointer', background: 'transparent', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', font: 'inherit' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome back 👋</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>Live Dashboard — Syncing auto</p>
                {refreshing && <Loader2 size={12} className="animate-spin opacity-50" />}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card animate-fade-in" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>TOTAL CLIENTS</span>
                <Users size={18} style={{ color: '#3b82f6' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800' }}>{stats.totalClients}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: '500' }}>Real-time</span>
              </div>
            </div>

            <div className="glass-card animate-fade-in" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>TOTAL REVENUE</span>
                <DollarSign size={18} style={{ color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800' }}>${stats.totalRevenue.toFixed(2)}</h2>
            </div>

            <div className="glass-card animate-fade-in" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>TOTAL CALLS</span>
                <PhoneCall size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800' }}>{stats.totalCalls}</h2>
            </div>

            <div className="glass-card animate-fade-in" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>AI CREDITS</span>
                <Zap size={18} style={{ color: '#f59e0b' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800' }}>{(stats.elCredits / 1000).toFixed(1)}k</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ background: 'hsla(142, 70%, 45%, 0.05)', border: '1px solid hsla(142, 70%, 45%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
                <CheckCircle size={20} />
                <h3 style={{ fontWeight: '600' }}>Approved Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.approvedLeads}</div>
            </div>

            <div className="glass-card" style={{ background: 'hsla(0, 72%, 51%, 0.05)', border: '1px solid hsla(0, 72%, 51%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ef4444' }}>
                <XCircle size={20} />
                <h3 style={{ fontWeight: '600' }}>Rejected Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.rejectedLeads}</div>
            </div>

            <div className="glass-card" style={{ background: 'hsla(45, 93%, 47%, 0.05)', border: '1px solid hsla(45, 93%, 47%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f59e0b' }}>
                <Clock size={20} />
                <h3 style={{ fontWeight: '600' }}>Pending Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.pendingLeads}</div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Client Accounts</h3>
              <Link href="/admin/clients" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Manage All
              </Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Wallet</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.clients.map((c: any) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '500' }}>{c.name}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{c.email}</td>
                      <td style={{ color: '#10b981', fontWeight: '600' }}>${c.walletAmount.toFixed(2)}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link href={`/client?userId=${c.id}`} target="_blank" className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                          View Portal
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
