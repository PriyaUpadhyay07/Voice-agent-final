import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const phoneNumber = '+12063393710';
  
  // GLOBAL SECURE SIP URI (TLS on 5061)
  // This works everywhere because it is encrypted (TLS) and uses the standard secure port 5061.
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5061;transport=tls`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting to your assistant.</Say>
  <Dial timeout="60" answerOnBridge="true">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say voice="alice">Assistant connection failed. Please try again later.</Say>
</Response>`;

  console.log('[TwiML] Global Secure Bridge Ready (TLS 5061)');

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
