'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Download, Search, Phone } from 'lucide-react';
import Link from 'next/link';

function LeadsViewContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batch');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (batchId) {
      fetchLeads();
    }
  }, [batchId]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      const filtered = data.filter((l: any) => l.batchId === batchId);
      setLeads(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.phone.includes(search) ||
    (l.company && l.company.toLowerCase().includes(search.toLowerCase()))
  );

  function downloadCSV() {
    if (leads.length === 0) return;
    const headers = ['Name', 'Phone', 'Company', 'Status', 'Calls', 'Transcript'];
    const csvContent = [
      headers.join(','),
      ...leads.map(l => [
        `"${l.name}"`,
        `"${l.phone}"`,
        `"${l.company || ''}"`,
        `"${l.status}"`,
        l.calls.length,
        `"${l.calls[0]?.transcript?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${batchId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'hsl(var(--background))' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <Link href="/admin/leads" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Leads
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Sheet View: {batchId}</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Detailed view of all leads in this upload batch.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={downloadCSV} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
            <Search size={18} style={{ color: 'hsl(var(--muted-foreground))' }} />
            <input 
              type="text" 
              placeholder="Search leads in this sheet..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none', color: 'inherit' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid hsl(var(--border))' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Phone</th>
                  <th style={{ padding: '1rem' }}>Company</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Calls</th>
                  <th style={{ padding: '1rem' }}>Last Transcript Snippet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l: any) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{l.name}</td>
                    <td style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>{l.phone}</td>
                    <td style={{ padding: '1rem', color: 'hsl(var(--muted-foreground))' }}>{l.company || '—'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-badge status-${l.status}`}>{l.status}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{l.calls.length}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.calls[0]?.transcript || 'No transcript yet'}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--muted-foreground))' }}>No leads match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsViewContent />
    </Suspense>
  );
}
