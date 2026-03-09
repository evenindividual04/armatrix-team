'use client';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const DEPARTMENTS = ['All', 'Leadership', 'Engineering', 'Design', 'Operations'];

interface Props {
  active: string;
  counts: Record<string, number>;
  onChange: (dept: string) => void;
  search: string;
  onSearch: (q: string) => void;
}

export default function DepartmentFilter({ active, counts, onChange, search, onSearch }: Props) {
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1C1F1C',
          padding: '0 1.5rem',
          gap: '1rem',
        }}
      >
        {/* Department tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 2rem' }}>
          {DEPARTMENTS.map((dept) => {
            const count =
              dept === 'All'
                ? Object.values(counts).reduce((a, b) => a + b, 0)
                : counts[dept] || 0;
            const isActive = active === dept;
            return (
              <button
                key={dept}
                onClick={() => onChange(dept)}
                style={{
                  position: 'relative',
                  padding: '10px 0',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? '#E8EBE8' : '#7A8078',
                  outline: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#E8EBE8';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#7A8078';
                }}
              >
                {dept.toUpperCase()}
                <span
                  style={{
                    marginLeft: 5,
                    color: isActive ? '#FF9500' : '#4A4F4A',
                    fontSize: '0.5625rem',
                    transition: 'color 0.15s ease',
                  }}
                >
                  ({count})
                </span>

                {isActive && (
                  <motion.div
                    layoutId="filter-underline"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: '#FF9500',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search
            size={11}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: search ? '#FF9500' : '#4A4F4A',
              pointerEvents: 'none',
              transition: 'color 0.15s',
            }}
          />
          <input
            type="text"
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${search ? '#FF9500' : '#2A2F2A'}`,
              color: '#E8EBE8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.12em',
              padding: '6px 8px 6px 24px',
              width: 140,
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#FF9500'; }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = search ? '#FF9500' : '#2A2F2A'; }}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#4A4F4A',
                cursor: 'pointer',
                padding: '0 2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                lineHeight: 1,
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
