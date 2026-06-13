import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: Fetch all campaigns for a specific user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId");

    if (!userId) {
      const user = await prisma.user.findUnique({
        where: { email: "upadhyaypriya974@gmail.com" }
      });
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const formattedCampaigns = campaigns.map(c => ({
      id: c.id,
      name: c.name,
      messages: JSON.parse(c.messages || "[]"),
      leads: JSON.parse(c.leads || "[]")
    }));

    return NextResponse.json(formattedCampaigns);
  } catch (error: any) {
    console.error("[Campaign API GET Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or Update a campaign
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, campaign } = body;

    if (!userId || !campaign || !campaign.id) {
      return NextResponse.json({ error: "Missing userId or campaign details" }, { status: 400 });
    }

    const upserted = await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: {
        name: campaign.name || "Unnamed Campaign",
        messages: JSON.stringify(campaign.messages || []),
        leads: JSON.stringify(campaign.leads || [])
      },
      create: {
        id: campaign.id,
        userId: userId,
        name: campaign.name || "Unnamed Campaign",
        messages: JSON.stringify(campaign.messages || []),
        leads: JSON.stringify(campaign.leads || [])
      }
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: upserted.id,
        name: upserted.name,
        messages: JSON.parse(upserted.messages || "[]"),
        leads: JSON.parse(upserted.leads || "[]")
      }
    });
  } catch (error: any) {
    console.error("[Campaign API POST Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a campaign
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
    }

    await prisma.campaign.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error: any) {
    console.error("[Campaign API DELETE Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
