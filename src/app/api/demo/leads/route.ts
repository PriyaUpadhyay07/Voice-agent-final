
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leads: bulkLeads, phone, name, company, batchId } = body;
    
    // HARDCODED ADMIN ID FOR DEMO
    const targetUserId = "cmocru6r00000p16f3jhops3c";

    // Single create (Test Call)
    if (!bulkLeads && phone && name) {
      const lead = await prisma.lead.create({
        data: { userId: targetUserId, phone, name, company: company || null, batchId: batchId || 'Demo_Trial', status: 'pending' },
      });
      return NextResponse.json({ leadIds: [lead.id] }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid demo request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Demo leads (last 10)
  const targetUserId = "cmocru6r00000p16f3jhops3c";
  const leads = await prisma.lead.findMany({
    where: { userId: targetUserId },
    include: { calls: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  return NextResponse.json(leads);
}
