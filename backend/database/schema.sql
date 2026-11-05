-- ==============================================================================
-- MUBDEV PORTFOLIO DATABASE SCHEMA (MySQL 8.x / MariaDB)
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `mubdev_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `mubdev_db`;

-- ------------------------------------------------------------------------------
-- Table 1: mubdev_contact_messages
-- Stores verified inquiries and collaboration messages from portfolio visitors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mubdev_contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contact_created_idx` (`created_at` DESC),
  KEY `contact_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: admin_users
-- Stores administrative credentials for managing portfolio inquiries and content
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(254) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_username_idx` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

