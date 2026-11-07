# Mubdev — Personal Brand & Full-Stack Portfolio

> Official personal brand website of **Mubarek Hussein** — Third-year Software Engineering student at Haramaya University & Aspiring Full-Stack Developer.

---

## Technical Stack Overview

- **Frontend**:
  - React 19, JavaScript (ESNext), Pure CSS Design Tokens & Glassmorphism
  - Three.js (3D floating geometric objects, ambient lighting, digital particles)
  - Framer Motion (Entrance reveals, scroll-triggered animations, spring physics)
  - Lucide React & Custom Brand Vectors
  - Vite (Build system with code splitting and development reverse proxy)
  - Centralized API Service (`src/services/api.js`)
- **Backend**:
  - PHP 8.2+ (Modular MVC / REST API Architecture)
  - PDO (Prepared Statements, SQL-injection prevention)
  - Sliding-window rate limiter & anti-spam honeypot
  - Bcrypt authentication (`password_hash` / `password_verify`) & HMAC-signed bearer tokens
- **Database**:
  - MySQL 8.x / MariaDB (`utf8mb4`, InnoDB, indexed tables) with automatic SQLite local development fallback

---

## Quick Start & Local Development

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start frontend development server (http://localhost:3000)
npm run dev

# Compile optimized production build
npm run build
```

### 2. Backend Setup (PHP + MySQL)

#### Option A: Built-in PHP Development Server (Quickest)
```bash
# From workspace root:
# Start PHP backend server at port 8000
php -S 127.0.0.1:8000 -t backend backend/index.php

# Run PHP integration test suite
php backend/test_integration.php
```

#### Option B: XAMPP / Apache + MySQL Setup
1. Place or link the repository in your web root (or run under XAMPP `htdocs`).
2. Start **Apache** and **MySQL** from the **XAMPP Control Panel**.
3. Open **phpMyAdmin** (`http://localhost/phpmyadmin/`).
4. Create database `mubdev_db` and import `backend/database/schema.sql` and `backend/database/seed.sql`.
5. Ensure `backend/.env` has:
   ```ini
   DB_DRIVER=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=mubdev_db
   DB_USER=root
   DB_PASSWORD=
   ```
6. The React frontend automatically proxies `/api` calls to `http://127.0.0.1:8000` or can connect directly via `FRONTEND_URL`.

---

## Documentation Index

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Database Design & Schema](docs/DATABASE_DESIGN.md)
- [REST API Specification](docs/API_SPECIFICATION.md)
- [Admin Dashboard Requirements](docs/ADMIN_DASHBOARD_REQUIREMENTS.md)
- [Design System & Visual Tokens](docs/DESIGN_SYSTEM.md)
- [Visual Reference Guidelines](docs/references/README.md)
