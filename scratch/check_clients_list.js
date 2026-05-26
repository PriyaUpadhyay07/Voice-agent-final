const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.user.findMany({
    where: { role: 'client' }
  });
  console.log("CLIENTS IN DB:", JSON.stringify(clients.map(c => ({ id: c.id, name: c.name, email: c.email, role: c.role })), null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
