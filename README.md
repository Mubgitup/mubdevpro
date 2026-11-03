# Mubdev — Personal Brand & Full-Stack Portfolio

> Official personal brand website of **Mubarek Hussein** — Third-year Software Engineering student at Haramaya University & Aspiring Full-Stack Developer.

---

## Technical Stack Overview

- **Frontend**:
  - React 19, JavaScript (ESNext), Pure CSS Design Tokens & Glassmorphism
  - Three.js (3D floating geometric objects, ambient lighting, digital particles)
  - Framer Motion (Entrance reveals, scroll-triggered animations, spring physics)
  - Lucide React (Modern icons)
  - Vite (Build system with code splitting and development proxy)
- **Backend**:
  - Python 3.15, Django 5.2, Django REST Framework (DRF)
  - django-cors-headers, python-dotenv, PyMySQL, Cryptography
- **Database**:
  - MySQL (`utf8mb4`, InnoDB, indexed tables) with automatic development fallback to SQLite

---

## Quick Start & Local Development

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start frontend development server (http://localhost:3000)
npm run dev

# Compile optimized production build
npm run build
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (using uv or standard python venv)
uv venv .venv
# or: python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
# source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Copy environment template & customize if needed
cp .env.example .env

# Apply database migrations
python manage.py migrate

# Run backend test suite
python manage.py test contact
python test_integration.py

# Start Django development server (http://127.0.0.1:8000)
python manage.py runserver
```

---

## Documentation Index

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Database Design & Schema](docs/DATABASE_DESIGN.md)
- [REST API Specification](docs/API_SPECIFICATION.md)
- [Design System & Visual Tokens](docs/DESIGN_SYSTEM.md)
- [Visual Reference Guidelines](docs/references/README.md)
- [Replaceable Portrait Guidelines](src/assets/images/README.md)
