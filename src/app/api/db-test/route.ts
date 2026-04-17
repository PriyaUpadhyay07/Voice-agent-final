import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check if can ping database
    const result = await prisma.$queryRaw`SELECT 1`;
    
    // 2. Check user count
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connected successfully!',
      data: {
        ping: result,
        userCount: userCount
      }
    });
  } catch (error: any) {
    console.error('Database Test Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      error_code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
