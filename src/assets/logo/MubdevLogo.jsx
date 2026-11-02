import React from 'react';

/**
 * MubdevLogo Component
 * 
 * Reusable, scalable brand logo for Mubdev.
 * Features the geometric cyber 'M' emblem and futuristic typography.
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {boolean} [props.showText=true]
 * @param {string} [props.className='']
 */
export const MubdevLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 28, fontSize: '1rem', gap: '0.5rem' },
    md: { icon: 36, fontSize: '1.25rem', gap: '0.65rem' },
    lg: { icon: 48, fontSize: '1.65rem', gap: '0.85rem' },
    xl: { icon: 64, fontSize: '2.15rem', gap: '1rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`mubdev-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Precision Geometric Cyber 'M' Emblem */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
        aria-label="Mubdev Symbol"
      >
        <defs>
          <linearGradient id="mubdev-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="50%" stopColor="#087BFF" />
            <stop offset="100%" stopColor="#713BFF" />
          </linearGradient>

          <linearGradient id="mubdev-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#087BFF" stopOpacity="0.2" />
          </linearGradient>

          <filter id="mubdev-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Glow Aura */}
        <polygon
          points="20,82 20,28 50,56 80,28 80,82 66,82 66,50 50,65 34,50 34,82"
          fill="none"
          stroke="url(#mubdev-primary-grad)"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#mubdev-glow)"
          opacity="0.5"
        />

        {/* Core Sharp Geometric M */}
        <polygon
          points="20,82 20,28 50,56 80,28 80,82 66,82 66,50 50,65 34,50 34,82"
          fill="none"
          stroke="url(#mubdev-primary-grad)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Cyber Center Accent Diamond */}
        <polygon
          points="50,30 55,38 50,46 45,38"
          fill="#00D9FF"
          filter="url(#mubdev-glow)"
        />

        {/* Terminal Accent Node */}
        <circle cx="20" cy="28" r="4" fill="#00D9FF" />
        <circle cx="80" cy="28" r="4" fill="#713BFF" />
      </svg>

      {/* Futuristic Typography Wordmark */}
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: currentSize.fontSize,
            letterSpacing: '0.04em',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline'
          }}
        >
          <span style={{ color: 'var(--color-white, #F5F8FF)' }}>MUB</span>
          <span
            style={{
              color: 'var(--color-neon-cyan, #00D9FF)',
              textShadow: '0 0 12px rgba(0, 217, 255, 0.45)',
              marginLeft: '1px'
            }}
          >
            DEV
          </span>
        </span>
      )}
    </div>
  );
};

export default MubdevLogo;
