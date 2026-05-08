
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;
    
    // Bypass database entirely for the demo to prevent Supabase connection errors
    return NextResponse.json({ leadIds: ['demo_lead_' + Date.now()] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Bypass database, return empty array so UI doesn't crash
  return NextResponse.json([]);
}
