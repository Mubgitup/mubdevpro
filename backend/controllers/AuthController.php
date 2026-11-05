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
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;

        $username = trim((string)($input['username'] ?? ''));
        $password = (string)($input['password'] ?? '');

        if ($username === '' || $password === '') {
            Response::error('Both username and password are required.', null, 400);
        }

        $user = AdminUser::findByUsername($username);

        if (!$user || !AdminUser::verifyPassword($password, $user['password_hash'])) {
            Response::error('Invalid credentials provided.', null, 401);
        }

        // Update last login timestamp
        AdminUser::updateLastLogin($user['id']);

        // Generate session & bearer token
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['admin_user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ];

        $token = AuthMiddleware::generateToken($user);

        Response::success('Authentication successful.', [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ], 200);
    }

    /**
     * POST /api/auth/logout
     */
    public static function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();

        Response::success('Logged out successfully.');
    }

    /**
     * GET /api/auth/me
     */
    public static function me(): void {
        $user = AuthMiddleware::authenticate();
        Response::success('Profile retrieved.', ['user' => $user]);
    }
}

