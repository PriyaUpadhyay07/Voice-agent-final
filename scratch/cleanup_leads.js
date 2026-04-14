const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up leads and calls...');
  // Delete calls first due to relation
  const callsResult = await prisma.call.deleteMany({});
  console.log(`Deleted ${callsResult.count} calls.`);
  
  const leadsResult = await prisma.lead.deleteMany({});
  console.log(`Deleted ${leadsResult.count} leads.`);
  
  console.log('Database cleaned. You can now add fresh leads.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
