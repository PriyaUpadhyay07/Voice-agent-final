import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

// PATCH /api/leads/[id] — update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, rejectReason } = body;

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status,
      ...(rejectReason ? { rejectReason } : {}),
    },
  });

  return NextResponse.json(lead);
}

// DELETE /api/leads/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Delete associated calls first
  await prisma.call.deleteMany({ where: { leadId: id } });
  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
