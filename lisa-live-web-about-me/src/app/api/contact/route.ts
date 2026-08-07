import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, topic, message } = body;

    // Log the contact submission targeted to priya@callwithlisa.in
    console.log("=== CONTACT FORM SUBMISSION FOR priya@callwithlisa.in ===");
    console.log(`From: ${name} <${email}> | Phone: ${phone || "N/A"}`);
    console.log(`Company: ${company || "N/A"} | Topic: ${topic}`);
    console.log(`Message: ${message}`);
    console.log("=========================================================");

    return NextResponse.json({
      success: true,
      recipient: "priya@callwithlisa.in",
      message: "Your message has been dispatched to Priya Upadhyay (priya@callwithlisa.in). We will respond within 24-48 hours.",
    });
  } catch (err: unknown) {
    console.error("Error handling contact submission:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process contact form submission." },
      { status: 500 }
    );
  }
}
