
async function checkCredentials() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  console.log('Fetching Vapi Credentials...');
  try {
    const res = await fetch(`https://api.vapi.ai/credential`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Credentials:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error fetching credentials:', res.status);
    }
  } catch (e) {
    console.error(e.message);
  }
}

checkCredentials();
