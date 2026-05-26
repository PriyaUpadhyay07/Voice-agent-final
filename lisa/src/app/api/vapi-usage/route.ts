import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const apiKey = process.env.VAPI_PRIVATE_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch latest calls from Vapi to compute exact daily minutes for this specific user
    const res = await fetch(`https://api.vapi.ai/call?limit=1000${assistantId ? `&assistantId=${assistantId}` : ""}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    let chartData: any[] = [];
    let totalMinutes = 0;

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const dailyUsage: { [key: string]: number } = {};
        
        data.forEach((call: any) => {
          // Verify if this call belongs to the requested user
          const matchCallerId = user.callerId && call.phoneNumberId === user.callerId;
          const matchMetadata = call.metadata?.userId === user.id;

          if (matchCallerId || matchMetadata) {
            if (!call.createdAt) return;
            const dateStr = call.createdAt.split("T")[0];
            const mins = (call.duration || 0) / 60; // duration is in seconds
            dailyUsage[dateStr] = (dailyUsage[dateStr] || 0) + mins;
            totalMinutes += mins;
          }
        });

        // Group & sort usage chronologically
        chartData = Object.keys(dailyUsage).sort().map(date => ({
          date,
          mins: parseFloat(dailyUsage[date].toFixed(3))
        }));
      }
    }

    return NextResponse.json({
      totalMinutes: parseFloat(totalMinutes.toFixed(3)),
      chartData
    });
  } catch (error: any) {
    console.error("VAPI Usage Error:", error.message);
    return NextResponse.json({ 
      totalMinutes: 0,
      chartData: []
    });
  }
}
