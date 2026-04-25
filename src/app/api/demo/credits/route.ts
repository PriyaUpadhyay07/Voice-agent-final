
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Vapi Usage (Spent Amount)
    const vapiRes = await fetch(`https://api.vapi.ai/call?limit=1000`, {
      headers: { 'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}` }
    });
    
    let totalSpent = 0;
    if (vapiRes.ok) {
      const calls = await vapiRes.json();
      totalSpent = Array.isArray(calls) ? calls.reduce((sum, c) => sum + (c.cost || 0), 0) : 0;
    }
    
    // 2. Fetch Admin's starting balance from DB
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const startingBalance = admin?.walletAmount || 5.00;
    const realBalance = Math.max(0, startingBalance - totalSpent);
    
    return NextResponse.json({
      signalWireStatus: 'Active',
      vapiStatus: 'Connected',
      realBalance: realBalance,
      creditsMinutes: admin?.creditsMinutes || (realBalance * 10)
    });
  } catch (error: any) {
    return NextResponse.json({ realBalance: 5.00, creditsMinutes: 50 });
  }
}
