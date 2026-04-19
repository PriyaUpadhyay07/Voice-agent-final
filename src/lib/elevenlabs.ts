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

          // Smart Status Tagging Logic
          let newStatus = 'approved'; // Default to approved if we are unsure (or keep current)
          const lowerTranscript = transcriptText.toLowerCase();

          const rejectKeywords = ['not interested', 'no thanks', 'don\'t call', 'stop calling', 'wrong number', 'not the right time', 'reject', 'no interest'];
          const pendingKeywords = ['call back', 'busy now', 'later', 'tomorrow', 'next week', 'meeting', 'driving', 'send me an email'];
          const approveKeywords = ['interested', 'send more info', 'sounds good', 'yes', 'tell me more', 'agreed', 'approve'];

          if (rejectKeywords.some(k => lowerTranscript.includes(k))) {
            newStatus = 'rejected';
          } else if (pendingKeywords.some(k => lowerTranscript.includes(k))) {
            newStatus = 'pending';
          } else if (approveKeywords.some(k => lowerTranscript.includes(k))) {
            newStatus = 'approved';
          }

          await prisma.call.update({
            where: { id: callRecordId },
            data: { transcript: transcriptText },
          });

          await prisma.lead.update({
            where: { id: matchingCall.leadId },
            data: { status: newStatus },
          });

          console.log(`Auto-synced transcript and set status to ${newStatus} for lead ${matchingCall.leadId}`);
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

export async function getElevenLabsBalance() {
  if (!API_KEY) return null;
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      headers: { 'xi-api-key': API_KEY }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      characterCount: data.character_count,
      characterLimit: data.character_limit,
      remaining: data.character_limit - data.character_count,
    };
  } catch (error) {
    console.error('Error fetching ElevenLabs balance:', error);
    return null;
  }
}
