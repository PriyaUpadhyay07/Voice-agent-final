import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/script — get a client's script
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  let userId = (session.user as any).id;

  // If admin, they might want to filter by userId query param
  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (userRole === 'admin' && queryUserId) {
    userId = queryUserId;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ script: user.script });
}

// PUT /api/script — update a client's voice agent script
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { userId: bodyUserId, script } = body;
  const userRole = (session.user as any).role;

  let targetUserId = (session.user as any).id;
  if (userRole === 'admin' && bodyUserId) {
    targetUserId = bodyUserId;
  }

  if (typeof script !== 'string') {
    return NextResponse.json({ error: 'script must be a string' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: targetUserId },
    data: { script },
  });

  return NextResponse.json({ success: true, script: user.script });
}
