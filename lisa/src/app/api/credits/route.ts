import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "upadhyaypriya974@gmail.com" }
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "upadhyaypriya974@gmail.com",
          name: "Priya",
          walletAmount: 10.00,
          creditsMinutes: 100
        }
      });
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      name: user.name || "Client",
      email: user.email,
      balance: user.walletAmount,
      minutes: user.creditsMinutes,
      history: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        date: p.createdAt
      }))
    });
  } catch (error: any) {
    console.error("SAFE MODE - Database error:", error.message);
    // Return default values so the dashboard doesn't crash
    return NextResponse.json({
      balance: 10.00, // Show the $10 credits as fallback
      minutes: 100,
      history: [],
      warning: "Running in Safe Mode (DB Offline)"
    });
  }
}
