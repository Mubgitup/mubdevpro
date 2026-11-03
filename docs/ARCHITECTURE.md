# Mubdev Architecture Documentation

## Overview
**Mubdev** is the personal brand website of **Mubarek Hussein**, a third-year Software Engineering student at Haramaya University and aspiring full-stack developer.

## Project Structure
```
mubdevpro/
├── backend/                      # Python Django Backend
│   ├── .env.example              # Documented environment variables template
│   ├── manage.py                 # Django command-line runner
│   ├── requirements.txt          # Python dependencies
│   ├── test_integration.py       # Automated end-to-end integration test
│   ├── mubdev_backend/           # Django core project configuration
│   │   ├── __init__.py           # PyMySQL MySQLdb installation hook
│   │   ├── asgi.py               # ASGI interface
│   │   ├── settings.py           # Configuration, CORS, DRF & DB engine
│   │   ├── urls.py               # Main URL routing & /api/health/
│   │   └── wsgi.py               # WSGI interface
│   └── contact/                  # Contact Management App
│       ├── admin.py              # Django admin registration
│       ├── apps.py               # App configuration
│       ├── models.py             # ContactMessage database model
│       ├── serializers.py        # Validation, sanitization & honeypot
│       ├── tests.py              # Unit & integration tests
│       ├── urls.py               # App URL routing
│       ├── views.py              # ContactMessageCreateView API handler
│       └── migrations/           # Django migration records
├── docs/                         # Documentation suite
│   ├── API_SPECIFICATION.md      # Complete REST API reference
│   ├── ARCHITECTURE.md           # Master architecture record (this document)
│   ├── DATABASE_DESIGN.md        # Database schema, constraints & indexes
│   ├── DESIGN_SYSTEM.md          # Visual tokens, colors & 3D specifications
│   ├── SYSTEM_ARCHITECTURE.md    # System architecture deep-dive
│   └── references/               # Authoritative screenshots & design references
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
│   │   └── ContactSection.jsx    # Live form connected to Django API with honeypot & validation
│   ├── styles/                   # Design system tokens and global CSS
│   │   ├── variables.css
│   │   ├── globals.css
│   │   └── components.css
│   ├── utils/                    # Utility functions (.gitkeep)
│   ├── App.jsx                   # Root application container assembling all sections
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML entry with font preconnects & metadata
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Vite build and server configuration with manual chunking & /api proxy
```

## Technical Decisions & Phase 4 Backend Integration
1. **Django REST Framework Architecture**:
   - Modular application design: `contact` application handles inquiries.
   - Model `ContactMessage` maps to `mubdev_contact_messages` with indexing on `created_at` and `email`.
   - Comprehensive sanitization via `html.escape` and RFC email regex.
   - Anti-spam honeypot field (`website`) traps automated web scrapers.
   - Rate limiting: anonymous requests throttled to 10/hour per IP.
2. **Database Resilience**:
   - Primary target: MySQL with `utf8mb4` encoding, strict mode, and PyMySQL bridge.
   - Development fallback: SQLite enabled automatically when MySQL server is not running locally, ensuring immediate testability.
3. **Frontend Connection**:
   - Form submission via native `fetch` targeting `/api/contact/`.
   - Vite development proxy routes `/api/*` to `http://127.0.0.1:8000`.
   - Real-time client & server error mapping under input fields.
   - Form resets only upon confirmed HTTP 201 backend persistence.
