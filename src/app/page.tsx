import Link from 'next/link';
import { PhoneCall, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <PhoneCall size={48} color="hsl(var(--primary))" style={{ marginBottom: '1rem', width: '100%' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Voice Calling AI Agent</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Automate your cold outreach with an intelligent, conversational AI that never needs a break. Log in to your portal below.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/admin" className="btn-primary" style={{ flex: 1 }}>
            <ShieldCheck size={20} />
            Admin Portal
          </Link>
          <Link href="/client" className="btn-outline" style={{ flex: 1 }}>
            <Users size={20} />
            Client Portal
          </Link>
        </div>
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</Link>
        </div>
        <p style={{ marginTop: '1rem' }}>© {new Date().getFullYear()} Voice Calling AI Agent. All rights reserved.</p>
      </footer>
    </main>
  );
}
