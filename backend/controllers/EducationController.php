<?php
/**
 * Mubdev Portfolio Backend - Education & Journey Controller
 * 
 * Exposes RESTful endpoints for retrieving, adding, editing, and deleting
 * academic milestones and qualifications.
 */

require_once dirname(__DIR__) . '/models/Education.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class EducationController {
    /**
     * Safely parse request body across JSON, standard POST, and multipart form-data.
     */
    private static function parseRequestInput(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (stripos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            return is_array($data) ? $data : [];
        }

        if (!empty($_POST)) {
            return $_POST;
        }

        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $data = json_decode($raw, true);
            if (is_array($data)) {
                return $data;
            }
            parse_str($raw, $parsed);
            if (is_array($parsed)) {
                return $parsed;
            }
        }

        return [];
    }

    /**
     * Handles optional uploaded institution logo or image file safely.
     */
    private static function handleImageUpload(array $file): ?string {
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('Image file exceeds the 5MB size limit.', ['image' => ['File exceeds 5MB']], 422);
        }

        // Validate MIME type
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg',
            'image/gif'  => 'gif'
        ];

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($detectedMime, $allowedMimes)) {
            Response::error('Invalid image type. Supported: JPG, PNG, WEBP, SVG, GIF.', ['image' => ['Unsupported image format']], 422);
        }

        $extension = $allowedMimes[$detectedMime];
        $uploadDir = dirname(__DIR__) . '/uploads/education/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uniqueFilename = 'edu_' . bin2hex(random_bytes(10)) . '_' . time() . '.' . $extension;
        $targetPath = $uploadDir . $uniqueFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to store uploaded image on server.', null, 500);
        }

        return '/uploads/education/' . $uniqueFilename;
    }

    /**
     * GET /api/education
     * Retrieves all education records with search, status filtering, and sorting.
     */
    public static function list(): void {
        $filters = [
            'search'   => isset($_GET['search']) && $_GET['search'] !== 'undefined' && trim($_GET['search']) !== '' ? trim($_GET['search']) : null,
            'status'   => isset($_GET['status']) && $_GET['status'] !== 'undefined' && strtolower($_GET['status']) !== 'all' ? trim($_GET['status']) : null,
            'type'     => isset($_GET['type']) && $_GET['type'] !== 'undefined' && strtolower($_GET['type']) !== 'all' ? trim($_GET['type']) : null,
            'sort'     => isset($_GET['sort']) && $_GET['sort'] !== 'undefined' ? trim($_GET['sort']) : 'order',
            'limit'    => isset($_GET['limit']) ? (int)$_GET['limit'] : 100,
            'page'     => isset($_GET['page']) ? (int)$_GET['page'] : 1
        ];

        $result = Education::getAll($filters);

        // Calculate summary counters
        $pdo = Database::getConnection();
        $totalAll = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_education")->fetchColumn();
        $currentCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_education WHERE is_current = 1")->fetchColumn();
        $completedCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_education WHERE is_current = 0")->fetchColumn();

        Response::json([
            'success' => true,
            'message' => 'Education records retrieved successfully.',
            'data' => $result['education'],
            'education' => $result['education'], // Dual-compatibility alias
            'meta' => [
                'total' => $result['total'],
                'total_all' => $totalAll,
                'current_count' => $currentCount,
                'completed_count' => $completedCount,
                'page' => $result['page'],
                'limit' => $result['limit']
            ]
        ], 200);
    }

    /**
     * GET /api/education/{id}
     * Retrieves full details for a single education record.
     */
    public static function getSingle(int $id): void {
        $record = Education::findById($id);

        if (!$record) {
            Response::error("Education record #{$id} was not found.", null, 404);
        }

        Response::success('Education record retrieved.', $record);
    }

    /**
     * POST /api/education
     * Add a new education milestone.
     */
    public static function create(): void {
        AuthMiddleware::authenticate();

        $input = self::parseRequestInput();

        // 1. Validation
        $institution = trim((string)($input['institution'] ?? $input['organization'] ?? ''));
        $degree = trim((string)($input['degree'] ?? $input['title'] ?? ''));

        $errors = [];
        if ($institution === '') {
            $errors['institution'] = ['Institution name is required.'];
        } elseif (mb_strlen($institution) < 2) {
            $errors['institution'] = ['Institution name must be at least 2 characters.'];
        }

        if ($degree === '') {
            $errors['degree'] = ['Degree or qualification is required.'];
        } elseif (mb_strlen($degree) < 2) {
            $errors['degree'] = ['Degree must be at least 2 characters.'];
        }

        if (!empty($errors)) {
            Response::error('Validation failed. Please correct the highlighted errors.', $errors, 422);
        }

        // 2. Process image upload if provided
        $imageUrl = null;
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imageUrl = self::handleImageUpload($_FILES['image']);
        } elseif (!empty($input['image_url'])) {
            $imageUrl = trim((string)$input['image_url']);
        }

        // 3. Process highlights
        $highlights = [];
        if (isset($input['highlights'])) {
            if (is_array($input['highlights'])) {
                $highlights = $input['highlights'];
            } else {
                $decoded = json_decode($input['highlights'], true);
                $highlights = is_array($decoded) 
                    ? $decoded 
                    : array_filter(array_map('trim', explode(',', $input['highlights'])));
            }
        }

        $isCurrent = !empty($input['is_current']) || (isset($input['is_current']) && ($input['is_current'] === '1' || $input['is_current'] === 'true'));

        $data = [
            'institution' => htmlspecialchars($institution, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            'degree' => htmlspecialchars($degree, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            'field_of_study' => !empty($input['field_of_study']) ? htmlspecialchars(trim((string)$input['field_of_study']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null,
            'description' => !empty($input['description']) ? htmlspecialchars(trim((string)$input['description']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : '',
            'start_date' => !empty($input['start_date']) ? trim((string)$input['start_date']) : null,
            'end_date' => $isCurrent ? 'Present' : (!empty($input['end_date']) ? trim((string)$input['end_date']) : null),
            'is_current' => $isCurrent ? 1 : 0,
            'status' => !empty($input['status']) ? trim((string)$input['status']) : ($isCurrent ? 'In Progress / Current' : 'Completed Milestone'),
            'type' => !empty($input['type']) ? trim((string)$input['type']) : 'Formal Degree Education',
            'location' => !empty($input['location']) ? htmlspecialchars(trim((string)$input['location']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null,
            'image_url' => $imageUrl,
            'highlights' => $highlights,
            'display_order' => isset($input['display_order']) ? (int)$input['display_order'] : 0
        ];

        try {
            $created = Education::create($data);
            Response::success("Education record \"{$created['degree']}\" created successfully.", $created, 201);
        } catch (Throwable $e) {
            error_log("Failed to create education record: " . $e->getMessage());
            Response::error('Failed to create education record: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * POST /api/education/{id} (or PUT/PATCH)
     * Update an existing education record by ID.
     */
    public static function update(int $id): void {
        AuthMiddleware::authenticate();

        $existing = Education::findById($id);
        if (!$existing) {
            Response::error("Education record with ID #{$id} was not found.", null, 404);
        }

        $input = self::parseRequestInput();
        $updateData = [];

        // Institution
        if (isset($input['institution']) || isset($input['organization'])) {
            $institution = trim((string)($input['institution'] ?? $input['organization']));
            if ($institution === '') {
                Response::error('Institution name cannot be empty.', ['institution' => ['Institution is required.']], 422);
            }
            $updateData['institution'] = htmlspecialchars($institution, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // Degree
        if (isset($input['degree']) || isset($input['title'])) {
            $degree = trim((string)($input['degree'] ?? $input['title']));
            if ($degree === '') {
                Response::error('Degree or qualification cannot be empty.', ['degree' => ['Degree is required.']], 422);
            }
            $updateData['degree'] = htmlspecialchars($degree, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // Field of study
        if (array_key_exists('field_of_study', $input)) {
            $updateData['field_of_study'] = !empty($input['field_of_study']) 
                ? htmlspecialchars(trim((string)$input['field_of_study']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') 
                : null;
        }

        // Description
        if (array_key_exists('description', $input)) {
            $updateData['description'] = htmlspecialchars(trim((string)$input['description']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // Dates
        if (array_key_exists('start_date', $input)) {
            $updateData['start_date'] = !empty($input['start_date']) ? trim((string)$input['start_date']) : null;
        }
        if (array_key_exists('end_date', $input)) {
            $updateData['end_date'] = !empty($input['end_date']) ? trim((string)$input['end_date']) : null;
        }

        // Currently studying
        if (array_key_exists('is_current', $input)) {
            $isCurrent = !empty($input['is_current']) && ($input['is_current'] === true || $input['is_current'] === 1 || $input['is_current'] === '1' || $input['is_current'] === 'true');
            $updateData['is_current'] = $isCurrent ? 1 : 0;
            if ($isCurrent && empty($updateData['end_date'])) {
                $updateData['end_date'] = 'Present';
            }
        }

        // Status & Type
        if (isset($input['status'])) {
            $updateData['status'] = trim((string)$input['status']);
        }
        if (isset($input['type'])) {
            $updateData['type'] = trim((string)$input['type']);
        }

        // Location
        if (array_key_exists('location', $input)) {
            $updateData['location'] = !empty($input['location']) 
                ? htmlspecialchars(trim((string)$input['location']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') 
                : null;
        }

        // Image Handling
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $newImageUrl = self::handleImageUpload($_FILES['image']);
            if ($newImageUrl) {
                $updateData['image_url'] = $newImageUrl;
            }
        } elseif (array_key_exists('image_url', $input)) {
            $updateData['image_url'] = !empty($input['image_url']) ? trim((string)$input['image_url']) : null;
        }

        // Highlights
        if (isset($input['highlights'])) {
            if (is_array($input['highlights'])) {
                $updateData['highlights'] = $input['highlights'];
            } else {
                $decoded = json_decode($input['highlights'], true);
                $updateData['highlights'] = is_array($decoded) 
                    ? $decoded 
                    : array_filter(array_map('trim', explode(',', $input['highlights'])));
            }
        }

        // Display Order
        if (isset($input['display_order'])) {
            $updateData['display_order'] = (int)$input['display_order'];
        }

        try {
            $updated = Education::update($id, $updateData);
            Response::success("Education record \"{$updated['degree']}\" updated successfully.", $updated);
        } catch (Throwable $e) {
            error_log("Failed to update education record #{$id}: " . $e->getMessage());
            Response::error('Failed to update education record: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * DELETE /api/education/{id}
     * Remove an education record by ID.
     */
    public static function delete(int $id): void {
        AuthMiddleware::authenticate();

        $existing = Education::findById($id);
        if (!$existing) {
            Response::error("Education record with ID #{$id} was not found.", null, 404);
        }

        // Remove associated uploaded image if present
        if (!empty($existing['image_url']) && strpos($existing['image_url'], '/uploads/education/') === 0) {
            $fullPath = dirname(__DIR__) . $existing['image_url'];
            if (file_exists($fullPath) && is_file($fullPath)) {
                @unlink($fullPath);
            }
        }

        $deleted = Education::delete($id);
        if ($deleted) {
            Response::success("Education record \"{$existing['degree']}\" was deleted.", ['id' => $id]);
        } else {
            Response::error("Failed to delete education record #{$id}.", null, 500);
        }
    }
}
