<?php
/**
 * GET /api/auth/me
 */
$config = require_once dirname(__DIR__, 2) . '/config/app.php';
require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__, 2) . '/controllers/AuthController.php';

CorsMiddleware::handle($config);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    AuthController::me();
} else {
    Response::error('Method not allowed. Use GET.', null, 405);
}

