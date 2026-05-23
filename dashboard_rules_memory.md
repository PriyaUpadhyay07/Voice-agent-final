# Client Dashboard Critical Rules (Memory)

1. **Bulk Calling**: Use VAPI's built-in bulk uploading/calling capabilities via our frontend UI.
2. **History & Transcripts**: Show real call history and transcripts on the client's dashboard fetched from VAPI.
3. **Call Tagging & Pending Section**: Tag calls (Interested, Not Interested, Pending). Create a dedicated section for "Pending" calls with a 1-click bulk re-call button.
4. **Credit System UI**: Include an "Add Credit" button. Dashboard must show real dynamic data (remaining credits/calls, deductions after every call).
5. **Revenue Split (Razorpay)**: 10-20% of added credits goes to the admin bank account, the rest buys real API credits.
6. **Supabase Integration**: Supabase MUST be the central database integrating Razorpay + VAPI + Voice Provider (11Labs/Cartesia) to ensure 100% real data rendering.
