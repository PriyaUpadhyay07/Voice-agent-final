async function main() {
  try {
    const res = await fetch('https://voice-agent-final-hfv9.vercel.app/api/clients');
    if (!res.ok) {
      console.error("HTTP ERROR:", res.status);
      const text = await res.text();
      console.error(text);
      return;
    }
    const data = await res.json();
    console.log("VERCEL LIVE CLIENTS:");
    console.log(JSON.stringify(data.map(c => ({ id: c.id, name: c.name, email: c.email, role: c.role })), null, 2));
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}
main();
