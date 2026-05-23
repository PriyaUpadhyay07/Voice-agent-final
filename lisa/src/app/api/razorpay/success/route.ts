import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { amount, minutes, orderId, paymentId } = await req.json();

    const user = await prisma.user.update({
      where: { email: "upadhyaypriya974@gmail.com" },
      data: {
        walletAmount: { increment: amount },
        creditsMinutes: { increment: minutes }
      }
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: amount,
        creditsAdded: minutes,
        status: "completed",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId
      }
    });

    return NextResponse.json({ success: true, balance: user.walletAmount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
