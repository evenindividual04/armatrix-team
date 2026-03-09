'use client';
import { motion } from 'framer-motion';
import ArmSchematic from './ArmSchematic';

interface Props {
  memberCount?: number;
}

export default function HeroSection({ memberCount }: Props) {
  return (
    <section className="scanlines relative pt-32 pb-10">
      {/* Ghost background number */}
      {memberCount !== undefined && (
        <div
          style={{
            position: 'absolute',
            right: '-2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-barlow-condensed)',
            fontWeight: 800,
            fontSize: 'clamp(12rem, 22vw, 20rem)',
            color: '#E8EBE8',
            opacity: 0.03,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          {memberCount}
        </div>
      )}

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>

        {/* Left: text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top mono label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              color: '#3A3F3A',
              marginBottom: '3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>ARMATRIX / TEAM DATABASE / 2024</span>
            <span style={{ flex: 1, height: 1, maxWidth: 160, background: '#1C1F1C' }} />
          </motion.div>

          {/* Small amber label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.16em',
              color: '#FF9500',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            PERSONNEL DATABASE
          </motion.p>

          {/* Stacked heading */}
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontWeight: 800,
              fontSize: 'clamp(4rem, 9vw, 8rem)',
              lineHeight: 0.9,
              color: '#E8EBE8',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {['MEET', 'THE TEAM.'].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: 'block' }}
              >
                {i === 1 ? (
                  <>THE <span style={{ color: '#FF9500' }}>TEAM.</span></>
                ) : line}
              </motion.div>
            ))}
          </h1>

          {/* Amber underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            style={{
              height: 2,
              width: 100,
              marginTop: '1.75rem',
              background: 'linear-gradient(90deg, #FF9500, transparent)',
              transformOrigin: 'left',
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: '#7A8078',
              lineHeight: 1.75,
              marginTop: '1.5rem',
              maxWidth: '36rem',
            }}
          >
            The minds building the future of industrial robotics —
            snake-like robotic arms for confined hazardous environments.
          </motion.p>
        </div>

        {/* Right: arm schematic */}
        <div className="hero-schematic">
          <ArmSchematic />
        </div>

      </div>
    </section>
  );
}
