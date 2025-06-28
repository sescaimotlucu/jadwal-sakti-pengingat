<?php
/**
 * Logout Handler
 * Menangani proses logout pengguna
 */

require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

try {
    // Log logout activity
    if (isLoggedIn()) {
        $userName = $_SESSION['user_nama'] ?? 'Unknown';
        logActivity("User logout: {$userName}");
    }
    
    // Clear remember me cookie
    if (isset($_COOKIE['remember_token'])) {
        setcookie('remember_token', '', time() - 3600, '/', '', false, true);
        
        // Remove token from database
        if (isset($_SESSION['user_id'])) {
            $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
        }
    }
    
    // Destroy session
    session_destroy();
    
    echo json_encode(createResponse(true, 'Logout berhasil'));
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    echo json_encode(createResponse(false, 'Terjadi kesalahan saat logout'));
}
?>