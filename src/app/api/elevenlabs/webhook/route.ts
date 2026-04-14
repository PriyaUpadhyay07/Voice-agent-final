import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('ElevenLabs Webhook received:', JSON.stringify(payload, null, 2));

    const conversationId = payload.conversation_id;
    const transcriptArray = payload.transcript || [];
    
    // Convert transcript array to a readable string
    const transcriptText = transcriptArray
      .map((m: any) => `${m.role === 'agent' ? 'Agent' : 'User'}: ${m.message}`)
      .join('\n\n');

    // Find the call_record_id from the dynamic variables / initiation data
    // ElevenLabs sends this in conversation_initiation_client_data.dynamic_variables or similar
    const dynamicVars = payload.conversation_initiation_client_data?.dynamic_variables || {};
    const callRecordId = dynamicVars.call_record_id;

    if (!callRecordId) {
      console.warn('Webhook received but no call_record_id found in metadata');
      return NextResponse.json({ error: 'No call_record_id' }, { status: 400 });
    }

    // Basic status analysis — can be improved with AI analysis
    let finalStatus = 'pending'; // default fallback
    const lowerTranscript = transcriptText.toLowerCase();

    // Check for "Approved" keywords (English + common Hindi transliterations)
    const approvedKeywords = ['yes', 'interested', 'sure', 'approved', 'thik hai', 'han', 'bhej do', 'done', 'okay', 'agreement'];
    const rejectedKeywords = ['no', 'not interested', 'stop', 'wrong number', 'don\'t call', 'mana kar', 'nahi chahiye', 'bekar'];

    const hasApproved = approvedKeywords.some(kw => lowerTranscript.includes(kw));
    const hasRejected = rejectedKeywords.some(kw => lowerTranscript.includes(kw));

    if (hasApproved && !hasRejected) {
      finalStatus = 'approved';
    } else if (hasRejected) {
      finalStatus = 'rejected';
    } else if (transcriptArray.length < 3) {
      // Very short call (e.g. hung up immediately)
      finalStatus = 'rejected';
    } else {
      // Default to pending if we're not sure
      finalStatus = 'pending';
    }

    // Find the lead associated with this call
    const callRec = await prisma.call.findUnique({
      where: { id: callRecordId },
      select: { leadId: true }
    });

    // Update the call record and lead status
    await prisma.call.update({
      where: { id: callRecordId },
      data: {
        transcript: transcriptText,
      },
    });

    if (callRec?.leadId) {
      await prisma.lead.update({
        where: { id: callRec.leadId },
        data: { status: finalStatus },
      });
    }

    console.log(`Successfully updated transcript for call ${callRecordId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing ElevenLabs webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
