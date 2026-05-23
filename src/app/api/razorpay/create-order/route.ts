import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay order for credit purchase
 */
export async function POST(req: Request) {
  try {
    let { amount, credits } = await req.json();

    // If amount is less than 1000, assume it's in dollars and convert to paise
    // (Razorpay expects amount in the smallest currency unit)
    if (amount < 1000) {
      const dollars = amount;
      amount = dollars * 100; // Convert to paise/cents
      if (!credits) {
        credits = dollars * 10; // $1 = 10 minutes
      }
    } else if (!credits) {
      // If amount is already in paise, calculate credits
      credits = (amount / 100) * 10;
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });
    }

    // Create order via Razorpay API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount, // amount in paise/cents
        currency: 'USD',
        receipt: `credits_${credits}_${Date.now()}`,
        notes: {
          credits: credits.toString(),
          type: 'voice_credits',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Razorpay order creation failed:', errorData);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      keyId: keyId,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
