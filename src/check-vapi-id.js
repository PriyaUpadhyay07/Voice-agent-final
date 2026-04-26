
async function checkAssistant() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  const ASSISTANT_ID = "58b862f3-e052-442c-b8f7-eaa1e63d6b49";
  
  console.log(`Checking Vapi Assistant: ${ASSISTANT_ID}`);
  try {
    const res = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Assistant found:', data.name);
      console.log('Voice Provider:', data.voice?.provider);
      console.log('Transcriber:', data.transcriber?.provider);
    } else {
      console.log('Assistant not found or error:', res.status);
    }
  } catch (e) {
    console.error(e.message);
  }
}

checkAssistant();
