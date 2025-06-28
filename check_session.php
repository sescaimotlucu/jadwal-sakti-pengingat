<?php
/**
 * Session Validator
 * Memvalidasi sesi pengguna
 */

require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

$valid = isLoggedIn();

// Additional session validation
if ($valid) {
    // Check session timeout (24 hours)
    $loginTime = $_SESSION['login_time'] ?? 0;
    $sessionTimeout = 24 * 60 * 60; // 24 hours
    
    if (time() - $loginTime > $sessionTimeout) {
        session_destroy();
        $valid = false;
    }
}

echo json_encode([
    'valid' => $valid,
    'timestamp' => date('Y-m-d H:i:s')
]);
?>