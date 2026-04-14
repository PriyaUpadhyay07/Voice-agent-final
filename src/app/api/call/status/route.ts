import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

const COST_PER_MINUTE = 0.01;

// POST /api/call/status — Twilio status callback
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const callSid = formData.get('CallSid') as string;
  const callStatus = formData.get('CallStatus') as string;
  const callDuration = formData.get('CallDuration') as string;

  if (!callSid) {
    return NextResponse.json({ error: 'Missing CallSid' }, { status: 400 });
  }

  // Find the call record by twilio SID stored in status field
  const callRecord = await prisma.call.findFirst({
    where: { status: { contains: callSid } },
    include: { lead: { include: { user: true } } },
  });

  if (!callRecord) {
    // If we can't find the record, just acknowledge
    return NextResponse.json({ received: true });
  }

  const duration = parseInt(callDuration || '0', 10);

  if (callStatus === 'completed') {
    // Calculate cost: cost per minute, rounded up
    const minutes = Math.ceil(duration / 60);
    const cost = minutes * COST_PER_MINUTE;

    // Deduct from user wallet
    await prisma.user.update({
      where: { id: callRecord.lead.userId },
      data: { walletAmount: { decrement: cost } },
    });

    // Update call record
    await prisma.call.update({
      where: { id: callRecord.id },
      data: {
        duration,
        costDeducted: cost,
        status: 'completed',
      },
    });

    // Update lead status
    await prisma.lead.update({
      where: { id: callRecord.leadId },
      data: { status: 'waiting_for_analysis' },
    });
  } else if (['busy', 'no-answer', 'canceled', 'failed'].includes(callStatus)) {
    await prisma.call.update({
      where: { id: callRecord.id },
      data: { status: callStatus, duration: 0, costDeducted: 0 },
    });

    let leadStatus = 'failed';
    if (['no-answer', 'busy', 'canceled'].includes(callStatus)) {
      leadStatus = 'pending'; // Retryable
    }

    await prisma.lead.update({
      where: { id: callRecord.leadId },
      data: { status: leadStatus },
    });
  } else {
    // Other statuses (initiated, ringing, in-progress) — just log
    await prisma.call.update({
      where: { id: callRecord.id },
      data: { status: `twilio:${callSid}:${callStatus}` },
    });
  }

  return NextResponse.json({ received: true });
}
