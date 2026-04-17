import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call 
// to ElevenLabs AI agent via SIP
export async function POST(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id') || process.env.ELEVENLABS_AGENT_ID || '';
  
  // ElevenLabs SIP URI - bridges the call to the AI agent
  const sipUri = `sip:${agentId}@sip.rtc.elevenlabs.io`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>${sipUri}</Sip>
  </Dial>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
