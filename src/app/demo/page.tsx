
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, Clock, Phone, CheckCircle, 
  XCircle, Loader2, Shield, ChevronDown, Activity
} from 'lucide-react';

export default function DemoPortal() {
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('+1');
  const [testNumber, setTestNumber] = useState('');
  const [script, setScript] = useState('Hello! I am an AI calling from the demo portal to show you how this works.');
  const [leads, setLeads] = useState<any[]>([]);
  const [platformInfo, setPlatformInfo] = useState<any>(null);
  
  useEffect(() => {
    fetchDemoData();
    const interval = setInterval(fetchDemoData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDemoData = async () => {
    try {
      // Fetch admin's platform credits
      const credsRes = await fetch('/api/demo/credits');
      const credsData = await credsRes.json();
      setPlatformInfo(credsData);

      // Fetch recent demo leads
      const leadsRes = await fetch('/api/demo/leads');
      const leadsData = await leadsRes.json();
      setLeads(leadsData);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleRunTest = async () => {
    if (!testNumber) {
      alert("Please enter a phone number to test.");
      return;
    }
    
    setLoading(true);
    try {
      const fullNumber = `${countryCode}${testNumber}`;
      // Create lead via demo API
      const leadRes = await fetch('/api/demo/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: fullNumber, 
          name: 'Demo Visitor',
          batchId: 'Demo_Trial'
        })
      });
      
      const leadData = await leadRes.json();
      if (leadData.leadIds && leadData.leadIds[0]) {
        // Start call via demo API
        await fetch('/api/demo/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: leadData.leadIds[0] })
        });
        alert('Calling ' + fullNumber + ' now! Please answer to hear the AI.');
        await fetchDemoData();
      }
    } catch (err) {
      alert('Error starting call.');
    }
    setLoading(false);
  };

  if (loading && !platformInfo) {
    return <div className="flex-center h-screen"><Loader2 className="spinner" size={32} /></div>;
  }

  const interestedCount = leads.filter(l => l.status === 'interested').length;
  const rejectedCount = leads.filter(l => l.status === 'rejected').length;
  const pendingCount = leads.filter(l => l.status === 'pending' || l.status === 'calling' || l.status === 'busy').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', borderRight: '1px solid hsl(var(--border))', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(var(--border))' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} /> VoiceAgent
          </h2>
          <div style={{ fontSize: '0.7rem', color: '#10b981', background: '#10b98115', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>PUBLIC DEMO</div>
        </div>
        
        <div style={{ padding: '1rem' }}>
           <div style={{ padding: '1rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '0.85rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>Experience AI Outreach</p>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', lineHeight: '1.4' }}>
                Enter your number on the right to hear our conversational AI in action.
              </p>
           </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Trial Dashboard</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>Live Preview Mode</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'hsl(var(--card))', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Admin Balance <span style={{ fontSize: '0.6rem', color: '#10b981', background: '#10b98110', padding: '1px 4px', borderRadius: '4px' }}>REAL</span>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                ${(platformInfo?.realBalance || 0).toFixed(2)}
              </div>
            </div>
            <div style={{ height: '30px', width: '1px', background: 'hsl(var(--border))' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', fontWeight: '600' }}>Call Minutes</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {(platformInfo?.creditsMinutes || 0).toFixed(0)} min
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* TEST NUMBER */}
            <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>Step 1: Your Phone Number</label>
              <div style={{ display: 'flex' }}>
                <select 
                  value={countryCode} 
                  onChange={e => setCountryCode(e.target.value)}
                  style={{ appearance: 'none', background: 'hsl(var(--input-bg))', border: '1px solid hsl(var(--input-border))', borderRight: 'none', borderRadius: 'var(--radius) 0 0 var(--radius)', padding: '0.75rem 1rem', color: 'hsl(var(--foreground))', outline: 'none' }}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Enter number" 
                  value={testNumber}
                  onChange={e => setTestNumber(e.target.value)}
                  style={{ flex: 1, padding: '0.85rem', background: 'hsl(var(--input-bg))', border: '1px solid hsl(var(--input-border))', borderRadius: '0 var(--radius) var(--radius) 0', color: 'hsl(var(--foreground))', outline: 'none' }}
                />
              </div>
            </div>

            {/* SCRIPT PREVIEW */}
            <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>Step 2: AI Script Preview</label>
              <textarea 
                value={script}
                onChange={e => setScript(e.target.value)}
                style={{ width: '100%', padding: '0.85rem', background: 'hsl(var(--input-bg))', border: '1px solid hsl(var(--input-border))', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', outline: 'none', minHeight: '60px', fontSize: '0.9rem' }}
              />
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleRunTest}
              disabled={loading}
              style={{ 
                background: 'hsl(var(--foreground))', color: 'hsl(var(--background))', 
                border: 'none', borderRadius: '99px', padding: '1rem 4rem', fontSize: '1.1rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
              }}
            >
              {loading ? <Loader2 className="spinner" size={20} /> : <Play fill="currentColor" size={20} />}
              CALL ME NOW
            </button>
          </div>

        </div>

        <div style={{ height: '1px', background: 'hsl(var(--border))', width: '100%' }}></div>

        {/* RECENT ACTIVITY */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Recent Trial Activity
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {leads.map(l => (
              <div key={l.id} style={{ padding: '1rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  {l.phone.replace(/.(?=.{4})/g, '*')} 
                  <span style={{ fontSize: '0.7rem', color: l.status === 'interested' ? '#10b981' : '#f59e0b', background: l.status === 'interested' ? '#10b98115' : '#f59e0b15', padding: '2px 6px', borderRadius: '12px' }}>{l.status}</span>
                </div>
                <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem' }}>{new Date(l.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
            {leads.length === 0 && <p style={{ color: 'hsl(var(--muted-foreground))' }}>No calls made yet.</p>}
          </div>
        </div>

      </main>
    </div>
  );
}
