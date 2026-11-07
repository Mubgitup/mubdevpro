# Mubdev Database Design Documentation

## 1. Overview
The **Mubdev** database layer is designed for **MySQL 8.x / MariaDB** (with `utf8mb4` character set and InnoDB storage engine), accessed via **PHP PDO prepared statements**.

For local development flexibility, the system features an automatic SQLite fallback when the MySQL service is offline, ensuring zero disruption during frontend work and automated test suites.

---

## 2. Table Specifications

### 2.1 Table: `mubdev_contact_messages`
Stores visitor inquiries, collaboration proposals, and contact submissions.

| Column Name | SQL Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | No | Primary Key | Unique message identifier |
| `name` | `VARCHAR(120)` | No | - | Sanitized sender full name (Min: 2) |
| `email` | `VARCHAR(254)` | No | - | Sender contact email (Indexed) |
| `subject` | `VARCHAR(200)` | No | - | Subject line (Min: 3) |
| `message` | `LONGTEXT` | No | - | Message body (Min: 10) |
| `ip_address` | `VARCHAR(45)` | Yes | `NULL` | IPv4 / IPv6 client address for abuse prevention |
| `is_read` | `TINYINT(1)` | No | `0` | Review status flag (0 = unread, 1 = read) |
| `created_at` | `DATETIME` | No | `CURRENT_TIMESTAMP` | Timestamp of submission (Indexed DESC) |

#### Indexes
1. `contact_created_idx`: `(created_at DESC)` — Optimizes inbox timeline sorting.
2. `contact_email_idx`: `(email)` — Optimizes sender lookup and duplicate auditing.

---

### 2.2 Table: `admin_users`
Stores administrative accounts for managing portfolio messages, profile data, and settings.

| Column Name | SQL Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `INT UNSIGNED AUTO_INCREMENT` | No | Primary Key | Unique admin user identifier |
| `username` | `VARCHAR(60)` | No | Unique | Admin username (Indexed) |
| `email` | `VARCHAR(254)` | No | Unique | Admin notification email |
| `password_hash` | `VARCHAR(255)` | No | - | Bcrypt password hash (`password_hash`) |
| `is_active` | `TINYINT(1)` | No | `1` | Account active state |
| `created_at` | `DATETIME` | No | `CURRENT_TIMESTAMP` | Account creation timestamp |
| `last_login` | `DATETIME` | Yes | `NULL` | Last successful login timestamp |

---

## 3. SQL Setup & Seed Instructions

To initialize the database in MySQL / phpMyAdmin:

1. Import schema:
   ```sql
   -- File: backend/database/schema.sql
   CREATE DATABASE IF NOT EXISTS `mubdev_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE `mubdev_db`;
   -- (Runs CREATE TABLE statements)
   ```

2. Import seed data (provisions default administrator and migrated messages):
   ```sql
   -- File: backend/database/seed.sql
   -- Default Admin Account:
   -- Username: admin
   -- Password: AdminMubdev2026!
   ```

3. Configure `backend/.env`:
   ```ini
   DB_DRIVER=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=mubdev_db
   DB_USER=root
   DB_PASSWORD=
   ```
