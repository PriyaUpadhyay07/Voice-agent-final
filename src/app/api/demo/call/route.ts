
import { NextRequest, NextResponse } from 'next/server';
import { POST as mainCallPost } from '../../call/route';

export async function POST(request: NextRequest) {
  // Proxy to main call logic
  // Since api/call doesn't check session, we can just call it
  return mainCallPost(request);
}
