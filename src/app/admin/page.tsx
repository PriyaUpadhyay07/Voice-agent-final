import Link from 'next/link';
import prisma from '../../lib/db';
import { Users, PhoneCall, DollarSign, Activity, LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  const clients = await prisma.user.findMany({ where: { role: 'client' } });
  const allLeads = await prisma.lead.findMany();
  const allCalls = await prisma.call.findMany();

  const totalRevenue = clients.reduce((sum, c) => sum + (c.walletAmount || 0), 0);
  const totalCalls = allCalls.length;
  const pendingLeads = allLeads.filter(l => l.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
      {/* Sidebar + Main layout */}
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
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" style={{ width: '100%', cursor: 'pointer', background: 'transparent', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', font: 'inherit' }}>
                <LogOut size={16} /> Logout
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>Admin Control Center — Direct Access Mode</p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Total Clients</span>
                <Users size={18} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{clients.length}</h2>
              <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Active accounts</span>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Wallet Balances Total</span>
                <DollarSign size={18} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>${totalRevenue.toFixed(2)}</h2>
              <span style={{ color: '#60a5fa', fontSize: '0.8rem' }}>Loaded across clients</span>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Total Calls Made</span>
                <PhoneCall size={18} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{totalCalls}</h2>
              <span style={{ color: '#a78bfa', fontSize: '0.8rem' }}>All time</span>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Pending Leads</span>
                <Activity size={18} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{pendingLeads}</h2>
              <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>Awaiting calls</span>
            </div>
          </div>

          {/* Clients Table */}
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
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '500' }}>{c.name}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))' }}>{c.email}</td>
                      <td style={{ color: '#10b981', fontWeight: '600' }}>${c.walletAmount.toFixed(2)}</td>
                      <td style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <a 
                          href={`/client?userId=${c.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}
                        >
                          View Portal
                        </a>
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
