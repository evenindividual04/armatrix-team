'use client';
import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TeamMember } from '@/types';
import TeamCard from './TeamCard';
import FeaturedCard from './FeaturedCard';
import WideCard from './WideCard';
import SkeletonGrid from './SkeletonGrid';

interface Props {
  members: TeamMember[];
  loading: boolean;
  department: string;
  search: string;
  onMemberClick: (member: TeamMember) => void;
}

export default function TeamGrid({
  members,
  loading,
  department,
  search,
  onMemberClick,
}: Props) {
  const filtered = useMemo(() => {
    let result = department === 'All' ? members : members.filter((m) => m.department === department);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) =>
        m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
      );
    }
    return result;
  }, [members, department, search]);

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="__loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SkeletonGrid />
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}
          >
            <p style={{ color: '#7A8078', fontSize: '1.125rem' }}>
              {search.trim()
                ? `No results for "${search}".`
                : `No team members in ${department} yet.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              gridAutoRows: '280px',
              gridAutoFlow: 'dense',
            }}
            className="grid-mobile"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((member, i) => {
                const isWide = member.card_size === 'wide';
                const isFeatured = member.card_size === 'featured';
                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{
                      gridColumn: isWide || isFeatured ? 'span 2' : undefined,
                      gridRow: isFeatured ? 'span 2' : undefined,
                      height: '100%',
                    }}
                  >
                    {isFeatured ? (
                      <FeaturedCard
                        member={member}
                        onClick={() => onMemberClick(member)}
                        index={i}
                      />
                    ) : isWide ? (
                      <WideCard
                        member={member}
                        onClick={() => onMemberClick(member)}
                        index={i}
                      />
                    ) : (
                      <TeamCard
                        member={member}
                        onClick={() => onMemberClick(member)}
                        index={i}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
