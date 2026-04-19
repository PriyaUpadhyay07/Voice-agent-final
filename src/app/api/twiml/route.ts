import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call
// to ElevenLabs AI agent via SIP.
export async function POST(request: NextRequest) {
  // Use the phone number as the primary identifier
  const phoneNumber = process.env.SIGNALWIRE_PHONE_NUMBER || '+12063393710';
  
  // We use TCP on Port 5060 because it's the most compatible with SignalWire and what worked previously
  // Format: sip:IDENTIFIER@sip.rtc.elevenlabs.io:5060;transport=tcp
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="45">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>Connecting you to the AI agent. Please hold.</Say>
</Response>`;

  console.log('[TwiML] Root Audit - Using TCP 5060 for reliability.');
  console.log('[TwiML] SIP URI:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
