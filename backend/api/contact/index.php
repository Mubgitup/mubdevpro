<?php
/**
 * POST /api/contact/
 */
$config = require_once dirname(__DIR__, 2) . '/config/app.php';
require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__, 2) . '/controllers/ContactController.php';

CorsMiddleware::handle($config);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    ContactController::submit();
} else {
    Response::error('Method not allowed. Use POST.', null, 405);
}

