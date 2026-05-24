import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { script } = await req.json();

    if (!script || typeof script !== "string") {
      return NextResponse.json({ error: "No script provided." }, { status: 400 });
    }

    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const apiKey = process.env.VAPI_PRIVATE_KEY;

    if (!assistantId || !apiKey) {
      return NextResponse.json({ error: "Vapi credentials missing in .env" }, { status: 500 });
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

    // Patch the VAPI assistant's system prompt — no VAPI dashboard access needed
    const vapiRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        },
      }),
    });

    if (!vapiRes.ok) {
      const err = await vapiRes.text();
      return NextResponse.json({ error: `Vapi error: ${err}` }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
