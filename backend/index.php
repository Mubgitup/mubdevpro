<?php
/**
 * Mubdev Portfolio Backend - Front Controller & REST API Router
 * 
 * Routes incoming HTTP requests to controllers and handles CORS,
 * error handling, and JSON response lifecycle.
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

// Support both direct '/api/...' and nested '/mubdevpro/backend/api/...' URLs
$apiPrefixPos = strpos($path, '/api');
if ($apiPrefixPos !== false) {
    $route = substr($path, $apiPrefixPos);
} else {
    $route = $path;
}

// 4. Route Dispatcher
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

    // Default 404 handler for unrecognized endpoints
    Response::error("Resource not found: [{$method}] {$route}", null, 404);

} catch (Throwable $e) {
    error_log("Unhandled Server Exception: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    Response::error(
        'An internal server error occurred. Please contact the administrator.',
        $config['debug'] ? ['exception' => $e->getMessage()] : null,
        500
    );
}

