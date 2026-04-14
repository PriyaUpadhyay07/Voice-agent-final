import prisma from './db';

const API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Optimized sync: Fetches recent conversations once and updates 
 * all matching call records at once.
 */
export async function syncAllTranscripts() {
  if (!API_KEY) return;

  try {
    // 1. Find all calls that are 'completed' or from 'signalwire'/'twilio' but missing transcript
    const pendingCalls = await prisma.call.findMany({
      where: { 
        transcript: null,
        OR: [
          { status: 'completed' },
          { status: { contains: 'twilio' } },
          { status: { contains: 'signalwire' } }
        ]
      },
      take: 20 // Don't try to sync too many at once
    });

    if (pendingCalls.length === 0) return;

    // 2. Fetch recent conversations from ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations?page_size=30', {
      headers: { 'xi-api-key': API_KEY }
    });

    if (!response.ok) return;

    const data = await response.json();
    const conversations = data.conversations || [];

    // 3. Keep track of what we've processed to avoid duplicate detail fetches
    for (const conv of conversations) {
      // Small optimization: skip if conversation is too short/failed (optional)
      
      const detailRes = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conv.conversation_id}`, {
        headers: { 'xi-api-key': API_KEY }
      });
      
      if (!detailRes.ok) continue;
      
      const details = await detailRes.json();
      const dynamicVars = details.conversation_initiation_client_data?.dynamic_variables || {};
      const callRecordId = dynamicVars.call_record_id;

      if (callRecordId) {
        // Check if this matches one of our pending calls
        const matchingCall = pendingCalls.find(c => c.id === callRecordId);
        if (matchingCall) {
          const transcriptText = (details.transcript || [])
            .map((m: any) => `${m.role === 'agent' ? 'Agent' : 'User'}: ${m.message}`)
            .join('\n\n');

          await prisma.call.update({
            where: { id: callRecordId },
            data: { transcript: transcriptText },
          });
          console.log(`Auto-synced transcript for call ${callRecordId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error in batch sync transcripts:', error);
  }
}

/**
 * Single call sync (still useful for manual button)
 */
export async function syncCallTranscript(callRecordId: string) {
  if (!API_KEY) return null;
  try {
    const callRecord = await prisma.call.findUnique({ where: { id: callRecordId } });
    if (!callRecord || callRecord.transcript) return callRecord?.transcript;

    // Just run the batch sync, it will find this call if it's there
    await syncAllTranscripts();
    
    // Return updated record
    const updated = await prisma.call.findUnique({ where: { id: callRecordId } });
    return updated?.transcript;
  } catch (error) {
    console.error('Error syncing single call transcript:', error);
  }
  return null;
}
