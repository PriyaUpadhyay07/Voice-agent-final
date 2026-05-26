const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find Riya by email
  const email = 'riya43upadhyay@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`❌ Error: User with email "${email}" not found!`);
    return;
  }

  // Update Riya's account with:
  // 1. Premium ElevenLabs Female Voice (Rachel - ID: 21m00Tcm4TlvDq8ikWAM)
  // 2. Default System Caller ID (f1ce0592-e96c-4229-8faa-7ece089440a8) to ensure it works immediately.
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      callerId: 'f1ce0592-e96c-4229-8faa-7ece089440a8', // Master System Phone Number ID
      voiceId: '21m00Tcm4TlvDq8ikWAM',               // Rachel (Standard Premium ElevenLabs Female Voice)
      voiceProvider: 'elevenlabs',
      status: 'active'                               // Ensure her account is active
    }
  });

  console.log("\n=======================================================");
  console.log("🌟 RIYA'S CLIENT PROFILE CONFIGURED SUCCESSFULLY 🌟");
  console.log("=======================================================");
  console.log(`👤 Name:           ${updatedUser.name}`);
  console.log(`📧 Email:          ${updatedUser.email}`);
  console.log(`📞 Caller ID:      ${updatedUser.callerId} (System Active Number)`);
  console.log(`🗣️ Voice ID:      ${updatedUser.voiceId} (Rachel - Premium ElevenLabs Female)`);
  console.log(`💼 Voice Provider: ${updatedUser.voiceProvider}`);
  console.log(`💰 Credits:        ${updatedUser.creditsMinutes} Minutes`);
  console.log("=======================================================\n");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
