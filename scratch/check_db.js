const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const leads = await prisma.lead.findMany();
  const batches = new Set(leads.map(l => l.batchId));
  console.log([...batches]);
  
  const calls = await prisma.call.findMany();
  console.log('Total calls:', calls.length);
}
check();
