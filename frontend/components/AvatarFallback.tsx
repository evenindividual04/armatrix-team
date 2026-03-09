'use client';

const GRADIENTS = [
  'from-amber-700 to-orange-800',
  'from-stone-700 to-neutral-800',
  'from-yellow-700 to-amber-800',
  'from-orange-700 to-red-800',
  'from-zinc-700 to-stone-800',
];

interface Props {
  name: string;
  className?: string;
}

export default function AvatarFallback({ name, className = '' }: Props) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const gradient = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <span
        className="font-bold text-white"
        style={{
          fontFamily: 'var(--font-barlow-condensed)',
          fontWeight: 800,
          letterSpacing: '0.04em',
          fontSize: 'clamp(1rem, 4vw, 2rem)',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
