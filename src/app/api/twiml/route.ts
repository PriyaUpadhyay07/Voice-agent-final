import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call
// to ElevenLabs AI agent via SIP.
//
// Call flow:
// 1. SignalWire calls the lead's phone number
// 2. Lead picks up → SignalWire fetches this TwiML
// 3. TwiML tells SignalWire to <Dial><Sip> to ElevenLabs' SIP server
// 4. ElevenLabs receives the SIP INVITE, matches the phone number
//    to the registered number, and routes to the assigned AI agent
// 5. Agent speaks with the lead
//
// Per ElevenLabs SIP trunking docs:
// - Default SIP URI: sip:+PHONE@sip.rtc.elevenlabs.io:5060
// - TCP on port 5060 (default, most compatible)
// - TLS on port 5061
// - UDP is NOT supported
// - Phone number must match exactly (with + prefix, E.164)
export async function POST(request: NextRequest) {
  // The ElevenLabs-registered phone number (must match exactly what's in ElevenLabs dashboard)
  const phoneNumber = process.env.SIGNALWIRE_PHONE_NUMBER || '+12063393710';

  // Use TCP transport on port 5060 — most compatible, matches ElevenLabs docs default
  // ElevenLabs inbound trunk accepts from 0.0.0.0/0 with media_encryption=allowed
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="120">
    <Sip>${sipUri}</Sip>
  </Dial>
  <Say>The AI agent could not be reached. Please try again later.</Say>
</Response>`;

  console.log('[TwiML] Generated SIP URI:', sipUri);
  console.log('[TwiML] Request from:', request.headers.get('host'));

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
