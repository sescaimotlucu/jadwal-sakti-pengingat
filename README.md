# Sistem Login Web dengan Integrasi WhatsApp API

Sistem login modern dengan autentikasi pengguna dan notifikasi WhatsApp otomatis menggunakan Fonte API.

## 🚀 Fitur Utama

- **Autentikasi Aman**: Login dengan enkripsi password menggunakan `password_hash()`
- **Integrasi WhatsApp**: Notifikasi otomatis via Fonte API saat login berhasil
- **Desain Responsif**: Tampilan modern menggunakan Bootstrap 5
- **Keamanan Tinggi**: CSRF protection, prepared statements, input sanitization
- **Session Management**: Manajemen sesi dengan timeout otomatis
- **Activity Logging**: Pencatatan aktivitas pengguna

## 📋 Persyaratan Sistem

- PHP 7.4 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- Web server (Apache/Nginx)
- Akun Fonte API untuk WhatsApp

## 🛠️ Instalasi

### 1. Setup Database

```sql
-- Jalankan script database_setup.sql
mysql -u root -p < database_setup.sql
```

### 2. Konfigurasi

Edit file `config.php`:

```php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'login_system');

// WhatsApp API Configuration
define('FONTE_API_TOKEN', 'your_fonte_api_token');
```

### 3. Permissions

```bash
# Set permissions untuk folder logs
mkdir logs
chmod 755 logs
```

## 📁 Struktur File

```
├── config.php              # Konfigurasi database dan API
├── functions.php            # Helper functions
├── fonte_api.php           # Integrasi WhatsApp API
├── login.html              # Halaman login
├── login.php               # Logic autentikasi
├── dashboard.php           # Halaman dashboard
├── logout.php              # Handler logout
├── style.css               # Custom CSS
├── get_csrf_token.php      # Generator CSRF token
├── check_login.php         # Checker status login
├── check_session.php       # Validator sesi
├── database_setup.sql      # Script setup database
└── logs/                   # Folder log aktivitas
```

## 🔐 Keamanan

### Password Hashing
```php
// Enkripsi password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Verifikasi password
password_verify($password, $hashedPassword);
```

### CSRF Protection
```php
// Generate token
$token = generateCSRFToken();

// Verify token
verifyCSRFToken($token);
```

### Prepared Statements
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
```

## 📱 Integrasi WhatsApp

### Setup Fonte API

1. Daftar di [Fonte API](https://fonteapi.com)
2. Dapatkan API token
3. Update konfigurasi di `config.php`

### Format Pesan

```php
$message = "🎉 *Selamat Datang!*\n\n";
$message .= "Halo *{$nama}*, selamat datang di sistem!\n\n";
$message .= "Anda telah berhasil login ke dalam sistem kami.\n";
$message .= "Terima kasih telah bergabung dengan kami! 😊";
```

## 🎨 Customization

### CSS Variables
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Responsive Breakpoints
- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px

## 📊 Database Schema

### Tabel Users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    no_wa VARCHAR(20) DEFAULT NULL,
    active TINYINT(1) DEFAULT 1,
    remember_token VARCHAR(255) DEFAULT NULL,
    login_count INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/login.php` | POST | Autentikasi pengguna |
| `/logout.php` | POST | Logout pengguna |
| `/check_login.php` | GET | Cek status login |
| `/check_session.php` | GET | Validasi sesi |
| `/get_csrf_token.php` | GET | Generate CSRF token |

## 🚨 Error Handling

### Database Errors
```php
try {
    // Database operations
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(createResponse(false, 'Database error'));
}
```

### WhatsApp API Errors
```php
try {
    $result = $fonteAPI->sendMessage($phone, $message);
} catch (Exception $e) {
    logActivity("WhatsApp error: " . $e->getMessage());
}
```

## 📝 Logging

### Activity Logs
```php
logActivity("User login: {$email}");
logActivity("WhatsApp sent to: {$phone}");
logActivity("User logout: {$nama}");
```

### Log Files
- `logs/activity.log` - Aktivitas pengguna
- `logs/error.log` - Error sistem

## 🧪 Testing

### Demo Credentials
- Email: `admin@example.com`
- Password: `password`

### Test WhatsApp
```php
$fonteAPI = new FonteAPI();
$result = $fonteAPI->testConnection();
```

## 🔄 Updates & Maintenance

### Database Migrations
```sql
-- Tambah kolom baru
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);

-- Update data
UPDATE users SET new_field = 'default_value';
```

### Cache Clearing
```bash
# Clear session files
rm -rf /tmp/sess_*

# Clear logs
> logs/activity.log
```

## 📞 Support

Untuk bantuan dan dukungan:
- Email: support@example.com
- Documentation: [Link ke dokumentasi]
- Issues: [Link ke issue tracker]

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.

---

**Dikembangkan dengan ❤️ untuk kemudahan autentikasi dan notifikasi WhatsApp**