// Try different API approaches to enable outbound
const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const PHONE_ID = 'phnum_5101kpe8cke8eeyaj4ha1w1kgg68';

async function tryApproach(label, body) {
  console.log(`\n--- ${label} ---`);
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${PHONE_ID}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text.substring(0, 500)}`);
  return res.status;
}

async function main() {
  // Approach 1: Simple outbound trunk
  await tryApproach('Approach 1: Basic outbound_trunk', {
    outbound_trunk: {
      sip_trunk_address: "ai-priya-agent.signalwire.com",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  });

  // Approach 2: With sip: prefix
  await tryApproach('Approach 2: sip: prefix', {
    outbound_trunk: {
      sip_trunk_address: "sip:ai-priya-agent.signalwire.com",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  });

  // Approach 3: With port
  await tryApproach('Approach 3: With port 5060', {
    outbound_trunk: {
      sip_trunk_address: "ai-priya-agent.signalwire.com:5060",
      transport: "udp",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  });

  // Approach 4: With from number
  await tryApproach('Approach 4: With from', {
    outbound_trunk: {
      sip_trunk_address: "ai-priya-agent.signalwire.com",
      from: "+12063393710",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  });

  // Now try a completely different approach: just use the outbound call API directly
  // even without outbound trunk configured
  console.log('\n\n=== Trying Direct Outbound Call API ===');
  
  // Try /v1/convai/sip-trunk/outbound-call
  const callRes = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: 'agent_8601knrwbp57ebnvzwkcd8eqwqys',
      agent_phone_number_id: PHONE_ID,
      to_number: '+919876543210'  // dummy number just to test the API response
    }),
  });
  console.log(`Status: ${callRes.status}`);
  const callText = await callRes.text();
  console.log(`Response: ${callText}`);

  // Try /v1/convai/twilio/outbound-call (since SignalWire is Twilio-compatible)
  console.log('\n--- Trying Twilio outbound endpoint ---');
  const callRes2 = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: 'agent_8601knrwbp57ebnvzwkcd8eqwqys',
      agent_phone_number_id: PHONE_ID,
      to_number: '+919876543210'
    }),
  });
  console.log(`Status: ${callRes2.status}`);
  const callText2 = await callRes2.text();
  console.log(`Response: ${callText2}`);

  // Check what endpoints are available
  console.log('\n--- Listing available convai endpoints ---');
  const endpoints = [
    'https://api.elevenlabs.io/v1/convai/sip-trunk',
    'https://api.elevenlabs.io/v1/convai/phone-numbers',
  ];
  for (const url of endpoints) {
    const r = await fetch(url, { headers: { 'xi-api-key': API_KEY } });
    console.log(`${url} => ${r.status}`);
    if (r.ok) {
      const t = await r.text();
      console.log(t.substring(0, 300));
    }
  }
}

main().catch(console.error);
