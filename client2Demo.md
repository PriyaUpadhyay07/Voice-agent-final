# Client 2 - Demo Dashboard Rules & Config

Yeh file Client 2 ke Demo Dashboard setup aur details ko track karne ke liye hai.

## 👤 Client Details
* **Name**: Client 2 (Demo)
* **Email**: client2demo@example.com
* **Role**: Client
* **Status**: `demo` (Is account ka status explicitly 'demo' hai)
* **Initial Credits**: 2 Minutes ($0.20 Balance)

---

## ⚙️ Rules & Limitations (Hinglish)
1. **Lead Slice Limit**: Agar client apni CSV ya Google Sheet me 10-20 leads upload karega, toh backend code automatically leads list ko slice karke sirf pehle **2 leads** ko hi call lagayega.
2. **Credits Limit**: Demo account me strictly 2 minutes ($0.20) ki calling capacity hai. 2 calls complete hote hi credits 0 ho jayenge aur further calling block ho jayegi.
3. **Demo Warning Banner**: Screen ke top par client ko warning dikhayi jayegi: 
   *"Testing ke liye CSV/Google Sheet me sirf 1-2 leads rakhein. Campaign max 2 leads ko hi call karega. Zyada leads ke liye credits buy karein."*
4. **Upgrade to Real Dashboard**: Agar Client 2 ko demo pasand aata hai aur woh real dashboard me convert hona chahta hai, toh aapse contact karega. Uske baad aap database me unka status badal kar `active` karenge aur credits increment karenge.

---

## 🔗 Setup Command
Admin script ke through Client 2 (Demo) ko register karne ki command:
```bash
node lisa/scripts/register-user.js "Client 2 Demo" "client2demo@example.com" 2 "demo"
```
