
async function crawlSignalWire() {
  const SIGNALWIRE_PROJECT_ID = "dd9defbb-1449-4a44-89f8-7d25b2e048de";
  const SIGNALWIRE_API_TOKEN = "PT29ffe4a489f1801030099e11307e6cd33759302c554dc34d";
  const SIGNALWIRE_SPACE_URL = "ai-priya-agent.signalwire.com";

  const swAuth = Buffer.from(`${SIGNALWIRE_PROJECT_ID}:${SIGNALWIRE_API_TOKEN}`).toString('base64');
  const baseUrl = `https://${SIGNALWIRE_SPACE_URL}/api/laml/2010-04-01/Accounts/${SIGNALWIRE_PROJECT_ID}`;

  console.log('Crawling SignalWire resources for balance...');
  
  const endpoints = [
    `${baseUrl}.json`,
    `${baseUrl}/Usage/Records.json`,
    `${baseUrl}/Balance.json`, // Guessing
    `https://${SIGNALWIRE_SPACE_URL}/api/video/usage`,
    `https://${SIGNALWIRE_SPACE_URL}/api/relay/rest/billing/balance` // Guessing Relay V3
  ];

  for (const url of endpoints) {
    try {
      console.log(`\nTesting: ${url}`);
      const res = await fetch(url, { headers: { 'Authorization': `Basic ${swAuth}` } });
      if (res.ok) {
        const data = await res.json();
        console.log('Success! Data snippet:', JSON.stringify(data, null, 2).substring(0, 500));
        if (JSON.stringify(data).toLowerCase().includes('balance')) {
          console.log('>>> FOUND BALANCE IN THIS RESOURCE! <<<');
        }
      } else {
        console.log(`Failed: ${res.status}`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

crawlSignalWire();
