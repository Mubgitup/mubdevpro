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
  KEY `admin_username_idx` (`username`),
  KEY `admin_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 3: mubdev_projects
-- Stores portfolio showcase projects, academic works, and technology experiments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mubdev_projects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(80) NOT NULL DEFAULT 'Frontend',
  `short_description` TEXT NOT NULL,
  `full_description` LONGTEXT NULL,
  `technologies` TEXT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `github_url` VARCHAR(500) DEFAULT NULL,
  `live_url` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'published',
  `badge` VARCHAR(80) DEFAULT 'Portfolio',
  `display_order` INT NOT NULL DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `projects_status_idx` (`status`),
  KEY `projects_category_idx` (`category`),
  KEY `projects_order_idx` (`display_order` ASC, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 4: mubdev_education
-- Stores academic degrees, formal coursework, learning milestones, and institutions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mubdev_education` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `institution` VARCHAR(200) NOT NULL,
  `degree` VARCHAR(200) NOT NULL,
  `field_of_study` VARCHAR(200) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `start_date` VARCHAR(50) DEFAULT NULL,
  `end_date` VARCHAR(50) DEFAULT NULL,
  `is_current` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(80) NOT NULL DEFAULT 'In Progress / Current',
  `type` VARCHAR(80) NOT NULL DEFAULT 'Formal Degree Education',
  `location` VARCHAR(150) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `highlights` TEXT DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `education_order_idx` (`display_order` ASC, `created_at` DESC),
  KEY `education_current_idx` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
