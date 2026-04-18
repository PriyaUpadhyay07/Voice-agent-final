import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call
// to ElevenLabs AI agent via SIP.
//
// How it works:
// 1. SignalWire calls the lead's phone number
// 2. Lead picks up → SignalWire fetches this TwiML
// 3. TwiML tells SignalWire to <Dial><Sip> to ElevenLabs' SIP server
// 4. ElevenLabs receives the SIP INVITE, matches the phone number
//    to the registered number, and routes to the assigned AI agent
// 5. Agent speaks with the lead
//
// Per ElevenLabs docs:
// - SIP URI: sip:+PHONE@sip.rtc.elevenlabs.io:5060
// - UDP is NOT supported, must use transport=tcp
// - Phone number must match exactly (with + prefix)
export async function POST(request: NextRequest) {
  // The ElevenLabs-registered phone number (must match exactly what's in ElevenLabs dashboard)
  const phoneNumber = process.env.SIGNALWIRE_PHONE_NUMBER || '+12063393710';

  // Build the correct SIP URI per ElevenLabs documentation
  // Format: sip:+12063393710@sip.rtc.elevenlabs.io:5060;transport=tcp
  const sipUri = `sip:${phoneNumber}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>${sipUri}</Sip>
  </Dial>
</Response>`;

  console.log('[TwiML] Generated SIP URI:', sipUri);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
