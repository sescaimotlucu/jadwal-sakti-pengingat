
-- =====================================================
-- DATABASE SCHEMA FOR SISTEM PENGINGAT JADWAL OTOMATIS
-- =====================================================

-- Table: users
-- Menyimpan data pengguna/warga
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    alamat TEXT,
    rt_rw VARCHAR(10),
    status_aktif BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'warga' CHECK (role IN ('admin', 'pengurus', 'warga')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: kegiatan
-- Menyimpan data kegiatan/aktivitas desa
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(200) NOT NULL,
    jenis_kegiatan VARCHAR(50) NOT NULL CHECK (jenis_kegiatan IN ('Posyandu', 'Pengajian', 'Senam', 'Pertemuan PKK', 'Rapat RT', 'Lainnya')),
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    lokasi VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    pesan_pengingat TEXT,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: log_pengingat
-- Menyimpan log pengiriman pengingat
CREATE TABLE log_pengingat (
    id SERIAL PRIMARY KEY,
    kegiatan_id INTEGER NOT NULL REFERENCES kegiatan(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jenis_pengingat VARCHAR(10) NOT NULL CHECK (jenis_pengingat IN ('H-2', 'H-1', 'Hari-H')),
    nomor_tujuan VARCHAR(20) NOT NULL,
    pesan TEXT NOT NULL,
    status_kirim VARCHAR(20) DEFAULT 'pending' CHECK (status_kirim IN ('pending', 'terkirim', 'gagal')),
    waktu_kirim TIMESTAMP,
    response_whatsapp TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Index untuk pencarian berdasarkan nomor HP
CREATE INDEX idx_users_nomor_hp ON users(nomor_hp);

-- Index untuk pencarian berdasarkan status aktif
CREATE INDEX idx_users_status_aktif ON users(status_aktif);

-- Index untuk pencarian kegiatan berdasarkan tanggal
CREATE INDEX idx_kegiatan_tanggal ON kegiatan(tanggal);

-- Index untuk pencarian kegiatan berdasarkan jenis
CREATE INDEX idx_kegiatan_jenis ON kegiatan(jenis_kegiatan);

-- Index untuk pencarian kegiatan berdasarkan status
CREATE INDEX idx_kegiatan_status ON kegiatan(status);

-- Index untuk log pengingat berdasarkan kegiatan
CREATE INDEX idx_log_pengingat_kegiatan ON log_pengingat(kegiatan_id);

-- Index untuk log pengingat berdasarkan user
CREATE INDEX idx_log_pengingat_user ON log_pengingat(user_id);

-- Index untuk log pengingat berdasarkan status kirim
CREATE INDEX idx_log_pengingat_status ON log_pengingat(status_kirim);

-- Index untuk log pengingat berdasarkan jenis pengingat
CREATE INDEX idx_log_pengingat_jenis ON log_pengingat(jenis_pengingat);

-- =====================================================
-- TRIGGERS FOR AUTO UPDATE TIMESTAMP
-- =====================================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk table users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk table kegiatan
CREATE TRIGGER update_kegiatan_updated_at BEFORE UPDATE ON kegiatan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERT
-- =====================================================

-- Insert sample users
INSERT INTO users (nama, nomor_hp, email, alamat, rt_rw, role) VALUES
('Admin Sistem', '6281234567890', 'admin@desa.com', 'Kantor Desa', 'RT01/RW01', 'admin'),
('Budi Santoso', '6281234567891', 'budi@email.com', 'Jl. Merdeka No. 1', 'RT01/RW01', 'warga'),
('Siti Rahayu', '6281234567892', 'siti@email.com', 'Jl. Pahlawan No. 2', 'RT01/RW02', 'pengurus'),
('Ahmad Wijaya', '6281234567893', 'ahmad@email.com', 'Jl. Sudirman No. 3', 'RT02/RW01', 'warga'),
('Dewi Kusuma', '6281234567894', 'dewi@email.com', 'Jl. Kartini No. 4', 'RT02/RW02', 'warga');

-- Insert sample kegiatan
INSERT INTO kegiatan (nama_kegiatan, jenis_kegiatan, tanggal, waktu, lokasi, deskripsi, pesan_pengingat, created_by) VALUES
('Posyandu Balita', 'Posyandu', '2024-06-10', '08:00:00', 'Balai Desa', 'Pemeriksaan kesehatan balita rutin', 'Pengingat Posyandu Balita tanggal 10 Juni 2024 jam 08:00 di Balai Desa. Mohon hadir tepat waktu.', 1),
('Pengajian Rutin', 'Pengajian', '2024-06-12', '19:30:00', 'Masjid Al-Ikhlas', 'Pengajian rutin mingguan', 'Pengingat Pengajian Rutin tanggal 12 Juni 2024 jam 19:30 di Masjid Al-Ikhlas. Mohon hadir tepat waktu.', 1),
('Senam Sehat', 'Senam', '2024-06-15', '06:00:00', 'Lapangan Desa', 'Senam pagi bersama warga', 'Pengingat Senam Sehat tanggal 15 Juni 2024 jam 06:00 di Lapangan Desa. Mohon hadir tepat waktu.', 1),
('Rapat RT 01', 'Rapat RT', '2024-06-20', '20:00:00', 'Rumah Ketua RT', 'Rapat koordinasi RT 01', 'Pengingat Rapat RT 01 tanggal 20 Juni 2024 jam 20:00 di Rumah Ketua RT. Mohon hadir tepat waktu.', 1);

-- =====================================================
-- USEFUL QUERIES FOR THE APPLICATION
-- =====================================================

-- Query untuk mendapatkan kegiatan yang akan datang
/*
SELECT 
    k.id,
    k.nama_kegiatan,
    k.jenis_kegiatan,
    k.tanggal,
    k.waktu,
    k.lokasi,
    k.pesan_pengingat,
    u.nama as created_by_name
FROM kegiatan k
LEFT JOIN users u ON k.created_by = u.id
WHERE k.tanggal >= CURRENT_DATE 
AND k.status = 'aktif'
ORDER BY k.tanggal, k.waktu;
*/

-- Query untuk mendapatkan log pengingat berdasarkan kegiatan
/*
SELECT 
    lp.id,
    k.nama_kegiatan,
    u.nama as user_name,
    lp.jenis_pengingat,
    lp.nomor_tujuan,
    lp.status_kirim,
    lp.waktu_kirim,
    lp.created_at
FROM log_pengingat lp
JOIN kegiatan k ON lp.kegiatan_id = k.id
JOIN users u ON lp.user_id = u.id
WHERE lp.kegiatan_id = $1
ORDER BY lp.created_at DESC;
*/

-- Query untuk mendapatkan statistik pengiriman
/*
SELECT 
    jenis_pengingat,
    status_kirim,
    COUNT(*) as jumlah
FROM log_pengingat
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY jenis_pengingat, status_kirim
ORDER BY jenis_pengingat, status_kirim;
*/
