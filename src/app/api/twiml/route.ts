import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Use the registered phone number in ElevenLabs
  const phoneNumber = '+12063393710';
  
  // Cleanest SIP URI as per ElevenLabs 2024/2025 specs
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="30" answerOnBridge="true">
    <Sip>${sipUri}</Sip>
  </Dial>
</Response>`;

  console.log('[TwiML] Ultimate Bridge Fix - SIP URI:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
