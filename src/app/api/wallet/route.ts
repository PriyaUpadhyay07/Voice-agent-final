import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// POST /api/wallet — add credits to a client wallet
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, amount } = body;

  if (!userId || amount === undefined) {
    return NextResponse.json({ error: 'userId and amount are required' }, { status: 400 });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { walletAmount: user.walletAmount + numAmount },
  });

  return NextResponse.json({
    success: true,
    previousBalance: user.walletAmount,
    added: numAmount,
    newBalance: updated.walletAmount,
  });
}
