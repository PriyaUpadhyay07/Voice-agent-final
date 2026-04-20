async function assignAndGetSipUri() {
  const apiKey = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
  const agentId = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';
  const phoneId = 'phnum_8101kpe6s3b6fyqs77f956ydtg3m';

  // Step 1: Assign agent to phone number
  console.log('--- Assigning Agent ---');
  const assignRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phoneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({ agent_id: agentId })
  });
  console.log('Assign status:', assignRes.status);
  const assignData = await assignRes.json();
  console.log('Assign response:', JSON.stringify(assignData, null, 2));

  // Step 2: Check conversation config for SIP details
  console.log('\n--- Agent Config ---');
  const agentRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    headers: { 'xi-api-key': apiKey }
  });
  const agentData = await agentRes.json();
  // Look for any SIP/phone-related config
  if (agentData.platform_settings) {
    console.log('Platform settings:', JSON.stringify(agentData.platform_settings, null, 2));
  }

  // Step 3: Get updated phone details
  console.log('\n--- Updated Phone Details ---');
  const detailRes = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phoneId}`, {
    headers: { 'xi-api-key': apiKey }
  });
  const detail = await detailRes.json();
  console.log(JSON.stringify(detail, null, 2));

  // Step 4: Check all available API endpoints for SIP info
  console.log('\n--- Checking SIP endpoints ---');
  const endpoints = [
    'https://api.elevenlabs.io/v1/convai/sip-trunk',
    'https://api.elevenlabs.io/v1/convai/sip',
    `https://api.elevenlabs.io/v1/convai/phone-numbers/${phoneId}/sip-config`,
  ];
  for (const url of endpoints) {
    const res = await fetch(url, { headers: { 'xi-api-key': apiKey } });
    console.log(`${url}: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(JSON.stringify(data, null, 2));
    }
  }
}

assignAndGetSipUri().catch(console.error);
