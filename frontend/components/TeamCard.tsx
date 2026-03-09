'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useState } from 'react';
import type { TeamMember } from '@/types';
import SpotlightCard from './SpotlightCard';
import AvatarFallback from './AvatarFallback';
import { useTextScramble } from '@/hooks/useTextScramble';

interface Props {
  member: TeamMember;
  onClick: () => void;
  index: number;
}

const CARD_BASE = {
  background: '#111311',
  border: '1px solid #1C1F1C',
  borderLeft: '2px solid transparent',
};

const CARD_HOVER = {
  borderLeft: '2px solid #FF9500',
  background: '#151715',
  boxShadow: '0 0 40px rgba(255,149,0,0.08), 0 8px 32px rgba(0,0,0,0.5)',
  transform: 'translateY(-2px)',
};

export default function TeamCard({ member, onClick, index }: Props) {
  const [imgError, setImgError] = useState(false);
  const { displayText, scramble, reset } = useTextScramble(member.name);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    reset();
  };

  const handleMouseEnter = () => {
    scramble();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        height: '100%',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <SpotlightCard
        className="card-hover-group h-full cursor-pointer"
        style={{
          ...CARD_BASE,
          height: '100%',
          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
        }}
        hoverStyle={CARD_HOVER}
      >
        <div onClick={onClick} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 14 }}>
          {/* Index number */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: '#FF9500',
              opacity: 0.5,
              zIndex: 3,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Photo area with scanlines */}
          <div
            className="scanlines"
            style={{
              position: 'relative',
              height: 150,
              flexShrink: 0,
              borderRadius: 4,
              overflow: 'hidden',
              background: '#0D0F0D',
            }}
          >
            {!imgError ? (
              <Image
                src={member.photo_url}
                alt={member.name}
                fill
                className="photo-grayscale"
                style={{ objectFit: 'cover' }}
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <AvatarFallback name={member.name} className="w-full h-full" />
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#E8EBE8',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayText}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: '#FF9500',
                margin: '4px 0 8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {member.role}
            </p>
            {member.bio && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#7A8078',
                  fontSize: '0.75rem',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {member.bio}
              </p>
            )}
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 4 }}>
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: 6, color: '#4A4F4A', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FF9500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4A4F4A')}
                aria-label="LinkedIn"
              >
                <Linkedin size={12} />
              </a>
            )}
            {member.twitter_url && (
              <a
                href={member.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: 6, color: '#4A4F4A', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FF9500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4A4F4A')}
                aria-label="Twitter"
              >
                <Twitter size={12} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                style={{ padding: 6, color: '#4A4F4A', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FF9500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4A4F4A')}
                aria-label="Email"
              >
                <Mail size={12} />
              </a>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
