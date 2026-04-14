import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { syncCallTranscript } from '../../../../lib/elevenlabs';

// GET /api/admin/leads — all leads across all clients (for admin view)
export async function GET() {
  const leads = await prisma.lead.findMany({
    include: {
      calls: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Background Sync
  for (const lead of leads) {
    for (const call of lead.calls) {
      if (call.status === 'completed' && !call.transcript) {
        syncCallTranscript(call.id).catch(console.error);
      }
    }
  }

  return NextResponse.json(leads);
}
