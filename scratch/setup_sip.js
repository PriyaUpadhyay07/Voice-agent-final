async function setupSipTrunk() {
  const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
  const agentId = process.env.ELEVENLABS_AGENT_ID || 'agent_8601knrwbp57ebnvzwkcd8eqwqys';

  // Clean up existing
  const listRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers', {
    headers: { 'xi-api-key': apiKey }
  });
  const existing = await listRes.json();
  for (const p of existing) {
    await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${p.phone_number_id}`, {
      method: 'DELETE', headers: { 'xi-api-key': apiKey }
    });
    console.log('Deleted:', p.phone_number_id);
  }

  // Create SIP trunk with SignalWire's termination URI
  console.log('Creating SIP trunk...');
  const createRes = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      phone_number: '+12063393710',
      provider: 'sip_trunk',
      label: 'SignalWire SIP',
      agent_id: agentId,
      termination_uri: 'ai-priya-agent.signalwire.com'
    })
  });
  const createData = await createRes.json();
  console.log('Created:', JSON.stringify(createData, null, 2));

  if (createData.phone_number_id) {
    // Get full details including SIP connection info
    const detailRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${createData.phone_number_id}`, {
      headers: { 'xi-api-key': apiKey }
    });
    const detail = await detailRes.json();
    console.log('\nFull SIP Details:');
    console.log(JSON.stringify(detail, null, 2));
    console.log('\n=== KEY INFO ===');
    console.log('Phone Number ID:', detail.phone_number_id);
    console.log('Supports Inbound:', detail.supports_inbound);
    console.log('Supports Outbound:', detail.supports_outbound);
    if (detail.inbound_trunk) {
      console.log('Inbound Trunk:', JSON.stringify(detail.inbound_trunk, null, 2));
    }
    if (detail.outbound_trunk) {
      console.log('Outbound Trunk:', JSON.stringify(detail.outbound_trunk, null, 2));
    }
    if (detail.provider_config) {
      console.log('Provider Config:', JSON.stringify(detail.provider_config, null, 2));
    }
  }
}

setupSipTrunk().catch(console.error);
