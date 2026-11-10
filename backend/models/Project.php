<?php
/**
 * Mubdev Portfolio Backend - Project Model
 * 
 * Manages database persistence, queries, and mutations for portfolio projects
 * using strictly parameterized PDO prepared statements.
 */

require_once dirname(__DIR__) . '/config/Database.php';

class Project {
    /**
     * Format a database row into a clean, typed array.
     */
    public static function formatRow(array $row): array {
        // Decode technologies JSON array
        $techs = [];
        if (!empty($row['technologies'])) {
            if (is_array($row['technologies'])) {
                $techs = $row['technologies'];
            } else {
                $decoded = json_decode($row['technologies'], true);
                $techs = is_array($decoded) ? $decoded : array_map('trim', explode(',', $row['technologies']));
            }
        }

        return [
            'id' => (int)$row['id'],
            'title' => (string)$row['title'],
            'category' => (string)($row['category'] ?? 'Frontend'),
            'short_description' => (string)$row['short_description'],
            'description' => (string)$row['short_description'], // Alias for backward compatibility
            'full_description' => $row['full_description'] ?? null,
            'technologies' => $techs,
            'image_url' => $row['image_url'] ?? null,
            'github_url' => $row['github_url'] ?? null,
            'githubUrl' => $row['github_url'] ?? null, // CamelCase alias for frontend
            'live_url' => $row['live_url'] ?? null,
            'liveUrl' => $row['live_url'] ?? null, // CamelCase alias for frontend
            'status' => (string)($row['status'] ?? 'published'),
            'badge' => (string)($row['badge'] ?? 'Portfolio'),
            'display_order' => (int)($row['display_order'] ?? 0),
            'featured' => (bool)($row['featured'] ?? false),
            'created_at' => $row['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? null
        ];
    }

    /**
     * Retrieve all published projects for the public website.
     * Ordered by display_order ascending, then created_at descending.
     */
    public static function getPublished(?string $category = null): array {
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM mubdev_projects WHERE status = 'published'";
        $params = [];

        if ($category && $category !== 'All') {
            $sql .= " AND category = :category";
            $params[':category'] = $category;
        }

        $sql .= " ORDER BY display_order ASC, created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        return array_map([self::class, 'formatRow'], $rows);
    }

    /**
     * Administrative query to list projects with searching, filtering, sorting, and pagination.
     */
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM mubdev_projects WHERE 1=1";
        $params = [];

        // 1. Search Filter (Title, Description, or Technologies)
        if (!empty($filters['search']) && $filters['search'] !== 'undefined' && trim($filters['search']) !== '') {
            $sql .= " AND (title LIKE :search OR short_description LIKE :searchDesc OR full_description LIKE :searchFull OR technologies LIKE :searchTech)";
            $searchTerm = '%' . trim($filters['search']) . '%';
            $params[':search'] = $searchTerm;
            $params[':searchDesc'] = $searchTerm;
            $params[':searchFull'] = $searchTerm;
            $params[':searchTech'] = $searchTerm;
        }

        // 2. Category Filter
        if (!empty($filters['category']) && strtolower($filters['category']) !== 'all' && $filters['category'] !== 'undefined') {
            $sql .= " AND category = :category";
            $params[':category'] = $filters['category'];
        }

        // 3. Status Filter (published / draft)
        if (!empty($filters['status']) && strtolower($filters['status']) !== 'all' && $filters['status'] !== 'undefined') {
            $sql .= " AND status = :status";
            $params[':status'] = strtolower($filters['status']);
        }

        // Total count before pagination
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM (" . $sql . ") as filtered_projects");
        $countStmt->execute($params);
        $totalCount = (int)$countStmt->fetchColumn();

        // 4. Sorting
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'oldest':
                $sql .= " ORDER BY created_at ASC";
                break;
            case 'order':
                $sql .= " ORDER BY display_order ASC, created_at DESC";
                break;
            case 'title':
                $sql .= " ORDER BY title ASC";
                break;
            case 'newest':
            default:
                $sql .= " ORDER BY created_at DESC";
                break;
        }

