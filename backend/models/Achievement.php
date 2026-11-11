<?php
/**
 * Mubdev Portfolio Backend - Achievement Model
 * 
 * Manages database queries, mutations, and persistence for awards,
 * technical recognitions, and milestone achievements using PDO prepared statements.
 */

require_once dirname(__DIR__) . '/config/Database.php';

class Achievement {
    /**
     * Format a database row into a typed array.
     */
    public static function formatRow(array $row): array {
        $highlights = [];
        if (!empty($row['highlights'])) {
            if (is_array($row['highlights'])) {
                $highlights = $row['highlights'];
            } else {
                $decoded = json_decode($row['highlights'], true);
                $highlights = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $row['highlights'])));
            }
        }

        return [
            'id' => (int)$row['id'],
            'title' => (string)$row['title'],
            'category' => (string)($row['category'] ?? 'Technical Milestone'),
            'type' => (string)($row['category'] ?? 'Technical Milestone'),
            'organization' => !empty($row['organization']) ? (string)$row['organization'] : null,
            'institution' => !empty($row['organization']) ? (string)$row['organization'] : null,
            'date' => !empty($row['date']) ? (string)$row['date'] : null,
            'description' => (string)($row['description'] ?? ''),
            'image_url' => !empty($row['image_url']) ? (string)$row['image_url'] : null,
            'link_url' => !empty($row['link_url']) ? (string)$row['link_url'] : null,
            'url' => !empty($row['link_url']) ? (string)$row['link_url'] : null,
            'highlights' => array_values($highlights),
            'display_order' => (int)($row['display_order'] ?? 0),
            'featured' => !empty($row['featured']),
            'created_at' => $row['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? null
        ];
    }

    /**
     * Retrieve all achievements with optional search, category, and sorting.
     */
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM mubdev_achievements WHERE 1=1";
        $params = [];

        if (!empty($filters['search']) && trim($filters['search']) !== '') {
            $sql .= " AND (title LIKE :search OR organization LIKE :searchOrg OR description LIKE :searchDesc)";
            $searchTerm = '%' . trim($filters['search']) . '%';
            $params[':search'] = $searchTerm;
            $params[':searchOrg'] = $searchTerm;
            $params[':searchDesc'] = $searchTerm;
        }

        if (!empty($filters['category']) && strtolower($filters['category']) !== 'all') {
            $sql .= " AND category = :category";
            $params[':category'] = trim($filters['category']);
        }

        if (isset($filters['featured']) && $filters['featured'] !== '') {
            $sql .= " AND featured = :featured";
            $params[':featured'] = (int)$filters['featured'];
        }

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM (" . $sql . ") as filtered_achieve");
        $countStmt->execute($params);
        $totalCount = (int)$countStmt->fetchColumn();

        $sql .= " ORDER BY display_order ASC, created_at DESC";

        if (isset($filters['limit'])) {
            $limit = max(1, min(100, (int)$filters['limit']));
            $page = max(1, (int)($filters['page'] ?? 1));
            $offset = ($page - 1) * $limit;
            $sql .= " LIMIT :limit OFFSET :offset";
        }

        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        if (isset($limit)) {
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        }

        $stmt->execute();
        $rows = $stmt->fetchAll();

        return [
            'achievements' => array_map([self::class, 'formatRow'], $rows),
            'total' => $totalCount,
            'page' => $page ?? 1,
            'limit' => $limit ?? count($rows)
        ];
    }

    /**
     * Retrieve a single achievement by ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_achievements WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch();
        return $row ? self::formatRow($row) : null;
    }

    /**
     * Create a new achievement record.
     */
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $highlightsJson = is_array($data['highlights'] ?? null)
            ? json_encode($data['highlights'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : ($data['highlights'] ?? '[]');

        $stmt = $pdo->prepare("
            INSERT INTO mubdev_achievements
            (title, category, organization, date, description, image_url, link_url, highlights, display_order, featured, created_at)
            VALUES
            (:title, :category, :organization, :date, :description, :image_url, :link_url, :highlights, :display_order, :featured, :created_at)
        ");

        $now = gmdate('Y-m-d H:i:s');
        $stmt->bindValue(':title', trim($data['title']));
        $stmt->bindValue(':category', trim($data['category'] ?? 'Technical Milestone'));
        $stmt->bindValue(':organization', !empty($data['organization']) ? trim($data['organization']) : null);
        $stmt->bindValue(':date', !empty($data['date']) ? trim($data['date']) : null);
        $stmt->bindValue(':description', trim($data['description'] ?? ''));
        $stmt->bindValue(':image_url', !empty($data['image_url']) ? trim($data['image_url']) : null);
        $stmt->bindValue(':link_url', !empty($data['link_url']) ? trim($data['link_url']) : (!empty($data['url']) ? trim($data['url']) : null));
        $stmt->bindValue(':highlights', $highlightsJson);
        $stmt->bindValue(':display_order', (int)($data['display_order'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':featured', !empty($data['featured']) ? 1 : 0, PDO::PARAM_INT);
        $stmt->bindValue(':created_at', $now);

        $stmt->execute();
        $newId = (int)$pdo->lastInsertId();

        return self::findById($newId);
    }

    /**
     * Update an existing achievement record.
     */
    public static function update(int $id, array $data): ?array {
        $existing = self::findById($id);
        if (!$existing) {
            return null;
        }

        $pdo = Database::getConnection();

        $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
        $category = isset($data['category']) ? trim($data['category']) : $existing['category'];
        $organization = array_key_exists('organization', $data) ? $data['organization'] : $existing['organization'];
        $date = array_key_exists('date', $data) ? $data['date'] : $existing['date'];
        $description = isset($data['description']) ? trim($data['description']) : $existing['description'];
        $imageUrl = array_key_exists('image_url', $data) ? $data['image_url'] : $existing['image_url'];
        $linkUrl = array_key_exists('link_url', $data) ? $data['link_url'] : (array_key_exists('url', $data) ? $data['url'] : $existing['link_url']);

        $highlights = $existing['highlights'];
        if (isset($data['highlights'])) {
            $highlights = is_array($data['highlights']) ? $data['highlights'] : json_decode($data['highlights'], true);
        }
        $highlightsJson = json_encode($highlights ?: [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : $existing['display_order'];
        $featured = isset($data['featured']) ? (!empty($data['featured']) ? 1 : 0) : ($existing['featured'] ? 1 : 0);

        $stmt = $pdo->prepare("
            UPDATE mubdev_achievements
            SET title = :title,
                category = :category,
                organization = :organization,
                date = :date,
                description = :description,
                image_url = :image_url,
                link_url = :link_url,
                highlights = :highlights,
                display_order = :display_order,
                featured = :featured,
                updated_at = :updated_at
            WHERE id = :id
        ");

        $now = gmdate('Y-m-d H:i:s');
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':category', $category);
        $stmt->bindValue(':organization', !empty($organization) ? trim($organization) : null);
        $stmt->bindValue(':date', !empty($date) ? trim($date) : null);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':image_url', !empty($imageUrl) ? trim($imageUrl) : null);
        $stmt->bindValue(':link_url', !empty($linkUrl) ? trim($linkUrl) : null);
        $stmt->bindValue(':highlights', $highlightsJson);
        $stmt->bindValue(':display_order', $displayOrder, PDO::PARAM_INT);
        $stmt->bindValue(':featured', $featured, PDO::PARAM_INT);
        $stmt->bindValue(':updated_at', $now);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        $stmt->execute();
        return self::findById($id);
    }

    /**
     * Delete an achievement record.
     */
    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM mubdev_achievements WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
