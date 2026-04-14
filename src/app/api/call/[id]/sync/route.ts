import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const callRecord = await prisma.call.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!callRecord) {
      return NextResponse.json({ error: 'Call record not found' }, { status: 404 });
    }

    // List recent conversations from ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations?page_size=20', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from ElevenLabs' }, { status: 500 });
    }

    const data = await response.json();
    const conversations = data.conversations || [];

    // Find a conversation that matches the lead's phone or our call record ID
    // We fetch details for each to check dynamic variables (slow but reliable for a few)
    let matchedId = null;

    for (const conv of conversations) {
      const detailRes = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conv.conversation_id}`, {
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY! }
      });
      
      if (detailRes.ok) {
        const details = await detailRes.json();
        const dynamicVars = details.conversation_initiation_client_data?.dynamic_variables || {};
        
        if (dynamicVars.call_record_id === id) {
          matchedId = conv.conversation_id;
          
          // Found it! Save the transcript
          const transcriptText = (details.transcript || [])
            .map((m: any) => `${m.role === 'agent' ? 'Agent' : 'User'}: ${m.message}`)
            .join('\n\n');

          await prisma.call.update({
            where: { id },
            data: { transcript: transcriptText },
          });

          return NextResponse.json({ success: true, transcript: transcriptText });
        }
      }
    }

    return NextResponse.json({ error: 'No matching conversation found in ElevenLabs yet. Wait a few minutes and try again.' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
