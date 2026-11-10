<?php
ob_start();
/**
 * Mubdev Portfolio Backend - Front Controller & REST API Router
 * 
 * Routes incoming HTTP requests to controllers and handles CORS,
 * static uploads serving, error handling, and JSON response lifecycle.
 */

// 1. Initialize configuration & error handling
$config = require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/utils/Response.php';

// 2. Apply CORS preflight & response headers
CorsMiddleware::handle($config);

// 3. Resolve Request URI & Method
$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($rawUri, PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Normalize path: strip trailing slash and optional subdirectory prefix
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// 4. Static Uploads File Server
// Serves images located in backend/uploads/ directly if requested
if (preg_match('#^/(?:api/)?uploads/(.+)$#', $path, $uploadMatches)) {
    $relativeFilePath = $uploadMatches[1];
    $fullFilePath = __DIR__ . '/uploads/' . $relativeFilePath;

    if (file_exists($fullFilePath) && is_file($fullFilePath)) {
        $mime = mime_content_type($fullFilePath) ?: 'application/octet-stream';
        // Handle SVG mime type properly
        if (substr($fullFilePath, -4) === '.svg') {
            $mime = 'image/svg+xml';
        }

        header("Content-Type: {$mime}");
        header('Content-Length: ' . filesize($fullFilePath));
        header('Cache-Control: public, max-age=86400'); // Cache for 1 day
        readfile($fullFilePath);
        exit;
    } else {
        Response::error('Requested upload file not found.', null, 404);
        exit;
    }
}

// Support both direct '/api/...' and nested '/mubdevpro/backend/api/...' URLs
$apiPrefixPos = strpos($path, '/api');
if ($apiPrefixPos !== false) {
    $route = substr($path, $apiPrefixPos);
} else {
    $route = $path;
}

// 5. Route Dispatcher
try {
    // Health Check Endpoint
    if (($route === '/api/health' || $route === '/health') && $method === 'GET') {
        require_once __DIR__ . '/controllers/HealthController.php';
        HealthController::check();
    }

    // Contact Submission Endpoint
    if (($route === '/api/contact' || $route === '/contact') && $method === 'POST') {
        require_once __DIR__ . '/controllers/ContactController.php';
        ContactController::submit();
    }

    // Authentication Endpoints
    if ($route === '/api/auth/login' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        AuthController::login();
    }

    if ($route === '/api/auth/logout' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        AuthController::logout();
    }

    if ($route === '/api/auth/me' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AuthController.php';
        AuthController::me();
    }

    // Administrative Messages Management Endpoints
    if ($route === '/api/messages' && $method === 'GET') {
        require_once __DIR__ . '/controllers/ContactController.php';
        ContactController::listMessages();
    }

    // Parameterized route: /api/messages/{id}
    if (preg_match('#^/api/messages/(\d+)$#', $route, $matches)) {
        $id = (int)$matches[1];
        require_once __DIR__ . '/controllers/ContactController.php';

        if ($method === 'PATCH' || $method === 'PUT') {
            ContactController::updateStatus($id);
        } elseif ($method === 'DELETE') {
            ContactController::delete($id);
        }
    }

    // =========================================================================
    // PROJECTS API ROUTES
    // =========================================================================
    
    // Public projects listing (published only)
    if ($route === '/api/projects' && $method === 'GET') {
        require_once __DIR__ . '/controllers/ProjectController.php';
        ProjectController::listPublic();
    }

    // Admin projects catalog (all projects with filtering & pagination)
    if ($route === '/api/admin/projects' && $method === 'GET') {
        require_once __DIR__ . '/controllers/ProjectController.php';
        ProjectController::listAdmin();
    }

    // Create new project
    if ($route === '/api/projects' && $method === 'POST') {
        require_once __DIR__ . '/controllers/ProjectController.php';
        ProjectController::create();
    }

    // Parameterized project status toggle: /api/projects/{id}/status
    if (preg_match('#^/api/projects/(\d+)/status$#', $route, $matches)) {
        $id = (int)$matches[1];
        require_once __DIR__ . '/controllers/ProjectController.php';
        if ($method === 'PATCH' || $method === 'POST' || $method === 'PUT') {
            ProjectController::toggleStatus($id);
        }
    }

    // Parameterized project single/update/delete: /api/projects/{id}
    if (preg_match('#^/api/projects/(\d+)$#', $route, $matches)) {
        $id = (int)$matches[1];
        require_once __DIR__ . '/controllers/ProjectController.php';

        if ($method === 'GET') {
            ProjectController::getSingle($id);
        } elseif ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
            // Note: POST with multipart/form-data is commonly used for updates containing file uploads
            ProjectController::update($id);
        } elseif ($method === 'DELETE') {
            ProjectController::delete($id);
        }
    }

    // =========================================================================
    // EDUCATION & JOURNEY API ROUTES
    // =========================================================================
    
    // Education list: GET /api/education
    if ($route === '/api/education' && $method === 'GET') {
        require_once __DIR__ . '/controllers/EducationController.php';
        EducationController::list();
    }

    // Create new education record: POST /api/education
    if ($route === '/api/education' && $method === 'POST') {
        require_once __DIR__ . '/controllers/EducationController.php';
        EducationController::create();
    }

    // Parameterized education single/update/delete: /api/education/{id}
    if (preg_match('#^/api/education/(\d+)$#', $route, $matches)) {
        $id = (int)$matches[1];
        require_once __DIR__ . '/controllers/EducationController.php';

        if ($method === 'GET') {
            EducationController::getSingle($id);
        } elseif ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
            EducationController::update($id);
        } elseif ($method === 'DELETE') {
            EducationController::delete($id);
        }
    }

    // Default 404 handler for unrecognized endpoints
    Response::error("Resource not found: [{$method}] {$route}", null, 404);

} catch (Throwable $e) {
    error_log("Unhandled Server Exception: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    Response::error(
        'Server Error: ' . $e->getMessage(),
        ['exception' => $e->getMessage()],
        500
    );
}
