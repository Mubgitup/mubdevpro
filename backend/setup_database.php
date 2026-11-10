<?php
/**
 * Mubdev Portfolio - Database Setup & Migration Script
 * 
 * Run via terminal: php backend/setup_database.php
 * Connects to your local MySQL server (XAMPP default port 3306, user 'root', empty password),
 * creates the `mubdev_db` database, and imports tables and the administrator account.
 */

$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$password = '';
$dbname = 'mubdev_db';

echo "========================================================\n";
echo "MUBDEV MYSQL DATABASE SETUP & PROVISIONING UTILITY\n";
echo "========================================================\n\n";

try {
    echo "[1/4] Connecting to MySQL server at {$host}:{$port}...\n";
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo ">>> Connected to MySQL server successfully!\n\n";

    echo "[2/4] Ensuring database `{$dbname}` exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `{$dbname}`");
    echo ">>> Database `{$dbname}` ready.\n\n";

    echo "[3/4] Provisioning tables (`admin_users`, `mubdev_contact_messages`, `mubdev_projects`, `mubdev_education`)...\n";
    $schemaSql = file_get_contents(__DIR__ . '/database/schema.sql');
    $pdo->exec($schemaSql);
    echo ">>> Database schema applied successfully.\n\n";

    echo "[4/4] Seeding default administrator, initial messages, projects, and education records...\n";
    $seedSql = file_get_contents(__DIR__ . '/database/seed.sql');
    $pdo->exec($seedSql);
    echo ">>> Seed data applied successfully.\n\n";

    echo "========================================================\n";
    echo "SETUP COMPLETED SUCCESSFULLY!\n";
    echo "MySQL database `{$dbname}` is fully active with:\n";
    echo "- Table `admin_users` (admin / AdminMubdev2026!)\n";
    echo "- Table `mubdev_contact_messages`\n";
    echo "- Table `mubdev_projects` (Full CRUD Portfolio Management)\n";
    echo "- Table `mubdev_education` (Full CRUD Education & Journey Management)\n";
    echo "========================================================\n";

} catch (PDOException $e) {
    echo ">>> ERROR connecting to MySQL: " . $e->getMessage() . "\n";
    echo "Please verify that MySQL is started in your XAMPP Control Panel.\n";
    exit(1);
}

