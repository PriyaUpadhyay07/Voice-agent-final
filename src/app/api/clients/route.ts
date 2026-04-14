import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// GET /api/clients
export async function GET() {
  const clients = await prisma.user.findMany({
    where: { role: 'client' },
    include: {
      leads: {
        include: { calls: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(clients);
}

// POST /api/clients — create a new client
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const client = await prisma.user.create({
    data: { name, email, role: 'client', walletAmount: 0 },
  });

  return NextResponse.json(client, { status: 201 });
}
