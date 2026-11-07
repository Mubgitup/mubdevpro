<?php
/**
 * POST /api/auth/logout
 */
$config = require_once dirname(__DIR__, 2) . '/config/app.php';
require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__, 2) . '/controllers/AuthController.php';

CorsMiddleware::handle($config);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    AuthController::logout();
} else {
    Response::error('Method not allowed. Use POST.', null, 405);
}

