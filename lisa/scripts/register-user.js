const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Native .env parser to eliminate external 'dotenv' dependency
try {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split(/\r?\n/).forEach(line => {
      // Ignore comments and empty lines
      if (line.trim().startsWith("#") || !line.includes("=")) return;
      
      const delimiterIndex = line.indexOf("=");
      const key = line.substring(0, delimiterIndex).trim();
      let val = line.substring(delimiterIndex + 1).trim();
      
      // Remove surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      
      process.env[key] = val;
    });
  }
} catch (err) {
  console.warn("⚠️ Warning: Could not parse local .env file natively:", err.message);
}

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("\n❌ Error: Missing arguments!");
    console.log("Usage: node register-user.js <Name> <Email> [Minutes] [Status]");
    console.log("Example: node register-user.js \"Amit\" \"amit@example.com\" 2 \"demo\"\n");
    process.exit(1);
  }

  const name = args[0];
  const email = args[1].toLowerCase().trim();
  const minutes = parseFloat(args[2]) || 100;
  const balance = minutes / 10; // $1 = 10 mins
  const status = args[3] || (minutes <= 2 ? "demo" : "active");

  console.log(`\n⚙️ Registering client "${name}" (${email}) with ${minutes} mins ($${balance}) and status "${status}"...`);

  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log(`\n💡 Info: User with email "${email}" already exists!`);
      console.log(`   Current Balance: $${user.walletAmount}`);
      console.log(`   Current Minutes: ${user.creditsMinutes}`);
      console.log(`   Current Status:  ${user.status}`);
      
      // Update credits
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          walletAmount: balance,
          creditsMinutes: minutes,
          status: status
        }
      });
      console.log(`✨ Successfully updated user details, reset credits, and updated status to "${status}"!`);
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          walletAmount: balance,
          creditsMinutes: minutes,
          role: "client",
          status: status
        }
      });
      console.log(`✨ Successfully created new client profile with status "${status}"!`);
    }

    const localLink = `http://localhost:3000/?userId=${user.id}`;
    // Replace with actual production URL
    const productionLink = `https://lisa-voice-agent.vercel.app/?userId=${user.id}`;

    console.log("\n=======================================================");
    console.log("🌟 CLIENT CREATED SUCCESSFULLY 🌟");
    console.log("=======================================================");
    console.log(`👤 Name:       ${user.name}`);
    console.log(`📧 Email:      ${user.email}`);
    console.log(`🆔 User ID:    ${user.id}`);
    console.log(`💰 Balance:    $${user.walletAmount}`);
    console.log(`📞 Credits:    ${user.creditsMinutes} Minutes`);
    console.log("-------------------------------------------------------");
    console.log("🔗 SECURE PORTAL PORTABLE LINKS:");
    console.log(`   🖥️ Local Dev:   ${localLink}`);
    console.log(`   🌐 Production:  ${productionLink}`);
    console.log("=======================================================\n");

  } catch (err) {
    console.error("\n❌ Database Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
