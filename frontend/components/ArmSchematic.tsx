'use client';
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Bezier helpers ───────────────────────────────────────────────────────────
function bp(t: number, a: number, b: number, c: number, d: number) {
  const u = 1 - t;
  return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d;
}
function bt(t: number, a: number, b: number, c: number, d: number) {
  const u = 1 - t;
  return 3*u*u*(b-a) + 6*u*t*(c-b) + 3*t*t*(d-c);
}

// ─── Arm constants ────────────────────────────────────────────────────────────
// ViewBox: 300 × 480. Base at centre-bottom. The arm forms a full S-curve:
// lower half leans RIGHT, upper half sweeps back LEFT, like a snake threading
// through a confined channel between the two wall guides.

const N       = 16;
const SEG_W   = 6.5;
const SEG_H   = 12;
const SEG_RX  = 2.5;

const BASE        = { x: 150, y: 428 };
const CP1         = { x: 240, y: 265 }; // pulls arm RIGHT at the bottom
const CP2         = { x:  55, y: 130 }; // sweeps arm back LEFT at the top
const DEFAULT_END = { x: 145, y:  62 }; // ends near centre-top

// CP2_FLEX: how much CP2 shifts relative to the cursor delta so that the
// whole arm flexes, not just the last few segments.
const CP2_FLEX = 0.52;

interface Seg { x: number; y: number; angle: number }

function computeArm(
  ex: number, ey: number,
  cp2x = CP2.x, cp2y = CP2.y,
): Seg[] {
  return Array.from({ length: N }, (_, i) => {
    const t  = i / (N - 1);
    const x  = bp(t, BASE.x, CP1.x, cp2x, ex);
    const y  = bp(t, BASE.y, CP1.y, cp2y, ey);
    const tx = bt(t, BASE.x, CP1.x, cp2x, ex);
    const ty = bt(t, BASE.y, CP1.y, cp2y, ey);
    const angle = Math.atan2(ty, tx) * 180 / Math.PI + 90;
    return { x, y, angle };
  });
}

const SPECS = [
  { label: 'REACH', value: '1.2M' },
  { label: 'DOF',   value: '12'   },
  { label: 'SEGS',  value: '16'   },
  { label: 'IP',    value: '68'   },
  { label: 'Ø DIA', value: '38MM' },
];

