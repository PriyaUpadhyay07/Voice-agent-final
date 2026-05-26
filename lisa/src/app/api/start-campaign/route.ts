import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leads, script, userId } = body;

    const apiKey      = process.env.VAPI_PRIVATE_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const phoneNumId  = process.env.VAPI_PHONE_NUMBER_ID;

    if (!apiKey || !assistantId || !phoneNumId) {
      return NextResponse.json({ error: "Missing Vapi credentials in .env" }, { status: 500 });
    }

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads received. Please re-upload the file." }, { status: 400 });
    }

    const prisma = new (await import("@prisma/client")).PrismaClient();
    
    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: "upadhyaypriya974@gmail.com" } });
    }
    
    if (!user || user.creditsMinutes < leads.length) {
      return NextResponse.json({ 
        error: `Insufficient minutes. You have ${user?.creditsMinutes || 0} mins but trying to call ${leads.length} leads. Please buy more credits.` 
      }, { status: 400 });
    }

    // Step 1: Patch the assistant's system prompt if script provided
    if (script && script.trim()) {
      const patchRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: { systemPrompt: script.trim() },
        }),
      });
      if (!patchRes.ok) {
        const err = await patchRes.text();
        console.error("PATCH assistant error:", err);
      }
    }

    // Step 2: Call each lead
    let called = 0;
    const errors: string[] = [];

    for (const lead of leads) {
      // Find phone column (case-insensitive)
      const phoneKey = Object.keys(lead).find((k) =>
        /phone|mobile|contact/i.test(k)
      );
      const rawPhone = phoneKey ? String(lead[phoneKey]).trim().replace(/\s+/g, "") : "";

      if (!rawPhone) {
        errors.push(`No phone for: ${JSON.stringify(lead)}`);
        continue;
      }

      // Format to E.164 (+91 for India if 10-digit)
      let phone = rawPhone.replace(/[^0-9+]/g, ""); // strip non-numeric except +
      if (!phone.startsWith("+")) {
        phone = phone.replace(/^(0|91)/, "");
        if (phone.length === 10) phone = "+91" + phone;
        else phone = "+" + phone;
      }

      try {
        const callRes = await fetch("https://api.vapi.ai/call/phone", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assistantId,
            phoneNumberId: user?.callerId || phoneNumId, // Dynamic caller ID
            customer: {
              number: phone,
              name: lead.name || lead.Name || lead.NAME || undefined,
            },
            metadata: {
              userId: user?.id
            },
            assistantOverrides: user?.voiceId ? {
              voice: {
                provider: user.voiceProvider || "elevenlabs",
                voiceId: user.voiceId
              }
            } : undefined
          }),
        });

        const callData = await callRes.json();
        if (!callRes.ok) {
          errors.push(`${phone}: ${callData?.message || callRes.status}`);
          console.error("Call failed:", phone, callData);
        } else {
          called++;
          console.log("Call started:", phone, callData.id);
          
          // Deduct 1 minute and $0.10 (at $1 = 10 mins) per call (Simplified for testing)
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              creditsMinutes: { decrement: 1 },
              walletAmount: { decrement: 0.10 }
            }
          });
        }
      } catch (e: any) {
        errors.push(`${phone}: ${e.message}`);
      }

      // 500ms delay between calls
      await new Promise((r) => setTimeout(r, 500));
    }
    return NextResponse.json({
      called,
      total: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("start-campaign error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
