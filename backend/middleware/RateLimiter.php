<?php
/**
 * Mubdev Portfolio Backend - Rate Limiting Middleware
 * 
 * Protects public submission endpoints against automated spam floods.
 * Limits anonymous clients to 10 submissions per hour per IP.
 */

class RateLimiter {
    public static function check(string $ip, int $maxRequests = 10, int $windowSeconds = 3600): bool {
        $storageFile = dirname(__DIR__) . '/database/rate_limits.json';
        $now = time();

        $records = [];
        if (file_exists($storageFile)) {
            $content = file_get_contents($storageFile);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $records = $decoded;
            }
        }

        // Clean up expired entries across all IPs
        foreach ($records as $clientIp => $timestamps) {
            $valid = array_filter($timestamps, fn($ts) => ($now - $ts) < $windowSeconds);
            if (empty($valid)) {
                unset($records[$clientIp]);
            } else {
                $records[$clientIp] = array_values($valid);
            }
        }

        $clientTimestamps = $records[$ip] ?? [];

        if (count($clientTimestamps) >= $maxRequests) {
            $oldest = min($clientTimestamps);
            $retryAfter = $windowSeconds - ($now - $oldest);
            
            http_response_code(429);
            header('Content-Type: application/json; charset=utf-8');
            header("Retry-After: {$retryAfter}");
            echo json_encode([
                'detail' => "Request was throttled. Expected available in {$retryAfter} seconds."
            ]);
            exit;
        }

        // Record current attempt
        $clientTimestamps[] = $now;
        $records[$ip] = $clientTimestamps;

        // Persist records safely
        file_put_contents($storageFile, json_encode($records), LOCK_EX);
        return true;
    }
}

