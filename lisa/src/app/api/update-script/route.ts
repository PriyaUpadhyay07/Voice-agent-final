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

    // Patch the VAPI assistant's system prompt — no VAPI dashboard access needed
    const vapiRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {
          systemPrompt: script,
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
