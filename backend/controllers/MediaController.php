<?php
/**
 * Mubdev Portfolio Backend - Media & Image Management Controller
 * 
 * Handles secure file uploads, image validation, cropping payload ingestion,
 * and unified portfolio media cataloging.
 */

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';
require_once dirname(__DIR__) . '/models/SiteImage.php';
require_once dirname(__DIR__) . '/models/Project.php';
require_once dirname(__DIR__) . '/models/Certificate.php';
require_once dirname(__DIR__) . '/models/Achievement.php';
require_once dirname(__DIR__) . '/models/Education.php';
require_once dirname(__DIR__) . '/utils/Response.php';

class MediaController {
    /**
     * Base uploads directory in backend.
     */
    private static function getUploadsDir(string $subfolder = 'media'): string {
        $dir = dirname(__DIR__) . '/uploads/' . $subfolder;
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Mirror directory in public/uploads for direct dev server & static fallback.
     */
    private static function getPublicUploadsDir(string $subfolder = 'media'): string {
        $dir = dirname(dirname(__DIR__)) . '/public/uploads/' . $subfolder;
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * GET /api/site-images
     * Public endpoint: retrieve core website photos (Hero, About, OG).
     */
    public static function getSiteImages(): void {
        $images = SiteImage::getAll();
        Response::json([
            'success' => true,
            'message' => 'Site images retrieved successfully.',
            'data'    => $images
        ], 200);
    }

    /**
     * GET /api/admin/media-overview
     * Admin endpoint: unified catalog of all portfolio images across all sections.
     */
    public static function getMediaOverview(): void {
        AuthMiddleware::authenticate();

        $pdo = Database::getConnection();

        // 1. Core site images
        $siteImages = SiteImage::getAll();

        // 2. Project images
        $projectsStmt = $pdo->query("SELECT id, title, category, image_url, status FROM mubdev_projects ORDER BY display_order ASC, id ASC");
        $projects = $projectsStmt->fetchAll();

        // 3. Certificate images
        $certsStmt = $pdo->query("SELECT id, title, issuer, image_url, credential_id FROM mubdev_certificates ORDER BY display_order ASC, id ASC");
        $certificates = $certsStmt->fetchAll();

        // 4. Achievement images
        $achieveStmt = $pdo->query("SELECT id, title, category, image_url, organization FROM mubdev_achievements ORDER BY display_order ASC, id ASC");
        $achievements = $achieveStmt->fetchAll();

        // 5. Education images / logos
        $eduStmt = $pdo->query("SELECT id, institution, degree, image_url, type FROM mubdev_education ORDER BY display_order ASC, id ASC");
        $education = $eduStmt->fetchAll();

        Response::json([
            'success' => true,
            'message' => 'Media overview catalog generated successfully.',
            'data' => [
                'site_images'   => $siteImages,
                'projects'      => $projects,
                'certificates'  => $certificates,
                'achievements'  => $achievements,
                'education'     => $education,
                'counts' => [
                    'site_images'   => count($siteImages),
                    'projects'      => count($projects),
                    'certificates'  => count($certificates),
                    'achievements'  => count($achievements),
                    'education'     => count($education)
                ]
            ]
        ], 200);
    }

    /**
     * POST /api/site-images/{key}
     * Admin endpoint: update a site image (supports file upload, cropped base64, or image_url).
     */
    public static function updateSiteImage(string $key): void {
        AuthMiddleware::authenticate();

        $uploadedUrl = null;

        // 1. Check multipart file upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadedUrl = self::saveUploadedFile($_FILES['image'], 'profile');
        } elseif (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $uploadedUrl = self::saveUploadedFile($_FILES['file'], 'profile');
        } else {
            // 2. Check JSON / form body for cropped base64 or URL
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            
            if (!empty($input['base64'])) {
                $uploadedUrl = self::saveBase64Image($input['base64'], 'profile', 'profile_' . $key);
            } elseif (!empty($input['image_url'])) {
                $uploadedUrl = trim($input['image_url']);
            }
        }

        if (!$uploadedUrl) {
            Response::error('No valid image file, base64 payload, or image URL provided.', null, 400);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $title = $input['title'] ?? null;
        $altText = $input['alt_text'] ?? null;

        SiteImage::set($key, [
            'image_url' => $uploadedUrl,
            'title'     => $title,
            'alt_text'  => $altText
        ]);

        $updated = SiteImage::getByKey($key);

        Response::json([
            'success' => true,
            'message' => "Successfully updated {$key} image.",
            'data'    => $updated
        ], 200);
    }

    /**
     * DELETE /api/site-images/{key}
     * Admin endpoint: reset a site image to default.
     */
    public static function resetSiteImage(string $key): void {
        AuthMiddleware::authenticate();

        $defaultUrl = '/src/assets/images/mubdev-hero.jpg';
        SiteImage::reset($key, $defaultUrl);

        Response::json([
            'success' => true,
            'message' => "Successfully reset {$key} to default.",
            'data'    => SiteImage::getByKey($key)
        ], 200);
    }

    /**
     * POST /api/upload-media
     * Universal endpoint for file / cropped image uploads across any portfolio section.
     */
    public static function uploadMedia(): void {
        AuthMiddleware::authenticate();

        $subfolder = $_POST['section'] ?? 'media';
        // Sanitize subfolder to prevent directory traversal
        $subfolder = preg_replace('/[^a-zA-Z0-9_\-]/', '', $subfolder) ?: 'media';

        $uploadedUrl = null;

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadedUrl = self::saveUploadedFile($_FILES['image'], $subfolder);
        } elseif (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $uploadedUrl = self::saveUploadedFile($_FILES['file'], $subfolder);
        } else {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            if (!empty($input['base64'])) {
                $uploadedUrl = self::saveBase64Image($input['base64'], $subfolder, 'media_' . time());
            }
        }

        if (!$uploadedUrl) {
            Response::error('Failed to upload image. Please choose a valid image file.', null, 400);
            return;
        }

        Response::json([
            'success'   => true,
            'message'   => 'Image uploaded successfully.',
            'url'       => $uploadedUrl,
            'image_url' => $uploadedUrl,
            'filename'  => basename($uploadedUrl)
        ], 200);
    }

    /**
     * POST /api/admin/update-entity-image
     * Update the image URL of any portfolio project, certificate, achievement, or education item.
     */
    public static function updateEntityImage(): void {
        AuthMiddleware::authenticate();

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $type = $input['entity_type'] ?? '';
        $id = $input['entity_id'] ?? null;
        $imageUrl = $input['image_url'] ?? null;

        // If file or base64 was sent, upload it first
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $subfolder = $type === 'project' ? 'projects' : ($type === 'certificate' ? 'certificates' : ($type === 'achievement' ? 'achievements' : 'media'));
            $imageUrl = self::saveUploadedFile($_FILES['image'], $subfolder);
        } elseif (!empty($input['base64'])) {
            $subfolder = $type === 'project' ? 'projects' : ($type === 'certificate' ? 'certificates' : ($type === 'achievement' ? 'achievements' : 'media'));
            $imageUrl = self::saveBase64Image($input['base64'], $subfolder, "{$type}_{$id}");
        }

        if (!$type || !$id) {
            Response::error('Missing required entity_type or entity_id parameters.', null, 400);
            return;
        }

        $pdo = Database::getConnection();

        switch ($type) {
            case 'project':
                $stmt = $pdo->prepare("UPDATE mubdev_projects SET image_url = :url, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':url' => $imageUrl, ':id' => (int)$id]);
                break;

            case 'certificate':
                $stmt = $pdo->prepare("UPDATE mubdev_certificates SET image_url = :url, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':url' => $imageUrl, ':id' => (int)$id]);
                break;

            case 'achievement':
                $stmt = $pdo->prepare("UPDATE mubdev_achievements SET image_url = :url, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':url' => $imageUrl, ':id' => (int)$id]);
                break;

            case 'education':
                $stmt = $pdo->prepare("UPDATE mubdev_education SET image_url = :url, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':url' => $imageUrl, ':id' => (int)$id]);
                break;

            case 'site_image':
                SiteImage::set((string)$id, ['image_url' => $imageUrl]);
                break;

            default:
                Response::error("Unknown entity type [{$type}].", null, 400);
                return;
        }

        Response::json([
            'success'   => true,
            'message'   => "Successfully updated {$type} image.",
            'image_url' => $imageUrl
        ], 200);
    }

    /**
     * Validate and save an uploaded file securely.
     */
    private static function saveUploadedFile(array $file, string $subfolder): string {
        $maxBytes = 10 * 1024 * 1024; // 10MB limit
        if ($file['size'] > $maxBytes) {
            Response::error('Uploaded image exceeds maximum allowed size of 10MB.', null, 400);
        }

        $allowedMimes = [
            'image/jpeg'    => 'jpg',
            'image/png'     => 'png',
            'image/webp'    => 'webp',
            'image/gif'     => 'gif',
            'image/svg+xml' => 'svg'
        ];

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, $allowedMimes)) {
            Response::error('Invalid file format. Only JPG, PNG, WebP, GIF, and SVG formats are supported.', null, 400);
        }

        $ext = $allowedMimes[$mime];
        $filename = 'img_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;

        $backendDir = self::getUploadsDir($subfolder);
        $publicDir  = self::getPublicUploadsDir($subfolder);

        $backendDest = $backendDir . '/' . $filename;
        $publicDest  = $publicDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $backendDest)) {
            Response::error('Could not save uploaded file to disk.', null, 500);
        }

        // Mirror to public directory for seamless dev-server rendering
        @copy($backendDest, $publicDest);

        return "/uploads/{$subfolder}/{$filename}";
    }

    /**
     * Decode and save a base64 encoded image (e.g. from Canvas cropper).
     */
    private static function saveBase64Image(string $base64, string $subfolder, string $prefix): string {
        // Strip data URI header if present (e.g. "data:image/jpeg;base64,...")
        $ext = 'jpg';
        if (preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
            $rawExt = strtolower($matches[1]);
            $ext = in_array($rawExt, ['png', 'webp', 'gif', 'svg']) ? $rawExt : 'jpg';
            $base64 = substr($base64, strpos($base64, ',') + 1);
        }

        $binary = base64_decode($base64);
        if ($binary === false || strlen($binary) === 0) {
            Response::error('Invalid base64 image data payload.', null, 400);
        }

        $filename = $prefix . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

        $backendDir = self::getUploadsDir($subfolder);
        $publicDir  = self::getPublicUploadsDir($subfolder);

        $backendDest = $backendDir . '/' . $filename;
        $publicDest  = $publicDir . '/' . $filename;

        if (file_put_contents($backendDest, $binary) === false) {
            Response::error('Could not write cropped image to disk.', null, 500);
        }

        @copy($backendDest, $publicDest);

        return "/uploads/{$subfolder}/{$filename}";
    }
}
