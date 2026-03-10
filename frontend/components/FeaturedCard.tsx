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
  boxShadow: '0 0 60px rgba(255,149,0,0.1), 0 8px 40px rgba(0,0,0,0.6)',
  transform: 'translateY(-3px)',
};

export default function FeaturedCard({ member, onClick, index }: Props) {
  const [imgError, setImgError] = useState(false);
  const { displayText, scramble, reset } = useTextScramble(member.name);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
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
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
        }}
        hoverStyle={CARD_HOVER}
      >
        <div onClick={onClick} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Index number */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: '#FF9500',
              opacity: 0.6,
              zIndex: 3,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Large photo area */}
          <div
            className="scanlines"
            style={{
              position: 'relative',
              height: 300,
              flexShrink: 0,
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
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                onError={() => setImgError(true)}
                unoptimized
                priority
              />
            ) : (
              <AvatarFallback name={member.name} className="w-full h-full" />
            )}
            {/* Gradient overlay + base dark tint to blend avatar light backgrounds */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.22)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #111311 0%, rgba(17,19,17,0.3) 40%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            {/* Department badge */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 4 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 10px',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  border: '1px solid rgba(255,149,0,0.4)',
                  color: '#FF9500',
                  background: 'rgba(255,149,0,0.08)',
                  textTransform: 'uppercase',
                }}
              >
                {member.department}
              </span>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  color: '#E8EBE8',
                  margin: 0,
                  lineHeight: 1.0,
                  letterSpacing: '0.01em',
                }}
              >
                {displayText}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#FF9500',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  margin: '8px 0 14px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#7A8078',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {member.bio}
              </p>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto', paddingTop: 12 }}>
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
