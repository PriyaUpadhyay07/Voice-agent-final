import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    let { amount, minutes } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured in .env' }, { status: 500 });
    }

    // Razorpay expects amount in the smallest currency unit (cents/paise)
    const amountInCents = Math.round(Number(amount) * 100);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'USD',
        receipt: `lisa_${Date.now()}`,
        notes: {
          minutes: minutes.toString(),
          amount: amount.toString(),
          email: "upadhyaypriya974@gmail.com" // Specific user for testing
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error?.description || 'Failed to create order' }, { status: 500 });
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      keyId: keyId,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
