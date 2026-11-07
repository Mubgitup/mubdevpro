<?php
/**
 * Mubdev Backend & PHP/MySQL Integration Test Suite
 * 
 * Verifies all core API endpoints, database operations, validation rules,
 * anti-spam honeypot, rate limiting, and administrative authentication.
 */

// Define test environment
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/ContactMessage.php';
require_once __DIR__ . '/models/AdminUser.php';
require_once __DIR__ . '/utils/Validator.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/middleware/RateLimiter.php';

function runTestSuite() {
    echo "==================================================\n";
    echo "MUBDEV PHP & MYSQL BACKEND INTEGRATION TEST SUITE\n";
    echo "==================================================\n\n";

    $passed = 0;
    $total = 7;

    // Test 1: Database Connection & Active Engine
    echo "[1/{$total}] Testing Database Connectivity...\n";
    try {
        $pdo = Database::getConnection();
        $engine = Database::getActiveEngine();
        echo ">>> Connected successfully! Active Engine: [{$engine}]\n";
        $passed++;
    } catch (Throwable $e) {
        echo ">>> FAILED: Database connection error: " . $e->getMessage() . "\n";
    }

    // Test 2: Valid Contact Form Submission & Sanitization
    echo "\n[2/{$total}] Testing Contact Form Validation & Persistence...\n";
    $validPayload = [
        'name' => 'Sarah Connor',
        'email' => 'sarah@example.com',
        'subject' => 'Full-Stack Collaboration Inquiry',
        'message' => 'Hello Mubarek, I saw your portfolio and would like to collaborate on a web application.',
        'website' => '' // Honeypot empty
    ];
    $valResult = Validator::validateContact($validPayload);
    if ($valResult['isValid']) {
        $created = ContactMessage::create(array_merge($valResult['data'], ['ip_address' => '127.0.0.1']));
        if (!empty($created['id'])) {
            echo ">>> Valid submission stored! ID: {$created['id']}, Name: {$created['name']}\n";
            $passed++;
        } else {
            echo ">>> FAILED: Record was not saved properly.\n";
        }
    } else {
        echo ">>> FAILED: Valid payload was rejected by validator.\n";
    }

    // Test 3: Validation Error Handling on Invalid Inputs
    echo "\n[3/{$total}] Testing Validation Constraint Rejections...\n";
    $invalidPayload = [
        'name' => 'A', // too short
        'email' => 'invalid-email-format',
        'subject' => 'Hi', // too short
        'message' => 'Short', // too short (<10)
    ];
    $invalidResult = Validator::validateContact($invalidPayload);
    if (!$invalidResult['isValid'] && count($invalidResult['errors']) === 4) {
        echo ">>> Successfully trapped all 4 invalid fields: " . implode(', ', array_keys($invalidResult['errors'])) . "\n";
        $passed++;
    } else {
        echo ">>> FAILED: Invalid fields were not caught correctly.\n";
    }

    // Test 4: Anti-Spam Honeypot Trapping
    echo "\n[4/{$total}] Testing Anti-Spam Honeypot Trapping...\n";
    $botPayload = [
        'name' => 'Spam Bot',
        'email' => 'bot@automated-spam.com',
        'subject' => 'Buy Crypto Fast',
        'message' => 'Automated advertising message that should be rejected by honeypot.',
        'website' => 'http://spam-link.com' // Bot filled honeypot!
    ];
    $botResult = Validator::validateContact($botPayload);
    if (!$botResult['isValid'] && isset($botResult['errors']['spam'])) {
        echo ">>> Honeypot successfully trapped and rejected bot submission.\n";
        $passed++;
    } else {
        echo ">>> FAILED: Honeypot did not trap automated bot payload.\n";
    }

    // Test 5: Preserved Database Records Integrity
    echo "\n[5/{$total}] Testing Existing Database Records Integrity...\n";
    $messages = ContactMessage::getAll(10, 0);
    if (count($messages) >= 4) {
        echo ">>> Preserved records verified! Total messages currently in database: " . count($messages) . "\n";
        $passed++;
    } else {
        echo ">>> FAILED: Expected at least 4 preserved records, found: " . count($messages) . "\n";
    }

    // Test 6: Admin Authentication & Password Hashing
    echo "\n[6/{$total}] Testing Admin Authentication & Bcrypt Verification...\n";
    $admin = AdminUser::findByUsername('admin');
    if ($admin && AdminUser::verifyPassword('AdminMubdev2026!', $admin['password_hash'])) {
        $token = AuthMiddleware::generateToken($admin);
        echo ">>> Admin credentials authenticated! Bearer token generated: " . substr($token, 0, 25) . "...\n";
        $passed++;
    } else {
        echo ">>> FAILED: Admin authentication failed.\n";
    }

    // Test 7: Rate Limiter Mechanism
    echo "\n[7/{$total}] Testing Sliding-Window Rate Limiter...\n";
    $testIp = '10.0.0.' . rand(10, 250);
    $rateLimitPassed = true;
    for ($i = 0; $i < 9; $i++) {
        if (!RateLimiter::check($testIp, 10, 3600)) {
            $rateLimitPassed = false;
        }
    }
    if ($rateLimitPassed) {
        echo ">>> Rate limiter tracked requests within window safely.\n";
        $passed++;
    } else {
        echo ">>> FAILED: Rate limiter encountered an issue.\n";
    }

    echo "\n==================================================\n";
    echo "TEST RESULTS: {$passed}/{$total} PASSED\n";
    echo "==================================================\n";

    return $passed === $total ? 0 : 1;
}

exit(runTestSuite());
