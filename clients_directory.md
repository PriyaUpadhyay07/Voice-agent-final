# Clients Directory

Is file me aapke saare active, demo aur pending clients ki details aur rules centralized form me list kiye gaye hain.

## 👥 Client List & Status Table

| Client Name | Email | Status | Link / User ID | Shared With | Platform | Custom Settings / Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Riya (Tira Beauty)** | `riya43upadhyay@gmail.com` | `active` | [cmplclmxv0000xbavsd7ozeb6](https://voice-agent-final-hfv9.vercel.app/cmplclmxv0000xbavsd7ozeb6) | - | - | Cartesia voice provider, custom script & FAQs for beauty products |
| **Demo Dashboard (Client 1)** | `demo.client@lisa-ai.com` | `active` | [demo](https://voice-agent-final.vercel.app/demo) / [cmql8v7y90000secmfho3mukx](https://voice-agent-final-hfv9.vercel.app/cmql8v7y90000secmfho3mukx) | **Samuel Heenan** | **LinkedIn** | Standard demo client with ~88 credits remaining |
| **Client 2 Demo** | `client2demo@example.com` | `demo` | [cmqrxeku400009xsoxizopojm](https://voice-agent-final-hfv9.vercel.app/cmqrxeku400009xsoxizopojm) | **Hoshang (Hank) Vashissht**<br>**Shahzad Shaikh** | **LinkedIn**<br>**WhatsApp** | Limited to 2 calls max per campaign, dynamic warning banner active |
| **Ghulam Abbas** | `ghulam.abbas@demo.com` | `demo` | [cmr1n0o2100006r1rixz2gbt9](https://voice-agent-final-hfv9.vercel.app/cmr1n0o2100006r1rixz2gbt9) | - | **LinkedIn** | Standard demo client with 2 credits remaining, limited to 2 calls max per campaign |
| **Priya** | `upadhyaypriya974@gmail.com` | `pending` | [cmp41adpl0000rxkpm9mykjk9](https://voice-agent-final-hfv9.vercel.app/cmp41adpl0000rxkpm9mykjk9) | - | - | Admin/Developer profile |
| **ishu** | `upadhyaykanu4@gmail.com` | `pending` | [cmoe9ganf0000n1dn9gx3ko6f](https://voice-agent-final-hfv9.vercel.app/cmoe9ganf0000n1dn9gx3ko6f) | - | - | Pending onboarding |
| **priya 2** | `webdesignerpriya73@gmail.com` | `pending` | [cmocwumvl00002wo2cy5kv957](https://voice-agent-final-hfv9.vercel.app/cmocwumvl00002wo2cy5kv957) | - | - | Custom script for voice calling selling agent |
| **priya** | `upadhyaypriya479@gmail.com` | `pending` | [cmocru6r00000p16f3jhops3c](https://voice-agent-final-hfv9.vercel.app/cmocru6r00000p16f3jhops3c) | - | - | Admin backup profile |

---

## 🛠️ Update Kaise Karein?
Jab bhi koi client demo se real dashboard par shift hota hai:
1. **Database Update:** Admin script ko run karke status update karein:
   ```bash
   node lisa/scripts/register-user.js "Name" "email@example.com" 100 "active"
   ```
2. **Table Update:** Is file (`clients_directory.md`) me us client ki entry ka Status change karke `active` likh dein.
