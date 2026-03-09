export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #1C1F1C',
        marginTop: '6rem',
        padding: '2rem 0',
      }}
    >
      <div
        style={{
          maxWidth: '90rem',
          margin: '0 auto',
          padding: '0 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.1em',
              color: '#7A8078',
            }}
          >
            © 2025 ARMATRIX TECHNOLOGIES PVT. LTD.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.1em',
              color: '#4A4F4A',
            }}
          >
            KANPUR, INDIA · $2.1M PRE-SEED · PI VENTURES
          </p>
        </div>
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, #FF9500, transparent)',
            width: 80,
            opacity: 0.4,
          }}
        />
      </div>
    </footer>
  );
}
