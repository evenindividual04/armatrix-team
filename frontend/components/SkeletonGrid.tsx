'use client';

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: '#111311',
        border: '1px solid #1C1F1C',
        borderLeft: '2px solid #1C1F1C',
      }}
    >
      <div className="animate-pulse h-full w-full p-5 flex flex-col gap-3">
        <div
          className="flex-1 min-h-[120px]"
          style={{ background: '#1C1F1C', borderRadius: 2 }}
        />
        <div style={{ height: 14, borderRadius: 2, background: '#1C1F1C', width: '60%' }} />
        <div style={{ height: 10, borderRadius: 2, background: 'rgba(255,149,0,0.15)', width: '45%' }} />
        <div style={{ height: 10, borderRadius: 2, background: '#161816', width: '90%' }} />
        <div style={{ height: 10, borderRadius: 2, background: '#161816', width: '75%' }} />
      </div>
    </div>
  );
}

export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[280px]">
      <SkeletonCard className="sm:col-span-2 sm:row-span-2" />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard className="sm:col-span-2" />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
