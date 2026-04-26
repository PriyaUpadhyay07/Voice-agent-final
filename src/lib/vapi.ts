/**
 * VAPI.ai Integration Library
 * Handles creating and managing AI voice calls via VAPI
 * Uses SignalWire as BYOC (Bring Your Own Carrier)
 */

const VAPI_BASE_URL = 'https://api.vapi.ai';

interface VapiCallOptions {
  phoneNumber: string;     // Lead's phone number to call
  assistantId?: string;    // VAPI assistant ID (defaults to env)
  leadName?: string;       // Name of the lead (for personalization)
  leadCompany?: string;    // Company name
  customScript?: string;   // Custom script/first message
}

interface VapiCallResponse {
  id: string;
  status: string;
  phoneNumber: string;
  createdAt: string;
}

/**
 * Create an outbound call via VAPI
 */
export async function createVapiCall(options: VapiCallOptions): Promise<VapiCallResponse> {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  const assistantId = options.assistantId || process.env.VAPI_ASSISTANT_ID;

  if (!apiKey) throw new Error('VAPI_PRIVATE_KEY is not configured');
  if (!assistantId) throw new Error('VAPI_ASSISTANT_ID is not configured');

  // Build the assistant overrides if custom script is provided
  const assistantOverrides: any = {};
  
  if (options.customScript) {
    assistantOverrides.firstMessage = options.customScript
      .replace('{{lead_name}}', options.leadName || 'there')
      .replace('{{lead_company}}', options.leadCompany || 'your company');
  }

  const body: any = {
    assistantId,
    customer: {
      number: options.phoneNumber,
      name: options.leadName,
    },
    // Use the imported BYOC (SignalWire) number ID from VAPI dashboard
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
  };

  // Add assistant overrides if we have custom script
  if (Object.keys(assistantOverrides).length > 0) {
    body.assistantOverrides = assistantOverrides;
  }

  const response = await fetch(`${VAPI_BASE_URL}/call/phone`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`VAPI call failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

/**
 * Get call details from VAPI
 */
export async function getVapiCall(callId: string) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  if (!apiKey) throw new Error('VAPI_PRIVATE_KEY is not configured');

  const response = await fetch(`${VAPI_BASE_URL}/call/${callId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get VAPI call: ${response.status}`);
  }

  return await response.json();
}

/**
 * Parse VAPI webhook payload for call ended event
 */
export function parseVapiWebhook(payload: any) {
  return {
    callId: payload.call?.id || payload.id,
    status: payload.call?.status || payload.status,
    duration: payload.call?.duration || payload.duration || 0,
    transcript: payload.artifact?.transcript || payload.transcript || null,
    summary: payload.artifact?.summary || payload.summary || null,
    cost: payload.cost || payload.call?.cost || 0,
    endedReason: payload.call?.endedReason || payload.endedReason || 'unknown',
    customerNumber: payload.call?.customer?.number || payload.customer?.number || '',
  };
}

/**
 * Determine lead status from VAPI call analysis/transcript
 * Returns: 'interested' | 'busy' | 'rejected'
 */
export function determineLeadStatus(transcript: string | null, summary: string | null, endedReason: string): string {
  if (!transcript && !summary) return 'busy'; // No conversation happened
  
  const text = ((transcript || '') + ' ' + (summary || '')).toLowerCase();
  
  // Check for interest signals
  const interestSignals = [
    'interested', 'schedule', 'meeting', 'appointment', 'demo', 
    'send me', 'tell me more', 'sounds good', 'yes please',
    'let\'s talk', 'follow up', 'email me', 'call me back',
    'sign up', 'how much', 'pricing', 'available'
  ];
  
  // Check for rejection signals
  const rejectSignals = [
    'not interested', 'don\'t call', 'stop calling', 'no thank you',
    'no thanks', 'remove me', 'unsubscribe', 'do not call',
    'leave me alone', 'hang up', 'spam', 'scam'
  ];
  
  // Check for busy signals
  const busySignals = [
    'busy', 'call back', 'later', 'not now', 'in a meeting',
    'driving', 'call me later', 'another time', 'not a good time',
    'voicemail', 'no answer'
  ];
  
  // Check rejection first (highest priority)
  for (const signal of rejectSignals) {
    if (text.includes(signal)) return 'rejected';
  }
  
  // Check interest next
  for (const signal of interestSignals) {
    if (text.includes(signal)) return 'interested';
  }
  
  // Check busy
  for (const signal of busySignals) {
    if (text.includes(signal)) return 'busy';
  }
  
  // If call ended normally and had conversation, check by ended reason
  if (endedReason === 'customer-ended-call' || endedReason === 'silence-timed-out') {
    return 'busy';
  }
  
  return 'busy'; // Default to busy for follow-up
}
