# Mubdev Database Design Documentation

## 1. Overview
The **Mubdev** database layer is built around standard relational database design principles targeting **MySQL** (with `utf8mb4` character set and InnoDB storage engine), managed via Django migrations.

To maintain optimal performance and avoid database bloat, the schema is strictly limited to verified entity models required by the portfolio.

---

## 2. Entity Model: `ContactMessage`

- **Database Table**: `mubdev_contact_messages`
- **Engine**: InnoDB (MySQL)
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

### Column Specifications

| Column Name | SQL Type | Django Field Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|---|
| `id` | `BIGINT AUTO_INCREMENT` | `BigAutoField` | No | Auto | Primary Key |
| `name` | `VARCHAR(120)` | `CharField` | No | - | Min length 2, Max length 120. Sanitized sender name. |
| `email` | `VARCHAR(254)` | `EmailField` | No | - | Sender email address. Indexed for search & reply routing. |
| `subject` | `VARCHAR(200)` | `CharField` | No | - | Min length 3, Max length 200. Inquiry subject line. |
| `message` | `LONGTEXT` | `TextField` | No | - | Min length 10. Inquiry message body. |
| `ip_address` | `VARCHAR(45)` | `GenericIPAddressField` | Yes | `NULL` | IPv4 or IPv6 client address for abuse prevention. |
| `is_read` | `TINYINT(1)` | `BooleanField` | No | `FALSE` | Read status flag for administrative workflow. |
| `created_at` | `DATETIME(6)` | `DateTimeField` | No | `CURRENT_TIMESTAMP` | Timestamp of submission. Indexed for timeline sorting. |

---

## 3. Database Indexes

To ensure fast querying and dashboard retrieval, explicit database indexes have been applied:

1. **`contact_created_idx`**:
   - Fields: `created_at DESC`
   - Purpose: Optimizes sorting when listing messages in chronological order.
2. **`contact_email_idx`**:
   - Fields: `email`
   - Purpose: Accelerates sender lookups and deduplication audits.

---

## 4. MySQL Configuration Instructions

To configure a production or staging MySQL database:

1. Create the MySQL database and user:
   ```sql
   CREATE DATABASE mubdev_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'mubdev_user'@'localhost' IDENTIFIED BY 'StrongPasswordHere123!';
   GRANT ALL PRIVILEGES ON mubdev_db.* TO 'mubdev_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Update `backend/.env`:
   ```ini
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=mubdev_db
   DB_USER=mubdev_user
   DB_PASSWORD=StrongPasswordHere123!
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

---

## 5. Migration History
- `0001_initial`: Created initial model `ContactMessage` with table `mubdev_contact_messages`, constraints, and composite indexes.
