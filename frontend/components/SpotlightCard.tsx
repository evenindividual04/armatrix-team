'use client';
import { useRef, MouseEvent, ReactNode, CSSProperties, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
}

export default function SpotlightCard({ children, className = '', style, hoverStyle }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
    card.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--spotlight-opacity', '0');
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const mergedStyle: CSSProperties = {
    '--spotlight-x': '50%',
    '--spotlight-y': '50%',
    '--spotlight-opacity': '0',
    ...style,
    ...(isHovered && hoverStyle ? hoverStyle : {}),
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden ${className}`}
      style={mergedStyle}
    >
      {/* Amber spotlight gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(240px circle at var(--spotlight-x) var(--spotlight-y), rgba(255,149,0,0.06), transparent 70%)',
          opacity: 'var(--spotlight-opacity)' as string,
          transition: 'opacity 0.3s ease',
        }}
      />
      {children}
    </div>
  );
}
