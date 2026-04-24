'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { 
  PhoneCall, Upload, FileText, Wallet, LogOut, Activity, 
  Loader2, TrendingUp, Clock, CheckCircle, MessageSquare, 
  Save, CreditCard, ChevronRight, BarChart3, Phone,
  Menu, X, Home
} from 'lucide-react';

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
  phone: string;
  name: string;
  company: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  calls: Call[];
};

type ClientData = {
  id: string;
  name: string;
  email: string;
  walletAmount: number;
  creditsMinutes: number;
  script: string;
  leads: Lead[];
};

export default function ClientDashboard() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="spinner" />
      </div>
    }>
      <ClientDashboardContent />
    </Suspense>
  );
}

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'credits'>('overview');
  const [selectedTranscript, setSelectedTranscript] = useState<{ call: Call; leadName: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchClient();
  }, []);

  async function fetchClient() {
    setLoading(true);
    try {
      // For the base template, we fetch using a simple API
      // In production, this would use auth session
      const userId = userIdFromUrl || 'default';
      const res = await fetch(`/api/clients/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
      }
    } catch (error) {
      console.error('Failed to fetch client data', error);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="spinner" />
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <Phone size={48} style={{ color: 'var(--muted-light)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Account Not Found</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Please contact your admin for setup.</p>
        </div>
      </div>
    );
  }

  const totalCalls = client.leads.reduce((sum, l) => sum + l.calls.length, 0);
  const totalSpent = client.leads.reduce((sum, l) => sum + l.calls.reduce((s, c) => s + c.costDeducted, 0), 0);
  const interestedLeads = client.leads.filter(l => l.status === 'interested').length;
  const busyLeads = client.leads.filter(l => l.status === 'busy' || l.status === 'pending').length;
  const rejectedLeads = client.leads.filter(l => l.status === 'rejected').length;

  return (
    <div className="layout">
      {/* ====== SIDEBAR ====== */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Phone size={16} />
          </div>
          <div>
            <h2>VoiceAgent</h2>
            <span>Client Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Home size={16} /> Overview
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <PhoneCall size={16} /> Leads & Calls
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'credits' ? 'active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            <CreditCard size={16} /> Add Credits
          </button>
        </nav>

        <div className="sidebar-footer">
          {/* Credits Widget */}
          <div className="credits-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="credits-value">{client.creditsMinutes.toFixed(0)}</div>
                <div className="credits-label">Minutes remaining</div>
              </div>
              <Wallet size={20} style={{ color: 'var(--muted-light)' }} />
            </div>
            <button 
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => setActiveTab('credits')}
            >
              <CreditCard size={14} /> Add Credits
            </button>
          </div>

          <button className="sidebar-link" style={{ color: 'var(--muted)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ====== MOBILE NAV ====== */}
      <div className="mobile-nav">
        <div className="mobile-nav-items">
          <button 
            className={`mobile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button 
            className={`mobile-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <PhoneCall size={18} />
            <span>Leads</span>
          </button>
          <button 
            className={`mobile-nav-item ${activeTab === 'credits' ? 'active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            <CreditCard size={18} />
            <span>Credits</span>
          </button>
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <main className="main-content">
        {/* Transcript Modal */}
        {selectedTranscript && (
          <div className="modal-overlay" onClick={() => setSelectedTranscript(null)}>
            <div className="modal-content animate-in" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Call Transcript</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>{selectedTranscript.leadName}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => setSelectedTranscript(null)}>
                  <X size={18} />
                </button>
              </div>

              {selectedTranscript.call.summary && (
                <div className="alert alert-info" style={{ marginBottom: '12px' }}>
                  <BarChart3 size={16} />
                  <span><strong>Summary:</strong> {selectedTranscript.call.summary}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-default">
                  <Clock size={12} /> {selectedTranscript.call.duration > 0 
                    ? `${Math.floor(selectedTranscript.call.duration / 60)}m ${selectedTranscript.call.duration % 60}s` 
                    : 'N/A'}
                </span>
                <span className="badge badge-default">
                  ${selectedTranscript.call.costDeducted.toFixed(2)}
                </span>
                <span className="badge badge-default">
                  {new Date(selectedTranscript.call.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="transcript-box">
                {selectedTranscript.call.transcript || 'No transcript available yet. Transcripts appear after the call completes.'}
              </div>
            </div>
          </div>
        )}

        {/* ====== OVERVIEW TAB ====== */}
        {activeTab === 'overview' && (
          <div className="animate-in">
            <div className="page-header">
              <h1>Welcome, {client.name}</h1>
              <p>Track your leads, calls, and spending at a glance.</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">
                  <span>Total Leads</span>
                  <Upload size={16} />
                </div>
                <div className="stat-value">{client.leads.length}</div>
                <div className="stat-detail">{interestedLeads} interested</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  <span>Calls Made</span>
                  <PhoneCall size={16} />
                </div>
                <div className="stat-value">{totalCalls}</div>
                <div className="stat-detail">Across all leads</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  <span>Credits Left</span>
                  <Wallet size={16} />
                </div>
                <div className="stat-value">{client.creditsMinutes.toFixed(0)} <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--muted)' }}>min</span></div>
                <div className="stat-detail">${totalSpent.toFixed(2)} spent total</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  <span>Avg Duration</span>
                  <Clock size={16} />
                </div>
                <div className="stat-value">
                  {totalCalls > 0
                    ? `${Math.round(client.leads.reduce((sum, l) => sum + l.calls.reduce((s, c) => s + c.duration, 0), 0) / totalCalls)}s`
                    : '0s'
                  }
                </div>
                <div className="stat-detail">Per call average</div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Recent Leads</div>
                  <div className="card-subtitle">Your latest uploaded leads and their status</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('leads')}>
                  View All <ChevronRight size={14} />
                </button>
              </div>

              {client.leads.length === 0 ? (
                <div className="empty-state">
                  <Upload size={32} className="empty-state-icon" />
                  <h3>No leads yet</h3>
                  <p>Your leads will appear here once uploaded by admin.</p>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Calls</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.leads.slice(0, 5).map(lead => (
                        <tr key={lead.id}>
                          <td style={{ fontWeight: '500' }}>{lead.name}</td>
                          <td style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px' }}>{lead.phone}</td>
                          <td>
                            <span className={`badge badge-${lead.status}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td style={{ color: 'var(--muted)' }}>{lead.calls.length}</td>
                          <td>
                            {lead.calls.length > 0 && (
                              <button 
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSelectedTranscript({
                                  call: lead.calls[0],
                                  leadName: lead.name,
                                })}
                              >
                                <FileText size={14} /> Transcript
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== LEADS TAB ====== */}
        {activeTab === 'leads' && (
          <div className="animate-in">
            <div className="page-header">
              <h1>Leads & Calls</h1>
              <p>All your leads and their call history in one place.</p>
            </div>

            {/* Status Summary */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div className="badge badge-interested" style={{ padding: '6px 14px', fontSize: '13px' }}>
                <CheckCircle size={14} /> {interestedLeads} Interested
              </div>
              <div className="badge badge-busy" style={{ padding: '6px 14px', fontSize: '13px' }}>
                <Clock size={14} /> {busyLeads} Busy/Pending
              </div>
              <div className="badge badge-rejected" style={{ padding: '6px 14px', fontSize: '13px' }}>
                <X size={14} /> {rejectedLeads} Rejected
              </div>
            </div>

            {/* Leads Table */}
            <div className="card" style={{ padding: 0 }}>
              {client.leads.length === 0 ? (
                <div className="empty-state">
                  <PhoneCall size={32} className="empty-state-icon" />
                  <h3>No leads uploaded yet</h3>
                  <p>Contact admin to upload your leads CSV.</p>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Calls</th>
                        <th>Last Activity</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.leads.map(lead => (
                        <tr key={lead.id}>
                          <td style={{ fontWeight: '500' }}>{lead.name}</td>
                          <td style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px' }}>{lead.phone}</td>
                          <td style={{ color: 'var(--muted)' }}>{lead.company || '—'}</td>
                          <td>
                            <span className={`badge badge-${lead.status}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td style={{ color: 'var(--muted)' }}>{lead.calls.length}</td>
                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                            {lead.calls.length > 0 
                              ? new Date(lead.calls[0].createdAt).toLocaleDateString(undefined, {
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })
                              : 'Not called'
                            }
                          </td>
                          <td>
                            {lead.calls.length > 0 && (
                              <button 
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSelectedTranscript({
                                  call: lead.calls[0],
                                  leadName: lead.name,
                                })}
                              >
                                <FileText size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== CREDITS TAB ====== */}
        {activeTab === 'credits' && (
          <AddCreditsTab creditsMinutes={client.creditsMinutes} walletAmount={client.walletAmount} />
        )}
      </main>
    </div>
  );
}

/* ===== ADD CREDITS TAB COMPONENT ===== */
function AddCreditsTab({ creditsMinutes, walletAmount }: { creditsMinutes: number; walletAmount: number }) {
  const [selectedPlan, setSelectedPlan] = useState(2); // Default to 500 mins
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    { minutes: 100,  price: 10,   label: '100 minutes',  popular: false },
    { minutes: 250,  price: 22,   label: '250 minutes',  popular: false },
    { minutes: 500,  price: 40,   label: '500 minutes',  popular: true },
    { minutes: 1000, price: 70,   label: '1,000 minutes', popular: false },
    { minutes: 2500, price: 150,  label: '2,500 minutes', popular: false },
    { minutes: 5000, price: 250,  label: '5,000 minutes', popular: false },
  ];

  const selected = plans[selectedPlan];
  const perMinute = (selected.price / selected.minutes).toFixed(3);

  async function handlePurchase() {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selected.price * 100, // Razorpay expects paise/cents
          credits: selected.minutes,
        }),
      });
      const data = await res.json();

      if (data.orderId) {
        // Open Razorpay checkout
        const options = {
          key: data.keyId,
          amount: selected.price * 100,
          currency: 'USD',
          name: 'VoiceAgent Credits',
          description: `${selected.minutes} calling minutes`,
          order_id: data.orderId,
          handler: function (response: any) {
            alert('✅ Payment successful! Credits will be added shortly.');
            window.location.reload();
          },
          theme: { color: '#0a0a0a' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (e) {
      alert('Payment error. Please try again.');
    }
    setIsProcessing(false);
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Add Credits</h1>
        <p>Purchase calling minutes to power your AI agent.</p>
      </div>

      {/* Current Balance */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Current Balance</div>
          <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px' }}>
            {creditsMinutes.toFixed(0)} <span style={{ fontSize: '16px', fontWeight: '400', color: 'var(--muted)' }}>minutes</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Estimated calls</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>~{Math.floor(creditsMinutes / 3)}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted-light)' }}>at 3 min avg/call</div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title" style={{ marginBottom: '20px' }}>Select a plan</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {plans.map((plan, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPlan(idx)}
              style={{
                padding: '16px',
                border: selectedPlan === idx ? '2px solid var(--foreground)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: selectedPlan === idx ? 'var(--card-hover)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms ease',
                position: 'relative',
                fontFamily: 'inherit',
              }}
            >
              {plan.popular && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '12px',
                  background: 'var(--foreground)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}>Popular</span>
              )}
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>{plan.label}</div>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>${plan.price}</div>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ 
          background: 'var(--card-hover)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>You're purchasing</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{selected.minutes} minutes</div>
            <div style={{ fontSize: '12px', color: 'var(--muted-light)' }}>${perMinute}/min</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Total</div>
            <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-1px' }}>${selected.price}</div>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%' }}
          onClick={handlePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><Loader2 size={18} className="spinner" /> Processing...</>
          ) : (
            <><CreditCard size={18} /> Purchase {selected.minutes} Minutes — ${selected.price}</>
          )}
        </button>

        <p style={{ fontSize: '12px', color: 'var(--muted-light)', textAlign: 'center', marginTop: '12px' }}>
          Secure payment via Razorpay. Credits are added instantly.
        </p>
      </div>
    </div>
  );
}
