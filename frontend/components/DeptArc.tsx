'use client';
import { motion } from 'framer-motion';
import type { StatsResponse } from '@/types';

const SIZE = 260;
const CX = 130;
const CY = 130;
const R = 90;
const SW = 14;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP_FRACTION = 0.03;

const SEGMENT_OPACITIES = [1.0, 0.7, 0.5, 0.35, 0.25, 0.18];

interface Props {
  stats: StatsResponse | null;
}

export default function DeptArc({ stats }: Props) {
  if (!stats || stats.by_department.length === 0) return null;

  const total = stats.total;
  const depts = stats.by_department;
  const gapAngle = GAP_FRACTION * CIRCUMFERENCE;

  // Compute each segment's dasharray and dashoffset
  let cumulativeAngle = 0;
  const segments = depts.map((d, i) => {
    const fraction = d.count / total;
    const segmentLength = fraction * CIRCUMFERENCE - gapAngle;
    const startAngle = cumulativeAngle;
    cumulativeAngle += fraction * CIRCUMFERENCE;
    // Convert arc-length to radians (÷R), start from 12 o'clock (-π/2)
    const midAngle = -Math.PI / 2 + (startAngle + (fraction * CIRCUMFERENCE) / 2) / R;
    return {
      label: d.department.toUpperCase().slice(0, 8),
      count: d.count,
      dashArray: `${Math.max(0, segmentLength)} ${CIRCUMFERENCE - Math.max(0, segmentLength)}`,
      dashOffset: CIRCUMFERENCE - startAngle + CIRCUMFERENCE / 4,
      midAngle,
      opacity: SEGMENT_OPACITIES[i] ?? 0.15,
    };
  });

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible' }}
    >
      {/* Background ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#1C1F1C"
        strokeWidth={SW}
      />

      {/* Segments */}
      {segments.map((seg, i) => (
        <motion.circle
          key={seg.label}
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#FF9500"
          strokeOpacity={seg.opacity}
          strokeWidth={SW}
          strokeLinecap="butt"
          strokeDasharray={seg.dashArray}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: seg.dashOffset }}
          transition={{
            duration: 0.9,
            delay: 0.5 + i * 0.12,
            ease: 'easeOut',
          }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
      ))}

      {/* Segment labels */}
      {segments.map((seg) => {
        const labelR = R + SW / 2 + 28;
        const lx = CX + labelR * Math.cos(seg.midAngle);
        const ly = CY + labelR * Math.sin(seg.midAngle);
        const anchor = lx < CX - 4 ? 'end' : lx > CX + 4 ? 'start' : 'middle';
        return (
          <motion.g
            key={`label-${seg.label}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <text
              x={lx}
              y={ly - 3}
              textAnchor={anchor}
              fill="#8A9088"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.1em' }}
            >
              {seg.label}
            </text>
            <text
              x={lx}
              y={ly + 8}
              textAnchor={anchor}
              fill="#FF9500"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.05em' }}
            >
              {seg.count}
            </text>
          </motion.g>
        );
      })}

      {/* Center: total count */}
      <motion.text
        cx={CX}
        cy={CY}
        x={CX}
        y={CY - 4}
        textAnchor="middle"
        dominantBaseline="auto"
        fill="#FF9500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          fontFamily: 'var(--font-barlow-condensed)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        {total}
      </motion.text>
      <motion.text
        x={CX}
        y={CY + 18}
        textAnchor="middle"
        fill="#6A7068"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.14em' }}
      >
        PERSONNEL
      </motion.text>
    </svg>
  );
}
