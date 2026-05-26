import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { syncCallTranscript } from '../../../../lib/elevenlabs';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/clients/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow user to access their own data, or admin to access anyone
  const userId = (session.user as any).id;
  const userRole = String((session.user as any).role || '').toLowerCase();

  if (userId !== id && userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      leads: {
        include: { calls: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // Background Sync: check if any completed calls are missing transcripts
  for (const lead of client.leads) {
    for (const call of lead.calls) {
      if (call.status === 'completed' && !call.transcript) {
        // Run in background without await to keep response fast
        syncCallTranscript(call.id).catch(console.error);
      }
    }
  }

  return NextResponse.json(client);
}

// PATCH /api/clients/[id] — update wallet or profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = String((session.user as any).role || '').toLowerCase();

  // Only admin or the owner can update
  if (userId !== id && userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { walletAmount, name, email, script } = body;

  const data: Record<string, unknown> = {};
  if (walletAmount !== undefined) data.walletAmount = Number(walletAmount);
  if (name) data.name = name;
  if (email) data.email = email;
  if (script !== undefined) data.script = script;

  const client = await prisma.user.update({ where: { id }, data });
  return NextResponse.json(client);
}

// DELETE /api/clients/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as any).role;

  // Only admin can delete clients
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Cascade: delete calls -> leads -> user
  const leads = await prisma.lead.findMany({ where: { userId: id } });
  for (const lead of leads) {
    await prisma.call.deleteMany({ where: { leadId: lead.id } });
  }
  await prisma.lead.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
