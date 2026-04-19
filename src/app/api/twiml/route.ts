import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Primary identifier: The phone number registered in ElevenLabs
  const phoneNumber = process.env.SIGNALWIRE_PHONE_NUMBER || '+12063393710';
  
  // Use TCP on 5060 (Default ElevenLabs)
  // We specify only the phone number part as the identifier
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="120">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>Sorry, I could not connect your call. Please try again.</Say>
</Response>`;

  console.log('[TwiML] Root Audit - SIP URI Ready:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
