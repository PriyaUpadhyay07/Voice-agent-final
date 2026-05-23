import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || 'your-vapi-private-key';

    const response = await fetch(`https://api.vapi.ai/call/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch status' }, { status: response.status });
    }

    return NextResponse.json({
      status: data.status,
      transcript: data.transcript || '',
    });

  } catch (error: any) {
    console.error('Status Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
