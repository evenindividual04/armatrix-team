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
            key={department}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              gridAutoRows: '280px',
              gridAutoFlow: 'dense',
            }}
            className="grid-mobile"
          >
            {filtered.map((member, i) => {
              if (member.card_size === 'featured') {
                return (
                  <FeaturedCard
                    key={member.id}
                    member={member}
                    onClick={() => onMemberClick(member)}
                    index={i}
                  />
                );
              }
              if (member.card_size === 'wide') {
                return (
                  <WideCard
                    key={member.id}
                    member={member}
                    onClick={() => onMemberClick(member)}
                    index={i}
                  />
                );
              }
              return (
                <TeamCard
                  key={member.id}
                  member={member}
                  onClick={() => onMemberClick(member)}
                  index={i}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
