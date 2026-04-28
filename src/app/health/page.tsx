export default function HealthPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>System Health Check</h1>
      <p>If you see this page, the deployment was successful!</p>
      <p>Now check <a href="/api/health">/api/health</a> to see your keys.</p>
    </div>
  );
}
