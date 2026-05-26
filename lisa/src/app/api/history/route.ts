import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "100";
    const userId = searchParams.get("userId");
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const apiKey = process.env.VAPI_PRIVATE_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    // Fetch call list from Vapi
    const res = await fetch(`https://api.vapi.ai/call?limit=${limit}${assistantId ? `&assistantId=${assistantId}` : ""}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    // Filter calls strictly for the requested user to ensure proper data isolation
    if (Array.isArray(data)) {
      if (user) {
        const filtered = data.filter((call: any) => {
          // 1. Match by custom, non-shared callerId linked to this user
          const isSharedNumber = user.callerId === "f1ce0592-e96c-4229-8faa-7ece089440a8";
          const matchCallerId = user.callerId && 
                                call.phoneNumberId === user.callerId && 
                                !isSharedNumber;
          // 2. Match by metadata.userId passed during call initiation
          const matchMetadata = call.metadata?.userId === user.id;
          return matchCallerId || matchMetadata;
        });
        return NextResponse.json(filtered);
      } else {
        // If no userId is requested, return empty array to prevent leak of central/Priya data
        return NextResponse.json([]);
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
