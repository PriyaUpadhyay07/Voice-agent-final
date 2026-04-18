import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call 
// to ElevenLabs AI agent via SIP
export async function POST(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id') || process.env.ELEVENLABS_AGENT_ID || '';
  
  // Strip 'agent_' prefix if present (ElevenLabs WebSocket expects the raw ID)
  const idOnly = agentId.replace('agent_', '');

  // Use ElevenLabs WebSocket Stream for Twilio/SignalWire (with platform=twilio)
  // We use &amp; because this is going into an XML attribute
  const streamUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${idOnly}&amp;platform=twilio`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}" />
  </Connect>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
