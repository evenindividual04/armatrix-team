'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useState } from 'react';
import { useTextScramble } from '@/hooks/useTextScramble';
import type { TeamMember } from '@/types';
import SpotlightCard from './SpotlightCard';
import AvatarFallback from './AvatarFallback';

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

export default function WideCard({ member, onClick, index }: Props) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{
        height: '100%',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={scramble}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); reset(); }}
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
        <div onClick={onClick} className="wide-card-inner">
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

          {/* Photo */}
          <div className="scanlines wide-card-photo" style={{ position: 'relative' }}>
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
            {/* Dark overlay to blend light avatar backgrounds into the dark card */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 1, pointerEvents: 'none' }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, padding: '24px 24px 24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  color: '#7A8078',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {member.department}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#E8EBE8',
                  margin: '6px 0 4px',
                  lineHeight: 1.05,
                  letterSpacing: '0.01em',
                }}
              >
                {displayText}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: '#FF9500',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#7A8078',
                  fontSize: '0.8125rem',
                  lineHeight: 1.65,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {member.bio}
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    color: '#7A8078',
                    border: '1px solid #1C1F1C',
                    background: 'transparent',
                    textDecoration: 'none',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#FF9500';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7A8078';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
                  }}
                >
                  <Linkedin size={11} /> LINKEDIN
                </a>
              )}
              {member.twitter_url && (
                <a
                  href={member.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    color: '#7A8078',
                    border: '1px solid #1C1F1C',
                    background: 'transparent',
                    textDecoration: 'none',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#FF9500';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7A8078';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
                  }}
                >
                  <Twitter size={11} /> TWITTER
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    color: '#7A8078',
                    border: '1px solid #1C1F1C',
                    background: 'transparent',
                    textDecoration: 'none',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#FF9500';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7A8078';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
                  }}
                >
                  <Mail size={11} /> EMAIL
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
