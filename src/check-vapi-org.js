
async function checkOrg() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  try {
    const res = await fetch(`https://api.vapi.ai/org`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    const data = await res.json();
    console.log('Org Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}

checkOrg();
