<?php
/**
 * Database Configuration
 * Konfigurasi koneksi database MySQL
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'login_system');

// WhatsApp API Configuration (Fonte API)
define('FONTE_API_URL', 'https://api.fonteapi.com/v1/messages/send');
define('FONTE_API_TOKEN', 'pUHPiTDPi4aeGQo9Q4PW'); // Ganti dengan token Anda

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Create database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Timezone
date_default_timezone_set('Asia/Jakarta');
?>