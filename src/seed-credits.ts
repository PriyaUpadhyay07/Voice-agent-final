
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.update({
      where: { email: 'upadhyaypriya479@gmail.com' },
      data: {
        walletAmount: 9.00,
        creditsMinutes: 120, // Approx 120 mins for $9
        role: 'ADMIN' 
      }
    });
    console.log(`Real Data Synced! User ${user.email} initialized with $${user.walletAmount} (SignalWire $4 free + $5 topup).`);
  } catch (e) {
    console.error('Error seeding user:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
