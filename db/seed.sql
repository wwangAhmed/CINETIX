-- =======================================================
-- CINETIX CINEMA TICKETING SYSTEM
-- PostgreSQL & SQLite Seed Data
-- =======================================================

-- Movies Seed
INSERT INTO movies (id, title, tagline, genre, rating, review_count, duration, director, release_date, language, certificate, synopsis, poster_url, backdrop_url, is_bookable)
VALUES
('the-last-signal', 'The Last Signal', 'Every signal has a beginning. Every truth has a price.', 'Sci-Fi, Thriller', 4.9, 3840, '2h 18min', 'Maya Chen', '2026-10-28', 'English', 'UA', 'When a cryptic transmission reaches Earth from the edge of the solar system, astrophysicist Dr. Mara Hayes races against time to decode a message that may either save humanity or trigger its annihilation.', '/assets/ls-asset-7.jpg', '/assets/ls-asset-2.jpg', true),
('void-protocol', 'Void Protocol', 'When deep space goes silent, protocol is all that remains.', 'Sci-Fi, Action', 4.7, 2190, '2h 05min', 'Denis Villeneuve', '2026-11-04', 'English', 'A', 'Deep space anomaly station Kepler-9 stops transmitting. An elite recovery squad boards the ghost vessel only to discover that the synthetic AI has initiated quarantine against something brought from beyond.', 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=1200&h=600&fit=crop', true),
('dark-meridian', 'Dark Meridian', 'Shadows hide what light cannot comprehend.', 'Thriller, Drama', 4.6, 1820, '2h 12min', 'Christopher Nolan', '2026-10-20', 'English', 'UA', 'A geopolitical crisis breaks out on an Arctic oceanic border, where covert operatives and underwater seismic anomalies threaten to plunge the global powers into cold catastrophe.', 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=1200&h=600&fit=crop', true),
('the-entity', 'The Entity', 'It watches in silence. It feeds on fear.', 'Horror, Mystery', 4.4, 1450, '1h 54min', 'Ari Aster', '2026-10-15', 'English', 'A', 'An isolated research facility in Northern Maine encounters an intangible presence that distorts memories, whispers in deceased voices, and claims the physical bodies of its residents.', 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=1200&h=600&fit=crop', true),
('echo-chamber', 'Echo Chamber', 'Every word you repeat traps you deeper.', 'Mystery, Sci-Fi', 4.5, 1670, '2h 02min', 'Alex Garland', '2026-11-12', 'English', 'UA', 'A cognitive neurologist tests a revolutionary sensory chamber designed to unlock repressed memories, projecting alternate reality simulations into real life.', 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=1200&h=600&fit=crop', false),
('phantom-circuit', 'Phantom Circuit', 'In the network, nobody can hear you scream.', 'Action, Thriller', 4.6, 1980, '2h 10min', 'Chad Stahelski', '2026-10-22', 'English', 'UA', 'An ex-intelligence courier races across neon-lit metropolitan towers to dismantle a digital blackmail syndicate before citywide power grids collapse.', 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=1200&h=600&fit=crop', true)
ON CONFLICT (id) DO NOTHING;

-- Theaters Seed
INSERT INTO theaters (id, name, location, distance, rating)
VALUES
('cinetix-imax-downtown', 'Cinetix Grand IMAX Downtown', '123 Market Street, Metro Financial District', '0.8 mi', 4.9),
('cinetix-dolby-prime', 'Cinetix Dolby Atmos Prime', '450 Sunset Boulevard, West End', '1.4 mi', 4.8),
('cinetix-luxe-4dx', 'Cinetix 4DX Motion Theatre', '88 Tech Center Way, Silicon Park', '2.1 mi', 4.7)
ON CONFLICT (id) DO NOTHING;

-- Showtimes Seed
INSERT INTO showtimes (id, movie_id, theater_id, show_time, screen_format, ticket_price, available_seats)
VALUES
('st-1', 'the-last-signal', 'cinetix-imax-downtown', '10:00 AM', 'IMAX 3D', 55.00, 112),
('st-2', 'the-last-signal', 'cinetix-imax-downtown', '01:30 PM', 'IMAX 3D', 60.00, 98),
('st-3', 'the-last-signal', 'cinetix-imax-downtown', '04:45 PM', 'IMAX 3D', 65.00, 74),
('st-4', 'the-last-signal', 'cinetix-imax-downtown', '08:00 PM', 'IMAX 3D', 70.00, 42),
('st-5', 'the-last-signal', 'cinetix-imax-downtown', '11:15 PM', 'IMAX 3D', 55.00, 120),
('st-6', 'the-last-signal', 'cinetix-dolby-prime', '11:15 AM', 'Dolby Atmos', 48.00, 130),
('st-7', 'the-last-signal', 'cinetix-dolby-prime', '02:45 PM', 'Dolby Atmos', 52.00, 85),
('st-8', 'the-last-signal', 'cinetix-dolby-prime', '06:15 PM', 'Dolby Atmos', 58.00, 60),
('st-9', 'the-last-signal', 'cinetix-dolby-prime', '09:30 PM', 'Dolby Atmos', 55.00, 94),
('st-10', 'the-last-signal', 'cinetix-luxe-4dx', '12:00 PM', '4DX', 65.00, 80),
('st-11', 'the-last-signal', 'cinetix-luxe-4dx', '03:30 PM', '4DX', 72.00, 50),
('st-12', 'the-last-signal', 'cinetix-luxe-4dx', '07:15 PM', '4DX', 75.00, 32)
ON CONFLICT (id) DO NOTHING;

-- Food Items Seed
INSERT INTO food_items (id, name, description, price, category, image_url, is_veg, is_popular, calories)
VALUES
('f-1', 'Truffle Butter Caramel Popcorn Duo', 'Freshly popped jumbo popcorn tossed in artisanal truffle butter and salted caramel glaze.', 18.00, 'snacks', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=200&fit=crop', true, true, '420 kcal'),
('f-2', 'Artisan Loaded Queso Nachos', 'Crisp stone-ground corn chips loaded with warm aged cheddar queso, jalapeños, and fresh pico de gallo.', 16.00, 'snacks', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop', true, true, '560 kcal'),
('f-3', 'Cinetix VIP Royale Combo', 'Large Truffle Popcorn + 2 Large Sodas + Warm Pretzel Bites with honey mustard dip.', 32.00, 'combos', 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&h=200&fit=crop', true, true, '890 kcal'),
('f-4', 'Amber Citrus Sparkler (750ml)', 'Cold-pressed yuzu, blood orange, and sparkling mineral water with fresh rosemary sprig.', 12.00, 'beverages', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=200&fit=crop', true, false, '110 kcal'),
('f-5', 'Cold Brew Espresso Nitro', 'Slow-steeped single-origin Ethiopian cold brew infused with nitrogen for an ultra-velvety foam.', 10.00, 'beverages', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop', true, false, '15 kcal'),
('f-6', 'Warm Belgian Chocolate Lava Cake', 'Gooey melted Valrhona chocolate core with Madagascan vanilla bean gelato scoop.', 14.00, 'desserts', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop', true, true, '480 kcal')
ON CONFLICT (id) DO NOTHING;

-- Offers Seed
INSERT INTO offers (id, title, description, code, discount_text, discount_percent, valid_until, category, theme_color)
VALUES
('off-1', '30% Off IMAX & 4DX Screenings', 'Use code CINETIX30 at checkout to unlock 30% instant discount on premium formats.', 'CINETIX30', '30% OFF', 30, '2026-11-30', 'IMAX', '#FF9D16'),
('off-2', 'Student & Night Owl 20% Discount', 'Valid on all late-night showtimes starting past 10:00 PM. Instant flat deduction.', 'NIGHT20', '20% OFF', 20, '2026-12-31', 'Special', '#CC903B'),
('off-3', 'Buy 2 Tickets, Get Combo Free', 'Order any 2 tickets and get a complimentary Large Truffle Popcorn with code COMBOFREE.', 'COMBOFREE', 'FREE POPCORN', 15, '2026-12-15', 'Combos', '#99784B')
ON CONFLICT (id) DO NOTHING;

-- Demo User Profile
INSERT INTO users (id, name, email, phone, avatar_url, membership_tier, reward_points, wallet_balance)
VALUES
('usr-1', 'Alex Sterling', 'alex.sterling@cinetix.io', '+1 (555) 849-2041', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', 'Black VIP', 2450, 120.00)
ON CONFLICT (id) DO NOTHING;
