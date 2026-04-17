import { NextRequest, NextResponse } from 'next/server';

// Returns TwiML/cXML that tells SignalWire to bridge the call 
// to ElevenLabs AI agent via SIP
export async function POST(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id') || process.env.ELEVENLABS_AGENT_ID || '';
  
  // ElevenLabs SIP URI - use the phone number registered in ElevenLabs
  const phoneNumber = process.env.SIGNALWIRE_PHONE_NUMBER || '+12063393710';
  // Strip the + for SIP URI
  const cleanNumber = phoneNumber.replace('+', '');

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>sip:${cleanNumber}@sip.rtc.elevenlabs.io</Sip>
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
