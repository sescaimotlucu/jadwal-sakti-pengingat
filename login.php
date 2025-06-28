<?php
/**
 * Login Authentication Handler
 * Menangani proses autentikasi pengguna
 */

require_once 'config.php';
require_once 'functions.php';
require_once 'fonte_api.php';

// Set content type to JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(createResponse(false, 'Method not allowed'));
    exit();
}

try {
    // Verify CSRF token
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        echo json_encode(createResponse(false, 'Token keamanan tidak valid'));
        exit();
    }
    
    // Get and sanitize input
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $rememberMe = isset($_POST['remember_me']);
    
    // Validate input
    if (empty($email) || empty($password)) {
        echo json_encode(createResponse(false, 'Email dan password harus diisi'));
        exit();
    }
    
    if (!validateEmail($email)) {
        echo json_encode(createResponse(false, 'Format email tidak valid'));
        exit();
    }
    
    // Check user in database
    $stmt = $pdo->prepare("SELECT id, email, password, nama, no_wa FROM users WHERE email = ? AND active = 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // Log failed attempt
        logActivity("Failed login attempt for email: {$email} - User not found");
        echo json_encode(createResponse(false, 'Email atau password salah'));
        exit();
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        // Log failed attempt
        logActivity("Failed login attempt for email: {$email} - Wrong password");
        echo json_encode(createResponse(false, 'Email atau password salah'));
        exit();
    }
    
    // Successful login - create session
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_nama'] = $user['nama'];
    $_SESSION['login_time'] = time();
    
    // Set remember me cookie if requested
    if ($rememberMe) {
        $cookieToken = bin2hex(random_bytes(32));
        setcookie('remember_token', $cookieToken, time() + (30 * 24 * 60 * 60), '/', '', false, true);
        
        // Store token in database
        $stmt = $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
        $stmt->execute([$cookieToken, $user['id']]);
    }
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Send WhatsApp welcome message (async)
    if (!empty($user['no_wa'])) {
        try {
            $whatsappResult = $fonteAPI->sendWelcomeMessage($user['no_wa'], $user['nama']);
            
            // Log WhatsApp result
            if ($whatsappResult['success']) {
                logActivity("WhatsApp welcome message sent to {$user['nama']} ({$user['no_wa']})");
            } else {
                logActivity("Failed to send WhatsApp message to {$user['nama']}: " . $whatsappResult['message']);
            }
        } catch (Exception $e) {
            logActivity("WhatsApp error for {$user['nama']}: " . $e->getMessage());
        }
    }
    
    // Log successful login
    logActivity("Successful login for user: {$user['nama']} ({$email})");
    
    // Return success response
    echo json_encode(createResponse(true, 'Login berhasil! Selamat datang, ' . $user['nama'], [
        'user_id' => $user['id'],
        'nama' => $user['nama'],
        'email' => $user['email']
    ]));
    
} catch (PDOException $e) {
    error_log("Database error in login: " . $e->getMessage());
    echo json_encode(createResponse(false, 'Terjadi kesalahan sistem. Silakan coba lagi.'));
} catch (Exception $e) {
    error_log("General error in login: " . $e->getMessage());
    echo json_encode(createResponse(false, 'Terjadi kesalahan sistem. Silakan coba lagi.'));
}
?>