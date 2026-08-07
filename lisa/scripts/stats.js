const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

try {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split(/\r?\n/).forEach(line => {
      if (line.trim().startsWith("#") || !line.includes("=")) return;
      const delimiterIndex = line.indexOf("=");
      const key = line.substring(0, delimiterIndex).trim();
      let val = line.substring(delimiterIndex + 1).trim();
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
  try {
    const users = await prisma.user.findMany();
    const calls = await prisma.call.findMany();
    const campaigns = await prisma.campaign.findMany();
    const leads = await prisma.lead.findMany();
    console.log("USERS COUNT:", users.length);
    console.log("CALLS COUNT:", calls.length);
    console.log("CAMPAIGNS COUNT:", campaigns.length);
    console.log("LEADS COUNT:", leads.length);
    
    console.log("\n--- Users Details ---");
    users.forEach(u => {
      console.log(`User: ${u.name} (${u.email}), Role: ${u.role}, Status: ${u.status}`);
    });

    console.log("\n--- Campaigns Details ---");
    campaigns.forEach(c => {
      console.log(`Campaign: ${c.name}, ID: ${c.id}, User ID: ${c.userId}`);
    });

    console.log("\n--- Calls Details (Last 20) ---");
    calls.slice(-20).forEach(c => {
      console.log(`Call: ID ${c.id}, Duration ${c.duration}s, Status: ${c.status}, CreatedAt: ${c.createdAt}`);
    });
  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
