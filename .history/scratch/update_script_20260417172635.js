const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const script = "Hi! I am an Priya. I am calling to show you how I can help your business handle cold calls 24/7. I am friendly, I never get tired, and I can talk to hundreds of clients for you. Would you like to save time and grow your business with me? Let's talk!";

  await prisma.user.updateMany({
    data: { script: script }
  });

  const lead = await prisma.lead.findFirst({
    where: { name: 'Self Test' }
  });

  if (lead) {
    console.log(`Updated script. To trigger call, visit: /api/call with leadId: ${lead.id}`);
  } else {
    console.log('Self Test lead not found.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
