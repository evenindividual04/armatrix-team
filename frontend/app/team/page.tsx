'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll } from 'framer-motion';
import { api } from '@/lib/api';
import type { TeamMember, StatsResponse } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoiseOverlay from '@/components/NoiseOverlay';
import GridBackground from '@/components/GridBackground';
import HeroSection from '@/components/HeroSection';
import TeamStats from '@/components/TeamStats';
import DepartmentFilter from '@/components/DepartmentFilter';
import TeamGrid from '@/components/TeamGrid';
import TeamMemberModal from '@/components/TeamMemberModal';
import MarqueeTicker from '@/components/MarqueeTicker';
import BootSequence from '@/components/BootSequence';

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: 2, height: '100vh', zIndex: 100, background: '#1C1F1C' }}>
      <motion.div style={{ height: '100%', scaleY: scrollYProgress, transformOrigin: 'top', background: '#FF9500' }} />
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [booted, setBooted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('armatrix-booted') === '1';
  });

  const handleBootComplete = () => {
    sessionStorage.setItem('armatrix-booted', '1');
    setBooted(true);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [membersData, statsData] = await Promise.all([
        api.getTeam(),
        api.getStats(),
      ]);
      setMembers(membersData);
      setStats(statsData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const departmentCounts =
    stats?.by_department.reduce(
      (acc, d) => {
        acc[d.department] = d.count;
        return acc;
      },
      {} as Record<string, number>
    ) ?? {};

  return (
    <main className="relative min-h-screen" style={{ background: '#080A08' }}>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <ScrollProgressBar />
      <GridBackground />
      <NoiseOverlay />
      <Navbar />

      <div className="relative z-10">
        <HeroSection memberCount={stats?.total} />
        <TeamStats stats={stats} />
        <DepartmentFilter
          active={department}
          counts={departmentCounts}
          onChange={setDepartment}
          search={search}
          onSearch={setSearch}
        />

        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <MarqueeTicker totalMembers={stats?.total} />
        </div>

        {error ? (
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              style={{ padding: '8px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#FF9500', border: '1px solid rgba(255,149,0,0.4)', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Retry
            </button>
          </div>
        ) : (
          <TeamGrid
            members={members}
            loading={loading}
            department={department}
            search={search}
            onMemberClick={setSelectedMember}
          />
        )}

        <Footer />
      </div>

      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </main>
  );
}
