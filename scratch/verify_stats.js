const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const leadCount = await prisma.lead.count();
    const callCount = await prisma.call.count();
    const userCount = await prisma.user.count({ where: { role: 'client' } });
    const leadsByStatus = await prisma.lead.groupBy({ by: ['status'], _count: true });
    
    console.log('--- DATABASE STATS ---');
    console.log('Total Leads:', leadCount);
    console.log('Total Calls:', callCount);
    console.log('Total Clients:', userCount);
    console.log('Leads by Status:', JSON.stringify(leadsByStatus, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
