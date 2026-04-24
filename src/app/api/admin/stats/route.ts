import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [clients, allLeads, allCalls] = await Promise.all([
      prisma.user.findMany({ where: { role: 'client' } }),
      prisma.lead.findMany(),
      prisma.call.findMany(),
    ]);

    const totalRevenue = clients.reduce((sum, c) => sum + (c.walletAmount || 0), 0);
    const stats = {
      totalClients: clients.length,
      totalRevenue,
      totalCalls: allCalls.length,
      approvedLeads: allLeads.filter(l => l.status === 'approved' || l.status === 'interested').length,
      rejectedLeads: allLeads.filter(l => l.status === 'rejected').length,
      pendingLeads: allLeads.filter(l => l.status === 'pending').length,
      clients: clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        walletAmount: c.walletAmount,
        creditsMinutes: c.creditsMinutes,
        createdAt: c.createdAt,
      })),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
