import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      <div style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p style={{ marginBottom: '1rem' }}>
          Welcome to our Voice Calling AI Agent platform. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our service.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>1. Personal Information We Collect</h2>
        <p style={{ marginBottom: '1rem' }}>
          When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>2. How We Use Your Personal Information</h2>
        <p style={{ marginBottom: '1rem' }}>
          We use the information that we collect generally to fulfill any requests placed through the site (including processing your data for voice calling automation).
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>3. Data Retention</h2>
        <p style={{ marginBottom: '1rem' }}>
          When you use our service, we will maintain your related Information for our records unless and until you ask us to delete this information.
        </p>
      </div>
    </main>
  );
}
