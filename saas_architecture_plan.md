# Lisa AI - SaaS Architecture & Logic Plan

This document contains the core logic and architecture plan for scaling the Voice Agent into a Multi-Tenant SaaS application.

## 1. Core Architecture (Centralized Multi-Tenant)
* **Rule:** NEVER create separate projects (Vapi/Supabase/Twilio) for each user.
* **Solution:** Build a **Centralized System** using **Supabase RLS (Row Level Security)**.
* **How it works:**
    * 1 Codebase, 1 URL (`app.yourdomain.com`).
    * 1 Supabase Project, 1 Vapi Account, 1 Twilio Master Account, 1 Razorpay Account.
    * Supabase RLS ensures: *"User can only read/write data where user_id = unka khud ka ID"*. Database level par lock lagne se kisi ka data leak nahi hoga.
    * API Keys (`VAPI_PRIVATE_KEY`, etc.) sirf backend `.env` mein rahengi.

## 2. Dynamic Scripts (Script Update Problem)
* **Problem:** Har user ki alag script hoti hai, Vapi dashboard mein bar-bar update nahi kar sakte.
* **Solution:** `assistantOverrides` ka use karein.
* Jab backend Vapi API hit karega, toh AI Agent wahi rahega par script sirf uss call ke liye override ho jayegi:

```json
// Payload for POST https://api.vapi.ai/call/phone
{
  "phoneNumberId": "your-twilio-number-id",
  "customer": { "number": "+1234567890" },
  "assistantId": "your-base-assistant-id",
  "assistantOverrides": {
    "model": {
      "messages": [
        { "role": "system", "content": "USER_KI_CUSTOM_SCRIPT_YAHAN_AAYEGI" }
      ]
    }
  }
}
```

## 3. Multiple Scripts Per User (Campaign System)
* **Problem:** 1 User multiple scripts/campaigns kaise banayega?
* **Solution:** Supabase mein `Campaigns` naam ka table banayein.
* **Structure:** `id`, `user_id`, `campaign_name`, `script_text`.
* User apni dashboard se 100 campaigns bana sakta hai. Jab call start hogi, backend uss specific campaign ka `script_text` uthayega aur `assistantOverrides` mein pass kar dega.

## 4. User Sessions (Login/Signup)
* **Solution:** **Supabase Auth** use karein.
* Supabase dashboard mein `JWT Expiry` ko 30 days (2592000 seconds) set kar dein. User 30 din tak logged in rahega.

## 5. Credit System & Profit Logic
* **Rule:** Razorpay ka paisa direct Twilio/Vapi mat bhejein.
* **Step 1 (Your Costs):** Apne Vapi aur Twilio accounts mein apna (company ka) Credit/Debit card lagayein aur **"Auto-Recharge"** ON karein. Apka kharcha backend mein yahan se ktega (~$0.065 per min).
* **Step 2 (User Pricing):** User ko **"Minutes"** bechein, dollar cost nahi. (e.g., $1 = 10 Minutes).
* **Step 3 (Workflow):**
    1. User Razorpay pe $10 pay karta hai. Paisa aapke bank mein aata hai.
    2. Razorpay webhook trigger hota hai.
    3. Backend user ke Supabase mein `Credits = 100 Minutes` add kar deta hai.
    4. Call hone ke baad, Vapi ka webhook batata hai ki "Call 2 min chali".
    5. Backend user ke account se 2 Minutes minus kar deta hai.
    6. Dashboard mein user ko dikhta hai: *"Call duration: 2 mins | Deducted: 2 mins"*. Usko kabhi exact API cost nahi dikhega.
