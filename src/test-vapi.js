
async function testVapi() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  console.log('Testing Vapi connectivity...');
  try {
    const res = await fetch(`https://api.vapi.ai/assistant`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    const assistants = await res.json();
    console.log('Assistants:', JSON.stringify(assistants, null, 2));
  } catch (e) {
    console.error('Vapi failed:', e.message);
  }
}

testVapi();
