import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/razorpay/webhook
 * Razorpay sends webhook when payment is captured
 * Automatically adds credits to user account
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature (if secret is configured)
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('[Razorpay Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    console.log('[Razorpay Webhook] Event:', event);

    // Handle payment captured event
    if (event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise to actual amount
      const credits = parseInt(payment.notes?.credits || '0');

      if (!credits) {
        console.log('[Razorpay Webhook] No credits in notes, skipping');
        return NextResponse.json({ received: true });
      }

      // Find the payment record or find the user
      // For the base template, we use the first active user
      // In production, you'd match by userId in the order notes
      const existingPayment = await prisma.payment.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (existingPayment && existingPayment.status === 'completed') {
        console.log('[Razorpay Webhook] Payment already processed');
        return NextResponse.json({ received: true });
      }

      // Get user - in base template there's only one client
      const user = await prisma.user.findFirst({
        where: { role: 'client', status: 'active' },
      });

      if (!user) {
        console.error('[Razorpay Webhook] No active client user found');
        return NextResponse.json({ error: 'No user found' }, { status: 404 });
      }

      // Create or update payment record
      await prisma.payment.upsert({
        where: { id: existingPayment?.id || 'none' },
        create: {
          userId: user.id,
          amount: amount,
          creditsAdded: credits,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          status: 'completed',
        },
        update: {
          razorpayPaymentId: paymentId,
          status: 'completed',
        },
      });

      // Add credits to user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsMinutes: { increment: credits },
          walletAmount: { increment: amount },
        },
      });

      console.log(`[Razorpay Webhook] ✅ Added ${credits} minutes to user ${user.name} (${user.email}). Payment: $${amount}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Razorpay Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
