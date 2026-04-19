import Link from 'next/link';
import prisma from '../../lib/db';
import { Users, PhoneCall, DollarSign, Activity, LogOut, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { auth, signOut } from '@/auth';
import { getElevenLabsBalance } from '@/lib/elevenlabs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  try {
    const session = await auth();
    const clients = await prisma.user.findMany({ where: { role: 'client' } });
    const allLeads = await prisma.lead.findMany();
    const allCalls = await prisma.call.findMany();
    const elBalance = await getElevenLabsBalance();

    const totalRevenue = clients.reduce((sum, c) => sum + (c.walletAmount || 0), 0);
    const totalCalls = allCalls.length;
    const pendingLeadsCount = allLeads.filter(l => l.status === 'pending').length;
    const approvedLeadsCount = allLeads.filter(l => l.status === 'approved').length;
    const rejectedLeadsCount = allLeads.filter(l => l.status === 'rejected').length;

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
            <div className="glass-card animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.02em' }}>TOTAL CLIENTS</span>
                <Users size={18} style={{ color: '#3b82f6' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{clients.length}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: '500' }}>System Online</span>
              </div>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.02em' }}>TOTAL REVENUE</span>
                <DollarSign size={18} style={{ color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>${totalRevenue.toFixed(2)}</h2>
              <span style={{ color: '#60a5fa', fontSize: '0.75rem', fontWeight: '500', opacity: 0.8 }}>Across all accounts</span>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.02em' }}>TOTAL CALLS</span>
                <PhoneCall size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{totalCalls}</h2>
              <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: '500', opacity: 0.8 }}>All-time successful</span>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.02em' }}>AI AGENT CREDITS</span>
                <Zap size={18} style={{ color: '#f59e0b' }} />
              </div>
              <h2 style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                {elBalance ? (elBalance.remaining / 1000).toFixed(1) + 'k' : '—'}
              </h2>
              <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: '500', opacity: 0.8 }}>Characters available</span>
            </div>
          </div>

          {/* Detailed Status Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ background: 'hsla(142, 70%, 45%, 0.05)', border: '1px solid hsla(142, 70%, 45%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
                <CheckCircle size={20} />
                <h3 style={{ fontWeight: '600' }}>Approved Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{approvedLeadsCount}</div>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>Ready for service</p>
            </div>

            <div className="glass-card" style={{ background: 'hsla(0, 72%, 51%, 0.05)', border: '1px solid hsla(0, 72%, 51%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ef4444' }}>
                <XCircle size={20} />
                <h3 style={{ fontWeight: '600' }}>Rejected Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{rejectedLeadsCount}</div>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>Not interested</p>
            </div>

            <div className="glass-card" style={{ background: 'hsla(45, 93%, 47%, 0.05)', border: '1px solid hsla(45, 93%, 47%, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f59e0b' }}>
                <Clock size={20} />
                <h3 style={{ fontWeight: '600' }}>Pending Leads</h3>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{pendingLeadsCount}</div>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>Awaiting callbacks / Busy</p>
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
  } catch (error: any) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Dashboard Error</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>
            There was an error loading the admin dashboard. This is usually due to a database connection issue or missing environment variables.
          </p>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.8rem', overflowX: 'auto', marginBottom: '1.5rem', textAlign: 'left' }}>
            {error.message || 'Unknown Server Error'}
          </pre>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }
}
