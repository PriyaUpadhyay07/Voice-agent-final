import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const phoneNumber = '+12063393710';
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Hello. Connecting you to the assistant now.</Say>
  <Dial timeout="30">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>Sorry, I could not connect. Goodbye.</Say>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
