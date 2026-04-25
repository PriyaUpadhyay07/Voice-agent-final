import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { syncCallTranscript } from '../../../../lib/elevenlabs';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/leads — all leads across all clients (for admin view)
export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      include: {
        calls: { orderBy: { createdAt: 'desc' } },
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

