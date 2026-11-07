<?php
/**
 * Mubdev Portfolio Backend - Database Connection Manager (PDO)
 * 
 * Supports MySQL as primary target with automatic schema provisioning,
 * database creation if missing, and local SQLite fallback for resilient development.
 */

class Database {
    private static ?PDO $pdo = null;
    private static string $activeEngine = 'unknown';

    public static function getConnection(): PDO {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $driver   = env('DB_DRIVER', 'mysql');
        $host     = env('DB_HOST', '127.0.0.1');
        $port     = env('DB_PORT', '3306');
        $dbname   = env('DB_NAME', 'mubdev_db');
        $user     = env('DB_USER', 'root');
        $password = env('DB_PASSWORD', '');

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        // 1. Attempt MySQL Connection
        if (strtolower($driver) === 'mysql') {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                self::$pdo = new PDO($dsn, $user, $password, $options);
                self::$activeEngine = 'mysql';
                
                // Ensure required tables and admin account exist in MySQL
                self::ensureMysqlSchema(self::$pdo);
                return self::$pdo;

            } catch (PDOException $e) {
                // Check if MySQL is running but the database does not exist (SQLSTATE 1049)
                $msg = $e->getMessage();
                if ($e->getCode() == 1049 || strpos($msg, 'Unknown database') !== false || strpos($msg, '1049') !== false) {
                    try {
                        // Connect to MySQL server without dbname to create it
                        $serverDsn = "mysql:host={$host};port={$port};charset=utf8mb4";
                        $serverPdo = new PDO($serverDsn, $user, $password, $options);
                        $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

                        // Reconnect to the newly created database
                        self::$pdo = new PDO($dsn, $user, $password, $options);
                        self::$activeEngine = 'mysql';
                        self::ensureMysqlSchema(self::$pdo);
                        return self::$pdo;
                    } catch (PDOException $createEx) {
                        error_log("Failed to auto-create MySQL database [{$dbname}]: " . $createEx->getMessage());
                    }
                }

                // If MySQL daemon is completely unreachable or blocked by permissions
                error_log("MySQL connection notice: " . $e->getMessage() . " - switching to SQLite fallback.");
            }
        }

        // 2. Resilient SQLite Fallback
        $sqlitePath = dirname(__DIR__) . '/database/mubdev.sqlite';
        $isNew = !file_exists($sqlitePath);
        $dsn = "sqlite:{$sqlitePath}";
        
        self::$pdo = new PDO($dsn, null, null, $options);
        self::$activeEngine = 'sqlite';

        // Auto-provision tables if SQLite was newly created or missing tables
        self::initializeSqliteSchema(self::$pdo);

        return self::$pdo;
    }

    public static function getActiveEngine(): string {
        return self::$activeEngine;
    }

    /**
     * Ensures MySQL tables and default administrator account exist.
     */
    private static function ensureMysqlSchema(PDO $pdo): void {
        // Table 1: mubdev_contact_messages
        $pdo->exec("
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
        ");

        // Table 2: admin_users
        $pdo->exec("
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
        ");

        // Verify administrator account exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM `admin_users` WHERE `username` = 'admin'");
        $stmt->execute();
        $adminCount = (int)$stmt->fetchColumn();

        if ($adminCount === 0) {
            $insert = $pdo->prepare("
                INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `is_active`, `created_at`)
                VALUES (1, 'admin', 'admin@mubdev.com', :hash, 1, NOW())
            ");
            $insert->execute([
                ':hash' => '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi'
            ]);
        }
    }

    /**
     * Ensures SQLite tables and default administrator account exist.
     */
    private static function initializeSqliteSchema(PDO $pdo): void {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS mubdev_contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                ip_address TEXT,
                is_read INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS contact_created_idx ON mubdev_contact_messages(created_at DESC);
            CREATE INDEX IF NOT EXISTS contact_email_idx ON mubdev_contact_messages(email);

            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_login TEXT
            );
            CREATE INDEX IF NOT EXISTS admin_username_idx ON admin_users(username);
        ");

        // Ensure default administrator: admin / AdminMubdev2026!
        $adminStmt = $pdo->prepare("
            INSERT OR IGNORE INTO admin_users (id, username, email, password_hash, is_active, created_at)
            VALUES (1, 'admin', 'admin@mubdev.com', :hash, 1, datetime('now'))
        ");
        $adminStmt->execute([
            ':hash' => '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi'
        ]);

        // Seed initial preserved test records if table is empty
        $count = $pdo->query("SELECT COUNT(*) FROM mubdev_contact_messages")->fetchColumn();
        if ((int)$count === 0) {
            $pdo->exec("
                INSERT OR IGNORE INTO mubdev_contact_messages (id, name, email, subject, message, ip_address, is_read, created_at)
                VALUES 
                (1, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:04:18'),
                (2, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:17:27')
            ");
        }
    }
}
