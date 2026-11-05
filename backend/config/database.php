<?php
/**
 * Mubdev Portfolio Backend - Database Connection Manager (PDO)
 * 
 * Supports MySQL as primary enterprise target with automatic fallback
 * to SQLite for local development resilience when MySQL daemon is offline.
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

        if (strtolower($driver) === 'mysql') {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                self::$pdo = new PDO($dsn, $user, $password, $options);
                self::$activeEngine = 'mysql';
                return self::$pdo;
            } catch (PDOException $e) {
                // If MySQL is not reachable, fallback to SQLite for local development
                error_log("MySQL connection notice: " . $e->getMessage() . " - switching to SQLite fallback.");
            }
        }

        // SQLite fallback implementation
        $sqlitePath = dirname(__DIR__) . '/database/mubdev.sqlite';
        $isNew = !file_exists($sqlitePath);
        $dsn = "sqlite:{$sqlitePath}";
        
        self::$pdo = new PDO($dsn, null, null, $options);
        self::$activeEngine = 'sqlite';

        // Auto-provision tables if SQLite file was newly created
        if ($isNew) {
            self::initializeSqliteSchema(self::$pdo);
        }

        return self::$pdo;
    }

    public static function getActiveEngine(): string {
        return self::$activeEngine;
    }

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

        // Seed default administrator: admin / AdminMubdev2026!
        $adminStmt = $pdo->prepare("
            INSERT OR IGNORE INTO admin_users (id, username, email, password_hash, is_active, created_at)
            VALUES (1, 'admin', 'admin@mubdev.com', :hash, 1, datetime('now'))
        ");
        $adminStmt->execute([
            ':hash' => '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi'
        ]);

        // Seed preserved test records
        $msgStmt = $pdo->prepare("
            INSERT OR IGNORE INTO mubdev_contact_messages (id, name, email, subject, message, ip_address, is_read, created_at)
            VALUES 
            (1, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:04:18'),
            (2, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:17:27'),
            (3, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 0, '2026-11-03 16:53:11'),
            (4, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 0, '2026-11-05 06:32:47')
        ");
        $msgStmt->execute();
    }
}

