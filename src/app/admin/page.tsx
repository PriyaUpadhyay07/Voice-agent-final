'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, PhoneCall, DollarSign, Activity, LogOut, CheckCircle, XCircle, Clock, Loader2, Phone, TrendingUp } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats');
    } finally { setLoading(false); setRefreshing(false); }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="spinner" />
      </div>
    );
  }

  if (!stats || stats.error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>Dashboard Error</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>{stats?.error || 'Database connection issue.'}</p>
          <button onClick={fetchStats} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

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
          <Link href="/admin" className="sidebar-link active"><Activity size={16} /> Dashboard</Link>
          <Link href="/admin/leads" className="sidebar-link"><PhoneCall size={16} /> Leads & Calls</Link>
          <Link href="/admin/clients" className="sidebar-link"><Users size={16} /> Clients</Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="sidebar-link">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Dashboard</h1>
            <p>Real-time overview of your voice agent platform.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {refreshing && <Loader2 size={14} className="spinner" />}
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
              <span>Total Clients</span>
              <Users size={16} />
            </div>
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-detail">Active accounts</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <span>Total Revenue</span>
              <DollarSign size={16} />
            </div>
            <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-detail">All time earnings</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <span>Total Calls</span>
              <PhoneCall size={16} />
            </div>
            <div className="stat-value">{stats.totalCalls}</div>
            <div className="stat-detail">Across all clients</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <span>Conversion Rate</span>
              <TrendingUp size={16} />
            </div>
            <div className="stat-value">
              {stats.totalCalls > 0 ? Math.round((stats.approvedLeads / (stats.approvedLeads + stats.rejectedLeads + stats.pendingLeads || 1)) * 100) : 0}%
            </div>
            <div className="stat-detail">Interested leads</div>
          </div>
        </div>

        {/* Lead Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#059669' }}>
              <CheckCircle size={18} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Interested</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.approvedLeads}</div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#dc2626' }}>
              <XCircle size={18} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Rejected</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.rejectedLeads}</div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#b45309' }}>
              <Clock size={18} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Pending</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.pendingLeads}</div>
          </div>
        </div>

        {/* Client Accounts Table */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="card-title">Client Accounts</div>
            <Link href="/admin/clients" className="btn btn-outline btn-sm">Manage All</Link>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Wallet</th>
                  <th>Credits</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.clients?.map((c: any) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '500' }}>{c.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{c.email}</td>
                    <td style={{ color: '#059669', fontWeight: '600' }}>${c.walletAmount.toFixed(2)}</td>
                    <td style={{ color: 'var(--muted)' }}>{c.creditsMinutes?.toFixed(0) || 0} min</td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link href={`/client?userId=${c.id}`} target="_blank" className="btn btn-ghost btn-sm">
                        View Portal →
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
  );
}
