
async function testBalance() {
  const SIGNALWIRE_PROJECT_ID = "dd9defbb-1449-4a44-89f8-7d25b2e048de";
  const SIGNALWIRE_API_TOKEN = "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d";
  const SIGNALWIRE_SPACE_URL = "ai-priya-agent.signalwire.com";

  console.log('Testing SignalWire Usage...');
  const swAuth = Buffer.from(`${SIGNALWIRE_PROJECT_ID}:${SIGNALWIRE_API_TOKEN}`).toString('base64');
  try {
    const swRes = await fetch(`https://${SIGNALWIRE_SPACE_URL}/api/laml/2010-04-01/Accounts/${SIGNALWIRE_PROJECT_ID}/Usage/Records.json`, {
      headers: { 'Authorization': `Basic ${swAuth}` }
    });
    const swData = await swRes.json();
    console.log('SignalWire Usage Records (first 2):', JSON.stringify(swData.usage_records?.slice(0, 2), null, 2));
  } catch (e) {
    console.error('SignalWire failed:', e.message);
  }
}

testBalance();
