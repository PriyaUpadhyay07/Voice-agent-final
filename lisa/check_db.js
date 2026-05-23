const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'upadhyaypriya974@gmail.com' }
    });
    console.log("USER:", user);
  } catch(e) {
    console.error("DB ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
