<?php
/**
 * Mubdev Portfolio Backend - Administrator Model
 * 
 * Handles administrative accounts with secure bcrypt password hashing.
 */

require_once dirname(__DIR__) . '/config/database.php';

class AdminUser {
    public static function findByUsername(string $username): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :username AND is_active = 1 LIMIT 1");
        $stmt->execute([':username' => $username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, username, email, is_active, created_at, last_login FROM admin_users WHERE id = :id AND is_active = 1 LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function updateLastLogin(int $id): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE admin_users SET last_login = :now WHERE id = :id");
        $stmt->execute([
            ':now' => gmdate('Y-m-d H:i:s'),
            ':id' => $id
        ]);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}

