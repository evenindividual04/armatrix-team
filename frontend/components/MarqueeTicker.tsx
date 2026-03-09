'use client';

interface Props {
  totalMembers?: number;
}

const BASE_TEXT =
  'ENGINEERING · KANPUR, INDIA · SNAKE ROBOTICS · EST. 2023 · CONFINED ENVIRONMENTS · HAZARDOUS INSPECTION · ';

export default function MarqueeTicker({ totalMembers }: Props) {
  const tickerText = totalMembers !== undefined
    ? `${BASE_TEXT}${totalMembers} MEMBERS · `
    : BASE_TEXT;

  // Duplicate for seamless loop
  const content = tickerText + tickerText;

  return (
    <div
      style={{
        borderTop: '1px solid #1C1F1C',
        borderBottom: '1px solid #1C1F1C',
        padding: '8px 0',
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
        <span className="marquee-content">{content}</span>
      </div>
    </div>
  );
}
