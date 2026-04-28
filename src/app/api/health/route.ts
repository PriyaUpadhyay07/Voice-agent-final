import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const keys = [
    'VAPI_PRIVATE_KEY',
    'VAPI_ASSISTANT_ID',
    'VAPI_PHONE_NUMBER_ID',
    'SIGNALWIRE_PROJECT_ID',
    'SIGNALWIRE_API_TOKEN',
    'SIGNALWIRE_SPACE_URL',
    'SIGNALWIRE_PHONE_NUMBER',
    'DATABASE_URL'
  ];

  const status: any = {};
  keys.forEach(key => {
    const val = process.env[key];
    status[key] = val ? `FOUND (Ends with ...${val.slice(-4)})` : 'MISSING ❌';
  });

  return NextResponse.json(status);
}
