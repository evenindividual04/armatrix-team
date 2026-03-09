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

  const items = [
    { label: 'TOTAL', value: stats.total },
    ...stats.by_department.map((d) => ({ label: d.department.toUpperCase(), value: d.count })),
  ];

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', marginBottom: '2rem' }}>
      {/* Thin separator line above stats */}
      <div style={{ height: 1, background: '#1C1F1C', marginBottom: '1.25rem' }} />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          color: '#7A8078',
        }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{ margin: '0 1.25rem', color: '#2A2F2A', letterSpacing: 0 }}>···</span>
            )}
            <span>
              <span style={{ color: '#FF9500', fontWeight: 500 }}>
                <CountUp end={item.value} />
              </span>
              {' '}{item.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
