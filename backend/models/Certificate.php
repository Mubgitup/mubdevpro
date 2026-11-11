<?php
/**
 * Mubdev Portfolio Backend - Certificate Model
 * 
 * Manages database queries, mutations, and persistence for certifications,
 * credentials, and coursework verifications using PDO prepared statements.
 */

require_once dirname(__DIR__) . '/config/Database.php';

class Certificate {
    /**
     * Format a database row into a typed array with backward-compatible aliases.
     */
    public static function formatRow(array $row): array {
        $skills = [];
        if (!empty($row['skills'])) {
            if (is_array($row['skills'])) {
                $skills = $row['skills'];
            } else {
                $decoded = json_decode($row['skills'], true);
                $skills = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $row['skills'])));
            }
        }

        $issueDate = (string)($row['issue_date'] ?? '');
        $verificationUrl = !empty($row['verification_url']) ? (string)$row['verification_url'] : null;
        $credentialId = !empty($row['credential_id']) ? (string)$row['credential_id'] : null;

        return [
            'id' => (int)$row['id'],
            'title' => (string)$row['title'],
            'issuer' => (string)$row['issuer'],
            'issue_date' => $issueDate,
            'issueDate' => $issueDate,               // Frontend alias
            'credential_id' => $credentialId,
            'credentialId' => $credentialId,         // Frontend alias
            'verification_url' => $verificationUrl,
            'url' => $verificationUrl,               // Frontend alias
            'image_url' => !empty($row['image_url']) ? (string)$row['image_url'] : null,
            'imageUrl' => !empty($row['image_url']) ? (string)$row['image_url'] : null, // Frontend alias
            'skills' => array_values($skills),
            'description' => (string)($row['description'] ?? ''),
            'display_order' => (int)($row['display_order'] ?? 0),
            'featured' => !empty($row['featured']),
            'created_at' => $row['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? null
        ];
    }

    /**
     * Retrieve all certificate records with search and sorting.
     */
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();

        $sql = "SELECT * FROM mubdev_certificates WHERE 1=1";
        $params = [];

        if (!empty($filters['search']) && trim($filters['search']) !== '') {
            $sql .= " AND (title LIKE :search OR issuer LIKE :searchIssuer OR credential_id LIKE :searchCred OR description LIKE :searchDesc)";
            $searchTerm = '%' . trim($filters['search']) . '%';
            $params[':search'] = $searchTerm;
            $params[':searchIssuer'] = $searchTerm;
            $params[':searchCred'] = $searchTerm;
            $params[':searchDesc'] = $searchTerm;
        }

        if (isset($filters['featured']) && $filters['featured'] !== '') {
            $sql .= " AND featured = :featured";
            $params[':featured'] = (int)$filters['featured'];
        }

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM (" . $sql . ") as filtered_certs");
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
            'certificates' => array_map([self::class, 'formatRow'], $rows),
            'total' => $totalCount,
            'page' => $page ?? 1,
            'limit' => $limit ?? count($rows)
        ];
    }

    /**
     * Retrieve a single certificate by ID.
     */
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM mubdev_certificates WHERE id = :id LIMIT 1");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch();
        return $row ? self::formatRow($row) : null;
    }

    /**
     * Create a new certificate record.
     */
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $skillsJson = is_array($data['skills'] ?? null)
            ? json_encode($data['skills'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : ($data['skills'] ?? '[]');

        $stmt = $pdo->prepare("
            INSERT INTO mubdev_certificates
            (title, issuer, issue_date, credential_id, verification_url, image_url, skills, description, display_order, featured, created_at)
            VALUES
            (:title, :issuer, :issue_date, :credential_id, :verification_url, :image_url, :skills, :description, :display_order, :featured, :created_at)
        ");

        $now = gmdate('Y-m-d H:i:s');
        $stmt->bindValue(':title', trim($data['title']));
        $stmt->bindValue(':issuer', trim($data['issuer']));
        $stmt->bindValue(':issue_date', trim($data['issue_date'] ?? $data['issueDate'] ?? ''));
        $stmt->bindValue(':credential_id', !empty($data['credential_id']) ? trim($data['credential_id']) : (!empty($data['credentialId']) ? trim($data['credentialId']) : null));
        $stmt->bindValue(':verification_url', !empty($data['verification_url']) ? trim($data['verification_url']) : (!empty($data['url']) ? trim($data['url']) : null));
        $stmt->bindValue(':image_url', !empty($data['image_url']) ? trim($data['image_url']) : null);
        $stmt->bindValue(':skills', $skillsJson);
        $stmt->bindValue(':description', trim($data['description'] ?? ''));
        $stmt->bindValue(':display_order', (int)($data['display_order'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':featured', !empty($data['featured']) ? 1 : 0, PDO::PARAM_INT);
        $stmt->bindValue(':created_at', $now);

        $stmt->execute();
        $newId = (int)$pdo->lastInsertId();

        return self::findById($newId);
    }

    /**
     * Update an existing certificate record.
     */
    public static function update(int $id, array $data): ?array {
        $existing = self::findById($id);
        if (!$existing) {
            return null;
        }

        $pdo = Database::getConnection();

        $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
        $issuer = isset($data['issuer']) ? trim($data['issuer']) : $existing['issuer'];
        $issueDate = isset($data['issue_date']) ? trim($data['issue_date']) : (isset($data['issueDate']) ? trim($data['issueDate']) : $existing['issue_date']);
        $credentialId = array_key_exists('credential_id', $data) ? $data['credential_id'] : (array_key_exists('credentialId', $data) ? $data['credentialId'] : $existing['credential_id']);
        $verificationUrl = array_key_exists('verification_url', $data) ? $data['verification_url'] : (array_key_exists('url', $data) ? $data['url'] : $existing['verification_url']);
        $imageUrl = array_key_exists('image_url', $data) ? $data['image_url'] : $existing['image_url'];
        
        $skills = $existing['skills'];
        if (isset($data['skills'])) {
            $skills = is_array($data['skills']) ? $data['skills'] : json_decode($data['skills'], true);
        }
        $skillsJson = json_encode($skills ?: [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $description = isset($data['description']) ? trim($data['description']) : $existing['description'];
        $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : $existing['display_order'];
        $featured = isset($data['featured']) ? (!empty($data['featured']) ? 1 : 0) : ($existing['featured'] ? 1 : 0);

        $stmt = $pdo->prepare("
            UPDATE mubdev_certificates
            SET title = :title,
                issuer = :issuer,
                issue_date = :issue_date,
                credential_id = :credential_id,
                verification_url = :verification_url,
                image_url = :image_url,
                skills = :skills,
                description = :description,
                display_order = :display_order,
                featured = :featured,
                updated_at = :updated_at
            WHERE id = :id
        ");

        $now = gmdate('Y-m-d H:i:s');
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':issuer', $issuer);
        $stmt->bindValue(':issue_date', $issueDate);
        $stmt->bindValue(':credential_id', !empty($credentialId) ? trim($credentialId) : null);
        $stmt->bindValue(':verification_url', !empty($verificationUrl) ? trim($verificationUrl) : null);
        $stmt->bindValue(':image_url', !empty($imageUrl) ? trim($imageUrl) : null);
        $stmt->bindValue(':skills', $skillsJson);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':display_order', $displayOrder, PDO::PARAM_INT);
        $stmt->bindValue(':featured', $featured, PDO::PARAM_INT);
        $stmt->bindValue(':updated_at', $now);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        $stmt->execute();
        return self::findById($id);
    }

    /**
     * Delete a certificate record.
     */
    public static function delete(int $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM mubdev_certificates WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
