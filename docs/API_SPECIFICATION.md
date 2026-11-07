# Mubdev REST API Specification

## 1. Overview
The Mubdev API is built using **PHP 8.2+** following clean REST conventions. All requests and responses use **JSON**.

- **Base URL (Local)**: `http://127.0.0.1:8000/api/` (or `/api/` via frontend Vite reverse proxy).
- **Content-Type**: `application/json; charset=utf-8`
- **Rate Limit**: 10 requests / hour per IP address for anonymous endpoints.
- **Authentication**: Bearer token via `Authorization: Bearer <token>` or PHP session cookie.

---

## 2. Public Endpoints

### `GET /api/health/`
Inspects backend system health, active database engine, and server timestamp.

#### Response (200 OK)
```json
{
  "status": "healthy",
  "service": "Mubdev Backend API",
  "version": "1.0.0",
  "database_engine": "mysql",
  "timestamp": "2026-11-05T10:00:00+00:00"
}
```

---

### `POST /api/contact/`
Accepts, validates, sanitizes, and persists a visitor contact inquiry.

#### Payload Schema
| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `name` | string | Yes | Min: 2, Max: 120 | Full name of the sender |
| `email` | string | Yes | Valid RFC email | Sender's contact email |
| `subject` | string | Yes | Min: 3, Max: 200 | Subject of the inquiry |
| `message` | string | Yes | Min: 10 | Body content of the message |
| `website` | string | No | Must be empty | Anti-spam honeypot field |

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Thank you! Your message has been safely received and stored in the database. Mubarek will review it and respond promptly.",
  "data": {
    "id": 1,
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "subject": "Full-Stack Project Collaboration",
    "created_at": "2026-11-05T10:05:00+00:00"
  }
}
```

#### Validation Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": {
    "email": ["Please provide a valid email address."],
    "message": ["Message must be at least 10 characters long."]
  }
}
```

---

## 3. Administrative Endpoints

### `POST /api/auth/login`
Authenticates administrator credentials and returns an HMAC-signed Bearer token.

#### Request Payload
```json
{
  "username": "admin",
  "password": "AdminMubdev2026!"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Authentication successful.",
  "data": {
    "token": "eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTczMDg5NjAwMH0.d9b3...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@mubdev.com"
    }
  }
}
```

---

### `GET /api/messages` (Protected)
Lists all received inquiries ordered chronologically (newest first).

#### Headers
`Authorization: Bearer <token>`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Messages retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Sarah Connor",
      "email": "sarah@example.com",
      "subject": "Full-Stack Project Collaboration",
      "message": "Hi Mubarek, I saw your portfolio and would like to talk about a software project.",
      "ip_address": "127.0.0.1",
      "is_read": 0,
      "created_at": "2026-11-05 10:05:00"
    }
  ]
}
```

---

### `PATCH /api/messages/{id}` (Protected)
Toggles the review status (`is_read`) of a contact message.

#### Payload
```json
{
  "is_read": true
}
```

---

### `DELETE /api/messages/{id}` (Protected)
Deletes an inquiry record permanently.
