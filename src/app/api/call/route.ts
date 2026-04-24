import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { createVapiCall } from '../../../lib/vapi';

export const dynamic = 'force-dynamic';

const COST_PER_MINUTE = 0.07; // Estimated VAPI + Cartesia + SignalWire cost
const MIN_CREDITS = 1; // Minimum 1 minute to make a call

// Smart phone number formatter
function formatPhoneNumber(raw: string): string {
  if (raw.toLowerCase().startsWith('sip:') || raw.includes('@')) {
    return raw;
  }
  const cleaned = raw.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (/^[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned}`;
  if (/^\d{10}$/.test(cleaned)) return `+1${cleaned}`;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return `+${cleaned}`;
  if (/^1\d{10}$/.test(cleaned)) return `+${cleaned}`;
  return `+${cleaned}`;
}

// POST /api/call — initiate a voice call to a lead via VAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { user: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Skip SIP addresses
    if (lead.phone.includes('@')) {
      return NextResponse.json({ error: 'Cannot call SIP addresses.' }, { status: 400 });
    }

    // Check credits
    if (lead.user.creditsMinutes < MIN_CREDITS) {
      return NextResponse.json({
        error: `Insufficient credits. Current: ${lead.user.creditsMinutes.toFixed(0)} minutes`,
      }, { status: 402 });
    }

    // Update lead status
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'calling' },
    });

    // Format phone number
    const formattedPhone = formatPhoneNumber(lead.phone);

    // Create call via VAPI
    const vapiResponse = await createVapiCall({
      phoneNumber: formattedPhone,
      leadName: lead.name,
      leadCompany: lead.company || undefined,
      customScript: lead.user.script || undefined,
    });

    // Create call record
    const callRecord = await prisma.call.create({
      data: {
        leadId,
        status: 'in-progress',
        vapiCallId: vapiResponse.id,
        duration: 0,
        costDeducted: 0,
      },
    });

    return NextResponse.json({
      success: true,
      callId: callRecord.id,
      vapiCallId: vapiResponse.id,
    });

  } catch (error: any) {
    console.error('Call API Error:', error);
    return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
  }
}
