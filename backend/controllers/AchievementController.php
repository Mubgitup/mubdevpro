<?php
/**
 * Mubdev Portfolio Backend - Achievement Controller
 * 
 * Exposes RESTful endpoints for retrieving, creating, updating, and deleting
 * technical achievements, awards, and milestones.
 */

require_once dirname(__DIR__) . '/models/Achievement.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class AchievementController {
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
     * Handles optional uploaded achievement image safely.
     */
    private static function handleImageUpload(array $file): ?string {
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('Image file exceeds the 5MB size limit.', ['image' => ['File exceeds 5MB']], 422);
        }

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
        $uploadDir = dirname(__DIR__) . '/uploads/achievements/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uniqueFilename = 'achieve_' . bin2hex(random_bytes(10)) . '_' . time() . '.' . $extension;
        $targetPath = $uploadDir . $uniqueFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to store uploaded image on server.', null, 500);
        }

        return '/uploads/achievements/' . $uniqueFilename;
    }

    /**
     * GET /api/achievements
     */
    public static function list(): void {
        $filters = [
            'search'   => isset($_GET['search']) && $_GET['search'] !== 'undefined' ? trim($_GET['search']) : null,
            'category' => isset($_GET['category']) && $_GET['category'] !== 'undefined' ? trim($_GET['category']) : null,
            'featured' => isset($_GET['featured']) && $_GET['featured'] !== 'undefined' ? trim($_GET['featured']) : null,
            'page'     => isset($_GET['page']) ? (int)$_GET['page'] : 1,
            'limit'    => isset($_GET['limit']) ? (int)$_GET['limit'] : null
        ];

        try {
            $result = Achievement::getAll($filters);
            Response::json([
                'success' => true,
                'data' => $result['achievements'],
                'achievements' => $result['achievements'],
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit']
            ]);
        } catch (Throwable $e) {
            Response::error('Failed to retrieve achievements: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * GET /api/achievements/{id}
     */
    public static function getSingle(int $id): void {
        try {
            $achieve = Achievement::findById($id);
            if (!$achieve) {
                Response::error("Achievement #{$id} not found", null, 404);
            }
            Response::json(['success' => true, 'data' => $achieve, 'achievement' => $achieve]);
        } catch (Throwable $e) {
            Response::error('Failed to fetch achievement: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * POST /api/achievements (Admin Protected)
     */
    public static function create(): void {
        AuthMiddleware::authenticate();
        $input = self::parseRequestInput();

        $errors = [];
        if (empty(trim($input['title'] ?? ''))) {
            $errors['title'] = ['Achievement title is required'];
        }

        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        $uploadedFile = $_FILES['file'] ?? $_FILES['image'] ?? null;
        if ($uploadedFile && isset($uploadedFile['error']) && $uploadedFile['error'] === UPLOAD_ERR_OK) {
            $input['image_url'] = self::handleImageUpload($uploadedFile);
        }

        try {
            $newAchieve = Achievement::create($input);
            Response::json([
                'success' => true,
                'message' => 'Achievement created successfully',
                'data' => $newAchieve,
                'achievement' => $newAchieve
            ], 201);
        } catch (Throwable $e) {
            Response::error('Failed to create achievement: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * PUT/POST /api/achievements/{id} (Admin Protected)
     */
    public static function update(int $id): void {
        AuthMiddleware::authenticate();
        $input = self::parseRequestInput();

        $uploadedFile = $_FILES['file'] ?? $_FILES['image'] ?? null;
        if ($uploadedFile && isset($uploadedFile['error']) && $uploadedFile['error'] === UPLOAD_ERR_OK) {
            $input['image_url'] = self::handleImageUpload($uploadedFile);
        }

        try {
            $updated = Achievement::update($id, $input);
            if (!$updated) {
                Response::error("Achievement #{$id} not found", null, 404);
            }
            Response::json([
                'success' => true,
                'message' => 'Achievement updated successfully',
                'data' => $updated,
                'achievement' => $updated
            ]);
        } catch (Throwable $e) {
            Response::error('Failed to update achievement: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * DELETE /api/achievements/{id} (Admin Protected)
     */
    public static function delete(int $id): void {
        AuthMiddleware::authenticate();
        try {
            $deleted = Achievement::delete($id);
            if (!$deleted) {
                Response::error("Achievement #{$id} not found", null, 404);
            }
            Response::json(['success' => true, 'message' => "Achievement #{$id} deleted successfully"]);
        } catch (Throwable $e) {
            Response::error('Failed to delete achievement: ' . $e->getMessage(), null, 500);
        }
    }
}

