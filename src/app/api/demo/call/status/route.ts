import { NextRequest, NextResponse } from 'next/server';
import { getVapiCall } from '@/lib/vapi';

export async function GET(request: NextRequest) {
  try {
    const callId = request.nextUrl.searchParams.get('callId');
    if (!callId) {
      return NextResponse.json({ error: 'callId is required' }, { status: 400 });
    }

    const callData = await getVapiCall(callId);

    // VAPI returns messages in either `messages` or `artifact.messages`
    const messages = callData.messages || (callData.artifact && callData.artifact.messages) || [];
    
    // Filter out system messages, we only want user and assistant (ai)
    const transcript = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant' || m.role === 'bot')
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'ai',
        text: m.message || m.text || '',
      }))
      .filter((m: any) => m.text.trim() !== '');

    return NextResponse.json({
      status: callData.status,
      transcript: transcript
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
