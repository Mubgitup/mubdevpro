# Mubdev Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive technical specification for the **Mubdev** full-stack web application, detailing system interfaces, constraints, software architecture, data models, and behavioral requirements.

### 1.2 Scope
The scope encompasses:
- Single-page React 19 application interface with Three.js visual computing and Framer Motion animation orchestration.
- Django 5.2 REST Framework API server running behind Nginx / Gunicorn.
- Relational database schema hosted on MySQL.

---

## 2. Overall Description

### 2.1 System Environment
- **Operating Systems**: Windows 10/11 (Development), Ubuntu 22.04 LTS / Alpine Linux (Production Docker).
- **Frontend Runtime**: Node.js >= 20.x, Modern Evergreen Browsers (Chrome, Firefox, Safari, Edge).
- **Backend Runtime**: Python >= 3.11.x, Django 5.2.x, Django REST Framework 3.18.x.
- **Database Engine**: MySQL >= 8.0 with `utf8mb4` encoding (SQLite 3 for development fallback).

### 2.2 System Architecture Diagram
```
Client Browser (React 19 SPA)
      |
      | HTTPS Requests / Reverse Proxy
      v
Nginx Web Server (:80 / :443)
      |
      +---> Static Files (dist/)
      |
      +---> /api/* & /admin/* Proxy
            |
            v
      Gunicorn WSGI Server (:8000)
            |
            v
      Django REST API (mubdev_backend)
            |
            v
      MySQL Relational Database (:3306)
```

---

## 3. Specific Software Requirements

### 3.1 External Interface Requirements
1. **User Interface (UI)**:
   - Fluid responsive layout using CSS Flexbox and CSS Grid.
   - Breakpoints: Mobile (`<= 480px`), Tablet (`<= 768px`), Laptop (`<= 1024px`), Desktop (`> 1024px`).
2. **Software Interfaces**:
   - `GET /api/health/`: Returns JSON health diagnostic payload.
   - `POST /api/contact/`: Consumes JSON payload `{name, email, subject, message, website}` and returns HTTP 201 Created or HTTP 400 Bad Request.

### 3.2 Data Validation & Security Rules
- **Name**: String, minimum 2 characters, maximum 120 characters. Trimmed and HTML escaped.
- **Email**: String, maximum 254 characters. Must conform to RFC standard email regex.
- **Subject**: String, minimum 3 characters, maximum 200 characters. Trimmed and HTML escaped.
- **Message**: String, minimum 10 characters. Trimmed and HTML escaped.
- **Honeypot**: String (`website`). Must be blank. Non-empty value flags submission as automated spam and halts processing.
- **Rate Limit**: 10 submissions per IP address per hour. Exceeding triggers HTTP 429 Too Many Requests.

### 3.3 Hardware & Rendering Safeguards
- 3D canvas must detect WebGL availability; if unavailable, the system renders an animated CSS fallback.
- The 3D render loop must hook into the Page Visibility API (`document.visibilityState`) to pause when the tab is backgrounded.
- The 3D render loop and Framer Motion animations must respect user's `prefers-reduced-motion` settings.
