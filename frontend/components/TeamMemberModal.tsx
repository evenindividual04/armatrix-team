'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Twitter, Mail } from 'lucide-react';
import Image from 'next/image';
import type { TeamMember } from '@/types';
import AvatarFallback from './AvatarFallback';

interface Props {
  member: TeamMember | null;
  onClose: () => void;
}

export default function TeamMemberModal({ member, onClose }: Props) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (member) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [member]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(8,10,8,0.85)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl overflow-hidden"
            style={{
              background: '#111311',
              border: '1px solid #1C1F1C',
              borderLeft: '2px solid #FF9500',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 10,
                padding: 8,
                background: 'transparent',
                border: '1px solid #1C1F1C',
                color: '#4A4F4A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#FF9500';
                (e.currentTarget as HTMLElement).style.borderColor = '#FF9500';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#4A4F4A';
                (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Photo */}
              <div
                className="scanlines relative flex-shrink-0"
                style={{
                  height: 240,
                  background: '#0D0F0D',
                }}
              >
                <div className="modal-photo-wrap">
                  {!imgError ? (
                    <Image
                      src={member.photo_url}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      onError={() => setImgError(true)}
                      unoptimized
                    />
                  ) : (
                    <AvatarFallback name={member.name} className="w-full h-full" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '28px 28px 28px 24px' }}>
                {/* Department label */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.14em',
                    color: '#FF9500',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {member.department}
                </div>

                {/* Name */}
                <h2
                  style={{
                    fontFamily: 'var(--font-barlow-condensed)',
                    fontWeight: 800,
                    fontSize: '2rem',
                    color: '#E8EBE8',
                    lineHeight: 1.0,
                    margin: '0 0 6px',
                    letterSpacing: '0.01em',
                  }}
                >
                  {member.name}
                </h2>

                {/* Role */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: '#7A8078',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 16,
                  }}
                >
                  {member.role}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: '#1C1F1C', marginBottom: 16 }} />

                {/* Bio */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#7A8078',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    marginBottom: 20,
                  }}
                >
                  {member.bio}
                </p>

                {/* Social links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.1em',
                        color: '#4A4F4A',
                        border: '1px solid #1C1F1C',
                        textDecoration: 'none',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#FF9500';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#4A4F4A';
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.1em',
                        color: '#4A4F4A',
                        border: '1px solid #1C1F1C',
                        textDecoration: 'none',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#FF9500';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#4A4F4A';
                        (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
                      }}
                    >
                      <Twitter size={11} /> TWITTER
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.1em',
                        color: '#4A4F4A',
                        border: '1px solid #1C1F1C',
                        textDecoration: 'none',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#FF9500';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#4A4F4A';
                        (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C';
                      }}
                    >
                      <Mail size={11} /> EMAIL
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
