const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugCall() {
  // Manually load .env
  const fs = require('fs');
  const path = require('path');
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '');
    }
  });

  const leadId = 'cmoiakso80037foc7pda2i53y'; // ishant from your DB
  
  console.log('--- VAPI DEBUG START ---');
  
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { user: true }
  });
  
  if (!lead) {
    console.error('Lead not found');
    return;
  }
  
  console.log('User Email:', lead.user.email);
  console.log('User Balance:', lead.user.walletAmount);
  console.log('User Minutes:', lead.user.creditsMinutes);
  
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  const assistantId = process.env.VAPI_ASSISTANT_ID;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  
  console.log('VAPI_PRIVATE_KEY:', apiKey ? 'FOUND' : 'MISSING');
  console.log('VAPI_ASSISTANT_ID:', assistantId ? 'FOUND' : 'MISSING');
  console.log('VAPI_PHONE_NUMBER_ID:', phoneNumberId ? 'FOUND' : 'MISSING');
  
  if (!apiKey || !assistantId || !phoneNumberId) {
    console.error('Environment variables are missing locally!');
  }

  // Simulate formatting
  const rawPhone = lead.phone;
  let formatted = rawPhone.replace(/[\s\-().]/g, '');
  if (!formatted.startsWith('+')) {
    if (/^[6-9]\d{9}$/.test(formatted)) formatted = '+91' + formatted;
    else if (/^\d{10}$/.test(formatted)) formatted = '+1' + formatted;
    else formatted = '+' + formatted;
  }
  
  console.log('Lead Phone:', rawPhone);
  console.log('Formatted Phone:', formatted);
  
  console.log('Testing VAPI API connection...');
  try {
    const res = await fetch('https://api.vapi.ai/assistant/' + assistantId, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await res.json();
    if (res.ok) {
      console.log('VAPI API Connection: SUCCESS');
      console.log('Assistant Name:', data.name);
    } else {
      console.error('VAPI API Connection: FAILED', data);
    }
  } catch (e) {
    console.error('VAPI API Connection: ERROR', e.message);
  }
  
  console.log('--- DEBUG END ---');
}

debugCall().catch(console.error);