        // 5. Pagination
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
            'projects' => array_map([self::class, 'formatRow'], $rows),
            'total' => $totalCount,
            'page' => $page ?? 1,
            'limit' => $limit ?? $totalCount
        ];
    }

    /**
     * Find a single project by ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_projects WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();

        return $row ? self::formatRow($row) : null;
    }

    /**
     * Create a new project.
     */
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("
            INSERT INTO mubdev_projects 
            (title, category, short_description, full_description, technologies, image_url, github_url, live_url, status, badge, display_order, featured, created_at)
            VALUES 
            (:title, :category, :short_description, :full_description, :technologies, :image_url, :github_url, :live_url, :status, :badge, :display_order, :featured, :created_at)
        ");

        $now = gmdate('Y-m-d H:i:s');
        $techsJson = is_array($data['technologies']) ? json_encode(array_values($data['technologies'])) : (string)($data['technologies'] ?? '[]');

        $stmt->execute([
            ':title' => $data['title'],
            ':category' => $data['category'] ?? 'Frontend',
            ':short_description' => $data['short_description'],
            ':full_description' => $data['full_description'] ?? null,
            ':technologies' => $techsJson,
            ':image_url' => $data['image_url'] ?? null,
            ':github_url' => !empty($data['github_url']) ? $data['github_url'] : null,
            ':live_url' => !empty($data['live_url']) ? $data['live_url'] : null,
            ':status' => strtolower($data['status'] ?? 'published'),
            ':badge' => $data['badge'] ?? 'Portfolio',
            ':display_order' => (int)($data['display_order'] ?? 0),
            ':featured' => !empty($data['featured']) ? 1 : 0,
            ':created_at' => $now
        ]);

        $newId = (int)$pdo->lastInsertId();
        return self::findById($newId);
    }

    /**
     * Update an existing project.
     */
    public static function update(int $id, array $data): ?array {
        $existing = self::findById($id);
        if (!$existing) {
            return null;
        }

        $pdo = Database::getConnection();

        $fields = [];
        $params = [':id' => $id];

        if (array_key_exists('title', $data)) {
            $fields[] = "title = :title";
            $params[':title'] = $data['title'];
        }

        if (array_key_exists('category', $data)) {
            $fields[] = "category = :category";
            $params[':category'] = $data['category'];
        }

        if (array_key_exists('short_description', $data)) {
            $fields[] = "short_description = :short_description";
            $params[':short_description'] = $data['short_description'];
        }

        if (array_key_exists('full_description', $data)) {
            $fields[] = "full_description = :full_description";
            $params[':full_description'] = $data['full_description'];
        }

        if (array_key_exists('technologies', $data)) {
            $fields[] = "technologies = :technologies";
            $params[':technologies'] = is_array($data['technologies']) 
                ? json_encode(array_values($data['technologies'])) 
                : (string)$data['technologies'];
        }

        if (array_key_exists('image_url', $data)) {
            $fields[] = "image_url = :image_url";
            $params[':image_url'] = $data['image_url'];
        }

        if (array_key_exists('github_url', $data)) {
            $fields[] = "github_url = :github_url";
            $params[':github_url'] = !empty($data['github_url']) ? $data['github_url'] : null;
        }

        if (array_key_exists('live_url', $data)) {
            $fields[] = "live_url = :live_url";
            $params[':live_url'] = !empty($data['live_url']) ? $data['live_url'] : null;
        }

        if (array_key_exists('status', $data)) {
            $fields[] = "status = :status";
            $params[':status'] = strtolower($data['status']);
        }

        if (array_key_exists('badge', $data)) {
            $fields[] = "badge = :badge";
            $params[':badge'] = $data['badge'];
        }

        if (array_key_exists('display_order', $data)) {
            $fields[] = "display_order = :display_order";
            $params[':display_order'] = (int)$data['display_order'];
        }

        if (array_key_exists('featured', $data)) {
            $fields[] = "featured = :featured";
            $params[':featured'] = !empty($data['featured']) ? 1 : 0;
        }

        if (empty($fields)) {
            return $existing;
        }

        $sql = "UPDATE mubdev_projects SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id);
    }

    /**
     * Toggle or set status (published / draft).
     */
    public static function toggleStatus(int $id, ?string $newStatus = null): ?array {
        $existing = self::findById($id);
        if (!$existing) {
            return null;
        }

        if ($newStatus === null) {
            $newStatus = ($existing['status'] === 'published') ? 'draft' : 'published';
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE mubdev_projects SET status = :status WHERE id = :id");
        $stmt->execute([
            ':status' => strtolower($newStatus),
            ':id' => $id
        ]);

        return self::findById($id);
    }

    /**
     * Delete a project from database.
     */
    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM mubdev_projects WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
