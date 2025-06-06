
-- =====================================================
-- SEED DATA FOR TESTING
-- =====================================================

-- Insert sample users
INSERT INTO users (nama, nomor_hp, email, alamat, rt_rw, role) VALUES
('Admin Sistem', '6281234567890', 'admin@desa.com', 'Kantor Desa', 'RT01/RW01', 'admin'),
('Budi Santoso', '6281234567891', 'budi@email.com', 'Jl. Merdeka No. 1', 'RT01/RW01', 'warga'),
('Siti Rahayu', '6281234567892', 'siti@email.com', 'Jl. Pahlawan No. 2', 'RT01/RW02', 'pengurus'),
('Ahmad Wijaya', '6281234567893', 'ahmad@email.com', 'Jl. Sudirman No. 3', 'RT02/RW01', 'warga'),
('Dewi Kusuma', '6281234567894', 'dewi@email.com', 'Jl. Kartini No. 4', 'RT02/RW02', 'warga'),
('Eko Prasetyo', '6281234567895', 'eko@email.com', 'Jl. Diponegoro No. 5', 'RT03/RW01', 'warga'),
('Maya Sari', '6281234567896', 'maya@email.com', 'Jl. Gajah Mada No. 6', 'RT03/RW02', 'warga'),
('Rizki Pratama', '6281234567897', 'rizki@email.com', 'Jl. Veteran No. 7', 'RT04/RW01', 'warga'),
('Indah Permata', '6281234567898', 'indah@email.com', 'Jl. Ahmad Yani No. 8', 'RT04/RW02', 'warga'),
('Agus Salim', '6281234567899', 'agus@email.com', 'Jl. Pemuda No. 9', 'RT05/RW01', 'pengurus')
ON CONFLICT (nomor_hp) DO NOTHING;

-- Insert sample kegiatan
INSERT INTO kegiatan (nama_kegiatan, jenis_kegiatan, tanggal, waktu, lokasi, deskripsi, pesan_pengingat, created_by) VALUES
('Posyandu Balita', 'Posyandu', CURRENT_DATE + INTERVAL '3 days', '08:00:00', 'Balai Desa', 'Pemeriksaan kesehatan balita rutin', 'Pengingat Posyandu Balita. Mohon hadir tepat waktu dengan membawa KMS balita.', 1),
('Pengajian Rutin', 'Pengajian', CURRENT_DATE + INTERVAL '5 days', '19:30:00', 'Masjid Al-Ikhlas', 'Pengajian rutin mingguan', 'Pengingat Pengajian Rutin. Mari hadir bersama untuk mendengarkan kajian Islam.', 1),
('Senam Sehat', 'Senam', CURRENT_DATE + INTERVAL '2 days', '06:00:00', 'Lapangan Desa', 'Senam pagi bersama warga', 'Pengingat Senam Sehat. Ayo bergabung untuk hidup sehat bersama!', 1),
('Rapat RT 01', 'Rapat RT', CURRENT_DATE + INTERVAL '7 days', '20:00:00', 'Rumah Ketua RT', 'Rapat koordinasi RT 01', 'Pengingat Rapat RT 01. Mohon kehadiran seluruh warga RT 01.', 1),
('Posyandu Lansia', 'Posyandu', CURRENT_DATE + INTERVAL '10 days', '09:00:00', 'Puskesmas Desa', 'Pemeriksaan kesehatan lansia', 'Pengingat Posyandu Lansia. Bagi warga lansia mohon hadir untuk pemeriksaan kesehatan.', 1),
('Pertemuan PKK', 'Pertemuan PKK', CURRENT_DATE + INTERVAL '6 days', '14:00:00', 'Balai Desa', 'Pertemuan rutin PKK', 'Pengingat Pertemuan PKK. Ibu-ibu PKK mohon hadir untuk membahas program kerja.', 3)
ON CONFLICT DO NOTHING;

-- Insert sample log pengingat (untuk testing)
INSERT INTO log_pengingat (kegiatan_id, user_id, jenis_pengingat, nomor_tujuan, pesan, status_kirim, waktu_kirim) VALUES
(1, 2, 'H-2', '6281234567891', 'Pengingat H-2: Posyandu Balita akan dilaksanakan 2 hari lagi. Mohon hadir tepat waktu.', 'terkirim', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(1, 3, 'H-2', '6281234567892', 'Pengingat H-2: Posyandu Balita akan dilaksanakan 2 hari lagi. Mohon hadir tepat waktu.', 'terkirim', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(2, 2, 'H-1', '6281234567891', 'Pengingat H-1: Pengajian Rutin akan dilaksanakan besok malam. Jangan sampai terlewat!', 'pending', NULL),
(2, 4, 'H-1', '6281234567893', 'Pengingat H-1: Pengajian Rutin akan dilaksanakan besok malam. Jangan sampai terlewat!', 'gagal', CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;
