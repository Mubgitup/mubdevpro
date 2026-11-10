<?php
/**
 * Mubdev Portfolio Backend - Database Connection Manager (PDO)
 * 
 * Supports MySQL as primary target with automatic schema provisioning,
 * database creation if missing, and local SQLite fallback for resilient development.
 */

require_once __DIR__ . '/app.php';

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
     * Ensures MySQL tables, projects, and default administrator account exist.
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

        // Table 3: mubdev_projects
        $pdo->exec("
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
        ");

        // Table 4: mubdev_education
        $pdo->exec("
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

        // Verify and seed initial projects if table is empty
        $projectCount = (int)$pdo->query("SELECT COUNT(*) FROM `mubdev_projects`")->fetchColumn();
        if ($projectCount === 0) {
            self::seedDefaultProjects($pdo);
        }

        // Verify and seed initial education milestones if table is empty
        $eduCount = (int)$pdo->query("SELECT COUNT(*) FROM `mubdev_education`")->fetchColumn();
        if ($eduCount === 0) {
            self::seedDefaultEducation($pdo);
        }
    }

    /**
     * Ensures SQLite tables, projects, and default administrator account exist.
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

            CREATE TABLE IF NOT EXISTS mubdev_projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT DEFAULT 'Frontend',
                short_description TEXT NOT NULL,
                full_description TEXT,
                technologies TEXT NOT NULL,
                image_url TEXT,
                github_url TEXT,
                live_url TEXT,
                status TEXT DEFAULT 'published',
                badge TEXT DEFAULT 'Portfolio',
                display_order INTEGER DEFAULT 0,
                featured INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS projects_status_idx ON mubdev_projects(status);
            CREATE INDEX IF NOT EXISTS projects_category_idx ON mubdev_projects(category);
            CREATE INDEX IF NOT EXISTS projects_order_idx ON mubdev_projects(display_order ASC, created_at DESC);
            CREATE TABLE IF NOT EXISTS mubdev_education (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                institution TEXT NOT NULL,
                degree TEXT NOT NULL,
                field_of_study TEXT,
                description TEXT,
                start_date TEXT,
                end_date TEXT,
                is_current INTEGER DEFAULT 0,
                status TEXT DEFAULT 'In Progress / Current',
                type TEXT DEFAULT 'Formal Degree Education',
                location TEXT,
                image_url TEXT,
                highlights TEXT,
                display_order INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS education_order_idx ON mubdev_education(display_order ASC, created_at DESC);
            CREATE INDEX IF NOT EXISTS education_current_idx ON mubdev_education(is_current);
        ");

        // Ensure default administrator: admin / AdminMubdev2026!
        $adminStmt = $pdo->prepare("
            INSERT OR IGNORE INTO admin_users (id, username, email, password_hash, is_active, created_at)
            VALUES (1, 'admin', 'admin@mubdev.com', :hash, 1, datetime('now'))
        ");
        $adminStmt->execute([
            ':hash' => '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi'
        ]);

        // Seed initial preserved test messages if table is empty
        $count = $pdo->query("SELECT COUNT(*) FROM mubdev_contact_messages")->fetchColumn();
        if ((int)$count === 0) {
            $pdo->exec("
                INSERT OR IGNORE INTO mubdev_contact_messages (id, name, email, subject, message, ip_address, is_read, created_at)
                VALUES 
                (1, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:04:18'),
                (2, 'Mubarek Test Visitor', 'visitor@example.com', 'Inquiry regarding Full-Stack Development', 'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.', '127.0.0.1', 1, '2026-11-03 16:17:27')
            ");
        }

        // Seed default projects if empty
        $projectCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_projects")->fetchColumn();
        if ($projectCount === 0) {
            self::seedDefaultProjects($pdo);
        }

        // Seed default education milestones if empty
        $eduCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_education")->fetchColumn();
        if ($eduCount === 0) {
            self::seedDefaultEducation($pdo);
        }
    }

    /**
     * Seeds initial authentic projects with database-agnostic prepared statements.
     */
    private static function seedDefaultProjects(PDO $pdo): void {
        $stmt = $pdo->prepare("
            INSERT INTO mubdev_projects 
            (id, title, category, short_description, full_description, technologies, image_url, github_url, live_url, status, badge, display_order, featured, created_at)
            VALUES 
            (:id, :title, :category, :short_description, :full_description, :technologies, :image_url, :github_url, :live_url, :status, :badge, :display_order, :featured, :created_at)
        ");

        $defaultProjects = [
            [
                'id' => 1,
                'title' => 'Mubdev — Personal Brand Website',
                'category' => 'Frontend',
                'short_description' => 'Personal brand and developer portfolio built with React, Vite, Framer Motion, and a custom futuristic dark glassmorphic design system.',
                'full_description' => 'Comprehensive personal developer brand and portfolio application showcasing responsive layouts, authentic vector technology logos, interactive 3D hero stage, and an administrative control panel for inquiry and project management.',
                'technologies' => json_encode(['React', 'JavaScript', 'CSS3 Variables', 'Framer Motion']),
                'image_url' => '/src/assets/images/mubdev-hero.jpg',
                'github_url' => 'https://github.com/placeholder/mubdev',
                'live_url' => '#hero',
                'status' => 'published',
                'badge' => 'Portfolio / Current',
                'display_order' => 1,
                'featured' => 1,
                'created_at' => '2026-11-01 10:00:00'
            ],
            [
                'id' => 2,
                'title' => 'Student Course Portal & Management',
                'category' => 'Full-Stack',
                'short_description' => 'Academic practice application demonstrating relational data modeling, student registration workflows, and course enrollment records.',
                'full_description' => 'Full-stack student course portal built with Python, Django, and MySQL. Implements student authentication, course catalog browsing, enrollment limit validations, and administrative grading dashboards.',
                'technologies' => json_encode(['Python', 'Django', 'MySQL', 'HTML/CSS']),
                'image_url' => null,
                'github_url' => 'https://github.com/placeholder/course-portal',
                'live_url' => null,
                'status' => 'published',
                'badge' => 'Academic Practice',
                'display_order' => 2,
                'featured' => 1,
                'created_at' => '2026-11-02 11:30:00'
            ],
            [
                'id' => 3,
                'title' => 'Data Structures & Algorithms Workbench',
                'category' => 'Systems & C++',
                'short_description' => 'Comprehensive collection of fundamental data structures, memory allocation experiments, and sorting algorithm implementations in modern C++.',
                'full_description' => 'High-performance C++ workbench showcasing manual memory management, custom linked lists, binary search trees, hash tables, and algorithm benchmarking suites with visual complexity outputs.',
                'technologies' => json_encode(['C++', 'OOP', 'Data Structures', 'Algorithms']),
                'image_url' => null,
                'github_url' => 'https://github.com/placeholder/cpp-algorithms',
                'live_url' => null,
                'status' => 'published',
                'badge' => 'Systems & Algorithms',
                'display_order' => 3,
                'featured' => 1,
                'created_at' => '2026-11-03 14:15:00'
            ],
            [
                'id' => 4,
                'title' => 'Udacity Web Development Showcase',
                'category' => 'Frontend',
                'short_description' => 'Responsive interactive web application developed during Udacity coursework focusing on modular JavaScript, DOM manipulation, and responsive UI layout.',
                'full_description' => 'Front-end web development project highlighting semantic HTML5 architecture, responsive Flexbox and Grid layouts, dynamic DOM event listeners, and asynchronous Web API integration.',
                'technologies' => json_encode(['JavaScript', 'HTML5', 'CSS3', 'Web APIs']),
                'image_url' => null,
                'github_url' => 'https://github.com/placeholder/udacity-web-project',
                'live_url' => null,
                'status' => 'published',
                'badge' => 'Course Project',
                'display_order' => 4,
                'featured' => 0,
                'created_at' => '2026-11-04 16:45:00'
            ]
        ];

        foreach ($defaultProjects as $proj) {
            try {
                $stmt->execute([
                    ':id' => $proj['id'],
                    ':title' => $proj['title'],
                    ':category' => $proj['category'],
                    ':short_description' => $proj['short_description'],
                    ':full_description' => $proj['full_description'],
                    ':technologies' => $proj['technologies'],
                    ':image_url' => $proj['image_url'],
                    ':github_url' => $proj['github_url'],
                    ':live_url' => $proj['live_url'],
                    ':status' => $proj['status'],
                    ':badge' => $proj['badge'],
                    ':display_order' => $proj['display_order'],
                    ':featured' => $proj['featured'],
                    ':created_at' => $proj['created_at']
                ]);
            } catch (Throwable $e) {
                // Ignore if record already exists
            }
        }
    }

    /**
     * Seeds initial authentic education records & learning milestones.
     */
    private static function seedDefaultEducation(PDO $pdo): void {
        $stmt = $pdo->prepare("
            INSERT INTO mubdev_education 
            (id, institution, degree, field_of_study, description, start_date, end_date, is_current, status, type, location, image_url, highlights, display_order, created_at)
            VALUES 
            (:id, :institution, :degree, :field_of_study, :description, :start_date, :end_date, :is_current, :status, :type, :location, :image_url, :highlights, :display_order, :created_at)
        ");

        $defaultEducation = [
            [
                'id' => 1,
                'institution' => 'Haramaya University',
                'degree' => 'Third-Year Software Engineering Studies',
                'field_of_study' => 'Software Engineering',
                'description' => 'Pursuing Software Engineering degree coursework covering Object-Oriented Programming, Database Systems, Software Requirements & Design, and Systems Programming.',
                'start_date' => '2022',
                'end_date' => '2026',
                'is_current' => 1,
                'status' => 'Current Academic Standing',
                'type' => 'Formal Degree Education',
                'location' => 'Dire Dawa, Ethiopia',
                'image_url' => null,
                'highlights' => json_encode(['C++ & Systems Programming', 'Object-Oriented Design', 'Software Engineering Principles', 'Database Design']),
                'display_order' => 1,
                'created_at' => '2026-11-01 10:00:00'
            ],
            [
                'id' => 2,
                'institution' => 'Self-Directed & Hands-on Exploration',
                'degree' => 'Full-Stack Expansion & Advanced Backend',
                'field_of_study' => 'Full-Stack Engineering & System Architecture',
                'description' => 'Deepening full-stack engineering capabilities with Django REST Framework, PHP backend fundamentals, MySQL relational database architecture, and scalable system design.',
                'start_date' => '2023',
                'end_date' => 'Present',
                'is_current' => 1,
                'status' => 'In Progress / Current',
                'type' => 'Skill Development',
                'location' => 'Independent / Remote',
                'image_url' => null,
                'highlights' => json_encode(['Django REST Framework', 'PHP server-side scripting', 'MySQL database modeling', 'API architecture']),
                'display_order' => 2,
                'created_at' => '2026-11-02 11:30:00'
            ],
            [
                'id' => 3,
                'institution' => 'Independent Lab & Practice Work',
                'degree' => 'Practical Software & Application Development',
                'field_of_study' => 'Applied Software Engineering',
                'description' => 'Engineering practice projects, translating theoretical concepts from coursework into real code, algorithmic problem solving, and modern frontend interfaces.',
                'start_date' => '2023',
                'end_date' => 'Present',
                'is_current' => 1,
                'status' => 'Continuous',
                'type' => 'Applied Experience',
                'location' => 'Independent / Remote',
                'image_url' => null,
                'highlights' => json_encode(['React component engineering', 'Full-stack prototyping', 'Algorithmic problem solving']),
                'display_order' => 3,
                'created_at' => '2026-11-03 14:00:00'
            ],
            [
                'id' => 4,
                'institution' => 'Udacity Coursework',
                'degree' => 'Udacity Web Development Program',
                'field_of_study' => 'Frontend & Modern Web Technologies',
                'description' => 'Completed foundational and intermediate web development curriculum covering modern semantic HTML, advanced CSS layouts, responsive design, and core JavaScript concepts.',
                'start_date' => '2023',
                'end_date' => '2024',
                'is_current' => 0,
                'status' => 'Completed Milestone',
                'type' => 'Professional Coursework',
                'location' => 'Online Course',
                'image_url' => null,
                'highlights' => json_encode(['Responsive web design', 'Vanilla JavaScript & DOM manipulation', 'Modern CSS layout models']),
                'display_order' => 4,
                'created_at' => '2026-11-04 16:00:00'
            ]
        ];

        foreach ($defaultEducation as $edu) {
            try {
                $stmt->execute([
                    ':id' => $edu['id'],
                    ':institution' => $edu['institution'],
                    ':degree' => $edu['degree'],
                    ':field_of_study' => $edu['field_of_study'],
                    ':description' => $edu['description'],
                    ':start_date' => $edu['start_date'],
                    ':end_date' => $edu['end_date'],
                    ':is_current' => $edu['is_current'],
                    ':status' => $edu['status'],
                    ':type' => $edu['type'],
                    ':location' => $edu['location'],
                    ':image_url' => $edu['image_url'],
                    ':highlights' => $edu['highlights'],
                    ':display_order' => $edu['display_order'],
                    ':created_at' => $edu['created_at']
                ]);
            } catch (Throwable $e) {
                // Ignore if record already exists
            }
        }
    }
}
