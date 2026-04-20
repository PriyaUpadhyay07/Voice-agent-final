import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getElevenLabsBalance } from '@/lib/elevenlabs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [clients, allLeads, allCalls, elBalance] = await Promise.all([
      prisma.user.findMany({ where: { role: 'client' } }),
      prisma.lead.findMany(),
      prisma.call.findMany(),
      getElevenLabsBalance(),
    ]);

    const totalRevenue = clients.reduce((sum, c) => sum + (c.walletAmount || 0), 0);
    const stats = {
      totalClients: clients.length,
      totalRevenue,
      totalCalls: allCalls.length,
      elCredits: elBalance ? elBalance.remaining : 0,
      approvedLeads: allLeads.filter(l => l.status === 'approved').length,
      rejectedLeads: allLeads.filter(l => l.status === 'rejected').length,
      pendingLeads: allLeads.filter(l => l.status === 'pending').length,
      clients: clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        walletAmount: c.walletAmount,
        createdAt: c.createdAt,
      })),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
