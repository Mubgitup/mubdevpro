<?php
/**
 * Mubdev Portfolio Backend - Contact Message Model
 * 
 * Manages database persistence and queries for visitor inquiries
 * using strictly parameterized PDO prepared statements.
 */

require_once dirname(__DIR__) . '/config/database.php';

class ContactMessage {
    /**
     * Persist a new validated contact submission into MySQL/SQLite.
     */
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("
            INSERT INTO mubdev_contact_messages (name, email, subject, message, ip_address, is_read, created_at)
            VALUES (:name, :email, :subject, :message, :ip_address, 0, :created_at)
        ");

        $now = gmdate('Y-m-d H:i:s');
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':subject' => $data['subject'],
            ':message' => $data['message'],
            ':ip_address' => $data['ip_address'] ?? null,
            ':created_at' => $now
        ]);

        $id = (int)$pdo->lastInsertId();

        return [
            'id' => $id,
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'created_at' => gmdate('c', strtotime($now))
        ];
    }

    /**
     * Retrieve all messages ordered chronologically (newest first).
     */
    public static function getAll(int $limit = 50, int $offset = 0): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("
            SELECT id, name, email, subject, message, ip_address, is_read, created_at 
            FROM mubdev_contact_messages 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Find a single message by ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_contact_messages WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Update message review status (is_read flag).
     */
    public static function setReadStatus(int $id, bool $isRead): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE mubdev_contact_messages SET is_read = :is_read WHERE id = :id");
        return $stmt->execute([
            ':is_read' => $isRead ? 1 : 0,
            ':id' => $id
        ]);
    }

    /**
     * Delete a contact message record.
     */
    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM mubdev_contact_messages WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

