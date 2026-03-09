'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const LINES = [
  { text: '> ARMATRIX OS v2.4.1', amber: false },
  { text: '> INITIALIZING PERSONNEL DATABASE...', amber: false },
  { text: '> LOADING TEAM RECORDS [██████████] 100%', amber: false },
  { text: '> CONNECTION ESTABLISHED', amber: false },
  { text: '> READY.', amber: true },
];

export default function BootSequence({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // After 1800ms start fade-out, then call onComplete
    const fadeTimer = setTimeout(() => setVisible(false), 1800);
    const doneTimer = setTimeout(onComplete, 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#080A08',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Amber progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: '#1C1F1C',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                height: '100%',
                background: '#FF9500',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Terminal lines */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              lineHeight: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.18, ease: 'easeOut' }}
                style={{ color: line.amber ? '#FF9500' : '#4A4F4A' }}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
