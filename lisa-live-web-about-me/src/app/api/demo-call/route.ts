import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, businessName, businessDesc } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    console.log(`=== INITIATING REAL DEMO CALL TO ${phone} ===`);
    console.log(`User: ${name} | Business: ${businessName}`);
    console.log(`Details: ${businessDesc}`);

    // Check for Vapi API Key
    const vapiApiKey = process.env.VAPI_PRIVATE_KEY || process.env.NEXT_PUBLIC_VAPI_KEY;
    const vapiPhoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
    const vapiAssistantId = process.env.VAPI_ASSISTANT_ID;

    // Check for Bland AI API Key (Alternative real outbound telephony engine)
    const blandApiKey = process.env.BLAND_API_KEY;

    let callStatus = "simulated";
    let apiResponse = null;

    if (vapiApiKey && vapiAssistantId) {
      try {
        const vapiRes = await fetch("https://api.vapi.ai/call/phone", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${vapiApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phoneNumberId: vapiPhoneNumberId,
            customer: {
              number: phone,
              name: name || "Prospect"
            },
            assistantId: vapiAssistantId,
            assistantOverrides: {
              variableValues: {
                user_name: name,
                business_name: businessName,
                business_desc: businessDesc
              }
            }
          })
        });

        apiResponse = await vapiRes.json();
        if (vapiRes.ok) {
          callStatus = "dispatched_vapi";
        }
      } catch (e) {
        console.error("Vapi dispatch error:", e);
      }
    } else if (blandApiKey) {
      try {
        const blandRes = await fetch("https://api.bland.ai/v1/calls", {
          method: "POST",
          headers: {
            "authorization": blandApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone_number: phone,
            task: `Call ${name} on behalf of ${businessName || "their business"}. Pitch Lisa AI tailored to their offer: ${businessDesc}. Keep it under 2 minutes.`,
            first_sentence: `Hi ${name || "there"}! This is Lisa AI calling regarding your business ${businessName || ""}.`
          })
        });

        apiResponse = await blandRes.json();
        if (blandRes.ok) {
          callStatus = "dispatched_bland";
        }
      } catch (e) {
        console.error("Bland dispatch error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      callStatus,
      message: callStatus.startsWith("dispatched")
        ? `Outbound call to ${phone} successfully initiated!`
        : `Demo call payload generated for ${phone}. Add VAPI_PRIVATE_KEY or BLAND_API_KEY in Vercel to make live PSTN calls.`,
      details: apiResponse
    });
  } catch (err) {
    console.error("Demo call API error:", err);
    return NextResponse.json({ success: false, error: "Failed to initiate demo call" }, { status: 500 });
  }
}
