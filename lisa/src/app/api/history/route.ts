import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "50";
    const assistantId = process.env.VAPI_ASSISTANT_ID;
    const apiKey = process.env.VAPI_PRIVATE_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

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
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
