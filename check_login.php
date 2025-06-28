<?php
/**
 * Check Login Status
 * Memeriksa status login pengguna
 */

require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

echo json_encode([
    'logged_in' => isLoggedIn(),
    'user_id' => $_SESSION['user_id'] ?? null,
    'timestamp' => date('Y-m-d H:i:s')
]);
?>