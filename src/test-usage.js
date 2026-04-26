
async function testUsage() {
  const SIGNALWIRE_PROJECT_ID = "dd9defbb-1449-4a44-89f8-7d25b2e048de";
  const SIGNALWIRE_API_TOKEN = "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d";
  const SIGNALWIRE_SPACE_URL = "ai-priya-agent.signalwire.com";

  const swAuth = Buffer.from(`${SIGNALWIRE_PROJECT_ID}:${SIGNALWIRE_API_TOKEN}`).toString('base64');
  const url = `https://${SIGNALWIRE_SPACE_URL}/api/laml/2010-04-01/Accounts/${SIGNALWIRE_PROJECT_ID}/Usage.json`;

  try {
    const res = await fetch(url, { headers: { 'Authorization': `Basic ${swAuth}` } });
    const data = await res.json();
    console.log('Usage Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testUsage();
