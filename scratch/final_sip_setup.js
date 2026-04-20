// Final fix: Delete and recreate SIP trunk with correct format per docs
// Key learning: UDP is NOT supported. Must use TCP or TLS.
// The outbound Address should be hostname only, no sip: prefix.

const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const AGENT_ID = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

async function main() {
  // Step 1: Delete current phone number
  console.log('=== Step 1: Delete current phone ===');
  const listRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const phones = await listRes.json();
  console.log('Current phones:', phones.length);
  
  for (const p of phones) {
    console.log(`  Deleting ${p.phone_number_id}...`);
    await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${p.phone_number_id}`, {
      method: 'DELETE',
      headers: { 'xi-api-key': API_KEY },
    });
  }
  
  await new Promise(r => setTimeout(r, 2000));

  // Step 2: Create with CORRECT format per ElevenLabs docs
  // - Transport must be TCP (not UDP!)
  // - Address should be hostname only
  // - Authentication uses username/password
  console.log('\n=== Step 2: Create with correct format ===');
  
  const createBody = {
    phone_number: "+12063393710",
    label: "SignalWire",
    provider: "sip_trunk",
    agent_id: AGENT_ID,
    // Inbound config
    inbound_trunk: {
      allowed_addresses: ["0.0.0.0/0"],
      media_encryption: "allowed",
      transport: "tcp"
    },
    // Outbound config - the KEY missing piece
    outbound_trunk: {
      address: "ai-priya-agent.signalwire.com",
      transport: "tcp",
      media_encryption: "allowed",
      authentication: {
        type: "digest",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  };

  console.log('Body:', JSON.stringify(createBody, null, 2));

  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(createBody),
  });
  console.log('Create status:', createRes.status);
  const createText = await createRes.text();
  console.log('Create response:', createText);

  // If first format doesn't work, try alternative field names
  if (createRes.status !== 200) {
    console.log('\n--- Trying alternative field names ---');
    const alt = {
      phone_number: "+12063393710",
      label: "SignalWire",
      provider: "sip_trunk",
      agent_id: AGENT_ID,
      termination_uri: "ai-priya-agent.signalwire.com",
      inbound_trunk: {
        allowed_addresses: ["0.0.0.0/0"],
        media_encryption: "allowed"
      },
      outbound_trunk: {
        sip_trunk_address: "ai-priya-agent.signalwire.com",
        transport: "tcp",
        media_encryption: "allowed",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    };
    const altRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(alt),
    });
    console.log('Alt status:', altRes.status);
    const altText = await altRes.text();
    console.log('Alt response:', altText);
  }

  await new Promise(r => setTimeout(r, 1000));

  // Step 3: Verify
  console.log('\n=== Step 3: Verify ===');
  const verRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const verPhones = await verRes.json();
  for (const p of verPhones) {
    console.log('Phone:', p.phone_number);
    console.log('  ID:', p.phone_number_id);
    console.log('  Inbound:', p.supports_inbound);
    console.log('  Outbound:', p.supports_outbound);
    console.log('  Outbound trunk:', JSON.stringify(p.outbound_trunk));
    console.log('  Agent:', JSON.stringify(p.assigned_agent));

    // If outbound still not working, try PATCH with every possible field name
    if (!p.supports_outbound) {
      console.log('\n  Trying PATCH approaches...');
      const patchBodies = [
        { outbound_trunk: { address: "ai-priya-agent.signalwire.com", transport: "tcp", authentication: { username: "dd9defbb-1449-4a44-89f8-7d25b2e048de", password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d" } } },
        { outbound_trunk: { hostname: "ai-priya-agent.signalwire.com", transport: "tcp", username: "dd9defbb-1449-4a44-89f8-7d25b2e048de", password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d" } },
        { outbound_trunk: { sip_trunk_address: "ai-priya-agent.signalwire.com", transport: "tcp", media_encryption: "allowed", authentication: { type: "digest", username: "dd9defbb-1449-4a44-89f8-7d25b2e048de", password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d" } } },
      ];

      for (let i = 0; i < patchBodies.length; i++) {
        const pRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${p.phone_number_id}`, {
          method: 'PATCH',
          headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify(patchBodies[i]),
        });
        const pData = await pRes.json();
        console.log(`  Patch ${i+1}: outbound=${pData.supports_outbound}, trunk=${JSON.stringify(pData.outbound_trunk)}`);
        if (pData.supports_outbound) {
          console.log('  🎉 OUTBOUND ENABLED!');
          break;
        }
      }
    }
  }

  // Step 4: Test outbound call
  console.log('\n=== Step 4: Test outbound API ===');
  const phones2 = await (await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', { headers: { 'xi-api-key': API_KEY } })).json();
  if (phones2.length > 0) {
    const phoneId = phones2[0].phone_number_id;
    const testRes = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        agent_phone_number_id: phoneId,
        to_number: '+919876543210'
      }),
    });
    console.log('Outbound test status:', testRes.status);
    console.log('Outbound test response:', await testRes.text());
  }
}

main().catch(console.error);
