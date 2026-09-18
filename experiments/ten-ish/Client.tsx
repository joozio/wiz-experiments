'use client';

export default function TenIshClient() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#1a1a2e', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src="/ten-ish/"
        title="Ten-ish — A Number Card Roguelike"
        style={{
          flex: 1,
          border: 'none',
          width: '100%',
          height: '100%',
        }}
        allow="fullscreen"
      />
    </div>
  );
}
