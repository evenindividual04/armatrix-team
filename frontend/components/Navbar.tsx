'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed top-0 left-0 right-0"
      style={{
        zIndex: 110,
        background: 'rgba(8,10,8,0.92)',
        borderBottom: '1px solid #1C1F1C',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Wordmark */}
        <Link
          href="/team"
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.04em',
            color: '#E8EBE8',
            textDecoration: 'none',
          }}
        >
          ARMATRIX<span style={{ color: '#FF9500' }}>.</span>
        </Link>

        {/* Nav links */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
          }}
        >
          <NavLink href="/team" active={pathname === '/team'}>
            TEAM
          </NavLink>
          <span style={{ color: '#1C1F1C' }}>/</span>
          <NavLink href="/admin" active={pathname === '/admin'}>
            ADMIN
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        color: active ? '#FF9500' : '#7A8078',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = '#E8EBE8';
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = '#7A8078';
      }}
    >
      {children}
    </Link>
  );
}
