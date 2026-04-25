
async function testBalance() {
  const SIGNALWIRE_PROJECT_ID = "dd9defbb-1449-4a44-89f8-7d25b2e048de";
  const SIGNALWIRE_API_TOKEN = "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d";
  const SIGNALWIRE_SPACE_URL = "ai-priya-agent.signalwire.com";

  console.log('Testing SignalWire Balance...');
  const swAuth = Buffer.from(`${SIGNALWIRE_PROJECT_ID}:${SIGNALWIRE_API_TOKEN}`).toString('base64');
  try {
    const swRes = await fetch(`https://${SIGNALWIRE_SPACE_URL}/api/laml/2010-04-01/Accounts/${SIGNALWIRE_PROJECT_ID}.json`, {
      headers: { 'Authorization': `Basic ${swAuth}` }
    });
    const swData = await swRes.json();
    console.log('SignalWire Data:', JSON.stringify(swData, null, 2));
  } catch (e) {
    console.error('SignalWire failed:', e.message);
  }
}

testBalance();
