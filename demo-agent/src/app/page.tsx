"use client";

import { useState } from 'react';
import { Phone, PhoneOff, Mic, Loader2, List, FileText } from 'lucide-react';

export default function DemoAgent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [script, setScript] = useState('');
  const [status, setStatus] = useState<'idle' | 'calling' | 'in-progress' | 'completed' | 'error'>('idle');
  const [callId, setCallId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCall = async () => {
    if (!phoneNumber) return;
    setStatus('calling');
    setErrorMessage('');
    setTranscript('');

    const cleanNumber = phoneNumber.replace(/\s+/g, '');

    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanNumber, script })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initiate call');

      setCallId(data.callId);
      setStatus('in-progress');
      
      // Start polling for status and transcript
      pollCallStatus(data.callId);
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const pollCallStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?id=${id}`);
        const data = await res.json();
        
        if (data.transcript) {
          setTranscript(data.transcript);
        }
        
        if (data.status === 'ended' || data.status === 'completed') {
          setStatus('completed');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching status', err);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-gray-200">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">VoiceAgent Demo</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">Outbound Testing</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Test Your Voice Agent</h1>
          <p className="text-gray-500 text-sm">Enter your number to receive an AI-powered phone call immediately.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Your Phone Number</label>
              <input 
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* Script Input */}
            <div>
              <label className="flex justify-between text-sm font-semibold mb-2 text-gray-700">
                <span>Custom System Prompt / Script</span>
                <span className="text-gray-400 font-normal">Optional</span>
              </label>
              <textarea 
                rows={4}
                placeholder="Hi! I am calling to see if you are interested in our AI automation services..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all resize-none"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-2">If left blank, the agent will use its default configuration.</p>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button 
                onClick={handleCall}
                disabled={!phoneNumber || status === 'calling' || status === 'in-progress'}
                className="w-full py-3.5 px-4 bg-[#1a1a1a] hover:bg-black text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {status === 'calling' ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Initiating Call...</>
                ) : status === 'in-progress' ? (
                  <><PhoneOff className="w-5 h-5 text-red-400" /> Call In Progress</>
                ) : (
                  <><Phone className="w-5 h-5" /> Call Me Now</>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Live Call Data Section */}
        {(status === 'in-progress' || status === 'completed') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-sm">Call Activity Logs</h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                status === 'in-progress' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-600'
              }`}>
                {status === 'in-progress' ? 'Live Call Active' : 'Call Completed'}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-2">Live Transcript</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-h-[120px] text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-mono">
                    {transcript || (status === 'in-progress' ? 'Waiting for conversation to start...' : 'No transcript available.')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
