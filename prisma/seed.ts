import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@voiceagent.com' },
    update: {},
    create: {
      name: 'Admin Priya',
      email: 'admin@voiceagent.com',
      role: 'admin',
      status: 'active',
      password: hashedPassword,
      walletAmount: 999999,
    },
  });

  // Create an 'Admin Private' client entry
  await prisma.user.upsert({
    where: { email: 'admin-private@voiceagent.com' },
    update: {},
    create: {
      name: 'My Private Tests',
      email: 'admin-private@voiceagent.com',
      role: 'client',
      status: 'active',
      password: hashedPassword,
      walletAmount: 100.0,
      script: 'You are testing the system. Be concise.',
    },
  });

  // Create demo client 1
  await prisma.user.upsert({
    where: { email: 'client@demo.com' },
    update: {},
    create: {
      name: 'Demo Client 1',
      email: 'client@demo.com',
      role: 'client',
      status: 'active',
      password: hashedPassword,
      walletAmount: 50.0,
      script: 'You are selling AI Voice Agents. Be professional.',
    },
  });

  // Create demo client 2
  await prisma.user.upsert({
    where: { email: 'demo2@client.com' },
    update: {},
    create: {
      name: 'Demo 2 (Test)',
      email: 'demo2@client.com',
      role: 'client',
      status: 'active',
      password: hashedPassword,
      walletAmount: 100.0,
      script: 'You are an appointment setter for a Real Estate agency.',
    },
  });

  // Create New Test Client
  await prisma.user.upsert({
    where: { email: 'test@client.com' },
    update: {},
    create: {
      name: 'Tester User',
      email: 'test@client.com',
      role: 'client',
      status: 'active',
      password: hashedPassword,
      walletAmount: 25.0,
      script: 'You are a warm outbound caller for a gym membership.',
    },
  });

  console.log('✅ Seed data created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
