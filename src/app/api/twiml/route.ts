import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const phoneNumber = '+12063393710';
  
  // Clean Secure SIP URI for Highest Quality
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5061;transport=tls`;

  // Removed manual <Say> to let the AI Agent's 'First Message' handle the greeting instantly.
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="60" answerOnBridge="true">
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
