import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { RestClient } from '@signalwire/compatibility-api';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const signalwireClient = RestClient(
  process.env.SIGNALWIRE_PROJECT_ID!,
  process.env.SIGNALWIRE_API_TOKEN!,
  { signalwireSpaceUrl: process.env.SIGNALWIRE_SPACE_URL! }
);

const COST_PER_MINUTE = 0.15; // $0.15/min
const MIN_BALANCE = 1.0; // minimum wallet balance to initiate a call

// Smart phone number formatter — never blindly adds +1
// Rules: already has '+' → use as-is | 10 digits starting 6-9 → India (+91) | else → add +1 fallback
function formatPhoneNumber(raw: string): string {
  // If it's a SIP URI, don't format it like a PSTN number
  if (raw.toLowerCase().startsWith('sip:') || raw.includes('@')) {
    return raw;
  }

  const cleaned = raw.replace(/[\s\-().]/g, ''); // strip spaces, dashes, parens, dots
  if (cleaned.startsWith('+')) return cleaned;   // already has country code
  // Indian mobile numbers: 10 digits starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned}`;
  // US 10-digit
  if (/^\d{10}$/.test(cleaned)) return `+1${cleaned}`;
  // 11 digits starting with 91 (India without +)
  if (/^91[6-9]\d{9}$/.test(cleaned)) return `+${cleaned}`;
  // 11 digits starting with 1 (US without +)
  if (/^1\d{10}$/.test(cleaned)) return `+${cleaned}`;
  // Fallback: just add + and hope for the best
  return `+${cleaned}`;
}

// POST /api/call — initiate a voice call to a lead
export async function POST(request: NextRequest) {
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

  if (lead.status === 'calling') {
    return NextResponse.json({ error: 'A call is already in progress for this lead' }, { status: 400 });
  }

  // Check wallet balance
  if (lead.user.walletAmount < MIN_BALANCE) {
    return NextResponse.json({
      error: `Insufficient wallet balance. Minimum $${MIN_BALANCE} required. Current: $${lead.user.walletAmount.toFixed(2)}`,
    }, { status: 402 });
  }

  // Update lead status to "calling"
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: 'calling' },
  });

  // Create call record
  const callRecord = await prisma.call.create({
    data: {
      leadId,
      status: 'initiated',
      duration: 0,
      costDeducted: 0,
    },
  });

  try {
    // Build ElevenLabs URL with dynamic variables (script + lead info)
    const agentId = process.env.ELEVENLABS_AGENT_ID!;

    // Pass the client's script and lead details as dynamic variables
    const dynamicVars: Record<string, string> = {
      lead_name: lead.name,
      lead_phone: lead.phone,
      lead_company: lead.company || 'Unknown',
      call_record_id: callRecord.id,
    };

    // If client has a script, pass it as the calling instructions
    if (lead.user.script && lead.user.script.trim()) {
      dynamicVars.calling_script = lead.user.script;
    }

    const encodedVars = encodeURIComponent(JSON.stringify(dynamicVars));
    const apiKey = process.env.ELEVENLABS_API_KEY!;
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/convai/twilio/outbound?agent_id=${agentId}&dynamic_variables=${encodedVars}&xi-api-key=${apiKey}`;

    // Format phone number
    let formattedPhone = formatPhoneNumber(lead.phone);
    
    // For SignalWire SIP dialing, ensure sip: prefix if it's an email-like URI
    if (formattedPhone.includes('@') && !formattedPhone.toLowerCase().startsWith('sip:')) {
      formattedPhone = `sip:${formattedPhone}`;
    }

    // Force Twilio for more stable international calls during testing
    const provider = 'twilio';
    let callSid = '';

    // Helper for timeout
    const withTimeout = (promise: Promise<any>, ms: number) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Telephony provider timeout after 10s')), ms))
      ]);
    };

    if (provider === 'signalwire') {
      const call = await withTimeout(signalwireClient.calls.create({
        from: process.env.SIGNALWIRE_PHONE_NUMBER!,
        to: formattedPhone,
        url: elevenLabsUrl,
        method: 'POST',
      }), 10000);
      callSid = call.sid;
    } else {
      const call = await withTimeout(twilioClient.calls.create({
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: formattedPhone,
        url: elevenLabsUrl,
        method: 'POST',
        statusCallback: `${getBaseUrl(request)}/api/call/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      }), 10000);
      callSid = call.sid;
    }

    // Update call record with SID
    await prisma.call.update({
      where: { id: callRecord.id },
      data: { status: `${provider}:${callSid}` },
    });

    return NextResponse.json({
      success: true,
      callSid: callSid,
      callRecordId: callRecord.id,
    });
  } catch (error: unknown) {
    // Revert lead status on failure
    await prisma.lead.update({ where: { id: leadId }, data: { status: 'failed' } });
    await prisma.call.update({ where: { id: callRecord.id }, data: { status: 'failed' } });

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Call failed: ${errorMessage}` }, { status: 500 });
  }
}

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}
