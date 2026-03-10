'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
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

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '2.5rem' }}>
      <div style={{ height: 1, background: '#1C1F1C', marginBottom: '1.5rem' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Left: big total */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexShrink: 0 }}>
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
            <CountUp end={stats.total} duration={1400} />
          </div>
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

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#1C1F1C', flexShrink: 0 }} />

        {/* Right: dept breakdown */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.1em',
            color: '#4A4F4A',
            gap: 0,
          }}
        >
          {stats.by_department.map((d, i) => (
            <span key={d.department} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <span style={{ margin: '0 1rem', color: '#2A2F2A' }}>···</span>
              )}
              <span>
                <span style={{ color: '#FF9500' }}>
                  <CountUp end={d.count} duration={1000 + i * 100} />
                </span>
                {' '}{d.department.toUpperCase()}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
