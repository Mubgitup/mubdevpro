<?php
/**
 * Mubdev Portfolio Backend - Authentication Controller
 * 
 * Handles administrative authentication, password verification, and session management.
 */

require_once dirname(__DIR__) . '/models/AdminUser.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class AuthController {
    /**
     * POST /api/auth/login
     */
    public static function login(): void {
        try {
            $raw = file_get_contents('php://input');
            $input = json_decode($raw, true);
            if (!is_array($input) || empty($input)) {
                $input = $_POST;
            }

            $username = trim((string)($input['username'] ?? ''));
            $password = (string)($input['password'] ?? '');

            if ($username === '' || $password === '') {
                Response::error('Both username and password are required.', null, 400);
            }

            // Lookup admin by username or email
            $user = AdminUser::findByUsername($username);

            if (!$user || !AdminUser::verifyPassword($password, (string)($user['password_hash'] ?? ''))) {
                Response::error('Invalid credentials provided.', null, 401);
            }

            // Update last login timestamp safely
            AdminUser::updateLastLogin((int)$user['id']);

            // Session state preservation if headers permit
            if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
                @session_start();
                $_SESSION['admin_user'] = [
                    'id' => (int)$user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ];
            }

            // Generate cryptographically signed HMAC Bearer token
            $token = AuthMiddleware::generateToken($user);

            Response::success('Authentication successful.', [
                'token' => $token,
                'user' => [
                    'id' => (int)$user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ],
                'database_engine' => Database::getActiveEngine()
            ], 200);

        } catch (Throwable $e) {
            error_log("AuthController::login exception: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            Response::error(
                'Authentication error: ' . $e->getMessage(),
                ['exception' => $e->getMessage(), 'engine' => Database::getActiveEngine()],
                500
            );
        }
    }

    /**
     * POST /api/auth/logout
     */
    public static function logout(): void {
        try {
            if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
                @session_start();
            }
            $_SESSION = [];
            if (!headers_sent() && ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            if (session_status() === PHP_SESSION_ACTIVE) {
                @session_destroy();
            }

            Response::success('Logged out successfully.');
        } catch (Throwable $e) {
            Response::success('Logged out successfully.');
        }
    }

    /**
     * GET /api/auth/me
     */
    public static function me(): void {
        try {
            $user = AuthMiddleware::authenticate();
            Response::success('Profile retrieved.', ['user' => $user]);
        } catch (Throwable $e) {
            Response::error('Unauthorized: ' . $e->getMessage(), null, 401);
        }
    }
}
