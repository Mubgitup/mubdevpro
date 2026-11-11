<?php
/**
 * Mubdev Portfolio Backend - Site Image Model
 * 
 * Manages core website images (Hero profile photo, About section photo, OpenGraph, etc.)
 * stored in the database with relative paths and metadata.
 */

require_once dirname(__DIR__) . '/config/database.php';

class SiteImage {
    /**
     * Get all site images indexed by image_key.
     */
    public static function getAll(): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM mubdev_site_images ORDER BY id ASC");
        $rows = $stmt->fetchAll();

        $result = [];
        foreach ($rows as $row) {
            $result[$row['image_key']] = $row;
        }

        return $result;
    }

    /**
     * Get single site image by key.
     */
    public static function getByKey(string $key): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_site_images WHERE image_key = :key LIMIT 1");
        $stmt->execute([':key' => $key]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    /**
     * Set or update a site image record.
     */
    public static function set(string $key, array $data): bool {
        $pdo = Database::getConnection();
        $existing = self::getByKey($key);

        if ($existing) {
            $stmt = $pdo->prepare("
                UPDATE mubdev_site_images 
                SET image_url = :image_url,
                    title = COALESCE(:title, title),
                    section = COALESCE(:section, section),
                    aspect_ratio = COALESCE(:aspect_ratio, aspect_ratio),
                    alt_text = COALESCE(:alt_text, alt_text),
                    updated_at = CURRENT_TIMESTAMP
                WHERE image_key = :key
            ");
            return $stmt->execute([
                ':key'          => $key,
                ':image_url'    => $data['image_url'],
                ':title'        => $data['title'] ?? null,
                ':section'      => $data['section'] ?? null,
                ':aspect_ratio' => $data['aspect_ratio'] ?? null,
                ':alt_text'     => $data['alt_text'] ?? null,
            ]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO mubdev_site_images 
                (image_key, section, title, image_url, aspect_ratio, alt_text, updated_at)
                VALUES 
                (:key, :section, :title, :image_url, :aspect_ratio, :alt_text, CURRENT_TIMESTAMP)
            ");
            return $stmt->execute([
                ':key'          => $key,
                ':section'      => $data['section'] ?? 'Website Image',
                ':title'        => $data['title'] ?? ucfirst(str_replace('_', ' ', $key)),
                ':image_url'    => $data['image_url'],
                ':aspect_ratio' => $data['aspect_ratio'] ?? '1:1',
                ':alt_text'     => $data['alt_text'] ?? '',
            ]);
        }
    }

    /**
     * Reset or remove custom site image.
     */
    public static function reset(string $key, string $defaultUrl = '/src/assets/images/mubdev-hero.jpg'): bool {
        return self::set($key, ['image_url' => $defaultUrl]);
    }
}
