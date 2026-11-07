<?php
/**
 * Mubdev Portfolio Backend - JSON Response Formatter
 */

class Response {
    public static function json(array $data, int $statusCode = 200): void {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(string $message, $data = null, int $statusCode = 200): void {
        $payload = [
            'success' => true,
            'message' => $message,
        ];
        if ($data !== null) {
            $payload['data'] = $data;
        }
        self::json($payload, $statusCode);
    }

    public static function error(string $message, ?array $errors = null, int $statusCode = 400): void {
        $payload = [
            'success' => false,
            'message' => $message,
        ];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }
        self::json($payload, $statusCode);
    }
}

