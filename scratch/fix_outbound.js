async function fixOutbound() {
  const apiKey = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
  const agentId = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';
  const phoneId = 'phnum_8101kpe6s3b6fyqs77f956ydtg3m';

  // Delete and recreate with FULL outbound config
  console.log('Deleting old...');
  await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phoneId}`, {
    method: 'DELETE', headers: { 'xi-api-key': apiKey }
  });

  console.log('Creating with outbound trunk...');
  const res = await fetch('https://api.elevenlabs.io/v1/convai/phone-numbers/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      phone_number: '+12063393710',
      provider: 'sip_trunk',
      label: 'SignalWire Full',
      agent_id: agentId,
      termination_uri: 'ai-priya-agent.signalwire.com',
      outbound_trunk: {
        termination_uri: 'ai-priya-agent.signalwire.com',
        sip_trunk_username: 'dd9defbb-1449-4a44-89f8-7d25b2e048de',
        sip_trunk_password: 'PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d',
        authentication: {
          username: 'dd9defbb-1449-4a44-89f8-7d25b2e048de',
          password: 'PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d'
        }
      },
      inbound_trunk: {
        allowed_addresses: ['0.0.0.0/0']
      }
    })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.phone_number_id) {
    // Check details
    const detail = await (await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${data.phone_number_id}`, {
      headers: { 'xi-api-key': apiKey }
    })).json();
    console.log('\nDetails:', JSON.stringify(detail, null, 2));

    // NOW try outbound call via ElevenLabs
    console.log('\n--- Making outbound call via ElevenLabs ---');
    const callRes = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
      body: JSON.stringify({
        agent_id: agentId,
        agent_phone_number_id: data.phone_number_id,
        to_number: '+919149087340'
      })
    });
    console.log('Call status:', callRes.status);
    const callData = await callRes.json();
    console.log('Call response:', JSON.stringify(callData, null, 2));
  }
}

fixOutbound().catch(console.error);
