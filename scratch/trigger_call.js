const fetch = require('node-fetch');

async function triggerCall() {
  const leadId = 'cmo2w4rut0001ozwyt5yaz6iv'; // priya lead ID from DB
  const url = 'https://voice-agent-jbl4.vercel.app/api/call';
  
  console.log(`🚀 Triggering direct call to lead: ${leadId}...`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId })
    });
    
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

triggerCall();
