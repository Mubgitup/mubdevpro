<?php
/**
 * Mubdev Portfolio Backend - Education Model
 * 
 * Manages database queries, mutations, and persistence for academic degrees,
 * coursework, and learning journey milestones using strictly parameterized PDO prepared statements.
 */

require_once dirname(__DIR__) . '/config/Database.php';

class Education {
    /**
     * Format a database row into a typed array with backward-compatible aliases.
     */
    public static function formatRow(array $row): array {
        // Decode highlights JSON or comma-separated string
        $highlights = [];
        if (!empty($row['highlights'])) {
            if (is_array($row['highlights'])) {
                $highlights = $row['highlights'];
            } else {
                $decoded = json_decode($row['highlights'], true);
                $highlights = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $row['highlights'])));
            }
        }

        $isCurrent = !empty($row['is_current']);

        return [
            'id' => (int)$row['id'],
            'institution' => (string)$row['institution'],
            'organization' => (string)$row['institution'], // Backward-compatible alias for JourneySection
            'degree' => (string)$row['degree'],
            'title' => (string)$row['degree'],             // Backward-compatible alias for TimelineItem
            'field_of_study' => !empty($row['field_of_study']) ? (string)$row['field_of_study'] : null,
            'description' => (string)($row['description'] ?? ''),
            'start_date' => !empty($row['start_date']) ? (string)$row['start_date'] : null,
            'end_date' => !empty($row['end_date']) ? (string)$row['end_date'] : ($isCurrent ? 'Present' : null),
            'is_current' => $isCurrent,
            'status' => (string)($row['status'] ?? ($isCurrent ? 'In Progress / Current' : 'Completed Milestone')),
            'type' => (string)($row['type'] ?? 'Formal Degree Education'),
            'location' => !empty($row['location']) ? (string)$row['location'] : null,
            'image_url' => !empty($row['image_url']) ? (string)$row['image_url'] : null,
            'highlights' => array_values($highlights),
            'display_order' => (int)($row['display_order'] ?? 0),
            'created_at' => $row['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? null
        ];
    }

    /**
     * Retrieve all education records with optional search, status filtering, and sorting.
     */
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM mubdev_education WHERE 1=1";
        $params = [];

        // 1. Search Query (Institution, Degree, Field of Study, or Description)
        if (!empty($filters['search']) && $filters['search'] !== 'undefined' && trim($filters['search']) !== '') {
            $sql .= " AND (institution LIKE :search OR degree LIKE :searchDegree OR field_of_study LIKE :searchField OR description LIKE :searchDesc)";
            $searchTerm = '%' . trim($filters['search']) . '%';
            $params[':search'] = $searchTerm;
            $params[':searchDegree'] = $searchTerm;
            $params[':searchField'] = $searchTerm;
            $params[':searchDesc'] = $searchTerm;
        }

        // 2. Status / Progress Filter
        if (!empty($filters['status']) && strtolower($filters['status']) !== 'all' && $filters['status'] !== 'undefined') {
            $statusVal = strtolower(trim($filters['status']));
            if ($statusVal === 'current' || $statusVal === 'studying' || $statusVal === '1') {
                $sql .= " AND is_current = 1";
            } elseif ($statusVal === 'completed' || $statusVal === '0') {
                $sql .= " AND is_current = 0";
            } else {
                $sql .= " AND status = :status";
                $params[':status'] = $filters['status'];
            }
        }

        // 3. Type Filter
        if (!empty($filters['type']) && strtolower($filters['type']) !== 'all' && $filters['type'] !== 'undefined') {
            $sql .= " AND type = :type";
            $params[':type'] = trim($filters['type']);
        }

        // Count total before pagination
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM (" . $sql . ") as filtered_edu");
        $countStmt->execute($params);
        $totalCount = (int)$countStmt->fetchColumn();

        // 4. Sorting
        $sort = $filters['sort'] ?? 'order';
        switch ($sort) {
            case 'newest':
                $sql .= " ORDER BY created_at DESC";
                break;
            case 'oldest':
                $sql .= " ORDER BY created_at ASC";
                break;
            case 'institution':
                $sql .= " ORDER BY institution ASC";
                break;
            case 'order':
            default:
                $sql .= " ORDER BY display_order ASC, created_at DESC";
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
            'education' => array_map([self::class, 'formatRow'], $rows),
            'total' => $totalCount,
            'page' => $page ?? 1,
            'limit' => $limit ?? count($rows)
        ];
    }

    /**
     * Retrieve a single education record by primary ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_education WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch();
        return $row ? self::formatRow($row) : null;
    }

    /**
     * Create a new education record.
     */
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $highlightsJson = '[]';
        if (!empty($data['highlights'])) {
            $highlightsJson = is_array($data['highlights']) 
                ? json_encode(array_values($data['highlights']), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                : (string)$data['highlights'];
        }

        $isCurrent = !empty($data['is_current']) ? 1 : 0;
        $now = gmdate('Y-m-d H:i:s');

        $sql = "
            INSERT INTO mubdev_education 
            (institution, degree, field_of_study, description, start_date, end_date, is_current, status, type, location, image_url, highlights, display_order, created_at)
            VALUES 
            (:institution, :degree, :field_of_study, :description, :start_date, :end_date, :is_current, :status, :type, :location, :image_url, :highlights, :display_order, :created_at)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':institution' => (string)$data['institution'],
            ':degree' => (string)$data['degree'],
            ':field_of_study' => !empty($data['field_of_study']) ? (string)$data['field_of_study'] : null,
            ':description' => (string)($data['description'] ?? ''),
            ':start_date' => !empty($data['start_date']) ? (string)$data['start_date'] : null,
            ':end_date' => $isCurrent ? 'Present' : (!empty($data['end_date']) ? (string)$data['end_date'] : null),
            ':is_current' => $isCurrent,
            ':status' => (string)($data['status'] ?? ($isCurrent ? 'In Progress / Current' : 'Completed Milestone')),
            ':type' => (string)($data['type'] ?? 'Formal Degree Education'),
            ':location' => !empty($data['location']) ? (string)$data['location'] : null,
            ':image_url' => !empty($data['image_url']) ? (string)$data['image_url'] : null,
            ':highlights' => $highlightsJson,
            ':display_order' => (int)($data['display_order'] ?? 0),
            ':created_at' => $now
        ]);

        $newId = (int)$pdo->lastInsertId();
        return self::findById($newId);
    }

    /**
     * Update an existing education record by ID.
     * Preserves unchanged fields and prevents inserting duplicate rows.
     */
    public static function update(int $id, array $data): ?array {
        $existing = self::findById($id);
        if (!$existing) {
            return null;
        }

        $pdo = Database::getConnection();
        $fields = [];
        $params = [':id' => $id];

        if (array_key_exists('institution', $data)) {
            $fields[] = "institution = :institution";
            $params[':institution'] = (string)$data['institution'];
        }

        if (array_key_exists('degree', $data)) {
            $fields[] = "degree = :degree";
            $params[':degree'] = (string)$data['degree'];
        }

        if (array_key_exists('field_of_study', $data)) {
            $fields[] = "field_of_study = :field_of_study";
            $params[':field_of_study'] = !empty($data['field_of_study']) ? (string)$data['field_of_study'] : null;
        }

        if (array_key_exists('description', $data)) {
            $fields[] = "description = :description";
            $params[':description'] = (string)$data['description'];
        }

        if (array_key_exists('start_date', $data)) {
            $fields[] = "start_date = :start_date";
            $params[':start_date'] = !empty($data['start_date']) ? (string)$data['start_date'] : null;
        }

        if (array_key_exists('end_date', $data)) {
            $fields[] = "end_date = :end_date";
            $params[':end_date'] = !empty($data['end_date']) ? (string)$data['end_date'] : null;
        }

        if (array_key_exists('is_current', $data)) {
            $isCurrent = !empty($data['is_current']) ? 1 : 0;
            $fields[] = "is_current = :is_current";
            $params[':is_current'] = $isCurrent;

            // If marked as current, ensure end_date is set to 'Present' unless explicitly provided
            if ($isCurrent && !array_key_exists('end_date', $data)) {
                $fields[] = "end_date = 'Present'";
            }
        }

        if (array_key_exists('status', $data)) {
            $fields[] = "status = :status";
            $params[':status'] = (string)$data['status'];
        }

        if (array_key_exists('type', $data)) {
            $fields[] = "type = :type";
            $params[':type'] = (string)$data['type'];
        }

        if (array_key_exists('location', $data)) {
            $fields[] = "location = :location";
            $params[':location'] = !empty($data['location']) ? (string)$data['location'] : null;
        }

        if (array_key_exists('image_url', $data)) {
            $fields[] = "image_url = :image_url";
            $params[':image_url'] = !empty($data['image_url']) ? (string)$data['image_url'] : null;
        }

        if (array_key_exists('highlights', $data)) {
            $fields[] = "highlights = :highlights";
            $params[':highlights'] = is_array($data['highlights']) 
                ? json_encode(array_values($data['highlights']), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) 
                : (string)$data['highlights'];
        }

        if (array_key_exists('display_order', $data)) {
            $fields[] = "display_order = :display_order";
            $params[':display_order'] = (int)$data['display_order'];
        }

        if (empty($fields)) {
            return $existing;
        }

        $sql = "UPDATE mubdev_education SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id);
    }

    /**
     * Delete an education record by ID.
     */
    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM mubdev_education WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
