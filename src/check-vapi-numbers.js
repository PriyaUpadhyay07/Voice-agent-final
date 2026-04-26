
async function checkPhoneNumbers() {
  const VAPI_PRIVATE_KEY = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  console.log('Fetching Vapi Phone Numbers...');
  try {
    const res = await fetch(`https://api.vapi.ai/phone-number`, {
      headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Phone Numbers:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error fetching numbers:', res.status);
    }
  } catch (e) {
    console.error(e.message);
  }
}

checkPhoneNumbers();
