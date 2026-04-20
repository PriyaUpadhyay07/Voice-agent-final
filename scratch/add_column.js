const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    console.log('Adding batchId column...');
    await prisma.$executeRawUnsafe('ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "batchId" TEXT;');
    console.log('✅ Column batchId added successfully!');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
