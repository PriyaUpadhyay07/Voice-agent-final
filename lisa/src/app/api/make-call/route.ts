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

    // Deduct 1 minute and $0.10 (at $1 = 10 mins) for this call
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        creditsMinutes: { decrement: 1 },
        walletAmount: { decrement: 0.10 }
      }
    });

    // Format to E.164
    let phone = rawPhone.replace(/[^0-9+]/g, ""); 
    if (!phone.startsWith("+")) {
      phone = phone.replace(/^(0|91)/, "");
      if (phone.length === 10) phone = "+91" + phone;
      else phone = "+" + phone;
    }

    // Parse JSON script containing firstMessage and description
    let firstMessage = script;
    let description = "";
    try {
      const parsed = JSON.parse(script);
      if (parsed && typeof parsed === "object") {
        firstMessage = parsed.firstMessage || "";
        description = parsed.description || "";
      }
    } catch (e) {
      // Fallback for legacy plain-text script
      firstMessage = script;
    }

    const systemPromptContent = description 
      ? `You are Lisa, a professional cold calling assistant. Your greeting is: "${firstMessage}". Business Info / Script context:\n${description}\nKeep your answers extremely short, natural, and follow the flow of the greeting. Direct the user towards the goal of the call.`
      : `You are Lisa, a professional cold calling assistant. Your greeting is: "${firstMessage}". Keep your answers extremely short, natural, and follow the flow of the greeting. Direct the user towards the goal of the call.`;

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
          firstMessage: firstMessage,
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: systemPromptContent
              }
            ]
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