export default function ArmSchematic() {
  // ── Spring-tracked end effector ──────────────────────────────────────────
  const rawX = useMotionValue(DEFAULT_END.x);
  const rawY = useMotionValue(DEFAULT_END.y);
  const endX = useSpring(rawX, { stiffness: 100, damping: 20, mass: 0.9 });
  const endY = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.9 });

  const offX = useTransform(endX, (x) => x - DEFAULT_END.x);
  const offY = useTransform(endY, (y) => y - DEFAULT_END.y);

  // ── Segments (recomputed whenever the spring changes) ────────────────────
  const [segs, setSegs] = useState<Seg[]>(() => computeArm(DEFAULT_END.x, DEFAULT_END.y));
  useEffect(() => {
    const update = () => {
      const ex = endX.get(), ey = endY.get();
      const dx = ex - DEFAULT_END.x,  dy = ey - DEFAULT_END.y;
      // Shift CP2 proportionally so the whole arm flexes, not just the tip
      setSegs(computeArm(ex, ey, CP2.x + dx * CP2_FLEX, CP2.y + dy * CP2_FLEX));
    };
    const unsubX = endX.on('change', update);
    const unsubY = endY.on('change', update);
    return () => { unsubX(); unsubY(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hover ────────────────────────────────────────────────────────────────
  const [hoveredSeg, setHoveredSeg] = useState<number | null>(null);

  // ── Mouse ────────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left)  / rect.width)  * 300;
    const svgY = ((e.clientY - rect.top)   / rect.height) * 480;
    const R = 35;
    rawX.set(DEFAULT_END.x + Math.max(-R, Math.min(R, svgX - DEFAULT_END.x)));
    rawY.set(DEFAULT_END.y + Math.max(-R, Math.min(R, svgY - DEFAULT_END.y)));
  };
  const handleMouseLeave = () => { rawX.set(DEFAULT_END.x); rawY.set(DEFAULT_END.y); };

  const isAmber = (i: number) => i >= N * 0.5;

  return (
    <svg
      viewBox="0 0 300 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: 'auto', cursor: 'crosshair' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Channel wall guides ─────────────────────────────────────────── */}
      {[55, 262].map((x) => (
        <g key={x}>
          <line x1={x} y1={22} x2={x} y2={445} stroke="#1C1F1C" strokeWidth="0.5" strokeDasharray="4 5" />
          <text x={x} y={17} textAnchor="middle" fontSize="4.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1" fill="#1C1F1C">WALL</text>
        </g>
      ))}

      {/* ── Model tag ───────────────────────────────────────────────────── */}
      <motion.text
        x={150} y={12} textAnchor="middle"
        fontSize="5.5" fontFamily="JetBrains Mono, monospace" letterSpacing="2"
        fill="#FF9500" fillOpacity={0.4}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        ARMATRIX · SR-7
      </motion.text>

      {/* ── Cylinder base (3-D drum) ─────────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        {/* body */}
        <rect x={84} y={436} width={56} height={32} fill="#0D0F0D" stroke="#1C1F1C" strokeWidth="0.75" />
        {/* top cap */}
        <ellipse cx={112} cy={436} rx={28} ry={7} fill="#141614" stroke="#252825" strokeWidth="0.75" />
        {/* bottom rim */}
        <ellipse cx={112} cy={468} rx={28} ry={5} fill="#0A0C0A" stroke="#1C1F1C" strokeWidth="0.5" />
        {/* logo */}
        <text x={112} y={455} textAnchor="middle" fontSize="4.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1" fill="#252825">SR-7</text>
        {/* stem */}
        <line x1={112} y1={428} x2={112} y2={436} stroke="#1C1F1C" strokeWidth="1" />
      </motion.g>

      {/* ── Arm vertebrae ────────────────────────────────────────────────── */}
      {segs.map((s, i) => {
        const amber   = isAmber(i);
        const isHov   = hoveredSeg === i;
        const dimmed  = hoveredSeg !== null && Math.abs(i - hoveredSeg) > 2;
        const fill    = amber
          ? (isHov ? 'rgba(255,149,0,0.28)' : 'rgba(255,149,0,0.13)')
          : (isHov ? '#242624' : '#141614');
        const stroke  = amber
          ? (isHov ? '#FF9500' : 'rgba(255,149,0,0.55)')
          : (isHov ? '#3A3F3A' : '#1C1F1C');
        const sw = amber ? (isHov ? 1.0 : 0.65) : 0.5;

        return (
          <motion.rect
            key={i}
            x={s.x - SEG_W / 2}
            y={s.y - SEG_H / 2}
            width={SEG_W}
            height={SEG_H}
            rx={SEG_RX}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            transform={`rotate(${s.angle}, ${s.x}, ${s.y})`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: dimmed ? 0.18 : 1, scale: isHov ? 1.3 : 1 }}
            transition={{
              opacity: { duration: 0.15 },
              scale:   { type: 'spring', stiffness: 320, damping: 22 },
              default: { delay: 0.12 + i * 0.075, duration: 0.22 },
            }}
            style={{ cursor: 'pointer', transformOrigin: `${s.x}px ${s.y}px` }}
            onMouseEnter={() => setHoveredSeg(i)}
            onMouseLeave={() => setHoveredSeg(null)}
          />
        );
      })}

      {/* ── BASE label ──────────────────────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <line
          x1={segs[0]?.x ?? BASE.x} y1={segs[0]?.y ?? BASE.y}
          x2={(segs[0]?.x ?? BASE.x) + 28} y2={segs[0]?.y ?? BASE.y}
          stroke="#252825" strokeWidth="0.5" strokeDasharray="2 3"
        />
        <text
          x={(segs[0]?.x ?? BASE.x) + 32} y={(segs[0]?.y ?? BASE.y) + 3}
          textAnchor="start" fontSize="5.5" fontFamily="JetBrains Mono, monospace"
          letterSpacing="0.5" fill="#3A3F3A"
        >
          BASE
        </text>
      </motion.g>

      {/* ── MID label ───────────────────────────────────────────────────── */}
      {(() => {
        const mid = segs[Math.floor(N / 2)];
        if (!mid) return null;
        return (
          <motion.g
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <line
              x1={mid.x} y1={mid.y}
              x2={mid.x + 28} y2={mid.y}
              stroke="#252825" strokeWidth="0.5" strokeDasharray="2 3"
            />
            <text
              x={mid.x + 32} y={mid.y + 3}
              textAnchor="start" fontSize="5.5" fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.5" fill="rgba(255,149,0,0.55)"
            >
              SEG·08
            </text>
          </motion.g>
        );
      })()}

      {/* ── END·EFF label + target (springs with cursor) ────────────────── */}
      <motion.g
        style={{ x: offX, y: offY }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        {/* pulsing target ring */}
        <motion.circle
          cx={DEFAULT_END.x} cy={DEFAULT_END.y} r={15}
          stroke="#FF9500" strokeWidth="0.5" fill="none" strokeDasharray="3 4"
          animate={{ strokeOpacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* crosshair — up, right, left */}
        <line x1={DEFAULT_END.x}      y1={DEFAULT_END.y - 19} x2={DEFAULT_END.x}      y2={DEFAULT_END.y - 10} stroke="#FF9500" strokeWidth="0.5" strokeOpacity={0.5} />
        <line x1={DEFAULT_END.x + 19} y1={DEFAULT_END.y}      x2={DEFAULT_END.x + 10} y2={DEFAULT_END.y}      stroke="#FF9500" strokeWidth="0.5" strokeOpacity={0.5} />
        <line x1={DEFAULT_END.x - 19} y1={DEFAULT_END.y}      x2={DEFAULT_END.x - 10} y2={DEFAULT_END.y}      stroke="#FF9500" strokeWidth="0.5" strokeOpacity={0.5} />
        {/* labels */}
        <text
          x={DEFAULT_END.x + 20} y={DEFAULT_END.y + 3}
          textAnchor="start" fontSize="5.5" fontFamily="JetBrains Mono, monospace"
          letterSpacing="0.5" fill="#FF9500" fillOpacity={0.7}
        >
          END·EFF
        </text>
        <text
          x={DEFAULT_END.x + 20} y={DEFAULT_END.y + 11}
          textAnchor="start" fontSize="4" fontFamily="JetBrains Mono, monospace"
          fill="#FF9500" fillOpacity={0.35}
        >
          TARGET
        </text>
      </motion.g>

      {/* ── Hover tooltip ────────────────────────────────────────────────── */}
      {hoveredSeg !== null && segs[hoveredSeg] && (() => {
        const s     = segs[hoveredSeg]!;
        const amber = isAmber(hoveredSeg);
        const label =
          hoveredSeg === 0     ? 'BASE'    :
          hoveredSeg === N - 1 ? 'END·EFF' :
          `SEG·${String(hoveredSeg).padStart(2, '0')}`;
        const deg = Math.round((s.angle - 90 + 360) % 360);
        // Place tooltip opposite the arm direction to avoid overlap
        const tx = s.x + (s.x < 150 ? 14 : -14);
        const anchor = s.x < 150 ? 'start' : 'end';
        return (
          <g style={{ pointerEvents: 'none' }}>
            <text x={tx} y={s.y - 3} textAnchor={anchor} fontSize="5.5"
              fontFamily="JetBrains Mono, monospace" letterSpacing="0.4"
              fill={amber ? '#FF9500' : '#3A3F3A'} fillOpacity={0.9}>
              {label}
            </text>
            <text x={tx} y={s.y + 5} textAnchor={anchor} fontSize="4"
              fontFamily="JetBrains Mono, monospace"
              fill={amber ? '#FF9500' : '#3A3F3A'} fillOpacity={0.5}>
              {deg}°
            </text>
          </g>
        );
      })()}

      {/* ── Spec panel (left column) ────────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
      >
        <line x1={8} y1={198} x2={48} y2={198} stroke="#1C1F1C" strokeWidth="0.5" />
        {SPECS.map((s, i) => (
          <g key={i}>
            <text x={8} y={206 + i * 21} fontSize="4" fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.5" fill="#252825">{s.label}</text>
            <text x={8} y={214 + i * 21} fontSize="5" fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.5" fill="#3A3F3A">{s.value}</text>
          </g>
        ))}
      </motion.g>

      {/* ── Dimension line (right edge) ──────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      >
        <line x1={282} y1={58}  x2={282} y2={428} stroke="#1C1F1C" strokeWidth="0.5" />
        <line x1={277} y1={58}  x2={287} y2={58}  stroke="#1C1F1C" strokeWidth="0.5" />
        <line x1={277} y1={428} x2={287} y2={428} stroke="#1C1F1C" strokeWidth="0.5" />
        <text x={290} y={246} fontSize="4.5" fontFamily="JetBrains Mono, monospace"
          fill="#252825" transform="rotate(90 290 246)">1200MM</text>
      </motion.g>
    </svg>
  );
}
