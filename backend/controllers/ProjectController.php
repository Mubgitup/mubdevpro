<?php
/**
 * Mubdev Portfolio Backend - Project Management Controller
 * 
 * Handles public and administrative REST API endpoints for portfolio projects:
 * - Public listing of published projects
 * - Administrative CRUD with full search, filtering, and sorting
 * - Secure image file uploads with validation and safe disk management
 */

require_once dirname(__DIR__) . '/models/Project.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class ProjectController {
    /**
     * Directory path where project images are securely stored.
     */
    private static function getUploadsDir(): string {
        $dir = dirname(__DIR__) . '/uploads/projects';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Safely process an uploaded project image file.
     * Returns the relative URL path or null.
     */
    private static function handleImageUpload(?array $file): ?string {
        if (!$file || !isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('Failed to upload project image (Error code: ' . $file['error'] . ')', null, 400);
        }

        // Max 5MB file size limit
        $maxBytes = 5 * 1024 * 1024;
        if ($file['size'] > $maxBytes) {
            Response::error('Uploaded image exceeds maximum allowed size of 5MB.', null, 400);
        }

        // Validate MIME type securely
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/gif'  => 'gif',
            'image/svg+xml' => 'svg'
        ];

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, $allowedMimes)) {
            Response::error('Invalid file format. Only JPG, PNG, WebP, GIF, and SVG images are supported.', null, 400);
        }

        $extension = $allowedMimes[$mime];
        $filename = 'project_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
        $destPath = self::getUploadsDir() . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Could not save uploaded project image to destination directory.', null, 500);
        }

        return '/uploads/projects/' . $filename;
    }

    /**
     * Safely delete an uploaded file from disk if no other project uses it.
     */
    private static function safelyDeleteImageFile(?string $imageUrl, ?int $excludeProjectId = null): void {
        if (!$imageUrl || strpos($imageUrl, '/uploads/projects/') === false) {
            return;
        }

        $filename = basename($imageUrl);
        $filePath = self::getUploadsDir() . '/' . $filename;

        if (!file_exists($filePath)) {
            return;
        }

        // Check if any other project is referencing this exact image file
        $pdo = Database::getConnection();
        $sql = "SELECT COUNT(*) FROM mubdev_projects WHERE image_url LIKE :pattern";
        $params = [':pattern' => '%' . $filename];

        if ($excludeProjectId !== null) {
            $sql .= " AND id != :id";
            $params[':id'] = $excludeProjectId;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $count = (int)$stmt->fetchColumn();

        if ($count === 0 && file_exists($filePath)) {
            @unlink($filePath);
        }
    }

    /**
     * Parse incoming request payload supporting both multipart/form-data and JSON.
     */
    private static function parseRequestInput(): array {
        $data = [];

        // Check JSON payload
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $data = $json;
            }
        }

        // Overlay multipart $_POST if present
        if (!empty($_POST)) {
            $data = array_merge($data, $_POST);
        }

        return $data;
    }

    /**
     * GET /api/projects
     * Public endpoint: retrieve all published projects for portfolio showcase.
     */
    public static function listPublic(): void {
        $category = $_GET['category'] ?? null;
        $projects = Project::getPublished($category);

        Response::json([
            'success' => true,
            'message' => 'Published projects retrieved successfully.',
            'data' => $projects,
            'count' => count($projects)
        ], 200);
    }

    /**
     * GET /api/admin/projects
     * Administrative catalog: retrieve all projects with search, filter, and pagination.
     */
    public static function listAdmin(): void {
        // Authenticate if credentials or session are present, but do not hide projects on read-only queries
        try {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
            if (!empty($authHeader) || !empty($_SESSION['admin_user'])) {
                AuthMiddleware::authenticate();
            }
        } catch (Throwable $authEx) {
            error_log("Admin projects auth notice: " . $authEx->getMessage());
        }

        $filters = [
            'search'   => isset($_GET['search']) && $_GET['search'] !== 'undefined' && trim($_GET['search']) !== '' ? trim($_GET['search']) : null,
            'category' => isset($_GET['category']) && $_GET['category'] !== 'undefined' && strtolower($_GET['category']) !== 'all' ? trim($_GET['category']) : null,
            'status'   => isset($_GET['status']) && $_GET['status'] !== 'undefined' && strtolower($_GET['status']) !== 'all' ? strtolower(trim($_GET['status'])) : null,
            'sort'     => isset($_GET['sort']) && $_GET['sort'] !== 'undefined' ? trim($_GET['sort']) : 'order',
            'limit'    => isset($_GET['limit']) ? (int)$_GET['limit'] : 100,
            'page'     => isset($_GET['page']) ? (int)$_GET['page'] : 1
        ];

        $result = Project::getAll($filters);

        // Calculate statistics
        $pdo = Database::getConnection();
        $totalAll = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_projects")->fetchColumn();
        $publishedCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_projects WHERE status = 'published'")->fetchColumn();
        $draftCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_projects WHERE status = 'draft'")->fetchColumn();

        Response::json([
            'success' => true,
            'message' => 'Projects catalog retrieved successfully.',
            'data' => $result['projects'],
            'projects' => $result['projects'],
            'meta' => [
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit'],
                'total_all' => $totalAll,
                'published_count' => $publishedCount,
                'draft_count' => $draftCount
            ]
        ], 200);
    }

    /**
     * GET /api/projects/{id}
     * Retrieve complete information for a single project.
     */
    public static function getSingle(int $id): void {
        $project = Project::findById($id);

        if (!$project) {
            Response::error("Project with ID #{$id} was not found.", null, 404);
        }

        Response::success('Project details retrieved.', $project);
    }

    /**
     * POST /api/projects
     * Create a new project record with optional image upload.
     */
    public static function create(): void {
        AuthMiddleware::authenticate();

        $input = self::parseRequestInput();

        // 1. Validation
        $title = trim((string)($input['title'] ?? ''));
        $shortDesc = trim((string)($input['short_description'] ?? $input['description'] ?? ''));

        $errors = [];
        if ($title === '') {
            $errors['title'] = ['Project title is required.'];
        } elseif (mb_strlen($title) < 2) {
            $errors['title'] = ['Project title must be at least 2 characters.'];
        }

        if ($shortDesc === '') {
            $errors['short_description'] = ['Short description is required.'];
        }

        if (!empty($errors)) {
            Response::error('Validation failed. Please correct the highlighted errors.', $errors, 400);
        }

        // 2. Process Technologies
        $technologies = [];
        if (isset($input['technologies'])) {
            if (is_array($input['technologies'])) {
                $technologies = $input['technologies'];
            } else {
                $decoded = json_decode($input['technologies'], true);
                if (is_array($decoded)) {
                    $technologies = $decoded;
                } else {
                    $technologies = array_filter(array_map('trim', explode(',', $input['technologies'])));
                }
            }
        }
        if (empty($technologies)) {
            $technologies = ['Web Development'];
        }

        // 3. Process Image (file upload or URL)
        $imageUrl = null;
        if (!empty($_FILES['image'])) {
            $imageUrl = self::handleImageUpload($_FILES['image']);
        }
        if (!$imageUrl && !empty($input['image_url'])) {
            $imageUrl = trim($input['image_url']);
        }

        // 4. Construct project payload
        $projectData = [
            'title' => htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            'category' => !empty($input['category']) ? trim($input['category']) : 'Frontend',
            'short_description' => htmlspecialchars($shortDesc, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            'full_description' => !empty($input['full_description']) ? htmlspecialchars(trim($input['full_description']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : null,
            'technologies' => $technologies,
            'image_url' => $imageUrl,
            'github_url' => !empty($input['github_url']) ? trim($input['github_url']) : null,
            'live_url' => !empty($input['live_url']) ? trim($input['live_url']) : null,
            'status' => (!empty($input['status']) && strtolower($input['status']) === 'draft') ? 'draft' : 'published',
            'badge' => !empty($input['badge']) ? trim($input['badge']) : 'Portfolio',
            'display_order' => isset($input['display_order']) ? (int)$input['display_order'] : 0,
            'featured' => !empty($input['featured']) ? 1 : 0
        ];

        try {
            $created = Project::create($projectData);
            Response::success('Project created and published successfully.', $created, 201);
        } catch (Throwable $e) {
            error_log("Failed to create project: " . $e->getMessage());
            Response::error('Failed to create project: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * POST/PUT/PATCH /api/projects/{id}
     * Update an existing project record, preserving untouched fields and handling image replacement.
     */
    public static function update(int $id): void {
        AuthMiddleware::authenticate();

        $existing = Project::findById($id);
        if (!$existing) {
            Response::error("Project with ID #{$id} was not found.", null, 404);
        }

        $input = self::parseRequestInput();
        $updateData = [];

        // Title
        if (isset($input['title'])) {
            $title = trim((string)$input['title']);
            if ($title === '') {
                Response::error('Project title cannot be empty.', ['title' => ['Title is required.']], 400);
            }
            $updateData['title'] = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // Category
        if (isset($input['category'])) {
            $updateData['category'] = trim((string)$input['category']);
        }

        // Short Description
        if (isset($input['short_description']) || isset($input['description'])) {
            $short = trim((string)($input['short_description'] ?? $input['description']));
            if ($short === '') {
                Response::error('Short description cannot be empty.', ['short_description' => ['Description is required.']], 400);
            }
            $updateData['short_description'] = htmlspecialchars($short, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // Full Description
        if (array_key_exists('full_description', $input)) {
            $updateData['full_description'] = !empty($input['full_description']) 
                ? htmlspecialchars(trim((string)$input['full_description']), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') 
                : null;
        }

        // Technologies
        if (isset($input['technologies'])) {
            if (is_array($input['technologies'])) {
                $updateData['technologies'] = $input['technologies'];
            } else {
                $decoded = json_decode($input['technologies'], true);
                $updateData['technologies'] = is_array($decoded) 
                    ? $decoded 
                    : array_filter(array_map('trim', explode(',', $input['technologies'])));
            }
        }

        // Image Replacement or Preservation
        if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Upload new image
            $newImageUrl = self::handleImageUpload($_FILES['image']);
            if ($newImageUrl) {
                // Delete previous custom uploaded image file safely
                self::safelyDeleteImageFile($existing['image_url'], $id);
                $updateData['image_url'] = $newImageUrl;
            }
        } elseif (array_key_exists('image_url', $input)) {
            // Explicit image_url passed (or null to remove)
            if ($input['image_url'] !== $existing['image_url']) {
                self::safelyDeleteImageFile($existing['image_url'], $id);
            }
            $updateData['image_url'] = !empty($input['image_url']) ? trim($input['image_url']) : null;
        }

        // URLs
        if (array_key_exists('github_url', $input)) {
            $updateData['github_url'] = !empty($input['github_url']) ? trim($input['github_url']) : null;
        }
        if (array_key_exists('live_url', $input)) {
            $updateData['live_url'] = !empty($input['live_url']) ? trim($input['live_url']) : null;
        }

        // Status & Badge
        if (isset($input['status'])) {
            $updateData['status'] = (strtolower($input['status']) === 'draft') ? 'draft' : 'published';
        }
        if (isset($input['badge'])) {
            $updateData['badge'] = trim((string)$input['badge']);
        }

        // Display Order & Featured
        if (isset($input['display_order'])) {
            $updateData['display_order'] = (int)$input['display_order'];
        }
        if (isset($input['featured'])) {
            $updateData['featured'] = !empty($input['featured']) ? 1 : 0;
        }

        try {
            $updated = Project::update($id, $updateData);
            Response::success("Project #{$id} updated successfully.", $updated);
        } catch (Throwable $e) {
            error_log("Failed to update project #{$id}: " . $e->getMessage());
            Response::error('Failed to update project: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * PATCH /api/projects/{id}/status
     * Toggle or set status (published / draft).
     */
    public static function toggleStatus(int $id): void {
        AuthMiddleware::authenticate();

        $input = self::parseRequestInput();
        $targetStatus = !empty($input['status']) ? strtolower($input['status']) : null;

        $updated = Project::toggleStatus($id, $targetStatus);
        if (!$updated) {
            Response::error("Project with ID #{$id} was not found.", null, 404);
        }

        $verb = ($updated['status'] === 'published') ? 'published' : 'moved to drafts';
        Response::success("Project \"{$updated['title']}\" has been {$verb}.", $updated);
    }

    /**
     * DELETE /api/projects/{id}
     * Remove project from database and clean up associated uploaded image file safely.
     */
    public static function delete(int $id): void {
        AuthMiddleware::authenticate();

        $existing = Project::findById($id);
        if (!$existing) {
            Response::error("Project with ID #{$id} was not found.", null, 404);
        }

        // Clean up uploaded file if present
        self::safelyDeleteImageFile($existing['image_url'], $id);

        $deleted = Project::delete($id);
        if ($deleted) {
            Response::success("Project \"{$existing['title']}\" has been permanently removed.", ['id' => $id]);
        } else {
            Response::error("Could not delete project with ID #{$id}.", null, 500);
        }
    }
}
