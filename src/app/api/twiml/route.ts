import { NextRequest, NextResponse } from 'next/server';

// This endpoint returns TwiML/cXML that tells SignalWire to connect
// the call audio to ElevenLabs Conversational AI via WebSocket stream
export async function POST(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id') || process.env.ELEVENLABS_AGENT_ID || '';
  
  // Get a signed URL from ElevenLabs for secure WebSocket connection
  let wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
  
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY || '';
    const signedRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } }
    );
    if (signedRes.ok) {
      const signedData = await signedRes.json();
      wsUrl = signedData.signed_url;
    }
  } catch (e) {
    console.error('Failed to get signed URL, using unsigned:', e);
  }

  // Return TwiML/cXML with <Connect><Stream> to ElevenLabs WebSocket
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}" />
  </Connect>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

// Also handle GET for testing
export async function GET(request: NextRequest) {
  return POST(request);
}
