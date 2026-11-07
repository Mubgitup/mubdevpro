# Mubdev System Architecture Documentation

## 1. High-Level Architecture Overview

**Mubdev** is designed as a decoupled, high-performance full-stack web application:
- **Frontend Layer**: React 19 single-page application bundled with Vite, featuring custom pure CSS design tokens, Three.js 3D geometric background, flowing vector light trails, Framer Motion animations, and a centralized API service (`src/services/api.js`).
- **API & Application Layer**: Modular **PHP 8.2+** REST API implementing the Front Controller pattern with clean routing, strict PDO prepared statements, sliding-window rate limiting, anti-spam honeypot verification, and administrative authentication.
- **Persistence Layer**: Relational **MySQL 8.x / MariaDB** database (with seamless SQLite fallback for local developer environments).

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|   +-----------------------------------------------------------------+   |
|   |                  React 19 Client Application                    |   |
|   |  - Three.js 3D Canvas        - Transparent Glassmorphism UI     |   |
|   |  - Framer Motion Reveals     - Centralized API Service (api.js) |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                   |
             HTTP / JSON (REST API: /api/contact/, /api/health/)
             Development Proxy: Vite (:3000) -> PHP (:8000)
                                   v
+-------------------------------------------------------------------------+
|                             PHP REST API                                |
|   +-----------------------------------------------------------------+   |
|   |  Front Controller (index.php) & Routing Router                  |   |
|   |  CorsMiddleware (Allowed Origins: localhost:3000)               |   |
|   |  RateLimiter (10 requests/hour per IP sliding window)           |   |
|   |  Anti-Spam Honeypot Verification ('website' field)              |   |
|   |  HTML Sanitization & RFC Email Validation                       |   |
|   |  AuthMiddleware (Bearer token & Bcrypt verification)            |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                   |
                         PDO Prepared Statements
                                   v
+-------------------------------------------------------------------------+
|                            DATABASE LAYER                               |
|   +-----------------------------------------------------------------+   |
|   |  Target: MySQL (utf8mb4, InnoDB, strict mode)                   |   |
|   |  Table 1: mubdev_contact_messages (Indexed created_at, email)   |   |
|   |  Table 2: admin_users (Bcrypt password_hash, indexed username)  |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
mubdevpro/
├── backend/                      # PHP REST API Backend
│   ├── .htaccess                 # Apache mod_rewrite rules to index.php
│   ├── .env                      # Local active environment variables
│   ├── .env.example              # Documented environment variables template
│   ├── index.php                 # Front controller and router
│   ├── test_integration.php      # Automated PHP integration test suite
│   ├── config/                   # Configuration
│   │   ├── app.php               # Global settings, error reporting, CORS origins
│   │   └── database.php          # PDO connection (MySQL with SQLite fallback)
│   ├── controllers/              # Application Controllers
│   │   ├── ContactController.php # Submission validation & message persistence
│   │   ├── AuthController.php    # Admin authentication & token management
│   │   └── HealthController.php  # System diagnostics & health check
│   ├── models/                   # Database Models
│   │   ├── ContactMessage.php    # Message queries & CRUD operations
│   │   └── AdminUser.php         # Admin credentials & password verification
│   ├── middleware/               # Middleware Pipeline
│   │   ├── CorsMiddleware.php    # Preflight OPTIONS & CORS headers
│   │   ├── AuthMiddleware.php    # Route authentication & token security
│   │   └── RateLimiter.php       # Sliding-window IP submission throttling
│   ├── utils/                    # Shared Utilities
│   │   ├── Response.php          # Standardized JSON response helper
│   │   └── Validator.php         # Input sanitization & validation rules
│   ├── database/                 # Database Definitions
│   │   ├── schema.sql            # MySQL schema DDL
│   │   └── seed.sql              # Seed data (preserved inquiries & default admin)
│   ├── uploads/                  # Managed user uploads directory
│   └── api/                      # Direct script API entrypoints
│       ├── health/index.php
│       ├── contact/index.php
│       ├── auth/login.php
│       ├── auth/logout.php
│       ├── auth/me.php
│       └── messages/index.php
│
├── src/                          # React 19 Frontend
│   ├── services/                 # Centralized API Service (api.js)
│   ├── components/               # Layout, Navigation, Common Glass Cards
│   ├── sections/                 # Portfolio Sections (Hero, Contact, Projects, etc.)
│   └── styles/                   # Design Tokens, Glassmorphism & Cyberpunk CSS
└── docs/                         # Architecture, API & Database Documentation
```
