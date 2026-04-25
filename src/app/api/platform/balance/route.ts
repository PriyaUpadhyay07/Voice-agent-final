
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is admin
    const isAdmin = session.user.role === 'ADMIN';
    
    let platformData = {
      signalWireStatus: 'Active',
      vapiStatus: 'Active',
      realBalance: null as number | null,
      totalCalls: 0
    };

    // 1. Try to fetch SignalWire Balance
    const swAuth = Buffer.from(`${process.env.SIGNALWIRE_PROJECT_ID}:${process.env.SIGNALWIRE_API_TOKEN}`).toString('base64');
    try {
      const swRes = await fetch(`https://${process.env.SIGNALWIRE_SPACE_URL}/api/laml/2010-04-01/Accounts/${process.env.SIGNALWIRE_PROJECT_ID}.json`, {
        headers: { 'Authorization': `Basic ${swAuth}` }
      });
      const swJson = await swRes.json();
      // Sometimes balance is in swJson.balance or swJson.account_balance
      platformData.realBalance = swJson.balance || swJson.account_balance || null;
    } catch (e) {
      platformData.signalWireStatus = 'Error';
    }

    // 2. Fetch Vapi Org Info
    try {
      const vapiRes = await fetch(`https://api.vapi.ai/org`, {
        headers: { 'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}` }
      });
      if (vapiRes.ok) {
        const vapiJson = await vapiRes.json();
        // If SignalWire balance was missing, maybe Vapi has billing info
        if (!platformData.realBalance && vapiJson.billingLimit) {
           platformData.realBalance = vapiJson.billingLimit;
        }
      } else {
        platformData.vapiStatus = 'Unauthorized';
      }
    } catch (e) {
      platformData.vapiStatus = 'Error';
    }

    // 3. Count total calls in DB
    const callCount = await prisma.call.count();
    platformData.totalCalls = callCount;

    return NextResponse.json(platformData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
