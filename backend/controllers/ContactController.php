<?php
/**
 * Mubdev Portfolio Backend - Contact Form Submission & Management Controller
 */

require_once dirname(__DIR__) . '/models/ContactMessage.php';
require_once dirname(__DIR__) . '/utils/Response.php';
require_once dirname(__DIR__) . '/utils/Validator.php';
require_once dirname(__DIR__) . '/middleware/RateLimiter.php';
require_once dirname(__DIR__) . '/middleware/AuthMiddleware.php';

class ContactController {
    /**
     * Safely resolve client IP address.
     */
    private static function getClientIp(): string {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }

    /**
     * POST /api/contact/
     * Process incoming visitor submission.
     */
    public static function submit(): void {
        $ip = self::getClientIp();

        // 1. Sliding-window rate limit (10 requests/hour)
        RateLimiter::check($ip, 10, 3600);

        // 2. Decode JSON input payload
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!is_array($input)) {
            // Also accept standard URL-encoded form data if submitted
            $input = $_POST;
        }

        // 3. Validate and sanitize
        $result = Validator::validateContact($input);

        if (!$result['isValid']) {
            Response::error(
                'Validation failed. Please correct the highlighted errors.',
                $result['errors'],
                400
            );
        }

        try {
            $data = $result['data'];
            $data['ip_address'] = $ip;

            $created = ContactMessage::create($data);

            Response::success(
                'Thank you! Your message has been safely received and stored in the database. Mubarek will review it and respond promptly.',
                $created,
                201
            );
        } catch (Throwable $e) {
            error_log("Contact submission error: " . $e->getMessage());
            Response::error(
                'An unexpected error occurred while processing your message. Please try again later.',
                null,
                500
            );
        }
    }

    /**
     * GET /api/messages/
     * Administrative inbox: list all received messages with pagination and unread counts.
     */
    public static function listMessages(): void {
        AuthMiddleware::authenticate();

        $pdo = Database::getConnection();
        $totalCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_contact_messages")->fetchColumn();
        $unreadCount = (int)$pdo->query("SELECT COUNT(*) FROM mubdev_contact_messages WHERE is_read = 0")->fetchColumn();

        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 50;
        $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
        $isReadFilter = isset($_GET['is_read']) ? (int)$_GET['is_read'] : null;

        if ($isReadFilter !== null) {
            $stmt = $pdo->prepare("SELECT * FROM mubdev_contact_messages WHERE is_read = :is_read ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':is_read', $isReadFilter, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $messages = $stmt->fetchAll();
        } else {
            $messages = ContactMessage::getAll($limit, $offset);
        }

        Response::json([
            'success' => true,
            'message' => 'Messages retrieved successfully.',
            'data' => $messages,
            'meta' => [
                'total_count' => $totalCount,
                'unread_count' => $unreadCount,
                'limit' => $limit,
                'offset' => $offset
            ]
        ], 200);
    }

    /**
     * PATCH /api/messages/{id}
     * Toggle read/unread status.
     */
    public static function updateStatus(int $id): void {
        AuthMiddleware::authenticate();

        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? [];
        $isRead = !empty($input['is_read']);

        $updated = ContactMessage::setReadStatus($id, $isRead);
        if ($updated) {
            Response::success('Message status updated successfully.', ['id' => $id, 'is_read' => $isRead]);
        } else {
            Response::error('Message not found or update failed.', null, 404);
        }
    }

    /**
     * DELETE /api/messages/{id}
     * Remove inquiry.
     */
    public static function delete(int $id): void {
        AuthMiddleware::authenticate();

        $deleted = ContactMessage::delete($id);
        if ($deleted) {
            Response::success('Message deleted successfully.', ['id' => $id]);
        } else {
            Response::error('Message not found or delete failed.', null, 404);
        }
    }
}

