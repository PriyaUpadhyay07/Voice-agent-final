import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { syncCallTranscript } from '../../../../lib/elevenlabs';

export const dynamic = 'force-dynamic';

// GET /api/admin/leads — all leads across all clients (for admin view)
export async function GET() {
  const leads = await prisma.lead.findMany({
    include: {
      calls: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(leads);
}
