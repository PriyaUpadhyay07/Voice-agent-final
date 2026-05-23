import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phoneNumber, script } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Replace with your VAPI credentials or fetch from process.env
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || 'your-vapi-private-key';
    const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || 'your-assistant-id';
    const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID || 'your-vapi-phone-number-id';

    const payload: any = {
      assistantId: VAPI_ASSISTANT_ID,
      customer: {
        number: phoneNumber,
      },
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
    };

    // If client provided a custom script, we override the assistant's prompt
    if (script && script.trim() !== '') {
      payload.assistantOverrides = {
        firstMessage: "Hello!",
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: script
            }
          ]
        }
      };
    }

    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vapi Error:', data);
      return NextResponse.json({ error: data.message || 'Failed to trigger Vapi call' }, { status: response.status });
    }

    // Return the Call ID so the frontend can poll its status/transcript
    return NextResponse.json({ success: true, callId: data.id });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
