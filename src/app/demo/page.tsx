'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'UAE / Dubai', code: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' }
];

export default function DemoPortal() {
  const [loading, setLoading] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  
  // Country Dropdown
  const [searchCountry, setSearchCountry] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  
  const [callActive, setCallActive] = useState(false);
  const [vapiCallId, setVapiCallId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<{role: 'ai'|'user', text: string}[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pollInterval: any;
    if (callActive && vapiCallId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/demo/call/status?callId=${vapiCallId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.transcript && data.transcript.length > 0) {
              setTranscript(data.transcript);
            }
            if (data.status === 'ended' || data.status === 'completed' || data.status === 'failed') {
              setCallActive(false);
              clearInterval(pollInterval);
            }
          }
        } catch (e) {
          console.error('Failed to poll transcript', e);
        }
      }, 2000);
    }
    return () => clearInterval(pollInterval);
  }, [callActive, vapiCallId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRunTest = async () => {
    if (!testNumber) {
      alert("Please enter a phone number to test.");
      return;
    }
    
    setLoading(true);
    setTranscript([{ role: 'ai', text: 'Ringing...' }]);
    
    try {
      const fullNumber = `${selectedCountry.code}${testNumber}`;
      const leadRes = await fetch('/api/demo/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullNumber, name: 'Demo Visitor', batchId: 'Demo_Trial' })
      });
      
      if (!leadRes.ok) throw new Error("API Route Missing");
      
      const leadData = await leadRes.json();
      // Directly call VAPI with the phone number
      const callRes = await fetch('/api/demo/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullNumber })
      });
      
      const callData = await callRes.json();
      if (callData.vapiCallId) {
        setVapiCallId(callData.vapiCallId);
        setCallActive(true);
      }
    } catch (err) {
      console.log(err);
      setTranscript(prev => [...prev, { role: 'ai', text: 'Call failed to connect.' }]);
    }
    setLoading(false);
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    c.code.includes(searchCountry)
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000000', 
      color: '#ffffff', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden' // Keeps elements from scrolling horizontally
    }}>
      {/* Background Gradient */}
      <div className="bg-gradient" style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '50vw',
        background: 'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Pure CSS 3D Shapes */}
      <div className="floating-pills" style={{ display: 'flex', flexDirection: 'column', gap: '-20px', transform: 'rotate(-20deg)' }}>
        <div style={{ width: '90px', height: '140px', background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', borderRadius: '99px', boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(255,255,255,0.4), 10px 20px 30px rgba(0,0,0,0.5)', zIndex: 1, marginTop: '40px', marginLeft: '40px' }} />
        <div style={{ width: '90px', height: '140px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', borderRadius: '99px', boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(255,255,255,0.4), 10px 20px 30px rgba(0,0,0,0.5)', zIndex: 2, marginTop: '-100px', marginLeft: '20px' }} />
        <div style={{ width: '90px', height: '140px', background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)', borderRadius: '99px', boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(255,255,255,0.4), 10px 20px 30px rgba(0,0,0,0.5)', zIndex: 3, marginTop: '-100px', marginLeft: '0px' }} />
      </div>

      <div className="floating-flower" style={{ position: 'relative', width: '160px', height: '160px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #c084fc, #8b5cf6)', borderRadius: '99px', transform: 'rotate(0deg)', boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #818cf8, #6366f1)', borderRadius: '99px', transform: 'rotate(45deg)', boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', borderRadius: '99px', transform: 'rotate(90deg)', boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #34d399, #10b981)', borderRadius: '99px', transform: 'rotate(135deg)', boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px', paddingBottom: '40px', width: '100%' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>
          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>VOICE<br/>COLD</div>
          <SparkleIcon />
          <div style={{ textAlign: 'left', lineHeight: '1.2' }}>CALLING<br/>AGENT</div>
        </div>

        {/* Heading */}
        <h1 className="hero-heading" style={{ fontWeight: '700', textAlign: 'center', lineHeight: '1.1', marginBottom: '30px', letterSpacing: '-1px' }}>
          Make your calls<br/>
          <span style={{ color: '#d8b4fe' }}>Automate</span>
        </h1>

        {/* Input Area */}
        <div className="input-container" style={{ position: 'relative', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', padding: '0 20px' }}>
          
          <div className="arrow-left-container" style={{ position: 'absolute', top: '-40px', left: '-50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>SELECT YOUR COUNTRY</span>
            <CurvedArrowLeft />
          </div>

          <div className="arrow-right-container" style={{ position: 'absolute', bottom: '-40px', right: '-80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CurvedArrowRight />
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', marginTop: '4px' }}>ENTER YOUR PHONE NUMBER</span>
          </div>

          <div style={{ 
            display: 'flex', 
            background: 'rgba(0,0,0,0.5)', 
            border: '2px solid white', 
            borderRadius: '99px',
            padding: '4px 8px',
            width: '100%',
            position: 'relative'
          }} ref={dropdownRef}>
            
            {/* Country Selector */}
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', outline: 'none' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{selectedCountry.flag}</span>
              <ChevronDown size={14} color="white" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            <div style={{ width: '2px', background: 'rgba(255,255,255,0.3)', margin: '8px 0' }} />

            {/* Number Input */}
            <input 
              type="tel" 
              placeholder="ENTER YOUR NO." 
              value={testNumber}
              onChange={e => setTestNumber(e.target.value.replace(/\D/g, ''))}
              style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none', fontWeight: '600', textAlign: 'center', letterSpacing: '1px', width: '100%' }}
            />

            {/* Dropdown Menu - Fixed Padding/Margin */}
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '100%', minWidth: '280px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', zIndex: 9999, overflow: 'hidden' }}>
                <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px', background: '#262626' }}>
                  <Search size={16} color="rgba(255,255,255,0.5)" />
                  <input 
                    type="text" 
                    placeholder="Search country..." 
                    value={searchCountry}
                    onChange={e => setSearchCountry(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none', width: '100%' }}
                    autoFocus
                  />
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredCountries.map(country => (
                    <div 
                      key={country.name}
                      onClick={() => { setSelectedCountry(country); setDropdownOpen(false); setSearchCountry(''); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)', background: selectedCountry.name === country.name ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = selectedCountry.name === country.name ? 'rgba(255,255,255,0.05)' : 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{country.flag}</span>
                        <span style={{ fontSize: '0.9rem', color: '#fff' }}>{country.name}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{country.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call Button */}
        <button 
          onClick={handleRunTest}
          disabled={loading}
          style={{ 
            background: 'linear-gradient(90deg, #1a1a1a, #3b0764)', 
            border: '2px solid #d8b4fe', 
            borderRadius: '99px', 
            padding: '12px 40px', 
            color: 'white', 
            fontWeight: '700', 
            fontSize: '14px', 
            letterSpacing: '1px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
          onMouseOver={e => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? <Loader2 size={16} className="spinner" /> : null}
          CALL NOW
        </button>

        {/* Live Transcript */}
        <div style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Live transcript</h3>
          
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '32px', 
            padding: '24px', 
            height: '350px',
            color: '#000',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}>
            {transcript.length === 0 ? (
              <div style={{ color: '#9ca3af', textAlign: 'center', marginTop: '40px', fontWeight: '500' }}>
                Start a call to see transcript...
              </div>
            ) : (
              transcript.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-start' : 'flex-end', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px', marginLeft: '8px', marginRight: '8px', color: '#6b7280' }}>
                    {msg.role === 'user' ? 'you' : 'AI agent'}
                  </span>
                  <div style={{ 
                    background: '#0ea5e9', 
                    color: 'white', 
                    padding: '10px 16px', 
                    borderRadius: '20px',
                    borderBottomLeftRadius: msg.role === 'user' ? '4px' : '20px',
                    borderBottomRightRadius: msg.role === 'ai' ? '4px' : '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    maxWidth: '85%',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Global & Responsive CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.7); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        
        /* Floating Elements Animation */
        @keyframes float1 {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }
        @keyframes float2 {
          0% { transform: translateY(0px) rotate(10deg); }
          50% { transform: translateY(15px) rotate(15deg); }
          100% { transform: translateY(0px) rotate(10deg); }
        }

        .floating-pills {
          position: absolute;
          top: 25%;
          left: 10%;
          width: 150px;
          z-index: 1;
          animation: float1 6s ease-in-out infinite;
        }

        .floating-flower {
          position: absolute;
          top: 10%;
          right: 15%;
          width: 150px;
          z-index: 1;
          animation: float2 7s ease-in-out infinite;
        }

        .hero-heading {
          font-size: 4.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-heading {
            font-size: 2.5rem !important;
            margin-bottom: 40px !important;
          }
          .floating-pills {
            width: 80px;
            left: 5%;
            top: 20%;
          }
          .floating-flower {
            width: 80px;
            right: 5%;
            top: 5%;
          }
          .arrow-left-container {
            display: none !important;
          }
          .arrow-right-container {
            display: none !important;
          }
          .input-container {
            margin-bottom: 20px !important;
          }
        }
      `}} />
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" fill="white"/>
    </svg>
  );
}

function CurvedArrowLeft() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-20deg)', marginTop: '4px' }}>
      <path d="M90 20 C 50 20, 20 50, 30 80" stroke="#d8b4fe" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M15 65 L30 80 L45 70" stroke="#d8b4fe" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CurvedArrowRight() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(20deg)' }}>
      <path d="M10 20 C 50 20, 80 50, 70 80" stroke="#d8b4fe" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M85 65 L70 80 L55 70" stroke="#d8b4fe" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
