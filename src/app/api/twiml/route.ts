import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const phoneNumber = '+12063393710';
  
  // Using ElevenLabs India Region SIP Endpoint for better connectivity in India
  const sipUri = `sip:${phoneNumber}@sip.rtc.in.residency.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting to Priya AI.</Say>
  <Dial timeout="30">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>I am sorry, the connection timed out. Goodbye.</Say>
</Response>`;

  console.log('[TwiML] India Region Test - SIP URI:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
