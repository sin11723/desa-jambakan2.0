-- Create tables for Desa Jambakan website
-- Make sure MySQL server is running on XAMPP before executing this script

-- Tabel Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Karya Tenun (Weaving Products)
CREATE TABLE IF NOT EXISTS tenun_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  image_url VARCHAR(500),
  price INT,
  technique VARCHAR(100),
  material VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Karawitan (Traditional Music)
CREATE TABLE IF NOT EXISTS karawitan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  content LONGTEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Berita & Kegiatan Desa (News & Activities)
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  event_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Galeri (Gallery)
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password, email) VALUES 
('admin', '$2b$10$YIvxeuK.JY3x4Ey6dQr0zuZKU6dv4k0vH/E0YvJvO6XJ0.8H0Q5Qm', 'admin@desa-jambakan.com');

-- Insert sample data
INSERT INTO tenun_products (title, description, image_url, technique, material) VALUES
('Tenun Tradisional Khas Jambakan', 'Karya tenun dengan motif tradisional yang memukau, dibuat dengan teknik lokal yang telah diwariskan turun temurun.', '/placeholder.svg?height=400&width=400', 'Tangan', 'Benang Katun'),
('Sarung Tenun Modern', 'Desain modern dengan sentuhan tradisional, cocok untuk berbagai acara formal dan casual.', '/placeholder.svg?height=400&width=400', 'Mesin Bantu', 'Benang Sutra');

INSERT INTO karawitan (title, description, content, image_url) VALUES
('Pengenalan Karawitan Jawa', 'Karawitan adalah istilah yang digunakan untuk menggambarkan musik gamelan Jawa. Seni tradisional ini merupakan bagian integral dari budaya Indonesia.', 'Karawitan memiliki arti sebagai musik gamelan dengan iringan vokal. Musik ini tersusun atas instrumen-instrumen tradisional seperti saron, demung, peking, bonang, kenong, kethuk, gong, dan kendang...', '/placeholder.svg?height=400&width=400');

INSERT INTO activities (title, description, content, category, image_url, event_date) VALUES
('Senam Pagi Rutin Desa', 'Program kesehatan yang dilakukan setiap hari pagi untuk meningkatkan kebugaran masyarakat.', 'Kegiatan senam pagi dilakukan setiap hari Minggu pukul 06.00 di lapangan desa. Dipimpin oleh instruktur profesional dan terbuka untuk semua kalangan.', 'Kesehatan', '/placeholder.svg?height=400&width=400', '2025-11-10'),
('Program PKK Desa', 'Program Pemberdayaan Kesejahteraan Keluarga untuk pemberdayaan ibu-ibu rumah tangga.', 'PKK mengadakan pelatihan keterampilan setiap bulan untuk mengajarkan berbagai skill kepada ibu-ibu masyarakat.', 'Pemberdayaan', '/placeholder.svg?height=400&width=400', '2025-11-15');

INSERT INTO gallery (title, description, image_url, category) VALUES
('Dokumentasi Tenun Tradisional', 'Proses pembuatan tenun dengan tangan', '/placeholder.svg?height=400&width=400', 'Tenun'),
('Kegiatan Gotong Royong', 'Kebersamaan masyarakat dalam pembangunan', '/placeholder.svg?height=400&width=400', 'Kegiatan'),
('Festival Karawitan', 'Perayaan kesenian tradisional desa', '/placeholder.svg?height=400&width=400', 'Budaya');
