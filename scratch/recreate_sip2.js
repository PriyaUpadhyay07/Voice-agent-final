// Fix: Delete badly created entry and recreate with correct fields
const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const AGENT_ID = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

async function main() {
  // Step 1: Delete the badly created one
  console.log('=== Step 1: Delete bad entry ===');
  const delRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers/phnum_1301kpgfwqd8f6eax9r1xehv1dyh', {
    method: 'DELETE',
    headers: { 'xi-api-key': API_KEY },
  });
  console.log('Delete:', delRes.status);

  await new Promise(r => setTimeout(r, 1000));

  // Step 2: Create with termination_uri (the correct field name)
  console.log('\n=== Step 2: Create with termination_uri ===');
  const createBody = {
    phone_number: "+12063393710",
    label: "SignalWire Full",
    provider: "sip_trunk",
    agent_id: AGENT_ID,
    termination_uri: "sip:ai-priya-agent.signalwire.com",
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

  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(createBody),
  });
  console.log('Create status:', createRes.status);
  const createText = await createRes.text();
  console.log('Create response:', createText);

  await new Promise(r => setTimeout(r, 1000));

  // Step 3: Get the new phone number ID
  const listRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const phones = await listRes.json();
  console.log('\n=== Current phones ===');
  console.log(JSON.stringify(phones, null, 2));

  if (!Array.isArray(phones) || phones.length === 0) {
    console.log('No phones found!');
    return;
  }

  const phone = phones[0];
  const newPhoneId = phone.phone_number_id;
  console.log('\nNew Phone ID:', newPhoneId);
  console.log('Supports outbound:', phone.supports_outbound);

  // Step 4: If outbound still not set, try PATCH with correct field names
  if (!phone.supports_outbound) {
    console.log('\n=== Step 4: Trying PATCH with different field names ===');
    
    // Try various field name combinations
    const patches = [
      {
        name: 'termination_uri',
        body: { termination_uri: "sip:ai-priya-agent.signalwire.com" }
      },
      {
        name: 'sip_trunk_address in outbound',
        body: {
          outbound_trunk: {
            sip_trunk_address: "ai-priya-agent.signalwire.com",
            username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
            password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
          }
        }
      },
      {
        name: 'outbound with termination_uri',
        body: {
          outbound_trunk: {
            termination_uri: "sip:ai-priya-agent.signalwire.com",
            authentication: {
              type: "credentials",
              username: "dd9defbb-1449-4a44-89f8-7d25b2e048de",
              password: "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d"
            }
          }
        }
      }
    ];

    for (const patch of patches) {
      console.log(`\nTrying: ${patch.name}`);
      const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${newPhoneId}`, {
        method: 'PATCH',
        headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(patch.body),
      });
      const patchText = await patchRes.text();
      const data = JSON.parse(patchText);
      console.log(`  Status: ${patchRes.status}, outbound: ${data.supports_outbound}, trunk: ${JSON.stringify(data.outbound_trunk)}`);
      
      if (data.supports_outbound) {
        console.log('\n🎉 OUTBOUND ENABLED!');
        break;
      }
    }
  }

  // Step 5: Assign agent if needed
  console.log('\n=== Step 5: Assign agent ===');
  const assignRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${newPhoneId}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: AGENT_ID }),
  });
  const assignData = await assignRes.json();
  console.log('Agent assigned:', JSON.stringify(assignData.assigned_agent));
  console.log('Supports outbound:', assignData.supports_outbound);
  console.log('Outbound trunk:', JSON.stringify(assignData.outbound_trunk));

  // Step 6: Try outbound call API to see what error we get
  console.log('\n=== Step 6: Test outbound call API ===');
  const callRes = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: AGENT_ID,
      agent_phone_number_id: newPhoneId,
      to_number: '+919876543210'
    }),
  });
  console.log('Call API status:', callRes.status);
  const callText = await callRes.text();
  console.log('Call API response:', callText);
}

main().catch(console.error);
