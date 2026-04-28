
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
    const isAdmin = (session.user as any).role === 'ADMIN';
    
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

    // 2. Fetch Vapi Usage (Spent Amount)
    try {
      const vapiRes = await fetch(`https://api.vapi.ai/call?limit=1000`, {
        headers: { 'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}` }
      });
      if (vapiRes.ok) {
        const calls = await vapiRes.json();
        const totalSpent = Array.isArray(calls) ? calls.reduce((sum, c) => sum + (c.cost || 0), 0) : 0;
        
        // Use Admin's wallet as the starting balance for the entire platform
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        const startingBalance = admin?.walletAmount || 5.00;
        
        platformData.realBalance = Math.max(0, startingBalance - totalSpent);
        platformData.vapiStatus = 'Connected';
      } else {
        platformData.vapiStatus = 'Unauthorized';
      }
    } catch (e) {
      platformData.vapiStatus = 'Error';
    }

    // 3. Sync with DB minutes (approx)
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    (platformData as any).creditsMinutes = admin?.creditsMinutes || ((platformData.realBalance || 0) * 10);

    // 3. Count total calls in DB
    const callCount = await prisma.call.count();
    platformData.totalCalls = callCount;

    return NextResponse.json(platformData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
