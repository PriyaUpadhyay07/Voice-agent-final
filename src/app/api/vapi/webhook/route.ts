import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { parseVapiWebhook, determineLeadStatus } from '../../../../lib/vapi';

export const dynamic = 'force-dynamic';

/**
 * POST /api/vapi/webhook
 * Receives webhook events from VAPI when calls end
 * Saves transcript, updates lead status, deducts credits
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload.message?.type || payload.type;

    console.log('[VAPI Webhook] Received event:', eventType);

    // We only care about end-of-call events
    if (eventType !== 'end-of-call-report' && eventType !== 'call.ended') {
      return NextResponse.json({ received: true });
    }

    const parsed = parseVapiWebhook(payload.message || payload);

    if (!parsed.callId) {
      console.log('[VAPI Webhook] No call ID found, ignoring');
      return NextResponse.json({ received: true });
    }

    // Find the call in our database by vapiCallId
    const call = await prisma.call.findFirst({
      where: { vapiCallId: parsed.callId },
      include: { lead: { include: { user: true } } },
    });

    if (!call) {
      console.log('[VAPI Webhook] Call not found in DB for vapiCallId:', parsed.callId);
      return NextResponse.json({ received: true });
    }

    // Calculate cost: Lisa Fixed Rate ($1 = 10 mins -> $0.10 per min)
    const durationMinutes = parsed.duration / 60;
    const totalCost = durationMinutes * 0.10; // Fixed Lisa Rate


    // Determine lead status from transcript
    const newLeadStatus = determineLeadStatus(
      parsed.transcript,
      parsed.summary,
      parsed.endedReason
    );

    // Update call record
    await prisma.call.update({
      where: { id: call.id },
      data: {
        duration: Math.round(parsed.duration),
        transcript: parsed.transcript,
        summary: parsed.summary,
        status: parsed.status === 'ended' ? 'completed' : parsed.status,
        costDeducted: Math.round(totalCost * 100) / 100,
      },
    });

    // Update lead status
    await prisma.lead.update({
      where: { id: call.leadId },
      data: { status: newLeadStatus },
    });

    // Deduct credits from user
    await prisma.user.update({
      where: { id: call.lead.userId },
      data: {
        creditsMinutes: {
          decrement: Math.round(durationMinutes * 100) / 100,
        },
        walletAmount: {
          decrement: Math.round(totalCost * 100) / 100,
        },
      },
    });

    console.log(`[VAPI Webhook] Call ${call.id} completed. Duration: ${parsed.duration}s, Status: ${newLeadStatus}, Cost: $${totalCost.toFixed(2)}`);

    return NextResponse.json({
      success: true,
      callId: call.id,
      leadStatus: newLeadStatus,
    });
  } catch (error: any) {
    console.error('[VAPI Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
