const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const riya = await prisma.user.findUnique({
    where: { email: 'riya43upadhyay@gmail.com' },
    include: { campaigns: true, leads: true }
  });
  console.log("Riya Profile:", JSON.stringify(riya, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
