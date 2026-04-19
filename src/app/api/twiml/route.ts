import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Use the Agent ID directly as the identifier in the SIP URI
  // Sometimes phone numbers fail to match, but Agent ID is unique and absolute.
  const agentId = process.env.ELEVENLABS_AGENT_ID || 'agent_8601knrwbp57ebnvzwkcd8eqwqys';
  
  // Try calling the Agent ID directly instead of the phone number
  const sipUri = `sip:${agentId}@sip.rtc.elevenlabs.io:5060;transport=tcp`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please wait while we connect you to our agent.</Say>
  <Dial timeout="30">
    <Sip>${sipUri}</Sip>
  </Dial>
</Response>`;

  console.log('[TwiML] Using Agent ID as SIP Identifier:', agentId);

  return new NextResponse(twiml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
