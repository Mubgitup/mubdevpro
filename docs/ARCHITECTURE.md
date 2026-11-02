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
│   │   ├── common/               # Reusable UI primitives
│   │   │   ├── Button.jsx        # Glow, glass, and ghost buttons with spring motion
│   │   │   ├── GlassCard.jsx     # Glassmorphic card container with hover lift
│   │   │   ├── MotionReveal.jsx  # Scroll-triggered entrance animations with reduced-motion support
│   │   │   ├── SectionHeader.jsx # Reusable section title with badges and gradients
│   │   │   ├── SkillCard.jsx     # Categorized skill cards with status tags
│   │   │   ├── ProjectCard.jsx   # Project cards with preview, tech tags & links
│   │   │   └── TimelineItem.jsx  # Journey milestone node & glass card
│   │   ├── effects/              # Phase 3 Visual Effects & 3D
│   │   │   ├── ThreeBackground.jsx # 3D Three.js canvas with geometric objects & particles
│   │   │   └── LightTrails.jsx     # Vector-animated cyber neon light trails
│   │   └── layout/               # Shell components
│   │       ├── Navbar.jsx        # Glassmorphic navbar with scroll spy & mobile drawer
│   │       ├── Footer.jsx        # Footer with back-to-top, copyright & links
│   │       └── Layout.jsx        # Master layout wrapper with 3D canvas and light trails
│   ├── data/
│   │   ├── brandConfig.js        # Single source of truth for brand, profile & links
│   │   ├── skillsData.js         # Verified technology skills categorized accurately
│   │   ├── projectsData.js       # Authentic academic and practice projects
│   │   └── journeyData.js        # Educational timeline milestones without fabricated claims
│   ├── hooks/                    # Custom React hooks (.gitkeep)
│   ├── sections/                 # Website page sections
│   │   ├── HeroSection.jsx       # 2-column hero with seamless portrait, floating chips & 3 info cards
│   │   ├── AboutSection.jsx      # Who I am, education, learning focus, and goals
│   │   ├── SkillsSection.jsx     # Frontend, Programming, Backend, and Database categories
│   │   ├── ProjectsSection.jsx   # Filterable project showcase with category tabs
│   │   ├── JourneySection.jsx    # Education and learning journey timeline
│   │   └── ContactSection.jsx    # Form with client validation, loading state & Django prep
│   ├── styles/                   # Design system tokens and global CSS
│   │   ├── variables.css
│   │   ├── globals.css
│   │   └── components.css
│   ├── utils/                    # Utility functions (.gitkeep)
│   ├── App.jsx                   # Root application container assembling all sections
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML entry with font preconnects & metadata
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Vite build and server configuration with manual chunking
```

## Technical Decisions & Phase 3 Architecture
1. **Three-Dimensional Background (Three.js)**:
   - Floating geometric wireframes (`BoxGeometry`, `OctahedronGeometry`, `IcosahedronGeometry`, `TorusGeometry`) with emissive materials in neon cyan (`#00D9FF`), electric blue (`#087BFF`), and violet (`#713BFF`).
   - Digital particle field (`BufferGeometry` with custom vertex colors) drifting slowly across the scene.
   - Fog exponential density (`FogExp2`) seamlessly blends 3D geometry into the midnight canvas.
2. **Hero Portrait Seamless Integration**:
   - Eliminated boxed rectangular card wrapper in favor of an organic holographic stage.
   - Dual-tier atmospheric radial glow, rotating orbital cyber rings, and gradient edge vignette blending (`mask-image: radial-gradient(...)`).
   - Retained the exact replaceable asset path (`src/assets/images/placeholder-portrait.svg`) for easy future replacement.
3. **Flowing Vector Light Trails**:
   - Curved SVG bezier trails with multi-stop cyan-blue-violet gradients, glowing Gaussian blur filters, and continuous `stroke-dashoffset` flow animations.
4. **Performance & Hardware Optimization (Critical)**:
   - **WebGL Feature Detection**: Automatically falls back to high-fidelity CSS radial glow orbs if WebGL is unavailable or errors out.
   - **Tab Inactivity Optimization**: Uses the Page Visibility API (`visibilitychange`) to pause the render loop when the browser tab is hidden or backgrounded, eliminating idle GPU consumption.
   - **Reduced Motion Support**: Detects `prefers-reduced-motion: reduce` across Three.js and Framer Motion, freezing dynamic motion and respecting accessibility preferences.
   - **Mobile Complexity Scaling**: Dynamically adjusts particle count (220 on desktop vs 80 on mobile), scales geometric objects, and caps `devicePixelRatio` at `1.75`.
   - **Chunk Splitting**: Rollup `manualChunks` configured in `vite.config.js` isolating `three`, `framer-motion`, and `lucide-react` for optimal caching and fast loads.
5. **Glassmorphism Refinement**:
   - `backdrop-filter: blur(20px)` paired with multi-layer surface reflections (`inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)`), controlled depth shadows, and subtle cyan/violet borders.

## Scripts
- `npm run dev`: Starts local development server at `http://localhost:3000`.
- `npm run build`: Compiles optimized production bundle with manual code-splitting.
- `npm run preview`: Previews production build locally.
