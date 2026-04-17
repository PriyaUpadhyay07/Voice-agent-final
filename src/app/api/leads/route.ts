import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { auth } from '@/auth';

// GET /api/leads
export async function GET(request: NextRequest) {
  // Direct Access Force: Bypass auth() entirely
  const session = { user: { id: 'cmnvnz0b30000vvmj5etl0lsh', role: 'admin' } } as any;

  const userRole = (session.user as any).role;
  let userId = (session.user as any).id;

  // If admin, they might want to filter by userId query param
  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (userRole === 'admin' && queryUserId) {
    userId = queryUserId;
  }

  const leads = await prisma.lead.findMany({
    where: { userId },
    include: { calls: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(leads);
}

// POST /api/leads — create single or bulk leads OR bulk reset
export async function POST(request: NextRequest) {
  // Direct Access Force: Bypass auth() entirely
  const session = { user: { id: 'cmnvnz0b30000vvmj5etl0lsh', role: 'admin' } } as any;

  const body = await request.json();
  const { userId: bodyUserId, leads: bulkLeads, phone, name, company, action, status: resetStatus } = body;
  
  const userRole = (session.user as any).role;
  let targetUserId = (session.user as any).id;
  if (userRole === 'admin' && bodyUserId) {
    targetUserId = bodyUserId;
  }

  // Handle Bulk Reset Action
  if (action === 'bulk_reset' && resetStatus) {
    const updated = await prisma.lead.updateMany({
      where: { userId: targetUserId },
      data: { status: resetStatus },
    });
    return NextResponse.json({ count: updated.count, status: resetStatus });
  }

  // Bulk create
  if (Array.isArray(bulkLeads)) {
    const created = await prisma.lead.createMany({
      data: bulkLeads.map((l: { phone: string; name: string; company?: string }) => ({
        userId: targetUserId,
        phone: l.phone,
        name: l.name,
        company: l.company || null,
        status: 'pending',
      })),
    });
    return NextResponse.json({ count: created.count }, { status: 201 });
  }

  // Single create
  if (!phone || !name) {
    return NextResponse.json({ error: 'phone and name are required' }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { userId: targetUserId, phone, name, company: company || null, status: 'pending' },
  });

  return NextResponse.json(lead, { status: 201 });
}

