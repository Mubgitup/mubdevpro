<?php
/**
 * Mubdev Portfolio Backend - Global Application Configuration
 */

// Strict error reporting in development, safe in production
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', dirname(__DIR__) . '/database/php_error.log');
error_reporting(E_ALL);

// Set standardized timezone
date_default_timezone_set('UTC');

// Helper to load .env file into $_ENV and putenv()
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Automatically load .env if available
loadEnv(dirname(__DIR__) . '/.env');

// Helper to retrieve env variables with default fallback
function env($key, $default = null) {
    $val = getenv($key);
    return ($val !== false && $val !== '') ? $val : $default;
}

return [
    'app_name' => 'Mubdev Backend API',
    'version' => '1.0.0',
    'debug' => filter_var(env('DEBUG', true), FILTER_VALIDATE_BOOLEAN),
    'secret_key' => env('SECRET_KEY', 'mubdev-php-secret-key-production-change-me'),
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    'rate_limit' => [
        'max_requests' => (int)env('RATE_LIMIT_MAX', 10),
        'window_seconds' => (int)env('RATE_LIMIT_WINDOW', 3600), // 1 hour
    ]
];

