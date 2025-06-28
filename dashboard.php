<?php
/**
 * Dashboard Page
 * Halaman utama setelah login berhasil
 */

require_once 'config.php';
require_once 'functions.php';

// Check if user is logged in
requireLogin();

// Get user data
$user = getUserById($_SESSION['user_id']);
if (!$user) {
    session_destroy();
    header('Location: login.html');
    exit();
}

// Get user statistics
try {
    $stmt = $pdo->prepare("SELECT login_count, last_login, created_at FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $userStats = $stmt->fetch();
} catch (PDOException $e) {
    $userStats = null;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Sistem Manajemen</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <h1 class="welcome-text">Selamat Datang, <?php echo htmlspecialchars($user['nama']); ?>!</h1>
            <p class="user-info">
                <i class="fas fa-envelope me-2"></i><?php echo htmlspecialchars($user['email']); ?>
            </p>
            <?php if (!empty($user['no_wa'])): ?>
            <p class="user-info">
                <i class="fas fa-phone me-2"></i><?php echo htmlspecialchars($user['no_wa']); ?>
            </p>
            <?php endif; ?>
        </div>

        <!-- User Information Cards -->
        <div class="row">
            <div class="col-md-6">
                <div class="info-card">
                    <h5 class="info-title">
                        <i class="fas fa-clock me-2 text-primary"></i>
                        Informasi Login
                    </h5>
                    <div class="info-text">
                        <p class="mb-2">
                            <strong>Login Terakhir:</strong><br>
                            <?php 
                            if ($userStats && $userStats['last_login']) {
                                echo date('d F Y, H:i', strtotime($userStats['last_login'])) . ' WIB';
                            } else {
                                echo 'Belum ada data';
                            }
                            ?>
                        </p>
                        <p class="mb-0">
                            <strong>Total Login:</strong> 
                            <?php echo $userStats ? $userStats['login_count'] : 0; ?> kali
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="info-card">
                    <h5 class="info-title">
                        <i class="fas fa-user-plus me-2 text-success"></i>
                        Informasi Akun
                    </h5>
                    <div class="info-text">
                        <p class="mb-2">
                            <strong>Terdaftar Sejak:</strong><br>
                            <?php 
                            if ($userStats && $userStats['created_at']) {
                                echo date('d F Y', strtotime($userStats['created_at']));
                            } else {
                                echo 'Tidak diketahui';
                            }
                            ?>
                        </p>
                        <p class="mb-0">
                            <strong>Status:</strong> 
                            <span class="badge bg-success">Aktif</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- WhatsApp Integration Info -->
        <div class="info-card">
            <h5 class="info-title">
                <i class="fab fa-whatsapp me-2 text-success"></i>
                Integrasi WhatsApp
            </h5>
            <div class="info-text">
                <p class="mb-2">
                    Sistem telah terintegrasi dengan WhatsApp API menggunakan Fonte API. 
                    Setiap kali Anda login, notifikasi otomatis akan dikirim ke nomor WhatsApp yang terdaftar.
                </p>
                <?php if (!empty($user['no_wa'])): ?>
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Nomor WhatsApp Anda (<strong><?php echo htmlspecialchars($user['no_wa']); ?></strong>) 
                    telah terdaftar dan akan menerima notifikasi.
                </div>
                <?php else: ?>
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Nomor WhatsApp belum terdaftar. Silakan hubungi administrator untuk menambahkan nomor WhatsApp Anda.
                </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-user-edit fa-2x text-primary mb-3"></i>
                        <h6 class="card-title">Edit Profil</h6>
                        <p class="card-text">Perbarui informasi profil Anda</p>
                        <button class="btn btn-primary btn-sm" onclick="alert('Fitur dalam pengembangan')">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-key fa-2x text-warning mb-3"></i>
                        <h6 class="card-title">Ganti Password</h6>
                        <p class="card-text">Ubah password akun Anda</p>
                        <button class="btn btn-warning btn-sm" onclick="alert('Fitur dalam pengembangan')">
                            <i class="fas fa-lock me-1"></i>Ganti
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="fas fa-history fa-2x text-info mb-3"></i>
                        <h6 class="card-title">Riwayat Login</h6>
                        <p class="card-text">Lihat riwayat aktivitas login</p>
                        <button class="btn btn-info btn-sm" onclick="alert('Fitur dalam pengembangan')">
                            <i class="fas fa-list me-1"></i>Lihat
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Logout Button -->
        <div class="text-center mt-4">
            <button class="btn-logout" onclick="logout()">
                <i class="fas fa-sign-out-alt me-2"></i>
                Keluar
            </button>
        </div>

        <!-- Footer -->
        <div class="text-center mt-4">
            <small class="text-muted">
                © 2024 Sistem Manajemen. Dikembangkan dengan ❤️
            </small>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Logout function
        async function logout() {
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                try {
                    const response = await fetch('logout.php', {
                        method: 'POST'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Logout berhasil!');
                        window.location.href = 'login.html';
                    } else {
                        alert('Terjadi kesalahan saat logout');
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    // Force redirect even if there's an error
                    window.location.href = 'login.html';
                }
            }
        }

        // Auto-refresh session
        setInterval(function() {
            fetch('check_session.php')
                .then(response => response.json())
                .then(data => {
                    if (!data.valid) {
                        alert('Sesi Anda telah berakhir. Silakan login kembali.');
                        window.location.href = 'login.html';
                    }
                })
                .catch(error => {
                    console.error('Session check error:', error);
                });
        }, 300000); // Check every 5 minutes
    </script>
</body>
</html>