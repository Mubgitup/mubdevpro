# Mubdev Architecture Documentation

## Overview
**Mubdev** is the personal brand website of **Mubarek Hussein**, a third-year Software Engineering student at Haramaya University and aspiring full-stack developer.

## Project Structure
```
mubdevpro/
├── docs/
│   ├── references/               # Authoritative screenshots & design references
│   │   └── README.md
│   ├── ARCHITECTURE.md           # Architecture, decisions, and system breakdown
│   └── DESIGN_SYSTEM.md          # Complete design token specifications
├── public/
│   └── mubdev-favicon.svg        # Scalable SVG brand favicon
├── src/
│   ├── assets/
│   │   ├── icons/                # Custom SVG icons & symbols (.gitkeep)
│   │   ├── images/               # Image assets and replaceable portrait placeholder
│   │   │   ├── placeholder-portrait.svg
│   │   │   └── README.md
│   │   └── logo/                 # Official Mubdev Logo assets & component
│   │       ├── MubdevLogo.jsx
│   │       └── mubdev-logo.svg
│   ├── components/
│   │   ├── common/               # Reusable UI primitives (Button, GlassCard, etc.)
│   │   │   ├── Button.jsx
│   │   │   └── GlassCard.jsx
│   │   └── layout/               # Shell components (Navbar, Footer, Layout)
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── data/
│   │   └── brandConfig.js        # Single source of truth for brand, profile & links
│   ├── hooks/                    # Custom React hooks (.gitkeep)
│   ├── sections/                 # Website page sections
│   │   └── DesignSystemPreview.jsx
│   ├── styles/                   # Design system tokens and global CSS
│   │   ├── variables.css
│   │   ├── globals.css
│   │   └── components.css
│   ├── utils/                    # Utility functions (.gitkeep)
│   ├── App.jsx                   # Root application container
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML entry with font preconnects & metadata
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Vite build and server configuration
```

## Technical Decisions
1. **Build Tool — Vite (React 19)**:
   - Ultra-fast HMR and optimized asset bundling.
   - Low overhead compared to heavy full-stack frameworks for static client-side rendering.
2. **Animation — Framer Motion**:
   - Fluid spring animations for buttons, cards, and future scroll-triggered entrance animations.
3. **Icons — Lucide React**:
   - Modern, lightweight SVG icon system matching tech aesthetics.
4. **Styling Architecture — Pure CSS Variables & Utility Components**:
   - Zero-runtime CSS custom properties (`var(--...)`) ensure peak performance, instant loading, and smooth GPU-accelerated backdrop blur and glow transitions without styling library overhead.
5. **Brand Integrity**:
   - Reusable `MubdevLogo` component and SVG files.
   - Distinct, replaceable portrait asset slot at `src/assets/images/placeholder-portrait.svg` obeying rule 10 ("Do not invent my personal information, achievements...").

## Scripts
- `npm run dev`: Starts local development server at `http://localhost:3000`.
- `npm run build`: Compiles production build to `dist/`.
- `npm run preview`: Previews production build locally.
