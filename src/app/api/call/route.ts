import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { RestClient } from '@signalwire/compatibility-api';
import twilio from 'twilio';

// No top-level client initialization to prevent module-level crashes on Vercel
function getTelephonyClients() {
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID || 'MISSING',
    process.env.TWILIO_AUTH_TOKEN || 'MISSING'
  );

  const signalwireClient = RestClient(
    process.env.SIGNALWIRE_PROJECT_ID || 'MISSING',
    process.env.SIGNALWIRE_API_TOKEN || 'MISSING',
    { signalwireSpaceUrl: process.env.SIGNALWIRE_SPACE_URL || 'MISSING' }
  );

  return { twilioClient, signalwireClient };
}



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

    // Check wallet balance
    if (lead.user.walletAmount < MIN_BALANCE) {
      return NextResponse.json({
        error: `Insufficient wallet balance. Current: $${lead.user.walletAmount.toFixed(2)}`,
      }, { status: 402 });
    }

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
      const { signalwireClient, twilioClient } = getTelephonyClients();
      const agentId = process.env.ELEVENLABS_AGENT_ID || '';
      const apiKey = process.env.ELEVENLABS_API_KEY || '';

      const dynamicVars: Record<string, string> = {
        lead_name: lead.name || 'Client',
        lead_phone: lead.phone || '',
        call_record_id: callRecord.id,
      };

      if (lead.user.script) {
        dynamicVars.calling_script = lead.user.script;
      }

      const encodedVars = encodeURIComponent(JSON.stringify(dynamicVars));
      const elevenLabsUrl = `https://api.elevenlabs.io/v1/convai/twilio/outbound?agent_id=${agentId}&dynamic_variables=${encodedVars}&xi-api-key=${apiKey}`;

      let formattedPhone = formatPhoneNumber(lead.phone);
      const provider = (process.env.CALL_PROVIDER || 'signalwire').toLowerCase();
      let callSid = '';

      if (provider === 'signalwire') {
        const call = await signalwireClient.calls.create({
          from: process.env.SIGNALWIRE_PHONE_NUMBER!,
          to: formattedPhone,
          url: elevenLabsUrl,
          method: 'POST',
        });
        callSid = call.sid;
      } else {
        const call = await twilioClient.calls.create({
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: formattedPhone,
          url: elevenLabsUrl,
          method: 'POST',
        });
        callSid = call.sid;
      }

      await prisma.call.update({
        where: { id: callRecord.id },
        data: { status: `${provider}:${callSid}` },
      });

      return NextResponse.json({ success: true, callSid });
    } catch (innerError: any) {
      // Revert status on inner failure
      await prisma.lead.update({ where: { id: leadId }, data: { status: 'failed' } });
      return NextResponse.json({ error: `Telephony Error: ${innerError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error('CRITICAL CALL API ERROR:', error);
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
