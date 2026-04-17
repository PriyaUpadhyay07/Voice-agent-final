import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { syncCallTranscript } from '../../../../lib/elevenlabs';

export const dynamic = 'force-dynamic';

// GET /api/admin/leads — all leads across all clients (for admin view)
export async function GET() {
  // Direct Access: Skip auth() and use hardcoded Admin ID
  try {
    const leads = await prisma.lead.findMany({
      include: {
        calls: { orderBy: { createdAt: 'desc' }, take: 1 }, // Speed optimization
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Admin Leads API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

