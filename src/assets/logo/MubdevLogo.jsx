import React from 'react';

/**
 * MubdevLogo Component
 * 
 * Authentic, high-fidelity brand logo for Mubdev matching the approved design reference:
 * - Geometric cyber emblem combining coding brackets < > with stylized 'M'
 * - Glowing blue and violet spherical core aura
 * - Orbital ring surrounding the emblem with glowing node
 * - Futuristic typography wordmark (Mubdev)
 * - Optional tagline: ENGINEER • CREATE • INNOVATE
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {boolean} [props.showText=true]
 * @param {boolean} [props.showTagline=false]
 * @param {boolean} [props.inCapsule=false]
 * @param {string} [props.className='']
 */
export const MubdevLogo = ({
  size = 'md',
  showText = true,
  showTagline = false,
  inCapsule = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 30, text: '1.05rem', tagline: '0.52rem', gap: '0.5rem' },
    md: { icon: 38, text: '1.25rem', tagline: '0.62rem', gap: '0.65rem' },
    lg: { icon: 48, text: '1.55rem', tagline: '0.72rem', gap: '0.8rem' },
    xl: { icon: 60, text: '1.95rem', tagline: '0.85rem', gap: '1rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      className={`mubdev-logo-wrap ${inCapsule ? 'nav-logo-capsule' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Precision Geometric < M > Emblem with Orbital Ring & Spherical Aura */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', flexShrink: 0 }}
        aria-label="Mubdev Official Emblem"
      >
        <defs>
          {/* Spherical Glow Core */}
          <radialGradient id="mub-core-sphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#087BFF" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#713BFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020817" stopOpacity="0" />
          </radialGradient>

          {/* M Gradient */}
          <linearGradient id="mub-m-vector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="45%" stopColor="#087BFF" />
            <stop offset="100%" stopColor="#713BFF" />
          </linearGradient>

          {/* Orbital Ring Gradient */}
          <linearGradient id="mub-orbit-vector-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="50%" stopColor="#087BFF" />
            <stop offset="100%" stopColor="#713BFF" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="mub-filter-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="mub-filter-sphere" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Ambient Glowing Core Sphere */}
        <circle cx="30" cy="30" r="22" fill="url(#mub-core-sphere)" filter="url(#mub-filter-sphere)" />

        {/* Orbital Ring - Back Segment (depth behind emblem) */}
        <path
          d="M 10 39 A 25 10 32 0 1 50 21"
          fill="none"
          stroke="url(#mub-orbit-vector-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Left Coding Bracket '<' in Neon Cyan */}
        <path
          d="M 17 21 L 9 30 L 17 39"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mub-filter-glow)"
        />
        <path
          d="M 17 21 L 9 30 L 17 39"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Right Coding Bracket '>' in Neon Violet */}
        <path
          d="M 43 21 L 51 30 L 43 39"
          fill="none"
          stroke="#713BFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mub-filter-glow)"
        />
        <path
          d="M 43 21 L 51 30 L 43 39"
          fill="none"
          stroke="#E0D0FF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Stylized Geometric 'M' Emblem */}
        <path
          d="M 19 39 L 19 22 L 30 33 L 41 22 L 41 39"
          fill="none"
          stroke="url(#mub-m-vector-grad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mub-filter-glow)"
        />
        {/* Inner Glossy Highlight Line */}
        <path
          d="M 19 39 L 19 22 L 30 33 L 41 22 L 41 39"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Orbital Ring - Front Segment (loops over the bottom-left M) */}
        <path
          d="M 50 21 A 25 10 32 0 1 10 39"
          fill="none"
          stroke="url(#mub-orbit-vector-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#mub-filter-glow)"
        />
        {/* Orbiting Energy Node */}
        <circle cx="15" cy="37" r="1.8" fill="#00D9FF" filter="url(#mub-filter-glow)" />
        <circle cx="15" cy="37" r="0.9" fill="#FFFFFF" />
      </svg>

      {/* Futuristic Typography Wordmark & Optional Tagline */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', -apple-system, sans-serif)",
              fontWeight: 700,
              fontSize: currentSize.text,
              letterSpacing: '0.03em',
              lineHeight: 1.1,
              display: 'inline-flex',
              alignItems: 'baseline'
            }}
          >
            <span style={{ color: 'var(--color-white, #F5F8FF)' }}>Mub</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #00D9FF 0%, #713BFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.4))',
                marginLeft: '1px'
              }}
            >
              dev
            </span>
          </span>

          {showTagline && (
            <span
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: currentSize.tagline,
                letterSpacing: '0.12em',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '2px',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            >
              ENGINEER <span style={{ color: '#00D9FF' }}>•</span> CREATE <span style={{ color: '#713BFF' }}>•</span> INNOVATE
            </span>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

export default MubdevLogo;
