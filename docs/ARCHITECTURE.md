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
│   │   │   ├── SectionHeader.jsx # Reusable section title with badges and gradients
│   │   │   ├── SkillCard.jsx     # Categorized skill cards with status tags
│   │   │   ├── ProjectCard.jsx   # Project cards with preview, tech tags & links
│   │   │   └── TimelineItem.jsx  # Journey milestone node & glass card
│   │   └── layout/               # Shell components
│   │       ├── Navbar.jsx        # Glassmorphic navbar with scroll spy & mobile drawer
│   │       ├── Footer.jsx        # Footer with back-to-top, copyright & links
│   │       └── Layout.jsx        # Master layout wrapper with ambient background layers
│   ├── data/
│   │   ├── brandConfig.js        # Single source of truth for brand, profile & links
│   │   ├── skillsData.js         # Verified technology skills categorized accurately
│   │   ├── projectsData.js       # Authentic academic and practice projects
│   │   └── journeyData.js        # Educational timeline milestones without fabricated claims
│   ├── hooks/                    # Custom React hooks (.gitkeep)
│   ├── sections/                 # Website page sections
│   │   ├── HeroSection.jsx       # 2-column hero with portrait, floating chips & 3 info cards
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
└── vite.config.js                # Vite build and server configuration
```

## Technical Decisions & Phase 2 Architecture
1. **Frontend Architecture — React 19 & Vite**:
   - Component-driven modular architecture.
   - Separation of concerns: all profile, skill, project, and journey data lives in structured data modules (`src/data/`) separate from presentation components.
2. **Authoritative Hero Layout**:
   - Preserves 2-column desktop composition with right-side integrated portrait, floating technology badges, and 3-column bottom information cards.
   - Fully collapses gracefully to single-column on tablet/mobile screens with zero horizontal overflow.
3. **Verified Information Integrity (Rules 10 & 11)**:
   - No fabricated percentages or invented certifications in the skills section.
   - Honest representation of projects as educational, academic, and practice builds.
   - Contact form includes complete client-side validation, error handling, and field status without simulating fake server-sent confirmations.
4. **Interactive Navigation & Scrollspy**:
   - Native `IntersectionObserver` updates the active navigation tab smoothly as the user scrolls.
   - Smooth scrolling enabled for internal anchor links (`#hero`, `#about`, `#skills`, `#projects`, `#journey`, `#contact`).
   - Accessible mobile drawer with keyboard Escape dismissal and ARIA attributes.
5. **Styling & Performance**:
   - Pure CSS variables and glassmorphism. GPU-accelerated backdrop blur and glowing gradients.

## Scripts
- `npm run dev`: Starts local development server at `http://localhost:3000`.
- `npm run build`: Compiles production build to `dist/`.
- `npm run preview`: Previews production build locally.
