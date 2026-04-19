import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const phoneNumber = '+12063393710';
  
  // Using TLS on Port 5061 - This bypasses most ISP blocks in India
  // and uses the regional India residency server for lowest latency.
  const sipUri = `sip:${phoneNumber}@sip.rtc.in.residency.elevenlabs.io:5061;transport=tls`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting to Priya AI assistant.</Say>
  <Dial timeout="120" answerOnBridge="true">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>The connection to AI failed. Please check your signal wire settings.</Say>
</Response>`;

  console.log('[TwiML] TLS 5061 India Fix - SIP URI:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
