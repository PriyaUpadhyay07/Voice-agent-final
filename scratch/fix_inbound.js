// Fix phone number to have proper inbound support and test SIP connectivity
const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const AGENT_ID = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

async function main() {
  // Step 1: Delete current phone and recreate with proper inbound
  console.log('=== Step 1: Delete and recreate with proper inbound ===');
  const listRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const phones = await listRes.json();
  for (const p of phones) {
    console.log(`Deleting ${p.phone_number_id}...`);
    await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${p.phone_number_id}`, {
      method: 'DELETE', headers: { 'xi-api-key': API_KEY },
    });
  }
  
  await new Promise(r => setTimeout(r, 2000));

  // Create with ONLY inbound trunk properly configured
  // The approach: SignalWire dials sip:+12063393710@sip.rtc.elevenlabs.io:5060
  // ElevenLabs receives the call inbound and routes to the agent
  const createBody = {
    phone_number: "+12063393710",
    label: "SignalWire Inbound",
    provider: "sip_trunk",
    agent_id: AGENT_ID,
    inbound_trunk: {
      allowed_addresses: ["0.0.0.0/0"],
      media_encryption: "allowed"
    }
  };

  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(createBody),
  });
  console.log('Create status:', createRes.status);
  const newPhone = await createRes.json();
  console.log('New phone:', JSON.stringify(newPhone));

  const newId = newPhone.phone_number_id;
  
  await new Promise(r => setTimeout(r, 1000));

  // Step 2: Assign agent and verify
  console.log('\n=== Step 2: Assign agent ===');
  const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${newId}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      agent_id: AGENT_ID,
      inbound_trunk: {
        allowed_addresses: ["0.0.0.0/0"],
        media_encryption: "allowed"
      }
    }),
  });
  const patchData = await patchRes.json();
  console.log('After patch:', JSON.stringify(patchData, null, 2));
  console.log('\nSupports inbound:', patchData.supports_inbound);
  console.log('Agent:', JSON.stringify(patchData.assigned_agent));

  // Step 3: Now the correct SIP URI for TwiML
  console.log('\n=== Correct TwiML SIP Configuration ===');
  console.log('SignalWire should dial: sip:+12063393710@sip.rtc.elevenlabs.io:5060;transport=tcp');
  console.log('This means ElevenLabs receives the call INBOUND and routes to the agent.');
  console.log('The agent speaks first with its configured first message: "Hello! How can I help you today?"');
}

main().catch(console.error);
