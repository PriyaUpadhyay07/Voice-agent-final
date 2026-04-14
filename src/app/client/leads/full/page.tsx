'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, PhoneCall } from 'lucide-react';

export default function FullLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchLeads() {
      const userId = (session?.user as any)?.id;
      if (!userId) return;
      const res = await fetch(`/api/clients/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
      setLoading(false);
    }
    fetchLeads();
  }, [session]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="animate-spin" color="hsl(var(--primary))" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Full Lead Database</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Comprehensive list of all your uploaded contacts.</p>
      </div>
      
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Calls</th>
                <th>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: '600' }}>{lead.name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{lead.phone}</td>
                  <td>{lead.company || '—'}</td>
                  <td><span className={`status-badge status-${lead.status}`}>{lead.status}</span></td>
                  <td>{lead.calls?.length || 0} calls</td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
