async function assignAgent() {
  const apiKey = 'sk_4b110962686ff06d32d8ec249e845931f6ed0afb830448b8';
  const agentId = 'agent_8601knrwbp57ebnvzwkcd8eqwqys';
  const phoneId = 'phnum_5101kpe8cke8eeyaj4ha1w1kgg68';

  // Assign agent
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phoneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({ agent_id: agentId })
  });
  console.log('Assign:', res.status, await res.json());
}
assignAgent().catch(console.error);
