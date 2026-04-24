import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { createVapiCall } from '../../../../lib/vapi';

export const dynamic = 'force-dynamic';

/**
 * POST /api/vapi/call
 * Trigger an AI call to a lead via VAPI
 */
export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Get the lead and its owner
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { user: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check if user has enough credits
    if (lead.user.creditsMinutes <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please add more minutes.' }, { status: 402 });
    }

    // Update lead status to calling
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'calling' },
    });

    // Make the call via VAPI
    const vapiResponse = await createVapiCall({
      phoneNumber: lead.phone,
      leadName: lead.name,
      leadCompany: lead.company || undefined,
      customScript: lead.user.script || undefined,
    });

    // Create a call record in our database
    const call = await prisma.call.create({
      data: {
        leadId: lead.id,
        vapiCallId: vapiResponse.id,
        status: 'in-progress',
      },
    });

    return NextResponse.json({
      success: true,
      callId: call.id,
      vapiCallId: vapiResponse.id,
    });
  } catch (error: any) {
    console.error('VAPI Call Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
