import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const agentId = url.searchParams.get('agent_id');
  const encodedVars = url.searchParams.get('dynamic_variables');
  const apiKey = process.env.ELEVENLABS_API_KEY || '';
  
  // Parse dynamic variables
  let customVariablesJson = "{}";
  if (encodedVars) {
    try {
      customVariablesJson = decodeURIComponent(encodedVars);
    } catch(e) {}
  }

  // Inject API Key into dynamic variables so ElevenLabs authenticates the socket connection
  let mergedVars = {};
  try {
    mergedVars = JSON.parse(customVariablesJson);
  } catch(e) {}
  console.log(`[TWIML] Proxying Webhook for Agent ${agentId}`);

  // Create TwiML that connects directly to the Websocket, passing the API KEY as a Parameter
  // ElevenLabs uses xi-api-key or Authorization parameter if it is a private agent.
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://api.elevenlabs.io/v1/convai/twilio/ws?agent_id=${agentId}">
      <Parameter name="custom_variables" value='${JSON.stringify(mergedVars).replace(/'/g, "&apos;")}' />
      <Parameter name="xi-api-key" value="${apiKey}" />
    </Stream>
  </Connect>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'no-cache'
    }
  });
}
