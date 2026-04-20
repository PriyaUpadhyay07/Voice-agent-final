// Delete and recreate SIP trunk with outbound support
const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const PHONE_ID = 'phnum_5101kpe8cke8eeyaj4ha1w1kgg68';
const AGENT_ID = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

async function main() {
  // Step 1: Delete the existing phone number
  console.log('=== Step 1: Deleting current phone number ===');
  const delRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${PHONE_ID}`, {
    method: 'DELETE',
    headers: { 'xi-api-key': API_KEY },
  });
  console.log(`Delete status: ${delRes.status}`);
  if (!delRes.ok) {
    const t = await delRes.text();
    console.log('Delete error:', t);
  } else {
    console.log('✅ Old phone number deleted');
  }

  // Wait a moment
  await new Promise(r => setTimeout(r, 2000));

  // Step 2: Re-create with outbound trunk configured
  console.log('\n=== Step 2: Creating new phone number with outbound ===');
  
  const createBody = {
    phone_number: "+12063393710",
    label: "SignalWire Outbound",
    provider: "sip_trunk",
    agent_id: AGENT_ID,
    inbound_trunk: {
      allowed_addresses: ["0.0.0.0/0"],
      media_encryption: "allowed"
    },
    outbound_trunk: {
      sip_trunk_address: "ai-priya-agent.signalwire.com",
      authentication: {
        type: "credentials",
        username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
        password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
      }
    }
  };

  console.log('Create body:', JSON.stringify(createBody, null, 2));

  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers/create', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(createBody),
  });

  console.log(`Create status: ${createRes.status}`);
  const createText = await createRes.text();
  console.log('Create response:', createText);

  if (!createRes.ok) {
    // Try alternative endpoint
    console.log('\n--- Trying alternative create endpoint ---');
    const createRes2 = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(createBody),
    });
    console.log(`Alt create status: ${createRes2.status}`);
    const createText2 = await createRes2.text();
    console.log('Alt create response:', createText2);
  }

  // Step 3: Verify
  console.log('\n=== Step 3: Verifying ===');
  const verifyRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const phones = await verifyRes.json();
  console.log('All phone numbers:', JSON.stringify(phones, null, 2));

  // If there's a new phone, try outbound call
  if (Array.isArray(phones) && phones.length > 0) {
    const phone = phones[0];
    console.log('\nPhone ID:', phone.phone_number_id);
    console.log('Supports outbound:', phone.supports_outbound);
    console.log('Outbound trunk:', JSON.stringify(phone.outbound_trunk));
  }
}

main().catch(console.error);
