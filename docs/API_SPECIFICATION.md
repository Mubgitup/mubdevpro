# Mubdev REST API Specification

## 1. Overview
The Mubdev API is built using **Django REST Framework (DRF)**. All responses are formatted in JSON.

- **Base URL (Local)**: `http://127.0.0.1:8000/api/` (or `/api/` via frontend Vite reverse proxy).
- **Content-Type**: `application/json`
- **Rate Limit**: 10 requests / hour per IP address for anonymous endpoints.

---

## 2. Endpoints

### `GET /api/health/`
Inspects backend system health, active database engine, and server timestamp.

#### Request
- **Method**: `GET`
- **Headers**: None required
- **Authentication**: None

#### Response (200 OK)
```json
{
  "status": "healthy",
  "service": "Mubdev Backend API",
  "version": "1.0.0",
  "database_engine": "mysql",
  "timestamp": "2026-11-03T16:04:18.080503+00:00"
}
```

---

### `POST /api/contact/`
Accepts, validates, sanitizes, and persists a visitor contact inquiry.

#### Request
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Payload Schema**:
  | Field | Type | Required | Constraints | Description |
  |---|---|---|---|---|
  | `name` | string | Yes | Min: 2, Max: 120 | Full name of the sender |
  | `email` | string | Yes | Valid RFC email | Sender's contact email |
  | `subject` | string | Yes | Min: 3, Max: 200 | Subject of the inquiry |
  | `message` | string | Yes | Min: 10 | Body content of the message |
  | `website` | string | No | Must be empty | Anti-spam honeypot field |

#### Example Request Payload
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "subject": "Full-Stack Project Collaboration",
  "message": "Hi Mubarek, I saw your portfolio and would like to talk about a software project."
}
```

#### Success Response (201 Created)
Returned when payload is valid and successfully committed to the database.
```json
{
  "success": true,
  "message": "Thank you! Your message has been safely received and stored in the database. Mubarek will review it and respond promptly.",
  "data": {
    "id": 1,
    "name": "Sarah Connor",
    "subject": "Full-Stack Project Collaboration",
    "created_at": "2026-11-03T16:04:18.123456+00:00"
  }
}
```

#### Validation Error Response (400 Bad Request)
Returned when input constraints fail.
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

#### Anti-Spam Honeypot Error Response (400 Bad Request)
Returned when an automated bot fills the hidden `website` field.
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted errors.",
  "errors": {
    "spam": ["Automated submission detected."]
  }
}
```

#### Rate Limit Exceeded (429 Too Many Requests)
Returned when more than 10 requests are received from the same IP address in an hour.
```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

#### Internal Server Error (500 Internal Server Error)
Returned when an unhandled server or database error occurs. Internal stack traces are suppressed for security.
```json
{
  "success": false,
  "message": "An unexpected error occurred while processing your message. Please try again later."
}
```

