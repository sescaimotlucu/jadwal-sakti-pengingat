<?php
/**
 * CSRF Token Generator
 * Menghasilkan token CSRF untuk keamanan form
 */

require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

try {
    $token = generateCSRFToken();
    echo json_encode(createResponse(true, 'Token generated', ['token' => $token]));
} catch (Exception $e) {
    echo json_encode(createResponse(false, 'Failed to generate token'));
}
?>