<?php
ob_start();
/**
 * POST /api/auth/login
 */
try {
    $config = require_once dirname(__DIR__, 2) . '/config/app.php';
    require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
    require_once dirname(__DIR__, 2) . '/utils/Response.php';
    require_once dirname(__DIR__, 2) . '/controllers/AuthController.php';

    CorsMiddleware::handle($config);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        AuthController::login();
    } else {
        Response::error('Method not allowed. Use POST.', null, 405);
    }
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage(),
        'errors' => ['exception' => $e->getMessage()]
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
