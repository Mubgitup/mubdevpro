<?php
/**
 * Mubdev Portfolio Backend - Certificate Controller
 * 
 * Exposes RESTful endpoints for retrieving, creating, updating, and deleting certificates.
 */

require_once dirname(__DIR__) . '/models/Certificate.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class CertificateController {
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
     * Handles optional uploaded certificate image/document safely.
     */
    private static function handleFileUpload(array $file): ?string {
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        if ($file['size'] > 10 * 1024 * 1024) {
            Response::error('File exceeds the 10MB size limit.', ['image' => ['File exceeds 10MB']], 422);
        }

        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf'
        ];

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($detectedMime, $allowedMimes)) {
            Response::error('Invalid file type. Supported: JPG, PNG, WEBP, PDF.', ['image' => ['Unsupported format']], 422);
        }

        $extension = $allowedMimes[$detectedMime];
        $uploadDir = dirname(__DIR__) . '/uploads/certificates/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uniqueFilename = 'cert_' . bin2hex(random_bytes(10)) . '_' . time() . '.' . $extension;
        $targetPath = $uploadDir . $uniqueFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to store uploaded certificate file.', null, 500);
        }

        return '/uploads/certificates/' . $uniqueFilename;
    }

    /**
     * GET /api/certificates
     */
    public static function list(): void {
        $filters = [
            'search'   => isset($_GET['search']) && $_GET['search'] !== 'undefined' ? trim($_GET['search']) : null,
            'featured' => isset($_GET['featured']) && $_GET['featured'] !== 'undefined' ? trim($_GET['featured']) : null,
            'page'     => isset($_GET['page']) ? (int)$_GET['page'] : 1,
            'limit'    => isset($_GET['limit']) ? (int)$_GET['limit'] : null
        ];

        try {
            $result = Certificate::getAll($filters);
            Response::json([
                'success' => true,
                'data' => $result['certificates'],
                'certificates' => $result['certificates'],
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit']
            ]);
        } catch (Throwable $e) {
            Response::error('Failed to retrieve certificates: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * GET /api/certificates/{id}
     */
    public static function getSingle(int $id): void {
        try {
            $cert = Certificate::findById($id);
            if (!$cert) {
                Response::error("Certificate #{$id} not found", null, 404);
            }
            Response::json(['success' => true, 'data' => $cert, 'certificate' => $cert]);
        } catch (Throwable $e) {
            Response::error('Failed to fetch certificate: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * POST /api/certificates (Admin Protected)
     */
    public static function create(): void {
        AuthMiddleware::authenticate();
        $input = self::parseRequestInput();

        $errors = [];
        if (empty(trim($input['title'] ?? ''))) {
            $errors['title'] = ['Certificate title is required'];
        }
        if (empty(trim($input['issuer'] ?? ''))) {
            $errors['issuer'] = ['Issuing organization is required'];
        }

        if (!empty($errors)) {
            Response::error('Validation failed', $errors, 422);
        }

        $uploadedFile = $_FILES['file'] ?? $_FILES['image'] ?? null;
        if ($uploadedFile && isset($uploadedFile['error']) && $uploadedFile['error'] === UPLOAD_ERR_OK) {
            $input['image_url'] = self::handleFileUpload($uploadedFile);
        }

        try {
            $newCert = Certificate::create($input);
            Response::json([
                'success' => true,
                'message' => 'Certificate created successfully',
                'data' => $newCert,
                'certificate' => $newCert
            ], 201);
        } catch (Throwable $e) {
            Response::error('Failed to create certificate: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * PUT/POST /api/certificates/{id} (Admin Protected)
     */
    public static function update(int $id): void {
        AuthMiddleware::authenticate();
        $input = self::parseRequestInput();

        $uploadedFile = $_FILES['file'] ?? $_FILES['image'] ?? null;
        if ($uploadedFile && isset($uploadedFile['error']) && $uploadedFile['error'] === UPLOAD_ERR_OK) {
            $input['image_url'] = self::handleFileUpload($uploadedFile);
        }

        try {
            $updated = Certificate::update($id, $input);
            if (!$updated) {
                Response::error("Certificate #{$id} not found", null, 404);
            }
            Response::json([
                'success' => true,
                'message' => 'Certificate updated successfully',
                'data' => $updated,
                'certificate' => $updated
            ]);
        } catch (Throwable $e) {
            Response::error('Failed to update certificate: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * DELETE /api/certificates/{id} (Admin Protected)
     */
    public static function delete(int $id): void {
        AuthMiddleware::authenticate();
        try {
            $deleted = Certificate::delete($id);
            if (!$deleted) {
                Response::error("Certificate #{$id} not found", null, 404);
            }
            Response::json(['success' => true, 'message' => "Certificate #{$id} deleted successfully"]);
        } catch (Throwable $e) {
            Response::error('Failed to delete certificate: ' . $e->getMessage(), null, 500);
        }
    }
}
