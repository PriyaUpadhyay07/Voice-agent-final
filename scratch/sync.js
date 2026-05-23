const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "upadhyaypriya974@gmail.com" },
      update: {
        walletAmount: 10.00,
        creditsMinutes: 100
      },
      create: {
        email: "upadhyaypriya974@gmail.com",
        name: "Priya",
        walletAmount: 10.00,
        creditsMinutes: 100
      }
    });

    console.log("SUCCESS: Credits added for:", user.email);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
