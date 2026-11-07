<?php
/**
 * Mubdev Portfolio Backend - Administrator Model
 * 
 * Handles administrative accounts with secure bcrypt password hashing.
 * Supports authentication lookup via either username or email.
 */

require_once dirname(__DIR__) . '/config/database.php';

class AdminUser {
    /**
     * Locate an active administrator by either username or email address.
     */
    public static function findByUsername(string $identifier): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("
            SELECT id, username, email, password_hash, is_active, created_at, last_login 
            FROM admin_users 
            WHERE (username = :username OR email = :email) 
              AND is_active = 1 
            LIMIT 1
        ");
        $stmt->execute([
            ':username' => $identifier,
            ':email'    => $identifier
        ]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Retrieve an active administrator by primary key ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("
            SELECT id, username, email, is_active, created_at, last_login 
            FROM admin_users 
            WHERE id = :id AND is_active = 1 
            LIMIT 1
        ");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Record timestamp of successful authentication.
     */
    public static function updateLastLogin(int $id): void {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("UPDATE admin_users SET last_login = :now WHERE id = :id");
            $stmt->execute([
                ':now' => gmdate('Y-m-d H:i:s'),
                ':id' => $id
            ]);
        } catch (Throwable $e) {
            // Non-critical: log and proceed
            error_log("Failed to update last_login for admin [{$id}]: " . $e->getMessage());
        }
    }

    /**
     * Cryptographic verification using PHP's standard password_verify()
     */
    public static function verifyPassword(string $password, string $hash): bool {
        if ($password === '' || $hash === '') {
            return false;
        }
        return password_verify($password, $hash);
    }
}
