'use client';

interface Props {
  totalMembers?: number;
}

const ITEMS = [
  { text: 'SNAKE-ARM ROBOTICS', highlight: true },
  { text: 'KANPUR, INDIA' },
  { text: 'EST. 2023', highlight: true },
  { text: 'CONFINED SPACE INSPECTION' },
  { text: 'HAZARDOUS ENVIRONMENTS', highlight: true },
  { text: 'ISRO COLLABORATION' },
  { text: 'MODULAR ACTUATORS', highlight: true },
  { text: 'REAL-TIME FIRMWARE' },
  { text: 'ROS2 STACK', highlight: true },
  { text: 'COMPLIANT MECHANISMS' },
  { text: 'AI-GUIDED NAVIGATION', highlight: true },
  { text: 'INDUSTRIAL SAFETY' },
];

function buildTickerItems(totalMembers?: number) {
  const items = [...ITEMS];
  if (totalMembers !== undefined) {
    items.splice(2, 0, { text: `${totalMembers} PERSONNEL`, highlight: true });
  }
  return items;
}

export default function MarqueeTicker({ totalMembers }: Props) {
  const items = buildTickerItems(totalMembers);

  const renderItems = (keyPrefix: string) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span
          style={{
            color: item.highlight ? '#FF9500' : '#4A4F4A',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            letterSpacing: '0.14em',
            whiteSpace: 'nowrap',
          }}
        >
          {item.text}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: item.highlight ? 'rgba(255,149,0,0.5)' : '#2A2F2A',
            margin: '0 1.25rem',
            flexShrink: 0,
          }}
        />
      </span>
    ));

  return (
    <div
      style={{
        borderTop: '1px solid #1C1F1C',
        borderBottom: '1px solid #1C1F1C',
        padding: '9px 0',
        marginBottom: '1.5rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to right, #080A08, transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to left, #080A08, transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="marquee-track">
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {renderItems('a')}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {renderItems('b')}
        </span>
      </div>
    </div>
  );
}
