import prisma from "../lisa/src/lib/db";

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "upadhyaypriya974@gmail.com" },
      update: {
        walletAmount: 10,
        creditsMinutes: 100
      },
      create: {
        email: "upadhyaypriya974@gmail.com",
        name: "Priya",
        walletAmount: 10,
        creditsMinutes: 100
      }
    });

    console.log("SUCCESS: Credits updated for user:", user.email);
    console.log("Balance:", user.walletAmount);
    console.log("Minutes:", user.creditsMinutes);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
