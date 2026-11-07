<?php
/**
 * GET /api/health/
 */
require_once dirname(__DIR__, 2) . '/config/app.php';
require_once dirname(__DIR__, 2) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__, 2) . '/controllers/HealthController.php';

CorsMiddleware::handle(require dirname(__DIR__, 2) . '/config/app.php');
HealthController::check();

