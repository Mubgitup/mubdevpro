<?php
/**
 * Mubdev Portfolio Backend - Input Sanitization & Validation Utility
 */

class Validator {
    /**
     * Validate and sanitize contact form submission payload.
     * Replicates exact Django REST Framework validation constraints.
     */
    public static function validateContact(array $input): array {
        $errors = [];
        $cleaned = [];

        // 1. Anti-spam honeypot verification
        $honeypot = trim($input['website'] ?? '');
        if ($honeypot !== '') {
            $errors['spam'] = ['Automated submission detected.'];
            return ['isValid' => false, 'errors' => $errors, 'data' => []];
        }

        // 2. Full Name validation
        $rawName = trim((string)($input['name'] ?? ''));
        if ($rawName === '') {
            $errors['name'] = ['Full name is required.'];
        } elseif (mb_strlen($rawName) < 2) {
            $errors['name'] = ['Name must be at least 2 characters long.'];
        } elseif (mb_strlen($rawName) > 120) {
            $errors['name'] = ['Name cannot exceed 120 characters.'];
        } else {
            $cleaned['name'] = htmlspecialchars($rawName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // 3. Email validation
        $rawEmail = strtolower(trim((string)($input['email'] ?? '')));
        if ($rawEmail === '') {
            $errors['email'] = ['Email address is required.'];
        } elseif (!filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = ['Please provide a valid email address.'];
        } elseif (mb_strlen($rawEmail) > 254) {
            $errors['email'] = ['Email address is too long.'];
        } else {
            $cleaned['email'] = $rawEmail;
        }

        // 4. Subject validation
        $rawSubject = trim((string)($input['subject'] ?? ''));
        if ($rawSubject === '') {
            $errors['subject'] = ['Subject line is required.'];
        } elseif (mb_strlen($rawSubject) < 3) {
            $errors['subject'] = ['Subject must be at least 3 characters long.'];
        } elseif (mb_strlen($rawSubject) > 200) {
            $errors['subject'] = ['Subject cannot exceed 200 characters.'];
        } else {
            $cleaned['subject'] = htmlspecialchars($rawSubject, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        // 5. Message validation
        $rawMessage = trim((string)($input['message'] ?? ''));
        if ($rawMessage === '') {
            $errors['message'] = ['Message content is required.'];
        } elseif (mb_strlen($rawMessage) < 10) {
            $errors['message'] = ['Message must be at least 10 characters long.'];
        } else {
            $cleaned['message'] = htmlspecialchars($rawMessage, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        return [
            'isValid' => empty($errors),
            'errors' => $errors,
            'data' => $cleaned,
        ];
    }
}

