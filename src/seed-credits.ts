
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.update({
      where: { email: 'upadhyaypriya479@gmail.com' },
      data: {
        walletAmount: 125.50,
        creditsMinutes: 600,
        role: 'ADMIN' 
      }
    });
    console.log(`Success! User ${user.email} updated to $${user.walletAmount} and ${user.creditsMinutes} mins.`);
  } catch (e) {
    console.error('Error seeding user:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
