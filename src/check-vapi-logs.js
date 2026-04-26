
async function checkVapiLogs() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  console.log('Fetching Vapi Recent Call Logs...');
  try {
    const res = await fetch(`https://api.vapi.ai/call?limit=1`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Vapi Call Log:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('Error fetching Vapi calls:', res.status);
    }
  } catch (e) {
    console.error(e.message);
  }
}

checkVapiLogs();
