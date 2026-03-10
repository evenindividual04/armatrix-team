'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { StatsResponse } from '@/types';

function CountUp({ end, duration = 1200 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function TeamStats({ stats }: { stats: StatsResponse | null }) {
  if (!stats) return null;

  const total = stats.total;

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '2.5rem' }}>
      {/* Thin separator line above stats */}
      <div style={{ height: 1, background: '#1C1F1C', marginBottom: '1.5rem' }} />

      {/* Top: prominent total */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: '#FF9500',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          <CountUp end={total} duration={1400} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.14em',
              color: '#4A4F4A',
              textTransform: 'uppercase',
            }}
          >
            PERSONNEL ACTIVE
          </div>
        </div>
        <div style={{ flex: 1, height: 1, background: '#1C1F1C', marginLeft: '0.5rem', alignSelf: 'center' }} />
      </div>

      {/* Department fill bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {stats.by_department.map((d, i) => (
          <div key={d.department} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Label */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                color: '#4A4F4A',
                textTransform: 'uppercase',
                width: 80,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {d.department}
            </span>

            {/* Bar track */}
            <div
              style={{
                flex: 1,
                height: 2,
                background: '#1C1F1C',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#FF9500',
                  transformOrigin: 'left',
                  width: `${(d.count / total) * 100}%`,
                }}
              />
            </div>

            {/* Count */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.08em',
                color: '#FF9500',
                width: 28,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              <CountUp end={d.count} duration={1000 + i * 100} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
