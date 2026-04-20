// Run this script to register the phone number in ElevenLabs
// This is needed because we deleted the old entry during debugging
// Run: node scratch/register_phone.js

const API_KEY = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
const AGENT_ID = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

async function main() {
  console.log('Checking existing phone numbers...');
  const listRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': API_KEY },
  });
  const phones = await listRes.json();
  
  if (phones.length > 0) {
    console.log('Phone already exists:', phones[0].phone_number_id);
    console.log('  Inbound:', phones[0].supports_inbound);
    console.log('  Agent:', JSON.stringify(phones[0].assigned_agent));
    
    // Just make sure agent is assigned
    if (!phones[0].assigned_agent) {
      console.log('Assigning agent...');
      await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phones[0].phone_number_id}`, {
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
      console.log('Agent assigned!');
    }
    return;
  }

  console.log('Creating phone number with inbound SIP trunk...');
  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone_number: "+12063393710",
      label: "SignalWire",
      provider: "sip_trunk",
      agent_id: AGENT_ID,
      inbound_trunk: {
        allowed_addresses: ["0.0.0.0/0"],
        media_encryption: "allowed"
      }
    }),
  });

  console.log('Status:', createRes.status);
  const data = await createRes.json();
  console.log('Created:', JSON.stringify(data));

  if (data.phone_number_id) {
    // Make sure inbound is enabled and agent is assigned
    console.log('\nAssigning agent and configuring inbound...');
    const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${data.phone_number_id}`, {
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
    console.log('Final state:');
    console.log('  Inbound:', patchData.supports_inbound);
    console.log('  Agent:', JSON.stringify(patchData.assigned_agent));
    console.log('\n✅ Phone number registered! You can now test calls.');
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  console.log('\nNetwork might be down. Try again in a few minutes.');
});
