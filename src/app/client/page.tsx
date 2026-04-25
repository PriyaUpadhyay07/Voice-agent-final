'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Play, Upload, Plus, History, Clock, FileText, Phone, CheckCircle, 
  XCircle, Loader2, CreditCard, Shield, ChevronDown
} from 'lucide-react';
import { resilientFetch } from '@/lib/fetch-utils';
import { loginWithEmail, getClientSession } from './actions';

type Lead = {
  id: string;
  phone: string;
  name: string;
  status: string;
  batchId: string | null;
  calls: any[];
};

export default function ClientDemoPage() {
  return (
    <Suspense fallback={<div className="flex-center h-screen"><Loader2 className="spinner" /></div>}>
      <ClientDemoContent />
    </Suspense>
  );
}

function ClientDemoContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // App State
  const [countryCode, setCountryCode] = useState('+1');
  const [testNumber, setTestNumber] = useState('');
  const [script, setScript] = useState('Hello! I am an AI calling to see if you are interested in our services.');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getClientSession();
      const adminRequestedUserId = searchParams.get('userId');
      
      // Smart Solution: If Admin is logged in, allow viewing any client portal via userId param
      if (session?.user?.role === 'ADMIN' && adminRequestedUserId) {
        const clientsRes = await fetch('/api/clients');
        const clients = await clientsRes.json();
        const targetClient = clients.find((c: any) => c.id === adminRequestedUserId);
        
        if (targetClient) {
          setEmail(targetClient.email);
          setClientData(targetClient);
          setScript(targetClient.script || targetClient.script === '' ? targetClient.script : script);
          await fetchMyLeads(targetClient.id);
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }
      }

      if (session?.user?.email) {
        setEmail(session.user.email);
        
        // Fetch client data
        const clientsRes = await fetch('/api/clients');
        const clients = await clientsRes.json();
        let me = clients.find((c: any) => (c.email === session.user.email) || (adminRequestedUserId && c.id === adminRequestedUserId));
        
        if (!me) {
          // Auto-create dummy client data for demo if not in DB yet
          me = { id: session.user.id || session.user.email, email: session.user.email, name: session.user.name || 'Demo User', creditsMinutes: 10, walletAmount: 50, script: script };
        }
        
        setClientData(me);
        setScript(me.script || me.script === '' ? me.script : script);
        await fetchMyLeads(me.id);
        
        // Set logged in LAST so UI doesn't crash trying to read null clientData
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Real Magic Link Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email);
      setMagicLinkSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send Magic Link. Please check your EMAIL_SERVER configuration.");
    }
    setLoading(false);
  };

  const fetchMyLeads = async (userId: string) => {
    try {
      const res = await fetch(`/api/leads?userId=${userId}`); 
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
        
        const uniqueBatches = Array.from(new Set(data.map((l: any) => l.batchId).filter(Boolean))) as string[];
      setBatches(uniqueBatches);
      if (uniqueBatches.length > 0 && !activeBatch) {
        setActiveBatch(uniqueBatches[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const leadsToAdd: any[] = [];
    
    // Simple CSV parser
    const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) leadsToAdd.push({ name: parts[0], phone: parts[1] });
    }

    if (leadsToAdd.length > 0) {
      const batchName = `Batch_${new Date().toLocaleDateString().replace(/\//g, '-')}_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
      
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: clientData.id, leads: leadsToAdd, batchId: batchName })
        });
        
        if (res.ok) {
          setUploadedFiles(prev => [...prev, { name: file.name, type: file.name.split('.').pop()?.toUpperCase() || 'CSV' }]);
          await fetchMyLeads(clientData.id);
          setActiveBatch(batchName);
        }
      } catch (err) {
        alert('Failed to upload leads.');
      }
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveScript = async () => {
    try {
      await fetch(`/api/clients/${clientData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
      });
    } catch (e) {}
  };

  const handleRunTest = async () => {
    if (!testNumber) {
      alert("Please enter a phone number to test.");
      return;
    }
    await saveScript();
    
    // Add the test number as a lead and call it
    setLoading(true);
    try {
      const fullNumber = `${countryCode}${testNumber}`;
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: clientData.id, 
          leads: [{ name: 'Test Client', phone: fullNumber }],
          batchId: activeBatch || 'Test_Run'
        })
      });
      
      const leadData = await leadRes.json();
      if (leadData.leadIds && leadData.leadIds[0]) {
        await fetch('/api/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: leadData.leadIds[0] })
        });
        alert('Calling ' + fullNumber + ' now!');
        await fetchMyLeads(clientData.id);
      }
    } catch (err) {
      alert('Error starting call.');
    }
    setLoading(false);
  };

  const handleRunBatch = async () => {
    const pendingLeads = currentBatchLeads.filter(l => l.status === 'pending');
    if (pendingLeads.length === 0) {
      alert("No pending leads in this batch.");
      return;
    }
    
    setLoading(true);
    await saveScript();
    
    // Trigger calls for all pending sequentially (in production this would be a background job)
    let count = 0;
    for (const lead of pendingLeads) {
      try {
        await fetch('/api/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id })
        });
        count++;
      } catch (e) { console.error(e); }
    }
    
    alert(`Started ${count} calls!`);
    await fetchMyLeads(clientData.id);
    setLoading(false);
  };

  // Pre-Login Screen
  if (loading && !magicLinkSent) {
    return <div className="flex-center h-screen"><Loader2 className="spinner" size={32} /></div>;
  }

  if (!isLoggedIn || !clientData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--background))' }}>
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Phone size={32} /></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Agent Demo</h1>
          
          {magicLinkSent ? (
            <div style={{ padding: '2rem 0' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Check your email</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>We've sent a magic link to <strong>{email}</strong>. Click it to log in securely.</p>
            </div>
          ) : (
            <>
              <div style={{ 
                marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', 
                border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '12px', fontSize: '0.85rem', 
                color: 'hsl(var(--muted-foreground))', textAlign: 'left', lineHeight: '1.4'
              }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>✨ Don't worry!</span>
                Your voice calling agent is safe. Just enter the email you used before, and click the link in your inbox to jump back in.
              </div>
              
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', background: 'transparent', color: 'hsl(var(--foreground))' }}
                />
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.75rem' }}>
                  {loading ? <Loader2 className="spinner" size={16} /> : 'Send Magic Link'}
                </button>
              </form>
            </>
          )}
          
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '1.5rem' }}>
            <Shield size={12} style={{ display: 'inline', marginRight: '4px' }}/> Secured via Magic Link (Real Auth)
          </p>
        </div>
      </div>
    );
  }

  // Active Batch Leads
  const currentBatchLeads = activeBatch ? leads.filter(l => l.batchId === activeBatch) : leads;
  
  const totalCount = currentBatchLeads.length;
  const interestedCount = currentBatchLeads.filter(l => l.status === 'interested').length;
  const notInterestedCount = currentBatchLeads.filter(l => l.status === 'rejected').length;
  const pendingCount = currentBatchLeads.filter(l => l.status === 'pending').length;
  const busyCount = currentBatchLeads.filter(l => l.status === 'busy').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      
      {/* SIDEBAR - HISTORY */}
      <aside style={{ width: '260px', borderRight: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} /> VoiceAgent
          </h2>
        </div>
        
        <div style={{ padding: '1rem' }}>
          <button 
            onClick={() => setActiveBatch(null)}
            className="btn-outline" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
          >
            <Plus size={16} /> New Leads
          </button>
          
          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <History size={12} /> Upload History
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {batches.map(batch => (
              <button 
                key={batch}
                onClick={() => setActiveBatch(batch)}
                style={{ 
                  textAlign: 'left', padding: '0.5rem', borderRadius: 'var(--radius)', border: 'none',
                  background: activeBatch === batch ? 'hsl(var(--accent))' : 'transparent',
                  color: activeBatch === batch ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))',
                  cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
              >
                {batch.replace('Batch_', '').replace('_', ' ')}
              </button>
            ))}
            {batches.length === 0 && (
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', padding: '0.5rem' }}>No history yet.</div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* HEADER */}
        <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Calling Dashboard</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>{activeBatch ? `Viewing: ${activeBatch}` : 'Create a new campaign'}</p>
          </div>
          
          {/* CREDITS DISPLAY */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'hsl(var(--card))', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', fontWeight: '600' }}>Balance</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${clientData.walletAmount.toFixed(2)}</div>
            </div>
            <div style={{ height: '30px', width: '1px', background: 'hsl(var(--border))' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', fontWeight: '600' }}>Call Minutes</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {clientData.creditsMinutes.toFixed(0)} min
              </div>
            </div>
          </div>
        </header>

        {/* INPUT SECTION */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* ADD NUMBER */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Test Number (For Demo Call)</label>
              <div style={{ display: 'flex' }}>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                    style={{ appearance: 'none', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRight: 'none', borderRadius: 'var(--radius) 0 0 var(--radius)', padding: '0.75rem 2rem 0.75rem 1rem', color: 'hsl(var(--foreground))', outline: 'none' }}
                  >
                    <option value="+1">🇺🇸 USA +1</option>
                    <option value="+1">🇨🇦 Canada +1</option>
                    <option value="+91">🇮🇳 India +91</option>
                    <option value="+44">🇬🇧 UK +44</option>
                    <option value="+61">🇦🇺 Australia +61</option>
                    <option value="+971">🇦🇪 Dubai +971</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'hsl(var(--muted-foreground))' }} />
                </div>
                <input 
                  type="text" 
                  placeholder="9876543210" 
                  value={testNumber}
                  onChange={e => setTestNumber(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0 var(--radius) var(--radius) 0', color: 'hsl(var(--foreground))', outline: 'none' }}
                />
              </div>
            </div>

            {/* WRITE SCRIPT */}
            <div style={{ flex: '2', minWidth: '300px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>AI Agent Script</label>
              <textarea 
                value={script}
                onChange={e => setScript(e.target.value)}
                placeholder="Write exactly what you want the AI to say..."
                style={{ width: '100%', padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', outline: 'none', minHeight: '45px', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* UPLOAD LEADS */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Bulk Leads</label>
              <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".csv" style={{ display: 'none' }} />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-outline" 
                style={{ width: '100%', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <Upload size={16} /> {loading ? 'Uploading...' : 'Upload CSV / Sheet'}
              </button>
            </div>
            
          </div>

          {/* UPLOADED FILES PREVIEW */}
          {uploadedFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '-0.5rem' }}>
              {uploadedFiles.map((file, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid hsl(var(--border))', 
                  borderRadius: '12px', minWidth: '180px', position: 'relative'
                }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', background: file.type === 'CSV' ? '#10b981' : '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                  }}>
                    {file.type === 'CSV' ? <FileText size={16} /> : <Upload size={16} />}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>{file.type} File</div>
                  </div>
                  <button 
                    onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', padding: '4px' }}
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* RUN ACTION */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              onClick={currentBatchLeads.length > 0 ? handleRunBatch : handleRunTest}
              disabled={loading}
              style={{ 
                background: 'hsl(var(--foreground))', color: 'hsl(var(--background))', 
                border: 'none', borderRadius: '99px', padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)', transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? <Loader2 className="spinner" size={20} /> : <Play fill="currentColor" size={20} />}
              {currentBatchLeads.length > 0 ? `RUN CAMPAIGN (${pendingCount} pending)` : 'TEST CALL NOW'}
            </button>
          </div>

        </div>

        {/* DASHBOARD DIVIDER */}
        <div style={{ height: '1px', background: 'hsl(var(--border))', width: '100%' }}></div>

        {/* LIVE COLUMNS */}
        <div style={{ display: 'flex', flex: 1, padding: '2rem', gap: '1.5rem', overflowX: 'auto', background: 'rgba(0,0,0,0.01)' }}>
          
          {/* Column 1: Total Leads */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', marginBottom: '1rem', borderTop: '3px solid hsl(var(--muted-foreground))' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Leads</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalCount}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentBatchLeads.map(l => (
                <div key={l.id} style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: '500' }}>{l.name}</div>
                  <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>{l.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Interested */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', marginBottom: '1rem', borderTop: '3px solid #10b981' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#10b981' }}>Interested</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{interestedCount}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentBatchLeads.filter(l => l.status === 'interested').map(l => (
                <div key={l.id} style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid #10b98120', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: '500' }}>{l.name} <CheckCircle size={12} color="#10b981" style={{ display: 'inline' }}/></div>
                  <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>{l.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Not Interested */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', marginBottom: '1rem', borderTop: '3px solid #ef4444' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#ef4444' }}>Not Interested</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{notInterestedCount}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentBatchLeads.filter(l => l.status === 'rejected').map(l => (
                <div key={l.id} style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid #ef444420', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: '500' }}>{l.name} <XCircle size={12} color="#ef4444" style={{ display: 'inline' }}/></div>
                  <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>{l.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Pending / Busy */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', marginBottom: '1rem', borderTop: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#f59e0b' }}>Pending / Busy</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingCount + busyCount}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentBatchLeads.filter(l => l.status === 'pending' || l.status === 'busy').map(l => (
                <div key={l.id} style={{ padding: '0.75rem', background: 'hsl(var(--card))', border: '1px solid #f59e0b20', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: '500', display: 'flex', justifyContent: 'space-between' }}>
                    {l.name} 
                    <span style={{ fontSize: '0.7rem', color: l.status === 'busy' ? '#ef4444' : '#f59e0b', background: l.status === 'busy' ? '#ef444420' : '#f59e0b20', padding: '2px 6px', borderRadius: '4px' }}>{l.status}</span>
                  </div>
                  <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>{l.phone}</div>
                </div>
              ))}
              
              {(pendingCount > 0 || busyCount > 0) && (
                <button 
                  onClick={handleRunBatch}
                  className="btn-outline" 
                  style={{ marginTop: '1rem', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  <Play size={14} /> Run All Pending
                </button>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
