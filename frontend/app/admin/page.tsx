'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { TeamMember } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoiseOverlay from '@/components/NoiseOverlay';
import GridBackground from '@/components/GridBackground';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTeam();
      setMembers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <main className="relative min-h-screen" style={{ background: '#080A08' }}>
      <GridBackground />
      <NoiseOverlay />
      <Navbar />

      <div className="relative z-10" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.16em',
              color: '#FF9500', marginBottom: '1rem', textTransform: 'uppercase' }}>
              ADMIN PANEL
            </p>
            <h1 style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 0.95, color: '#E8EBE8',
              letterSpacing: '-0.01em', margin: '0 0 1rem' }}>
              TEAM <span style={{ color: '#FF9500' }}>MANAGEMENT.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: '#7A8078', lineHeight: 1.6 }}>
              Add, edit, or remove team members from the Armatrix personnel database.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
              <p style={{ color: '#7A8078', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em' }}>
                LOADING...
              </p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
              <p style={{ color: '#FF4444', marginBottom: '1rem' }}>{error}</p>
              <button
                onClick={fetchMembers}
                style={{ padding: '8px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                  letterSpacing: '0.1em', color: '#FF9500', border: '1px solid rgba(255,149,0,0.4)',
                  background: 'transparent', cursor: 'pointer' }}
              >
                RETRY
              </button>
            </div>
          ) : (
            <AdminPanel members={members} onRefresh={fetchMembers} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
