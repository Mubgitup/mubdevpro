<?php
/**
 * Mubdev Portfolio Backend - Authentication & Authorization Middleware
 * 
 * Protects administrative routes (/api/messages, etc.) requiring authentication.
 */

class AuthMiddleware {
    public static function authenticate(): array {
        // 1. Check Bearer token in Authorization header
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        $token = null;

        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            $token = $matches[1];
        }

        // 2. Validate token or session
        if ($token) {
            $user = self::validateToken($token);
            if ($user) {
                return $user;
            }
        }

        // 3. Fallback to PHP session if initialized
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!empty($_SESSION['admin_user'])) {
            return $_SESSION['admin_user'];
        }

        // Unauthorized
        Response::error('Authentication required to access this resource.', null, 401);
        exit;
    }

    private static function validateToken(string $token): ?array {
        // Simple secure HMAC token verification: base64(userId.timestamp).signature
        $secret = env('SECRET_KEY', 'mubdev-default-secret-key');
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        list($payloadB64, $signature) = $parts;
        $expectedSig = hash_hmac('sha256', $payloadB64, $secret);

        if (!hash_equals($expectedSig, $signature)) {
            return null;
        }

        $payload = json_decode(base64_decode($payloadB64), true);
        if (!is_array($payload) || empty($payload['id']) || empty($payload['exp'])) {
            return null;
        }

        // Check token expiration (24 hours validity)
        if (time() > $payload['exp']) {
            return null;
        }

        // Retrieve user from database
        require_once dirname(__DIR__) . '/models/AdminUser.php';
        return AdminUser::findById((int)$payload['id']);
    }

    public static function generateToken(array $user): string {
        $secret = env('SECRET_KEY', 'mubdev-default-secret-key');
        $payload = [
            'id' => $user['id'],
            'username' => $user['username'],
            'exp' => time() + (86400 * 2) // 48 hours
        ];
        $payloadB64 = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $payloadB64, $secret);
        return "{$payloadB64}.{$signature}";
    }
}

