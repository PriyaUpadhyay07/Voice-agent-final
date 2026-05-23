const axios = require('axios');

async function debug() {
  const apiKey = "63cee64d-65ff-4bb9-bc87-1a10835ec961";
  const assistantId = "58b862f3-e052-442c-b8f7-eaa1e63d6b49";
  try {
    const res = await axios.get(`https://api.vapi.ai/call?assistantId=${assistantId}&limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    console.log(`Found ${res.data.length} calls`);
    let nonZero = 0;
    res.data.forEach((call, i) => {
      const start = call.startedAt ? new Date(call.startedAt).getTime() : NaN;
      const end = call.endedAt ? new Date(call.endedAt).getTime() : NaN;
      const durationSec = (!isNaN(start) && !isNaN(end)) ? Math.max(0, (end - start) / 1000) : 0;
      const mins = durationSec / 60;
      if (mins > 0 || i < 5) {
        console.log(`Call ${call.id}: CreatedAt=${call.createdAt}, Status=${call.status}, DurationSec=${durationSec}, Mins=${mins}`);
      }
      if (mins > 0) nonZero++;
    });
    console.log(`Calls with non-zero duration: ${nonZero}`);
  } catch (e) {
    console.error(e.message);
  }
}
debug();
