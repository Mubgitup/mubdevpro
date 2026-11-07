# Mubdev Admin Dashboard - Requirements & Architecture Specification

## 1. Overview & Objectives
The **Mubdev Admin Dashboard** provides a secure, intuitive back-office interface for Mubarek to monitor visitor inquiries, manage portfolio content, review system health, and oversee contact communications stored in MySQL.

---

## 2. Information Architecture & Navigation

```
Admin Dashboard
├── Overview / Analytics (Health, message volume, recent activity)
├── Messages Inbox (List, view details, mark as read, delete inquiries)
├── Profile Management (Bio, hero highlights, status, education details)
├── Projects & Skills (Showcase management, technology tags, links)
└── System & Security (Admin password change, database backup, API logs)
```

---

## 3. Authentication & Session Security

### 3.1 Authentication Strategy
- **Endpoint**: `POST /api/auth/login`
- **Credential Storage**: Passwords hashed using standard PHP `password_hash($password, PASSWORD_BCRYPT)` with salt cost factor 10.
- **Session & Token**:
  - Issues an HMAC-SHA256 signed bearer token (`Authorization: Bearer <token>`).
  - Native PHP secure cookie session as fallback.
  - Expiration: 48-hour sliding window.
- **Brute-Force Protection**: Throttles failed login attempts (max 5 per 15 minutes per IP).

---

## 4. Feature Specifications

### 4.1 Message Inbox Management
- **Table**: `mubdev_contact_messages`
- **Capabilities**:
  - Paginated list of inquiries (`GET /api/messages?limit=25&offset=0`).
  - Search by sender name, email, or subject.
  - Filter by `is_read` status (All, Unread, Read).
  - Quick action to toggle read/unread status (`PATCH /api/messages/{id}`).
  - Secure deletion with confirmation modal (`DELETE /api/messages/{id}`).
  - Export inquiries to CSV/JSON for records.

### 4.2 Content & Profile Management
- Direct editing of profile statements, hero highlights, and university year without rebuilding source code.
- Dynamic data sync through REST endpoints.

### 4.3 Media & Image Uploads
- **Destination**: `backend/uploads/`
- **MIME Validation**: Strict whitelist (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`).
- **File Limits**: Max 5 MB per image.
- **Security**: Renames files using random UUIDs; disables PHP script execution in `backend/uploads/.htaccess`.

---

## 5. API Endpoints Reference

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public (Throttled) | Authenticates administrator & issues token |
| `POST` | `/api/auth/logout` | Protected | Invalidates session and revokes token |
| `GET` | `/api/auth/me` | Protected | Retrieves authenticated admin identity |
| `GET` | `/api/messages` | Protected | Lists contact inquiries with pagination |
| `PATCH` | `/api/messages/{id}` | Protected | Updates inquiry status (`is_read`) |
| `DELETE` | `/api/messages/{id}` | Protected | Deletes an inquiry record |
| `GET` | `/api/health/` | Public | System status, database engine & diagnostics |
| `POST` | `/api/contact/` | Public (Rate-limited) | Public contact form submissions |

