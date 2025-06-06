
-- =====================================================
-- MIGRATION: Initial Schema
-- Version: 001
-- Description: Create initial tables for the reminder system
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Create kegiatan table
CREATE TABLE IF NOT EXISTS kegiatan (
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

-- Create log_pengingat table
CREATE TABLE IF NOT EXISTS log_pengingat (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_nomor_hp ON users(nomor_hp);
CREATE INDEX IF NOT EXISTS idx_users_status_aktif ON users(status_aktif);
CREATE INDEX IF NOT EXISTS idx_kegiatan_tanggal ON kegiatan(tanggal);
CREATE INDEX IF NOT EXISTS idx_kegiatan_jenis ON kegiatan(jenis_kegiatan);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON kegiatan(status);
CREATE INDEX IF NOT EXISTS idx_log_pengingat_kegiatan ON log_pengingat(kegiatan_id);
CREATE INDEX IF NOT EXISTS idx_log_pengingat_user ON log_pengingat(user_id);
CREATE INDEX IF NOT EXISTS idx_log_pengingat_status ON log_pengingat(status_kirim);
CREATE INDEX IF NOT EXISTS idx_log_pengingat_jenis ON log_pengingat(jenis_pengingat);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kegiatan_updated_at ON kegiatan;
CREATE TRIGGER update_kegiatan_updated_at BEFORE UPDATE ON kegiatan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
