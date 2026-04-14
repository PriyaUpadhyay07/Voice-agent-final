import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms of Service</h1>
      <div style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        <p style={{ marginBottom: '1rem' }}>
          By accessing or using the Voice Calling AI Agent platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>1. Use License</h2>
        <p style={{ marginBottom: '1rem' }}>
          Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>2. Disclaimer</h2>
        <p style={{ marginBottom: '1rem' }}>
          The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'hsl(var(--card-foreground))' }}>3. Limitations</h2>
        <p style={{ marginBottom: '1rem' }}>
          In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
        </p>
      </div>
    </main>
  );
}
