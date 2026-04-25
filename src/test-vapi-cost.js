
async function testVapiCalls() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  console.log('Fetching Vapi Calls to calculate real cost...');
  try {
    const res = await fetch(`https://api.vapi.ai/call?limit=100`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    const calls = await res.json();
    if (Array.isArray(calls)) {
       const totalCost = calls.reduce((sum, c) => sum + (c.cost || 0), 0);
       console.log(`Found ${calls.length} calls. Total Cost: $${totalCost.toFixed(4)}`);
    } else {
       console.log('Error or empty calls:', JSON.stringify(calls, null, 2));
    }
  } catch (e) {
    console.error('Vapi failed:', e.message);
  }
}

testVapiCalls();
