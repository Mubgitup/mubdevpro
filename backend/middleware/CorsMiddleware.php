<?php
/**
 * Mubdev Portfolio Backend - CORS Middleware
 */

class CorsMiddleware {
    public static function handle(array $config): void {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = $config['allowed_origins'] ?? ['http://localhost:3000'];

        if ($origin && in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header("Access-Control-Allow-Credentials: true");
        } else {
            // Default permissive for local dev requests without Origin header
            header("Access-Control-Allow-Origin: *");
        }

        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
        header("Access-Control-Max-Age: 86400");

        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}

