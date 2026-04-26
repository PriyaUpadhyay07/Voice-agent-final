
async function simulateCall() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  const ASSISTANT_ID = "58b862f3-e052-442c-b8f7-eaa1e63d6b49";
  const PHONE_NUMBER_ID = "ff4cf348-316b-47e7-9868-c800d76e81ac";
  const TEST_DESTINATION = "+919876543210"; // Dummy but formatted

  console.log('Simulating Vapi Call...');
  const body = {
    assistantId: ASSISTANT_ID,
    phoneNumberId: PHONE_NUMBER_ID,
    customer: {
      number: TEST_DESTINATION,
      name: "Debug Test"
    }
  };

  try {
    const res = await fetch(`https://api.vapi.ai/call/phone`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    console.log('Vapi Response Status:', res.status);
    console.log('Vapi Response Body:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

simulateCall();
