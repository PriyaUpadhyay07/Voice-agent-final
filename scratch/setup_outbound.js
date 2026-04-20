// Script to enable outbound SIP trunk on ElevenLabs phone number
const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const PHONE_NUMBER_ID = 'phnum_5101kpe8cke8eeyaj4ha1w1kgg68';

async function enableOutbound() {
  console.log('=== Enabling Outbound SIP Trunk on ElevenLabs ===');
  
  const body = {
    outbound_trunk: {
      sip_trunk_address: "ai-priya-agent.signalwire.com",
      transport: "udp",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  };

  console.log('Request body:', JSON.stringify(body, null, 2));

  const res = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${PHONE_NUMBER_ID}`, {
    method: 'PATCH',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Response:', text);
  
  if (res.ok) {
    console.log('\n✅ Outbound trunk configured successfully!');
  } else {
    console.log('\n❌ Failed. Let me try alternative format...');
    
    // Try alternative body format
    const body2 = {
      outbound_trunk: {
        sip_trunk_address: "sip:ai-priya-agent.signalwire.com",
        authentication: {
          type: "credentials", 
          username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
          password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
        }
      }
    };
    
    const res2 = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${PHONE_NUMBER_ID}`, {
      method: 'PATCH',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body2),
    });
    
    console.log('Alt Status:', res2.status, res2.statusText);
    const text2 = await res2.text();
    console.log('Alt Response:', text2);
  }
}

// Also verify current state
async function checkCurrentState() {
  console.log('\n=== Current Phone Number Config ===');
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${PHONE_NUMBER_ID}`, {
    headers: { 'xi-api-key': API_KEY },
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

// Check the agent's first message config
async function checkAgent() {
  console.log('\n=== Agent Configuration ===');
  const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/agent_8601knrwbp57ebnvzwkcd8eqwqys', {
    headers: { 'xi-api-key': API_KEY },
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  await checkCurrentState();
  await checkAgent();
  await enableOutbound();
  console.log('\n=== Verifying after update ===');
  await checkCurrentState();
}

main().catch(console.error);
