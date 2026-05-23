import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { amount, minutes } = await req.json();

    // For demo/testing, we use the specific user email
    const user = await prisma.user.update({
      where: { email: "upadhyaypriya974@gmail.com" },
      data: {
        walletAmount: { increment: Number(amount) },
        creditsMinutes: { increment: Number(minutes) }
      }
    });

    // Create a payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: Number(amount),
        creditsAdded: Number(minutes),
        status: "completed",
        razorpayOrderId: "test_order_" + Date.now()
      }
    });

    return NextResponse.json({ success: true, balance: user.walletAmount, minutes: user.creditsMinutes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
