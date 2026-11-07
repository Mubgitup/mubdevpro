<?php
/**
 * GET /api/messages/
 */
$config = require_once dirname(__DIR__, 2) . '/config/app.php';
require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__, 2) . '/controllers/ContactController.php';

CorsMiddleware::handle($config);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    ContactController::listMessages();
} else {
    Response::error('Method not allowed. Use GET.', null, 405);
}

