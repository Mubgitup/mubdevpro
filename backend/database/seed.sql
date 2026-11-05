-- ==============================================================================
-- MUBDEV PORTFOLIO DATABASE SEED DATA
-- Preserves existing contact inquiries and provisions default administrator
-- ==============================================================================

USE `mubdev_db`;

-- Seed default administrator account
-- Username: admin
-- Default Password: AdminMubdev2026! (Bcrypt hashed)
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `is_active`, `created_at`)
VALUES (
  1,
  'admin',
  'admin@mubdev.com',
  '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi',
  1,
  NOW()
)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- Seed preserved contact messages migrated from previous session
INSERT INTO `mubdev_contact_messages` (`id`, `name`, `email`, `subject`, `message`, `ip_address`, `is_read`, `created_at`)
VALUES 
(
  1,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  1,
  '2026-11-03 16:04:18'
),
(
  2,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  1,
  '2026-11-03 16:17:27'
),
(
  3,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  0,
  '2026-11-03 16:53:11'
),
(
  4,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  0,
  '2026-11-05 06:32:47'
)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

