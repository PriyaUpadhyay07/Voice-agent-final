import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead, script, phone: rawPhone, userId } = body;

    const apiKey      = process.env.VAPI_PRIVATE_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const phoneNumId  = process.env.VAPI_PHONE_NUMBER_ID;

    if (!apiKey || !assistantId || !phoneNumId) {
      return NextResponse.json({ error: "Missing Vapi credentials" }, { status: 500 });
    }

    const prisma = new (await import("@prisma/client")).PrismaClient();
    
    // Dynamic user lookup with backward-compatible fallback
    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: "upadhyaypriya974@gmail.com" } });
    }

    if (!user || user.creditsMinutes <= 0) {
      return NextResponse.json({ error: "Insufficient minutes. Please buy more credits." }, { status: 400 });
    }

    // Deduct 1 minute for this call
    await prisma.user.update({
      where: { id: user.id },
      data: { creditsMinutes: { decrement: 1 } }
    });

    // Format to E.164
    let phone = rawPhone.replace(/[^0-9+]/g, ""); 
    if (!phone.startsWith("+")) {
      phone = phone.replace(/^(0|91)/, "");
      if (phone.length === 10) phone = "+91" + phone;
      else phone = "+" + phone;
    }

    // Make the call with complete assistantOverrides
    const callRes = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        phoneNumberId: phoneNumId,
        customer: {
          number: phone,
          name: lead.name || lead.Name || lead.NAME || undefined,
        },
        assistantOverrides: script ? {
          instructions: script,
          model: {
            systemPrompt: script
          }
        } : undefined
      }),
    });

    const callData = await callRes.json();
    if (!callRes.ok) {
      return NextResponse.json({ error: callData?.message || "Call failed" }, { status: callRes.status });
    }

    return NextResponse.json({ success: true, callId: callData.id });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
