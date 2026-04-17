const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const leads = await prisma.lead.count();
  const calls = await prisma.call.count();
  console.log({ users, leads, calls });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
