# Mubdev System Architecture Documentation

## 1. High-Level Architecture Overview

**Mubdev** is designed as a decoupled, modern full-stack web application:
- **Frontend Layer**: React 19 single-page application bundled with Vite, featuring custom pure CSS design tokens, Three.js 3D geometric background, flowing vector light trails, and Framer Motion animations.
- **API & Application Layer**: Python Django 5 and Django REST Framework providing a secure, modular REST API.
- **Persistence Layer**: Relational MySQL database (with seamless SQLite fallback for local developer environments).

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|   +-----------------------------------------------------------------+   |
|   |                  React 19 Client Application                    |   |
|   |  - Three.js 3D Canvas        - Transparent Glassmorphism UI     |   |
|   |  - Framer Motion Reveals     - Real-Time Validated Contact Form |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                   |
             HTTP / JSON (REST API: /api/contact/, /api/health/)
             Development Proxy: Vite (:3000) -> Django (:8000)
                                   v
+-------------------------------------------------------------------------+
|                         DJANGO REST FRAMEWORK API                       |
|   +-----------------------------------------------------------------+   |
|   |  CorsMiddleware (Allowed Origins: localhost:3000)               |   |
|   |  AnonRateThrottle (10 requests/hour per IP)                     |   |
|   |  Anti-Spam Honeypot Verification ('website' field)              |   |
|   |  HTML Sanitization & RFC Email Validation                       |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                   |
                         PyMySQL / Django ORM
                                   v
+-------------------------------------------------------------------------+
|                            DATABASE LAYER                               |
|   +-----------------------------------------------------------------+   |
|   |  Target: MySQL (utf8mb4, InnoDB, strict mode)                   |   |
|   |  Table: mubdev_contact_messages                                 |   |
|   |  Indexes: [-created_at], [email]                                |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

## 2. Directory Structure
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
│   ├── ARCHITECTURE.md           # Master architecture record
│   ├── DATABASE_DESIGN.md        # Database schema, constraints & indexes
│   ├── DESIGN_SYSTEM.md          # Visual tokens, colors & 3D specifications
│   └── SYSTEM_ARCHITECTURE.md    # System architecture (this document)
├── src/                          # React 19 Frontend
│   ├── assets/                   # Vector logos, icons & placeholder portrait
│   ├── components/               # Reusable UI & Layout components
│   ├── data/                     # Single source of truth for profile & skills
│   ├── effects/                  # Three.js 3D canvas & vector light trails
│   ├── sections/                 # Website page sections (Hero, About, Contact, etc.)
│   └── styles/                   # Design system tokens & global styling
├── package.json                  # Frontend dependencies
└── vite.config.js                # Vite configuration with /api proxy & chunking
```

## 3. Communication & Integration Protocol

1. **Local Development Proxying**:
   - The Vite development server runs on port `3000`.
   - All client calls to `/api/*` are reverse-proxied automatically to `http://127.0.0.1:8000` via `vite.config.js`.
   - This eliminates browser CORS issues in development while keeping the frontend code clean.

2. **CORS Security**:
   - `django-cors-headers` is configured in `settings.py`.
   - `CORS_ALLOWED_ORIGINS` allows explicitly authorized frontend origins (`http://localhost:3000`, `http://127.0.0.1:3000`).

3. **Input Sanitization & Protection**:
   - Inbound strings are stripped of surrounding whitespace and escaped (`html.escape`) to prevent Cross-Site Scripting (XSS).
   - Email addresses are validated against strict regex patterns matching RFC standards.
   - An anti-spam honeypot field (`website`) is positioned off-screen; any submission containing a non-empty honeypot is immediately rejected without database writes.
   - An anonymous rate limiter (`AnonRateThrottle`) restricts submissions to 10 per hour per IP address to prevent denial-of-service or flood attacks.

4. **Fault Tolerance & Fallback**:
   - If MySQL credentials are not yet configured on a developer machine, the system falls back gracefully to `django.db.backends.sqlite3` without crashing.
   - Switching to MySQL requires only updating `DB_ENGINE=django.db.backends.mysql` in `backend/.env`.
