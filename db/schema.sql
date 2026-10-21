-- =======================================================
-- CINETIX CINEMA TICKETING SYSTEM
-- PostgreSQL & SQLite Unified Database Schema
-- =======================================================

-- Enable UUID extension (for PostgreSQL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    genre VARCHAR(255) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    duration VARCHAR(32) NOT NULL,
    director VARCHAR(128) NOT NULL,
    release_date DATE,
    language VARCHAR(64) DEFAULT 'English',
    certificate VARCHAR(16) DEFAULT 'UA',
    synopsis TEXT,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    trailer_url TEXT,
    is_bookable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Theaters Table
CREATE TABLE IF NOT EXISTS theaters (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    distance VARCHAR(32),
    rating NUMERIC(2, 1) DEFAULT 4.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Showtimes Table
CREATE TABLE IF NOT EXISTS showtimes (
    id VARCHAR(64) PRIMARY KEY,
    movie_id VARCHAR(64) NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    theater_id VARCHAR(64) NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    show_time VARCHAR(32) NOT NULL,
    screen_format VARCHAR(32) NOT NULL, -- 'IMAX 3D', 'Dolby Atmos', '4DX', 'Standard 2D'
    ticket_price NUMERIC(8, 2) NOT NULL,
    available_seats INT DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    membership_tier VARCHAR(32) DEFAULT 'Silver',
    reward_points INT DEFAULT 0,
    wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_ref VARCHAR(32) UNIQUE NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    movie_id VARCHAR(64) REFERENCES movies(id) ON DELETE SET NULL,
    movie_title VARCHAR(255) NOT NULL,
    movie_poster TEXT,
    theater_id VARCHAR(64) REFERENCES theaters(id) ON DELETE SET NULL,
    theater_name VARCHAR(255) NOT NULL,
    show_date VARCHAR(64) NOT NULL,
    show_time VARCHAR(32) NOT NULL,
    screen_format VARCHAR(32) NOT NULL,
    seats TEXT NOT NULL, -- Comma-separated seat IDs (e.g. 'E4,E5')
    subtotal NUMERIC(10, 2) NOT NULL,
    convenience_fee NUMERIC(8, 2) DEFAULT 0.00,
    discount NUMERIC(8, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    payment_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'refunded'
    qr_data TEXT NOT NULL,
    booked_at BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Booking Items (Food & Beverages)
CREATE TABLE IF NOT EXISTS booking_food_items (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    item_name VARCHAR(128) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(8, 2) NOT NULL,
    total_price NUMERIC(8, 2) NOT NULL
);

-- 7. Food & Concessions Menu
CREATE TABLE IF NOT EXISTS food_items (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price NUMERIC(8, 2) NOT NULL,
    category VARCHAR(32) NOT NULL, -- 'snacks', 'beverages', 'combos', 'desserts'
    image_url TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    calories VARCHAR(32)
);

-- 8. Offers & Promotional Vouchers
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    discount_text VARCHAR(32) NOT NULL,
    discount_percent INT DEFAULT 0,
    valid_until DATE NOT NULL,
    category VARCHAR(32) DEFAULT 'General',
    theme_color VARCHAR(16) DEFAULT '#FF9D16'
);

-- ── INDEXES FOR HIGH-TRAFFIC CONCURRENCY ──
CREATE INDEX IF NOT EXISTS idx_movies_release ON movies(release_date);
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_theater ON showtimes(movie_id, theater_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_code ON offers(code);
