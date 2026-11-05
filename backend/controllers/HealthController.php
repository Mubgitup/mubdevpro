<?php
/**
 * Mubdev Portfolio Backend - Health Check Controller
 */

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/utils/Response.php';

class HealthController {
    public static function check(): void {
        Database::getConnection();
        $engine = Database::getActiveEngine();

        Response::json([
            'status' => 'healthy',
            'service' => 'Mubdev Backend API',
            'version' => '1.0.0',
            'database_engine' => $engine,
            'timestamp' => gmdate('c')
        ], 200);
    }
}

