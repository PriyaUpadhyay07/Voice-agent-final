import { NextRequest, NextResponse } from 'next/server';
import { createVapiCall } from '@/lib/vapi';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;
    
    if (!phone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phone);
    console.log(`[DEBUG DEMO] Initiating direct VAPI call to: ${formattedPhone}`);

    const vapiResponse = await createVapiCall({
      phoneNumber: formattedPhone,
      leadName: 'Demo Visitor',
    });

    console.log(`[DEBUG DEMO] Vapi success! ID: ${vapiResponse.id}`);

    return NextResponse.json({
      success: true,
      vapiCallId: vapiResponse.id,
    });
  } catch (err: any) {
    console.error('[DEBUG DEMO] API Error:', err.message);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
