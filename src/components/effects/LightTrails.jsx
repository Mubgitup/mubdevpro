import React from 'react';

/**
 * LightTrails Component
 * 
 * Renders flowing neon cyan and violet light trails with subtle organic paths,
 * recreating the futuristic energy flows of the Mubdev design reference.
 */
export const LightTrails = () => {
  return (
    <div
      className="mub-light-trails"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.55 }}
      >
        <defs>
          {/* Gradient 1: Neon Cyan to Electric Blue */}
          <linearGradient id="trail-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#087BFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#713BFF" stopOpacity="0" />
          </linearGradient>

          {/* Gradient 2: Violet to Cyan */}
          <linearGradient id="trail-violet-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#713BFF" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#087BFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="trail-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Trail Path 1: Flowing from top left across hero right */}
        <path
          d="M -100 150 C 300 80, 650 350, 1100 180 C 1300 100, 1500 250, 1600 400"
          stroke="url(#trail-cyan-blue)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#trail-glow)"
          className="animated-trail-1"
        />

        {/* Trail Path 2: Complementary secondary trail sweeping diagonally */}
        <path
          d="M 100 850 C 450 700, 800 620, 1050 780 C 1300 920, 1500 650, 1600 600"
          stroke="url(#trail-violet-cyan)"
          strokeWidth="2"
          fill="none"
          filter="url(#trail-glow)"
          className="animated-trail-2"
        />

        {/* Trail Path 3: Subtle ambient stream through center */}
        <path
          d="M -50 480 C 400 550, 750 420, 1200 520 C 1380 560, 1520 490, 1650 510"
          stroke="url(#trail-cyan-blue)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          fill="none"
          opacity="0.4"
          className="animated-trail-3"
        />
      </svg>
    </div>
  );
};

export default LightTrails;
