# Chat History Checkpoint: 29 april 2.0

## Current Goal
Setting up a Voice Cold Calling Agent using **Vapi** (Core AI) and **SignalWire** (BYOC Phone Provider) to call Indian mobile numbers (+91) using a low-budget approach.

## Achievements Today
1. Debugged Vapi BYO SIP Trunk errors.
2. Successfully connected SignalWire to Vapi by:
   - Creating a SIP Domain & Endpoint in SignalWire.
   - Passing *only the domain* (`ai-priya-agent-....sip.signalwire.com`) to Vapi's `IP Address/Domain` field.
   - Setting Outbound Protocol to `TCP`.
3. Created a `test.js` script and ran a Next.js local server on `localhost:3001` / `localhost:3002` (demo-agent) with the updated `.env` keys.

## Current Blocker
- **Error:** `call.in-progress.error-sip-outbound-call-failed-to-connect`
- **Why it's happening:** Vapi connects to SignalWire via SIP. By default, SignalWire does NOT route incoming SIP calls to the public mobile network (PSTN). It treats them as isolated computer-to-computer calls. (Previously, ElevenLabs worked because it used SignalWire's REST API, which auto-routes to PSTN).

## Action Plan for Tomorrow
We have two choices to start with tomorrow:
1. **The Technical Path (SignalWire):** Write a LaML (XML) routing script inside SignalWire to catch Vapi's SIP calls and manually bridge them to the mobile network.
2. **The Fast Path (Twilio):** Drop the $5 SignalWire SIP headache, upgrade the Twilio account, and use Vapi's direct "Import Twilio" button which handles all routing automatically.
