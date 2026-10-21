import type { Movie, Theater, Showtime, FoodItem, Offer, BookingRecord, UserProfile, CartItem } from '../types';

const DB_KEY = 'cinetix_sqlite_db_v1';

// Initial Seed Data
const INITIAL_MOVIES: Movie[] = [
  {
    id: 'the-last-signal',
    title: 'The Last Signal',
    tagline: 'Every signal has a beginning. Every truth has a price.',
    genre: ['Sci-Fi', 'Thriller'],
    rating: 4.9,
    reviewCount: 3840,
    duration: '2h 18min',
    director: 'Maya Chen',
    releaseDate: '2026-10-28',
    language: 'English',
    certificate: 'UA',
    synopsis: 'When a cryptic transmission reaches Earth from the edge of the solar system, astrophysicist Dr. Mara Hayes races against time to decode a message that may either save humanity or trigger its annihilation. In a world where every signal has a cost, silence might be the only survival.',
    poster: '/assets/ls-asset-7.jpg',
    backdrop: '/assets/ls-asset-2.jpg',
    trailerUrl: '/assets/trailer.mp4',
    bookable: true,
    cast: [
      { name: 'Marcus Cole', role: 'Police Officer', image: '/assets/ls-asset-9.jpg' },
      { name: 'Olivia Reed', role: 'Investigative Journalist', image: '/assets/new-poster-1.jpg' },
      { name: 'Sophia Vance', role: "Ethan's Sister", image: '/assets/new-poster-4.jpg' },
      { name: 'Ethan Vance', role: 'Radio Technician', image: '/assets/ls-asset-6.jpg' },
    ],
    theaters: [],
  },
  {
    id: 'void-protocol',
    title: 'Void Protocol',
    tagline: 'When deep space goes silent, protocol is all that remains.',
    genre: ['Sci-Fi', 'Action'],
    rating: 4.7,
    reviewCount: 2190,
    duration: '2h 05min',
    director: 'Denis Villeneuve',
    releaseDate: '2026-11-04',
    language: 'English',
    certificate: 'A',
    synopsis: 'Deep space anomaly station Kepler-9 stops transmitting. An elite recovery squad boards the ghost vessel only to discover that the synthetic AI has initiated quarantine against something brought from beyond.',
    poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=1200&h=600&fit=crop',
    trailerUrl: '/assets/trailer.mp4',
    bookable: true,
    cast: [
      { name: 'David Mercer', role: 'Commander', image: '/assets/ls-asset-9.jpg' },
      { name: 'Aria Thorne', role: 'Cybernetic Specialist', image: '/assets/new-poster-2.jpg' },
    ],
    theaters: [],
  },
  {
    id: 'dark-meridian',
    title: 'Dark Meridian',
    tagline: 'Shadows hide what light cannot comprehend.',
    genre: ['Thriller', 'Drama'],
    rating: 4.6,
    reviewCount: 1820,
    duration: '2h 12min',
    director: 'Christopher Nolan',
    releaseDate: '2026-10-20',
    language: 'English',
    certificate: 'UA',
    synopsis: 'A geopolitical crisis breaks out on an Arctic oceanic border, where covert operatives and underwater seismic anomalies threaten to plunge the global powers into cold catastrophe.',
    poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=1200&h=600&fit=crop',
    trailerUrl: '/assets/trailer.mp4',
    bookable: true,
    cast: [
      { name: 'Kaelen Vance', role: 'Naval Commander', image: '/assets/ls-asset-9.jpg' },
      { name: 'Sora Tanaka', role: 'Oceanographer', image: '/assets/new-poster-1.jpg' },
    ],
    theaters: [],
  },
  {
    id: 'the-entity',
    title: 'The Entity',
    tagline: 'It watches in silence. It feeds on fear.',
    genre: ['Horror', 'Mystery'],
    rating: 4.4,
    reviewCount: 1450,
    duration: '1h 54min',
    director: 'Ari Aster',
    releaseDate: '2026-10-15',
    language: 'English',
    certificate: 'A',
    synopsis: 'An isolated research facility in Northern Maine encounters an intangible presence that distorts memories, whispers in deceased voices, and claims the physical bodies of its residents.',
    poster: 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=1200&h=600&fit=crop',
    trailerUrl: '/assets/trailer.mp4',
    bookable: true,
    cast: [
      { name: 'Sarah Lin', role: 'Lead Researcher', image: '/assets/new-poster-3.jpg' },
      { name: 'John Hayes', role: 'Security Chief', image: '/assets/ls-asset-6.jpg' },
    ],
    theaters: [],
  },
  {
    id: 'echo-chamber',
    title: 'Echo Chamber',
    tagline: 'Every word you repeat traps you deeper.',
    genre: ['Mystery', 'Sci-Fi'],
    rating: 4.5,
    reviewCount: 1670,
    duration: '2h 02min',
    director: 'Alex Garland',
    releaseDate: '2026-11-12',
    language: 'English',
    certificate: 'UA',
    synopsis: 'A cognitive neurologist tests a revolutionary sensory chamber designed to unlock repressed memories, only to discover that the chamber is projecting alternate reality simulations into real life.',
    poster: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=1200&h=600&fit=crop',
    trailerUrl: '/assets/trailer.mp4',
    bookable: false,
    cast: [
      { name: 'Elena Rostova', role: 'Dr. Rostova', image: '/assets/new-poster-4.jpg' },
    ],
    theaters: [],
  },
  {
    id: 'phantom-circuit',
    title: 'Phantom Circuit',
    tagline: 'In the network, nobody can hear you scream.',
    genre: ['Action', 'Thriller'],
    rating: 4.6,
    reviewCount: 1980,
    duration: '2h 10min',
    director: 'Chad Stahelski',
    releaseDate: '2026-10-22',
    language: 'English',
    certificate: 'UA',
    synopsis: 'A high-speed cyber thriller following an ex-intelligence courier racing across neon-lit metropolitan towers to dismantle a digital blackmail syndicate before citywide power grids collapse.',
    poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=1200&h=600&fit=crop',
    trailerUrl: '/assets/trailer.mp4',
    bookable: true,
    cast: [
      { name: 'Leon Cross', role: 'Courier', image: '/assets/ls-asset-9.jpg' },
    ],
    theaters: [],
  },
];

const INITIAL_THEATERS: Theater[] = [
  {
    id: 'cinetix-imax-downtown',
    name: 'Cinetix Grand IMAX Downtown',
    location: '123 Market Street, Metro Financial District',
    distance: '0.8 mi',
    rating: 4.9,
    showtimes: [
      { id: 'st-1', time: '10:00 AM', format: 'IMAX 3D', price: 55, available: 112 },
      { id: 'st-2', time: '01:30 PM', format: 'IMAX 3D', price: 60, available: 98 },
      { id: 'st-3', time: '04:45 PM', format: 'IMAX 3D', price: 65, available: 74 },
      { id: 'st-4', time: '08:00 PM', format: 'IMAX 3D', price: 70, available: 42 },
      { id: 'st-5', time: '11:15 PM', format: 'IMAX 3D', price: 55, available: 120 },
    ],
  },
  {
    id: 'cinetix-dolby-prime',
    name: 'Cinetix Dolby Atmos Prime',
    location: '450 Sunset Boulevard, West End',
    distance: '1.4 mi',
    rating: 4.8,
    showtimes: [
      { id: 'st-6', time: '11:15 AM', format: 'Dolby Atmos', price: 48, available: 130 },
      { id: 'st-7', time: '02:45 PM', format: 'Dolby Atmos', price: 52, available: 85 },
      { id: 'st-8', time: '06:15 PM', format: 'Dolby Atmos', price: 58, available: 60 },
      { id: 'st-9', time: '09:30 PM', format: 'Dolby Atmos', price: 55, available: 94 },
    ],
  },
  {
    id: 'cinetix-luxe-4dx',
    name: 'Cinetix 4DX Motion Theatre',
    location: '88 Tech Center Way, Silicon Park',
    distance: '2.1 mi',
    rating: 4.7,
    showtimes: [
      { id: 'st-10', time: '12:00 PM', format: '4DX', price: 65, available: 80 },
      { id: 'st-11', time: '03:30 PM', format: '4DX', price: 72, available: 50 },
      { id: 'st-12', time: '07:15 PM', format: '4DX', price: 75, available: 32 },
      { id: 'st-13', time: '10:45 PM', format: '4DX', price: 68, available: 70 },
    ],
  },
];

const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f-1',
    name: 'Truffle Butter Caramel Popcorn Duo',
    description: 'Freshly popped jumbo popcorn tossed in artisanal truffle butter and salted caramel glaze.',
    price: 18,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=200&fit=crop',
    isVeg: true,
    popular: true,
    calories: '420 kcal',
  },
  {
    id: 'f-2',
    name: 'Artisan Loaded Queso Nachos',
    description: 'Crisp stone-ground corn chips loaded with warm aged cheddar queso, jalapeños, and fresh pico de gallo.',
    price: 16,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop',
    isVeg: true,
    popular: true,
    calories: '560 kcal',
  },
  {
    id: 'f-3',
    name: 'Cinetix VIP Royale Combo',
    description: 'Large Truffle Popcorn + 2 Large Sodas + Warm Pretzel Bites with honey mustard dip.',
    price: 32,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&h=200&fit=crop',
    isVeg: true,
    popular: true,
    calories: '890 kcal',
  },
  {
    id: 'f-4',
    name: 'Amber Citrus Sparkler (750ml)',
    description: 'Cold-pressed yuzu, blood orange, and sparkling mineral water with fresh rosemary sprig.',
    price: 12,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=200&fit=crop',
    isVeg: true,
    popular: false,
    calories: '110 kcal',
  },
  {
    id: 'f-5',
    name: 'Cold Brew Espresso Nitro',
    description: 'Slow-steeped single-origin Ethiopian cold brew infused with nitrogen for an ultra-velvety foam.',
    price: 10,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop',
    isVeg: true,
    popular: false,
    calories: '15 kcal',
  },
  {
    id: 'f-6',
    name: 'Warm Belgian Chocolate Lava Cake',
    description: 'Gooey melted Valrhona chocolate core with Madagascan vanilla bean gelato scoop.',
    price: 14,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
    isVeg: true,
    popular: true,
    calories: '480 kcal',
  },
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: '30% Off IMAX & 4DX Screenings',
    description: 'Use code CINETIX30 at checkout to unlock 30% instant discount on premium formats.',
    code: 'CINETIX30',
    discount: '30% OFF',
    discountPercent: 30,
    validUntil: '2026-11-30',
    category: 'IMAX',
    color: '#FF9D16',
  },
  {
    id: 'off-2',
    title: 'Student & Night Owl 20% Discount',
    description: 'Valid on all late-night showtimes starting past 10:00 PM. Instant flat deduction.',
    code: 'NIGHT20',
    discount: '20% OFF',
    discountPercent: 20,
    validUntil: '2026-12-31',
    category: 'Special',
    color: '#CC903B',
  },
  {
    id: 'off-3',
    title: 'Buy 2 Tickets, Get Combo Free',
    description: 'Order any 2 tickets and get a complimentary Large Truffle Popcorn with code COMBOFREE.',
    code: 'COMBOFREE',
    discount: 'FREE POPCORN',
    discountPercent: 15,
    validUntil: '2026-12-15',
    category: 'Combos',
    color: '#99784B',
  },
];

const INITIAL_USER: UserProfile = {
  name: 'Alex Sterling',
  email: 'alex.sterling@cinetix.io',
  phone: '+1 (555) 849-2041',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  membershipTier: 'Black VIP',
  rewardPoints: 2450,
  walletBalance: 120.0,
};

// Initial booked seats map
const INITIAL_BOOKED_SEATS: Record<string, string[]> = {
  default: ['A3', 'A7', 'B2', 'B8', 'B9', 'C4', 'C5', 'D6', 'D7', 'D8', 'E1', 'E8', 'F3', 'F9', 'G5', 'G10', 'H2', 'H11', 'I4', 'I7', 'J6', 'J13'],
};

interface DatabaseState {
  movies: Movie[];
  theaters: Theater[];
  foodItems: FoodItem[];
  offers: Offer[];
  bookings: BookingRecord[];
  userProfile: UserProfile;
  bookedSeats: Record<string, string[]>;
  version: number;
}

class CinetixDatabase {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.version === 2) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse database, initializing fresh state', e);
    }
    return this.getInitialState();
  }

  private getInitialState(): DatabaseState {
    const movies = INITIAL_MOVIES.map(m => ({
      ...m,
      theaters: INITIAL_THEATERS,
    }));

    const demoBookings: BookingRecord[] = [
      {
        id: 'CTX-9182-AA',
        bookingRef: 'CTX-9182',
        movieId: 'the-last-signal',
        movieTitle: 'The Last Signal',
        moviePoster: '/assets/ls-asset-7.jpg',
        theaterId: 'cinetix-imax-downtown',
        theaterName: 'Cinetix Grand IMAX Downtown',
        date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: '08:00 PM',
        format: 'IMAX 3D',
        seats: ['E4', 'E5'],
        foodItems: [{ name: 'Cinetix VIP Royale Combo', quantity: 1, price: 32 }],
        subtotal: 140,
        convenienceFee: 7,
        discount: 30,
        total: 149,
        paymentMethod: 'Credit Card (•••• 4242)',
        paymentId: 'TXN_984128912',
        status: 'confirmed',
        qrData: 'CINETIX|CTX-9182|The Last Signal|E4,E5|IMAX 3D|VERIFIED_VALID',
        bookedAt: Date.now() - 3600000,
      },
    ];

    return {
      movies,
      theaters: INITIAL_THEATERS,
      foodItems: INITIAL_FOOD_ITEMS,
      offers: INITIAL_OFFERS,
      bookings: demoBookings,
      userProfile: INITIAL_USER,
      bookedSeats: INITIAL_BOOKED_SEATS,
      version: 2,
    };
  }

  private save() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error('Failed to save Cinetix DB to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ── Queries ──
  public getMovies(): Movie[] {
    return this.state.movies;
  }

  public getMovieById(id: string): Movie | undefined {
    return this.state.movies.find(m => m.id === id);
  }

  public getTheaters(): Theater[] {
    return this.state.theaters;
  }

  public getFoodItems(category?: string): FoodItem[] {
    if (!category || category === 'all') return this.state.foodItems;
    return this.state.foodItems.filter(f => f.category === category);
  }

  public getOffers(): Offer[] {
    return this.state.offers;
  }

  public getBookings(): BookingRecord[] {
    return [...this.state.bookings].sort((a, b) => b.bookedAt - a.bookedAt);
  }

  public getBookingById(id: string): BookingRecord | undefined {
    return this.state.bookings.find(b => b.id === id || b.bookingRef === id);
  }

  public getUserProfile(): UserProfile {
    return this.state.userProfile;
  }

  public getBookedSeats(showtimeKey: string): string[] {
    return this.state.bookedSeats[showtimeKey] || this.state.bookedSeats.default || [];
  }

  // ── Mutations ──
  public createBooking(payload: {
    movieTitle: string;
    moviePoster: string;
    movieId?: string;
    theaterName: string;
    theaterId?: string;
    date: string;
    time: string;
    format: string;
    seats: string[];
    foodItems?: CartItem[];
    subtotal: number;
    convenienceFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentId?: string;
  }): BookingRecord {
    const rawRef = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `CTX-${rawRef}`;
    const id = `CTX-${Date.now().toString().slice(-6)}-${rawRef}`;

    const showtimeKey = `${payload.movieId || 'movie'}_${payload.date}_${payload.time}`;
    const existing = this.state.bookedSeats[showtimeKey] || [...(this.state.bookedSeats.default || [])];
    this.state.bookedSeats[showtimeKey] = Array.from(new Set([...existing, ...payload.seats]));

    const formattedFood = payload.foodItems?.map(f => ({
      name: f.item.name,
      quantity: f.quantity,
      price: f.item.price,
    })) || [];

    const qrData = `CINETIX|${bookingRef}|${payload.movieTitle}|${payload.seats.join(',')}|${payload.date}|${payload.time}|TOTAL:$${payload.total}|AUTH_OK`;

    const newBooking: BookingRecord = {
      id,
      bookingRef,
      movieId: payload.movieId,
      movieTitle: payload.movieTitle,
      moviePoster: payload.moviePoster,
      theaterId: payload.theaterId,
      theaterName: payload.theaterName,
      date: payload.date,
      time: payload.time,
      format: payload.format,
      seats: payload.seats,
      foodItems: formattedFood,
      subtotal: payload.subtotal,
      convenienceFee: payload.convenienceFee,
      discount: payload.discount,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      paymentId: payload.paymentId || `TXN_${Date.now()}`,
      status: 'confirmed',
      qrData,
      bookedAt: Date.now(),
    };

    this.state.bookings.unshift(newBooking);

    // Reward points for booking (10 points per dollar)
    this.state.userProfile.rewardPoints += Math.round(payload.total * 10);

    this.save();
    return newBooking;
  }

  public cancelBooking(id: string): boolean {
    const idx = this.state.bookings.findIndex(b => b.id === id || b.bookingRef === id);
    if (idx === -1) return false;

    const booking = this.state.bookings[idx];
    booking.status = 'cancelled';

    // Release seats
    const showtimeKey = `${booking.movieId || 'movie'}_${booking.date}_${booking.time}`;
    if (this.state.bookedSeats[showtimeKey]) {
      this.state.bookedSeats[showtimeKey] = this.state.bookedSeats[showtimeKey].filter(
        s => !booking.seats.includes(s)
      );
    }

    this.save();
    return true;
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    this.state.userProfile = { ...this.state.userProfile, ...updates };
    this.save();
    return this.state.userProfile;
  }

  public validatePromo(code: string, currentTotal: number): { valid: boolean; discount: number; message: string } {
    const upper = code.trim().toUpperCase();
    const offer = this.state.offers.find(o => o.code === upper);
    if (!offer) {
      if (upper === 'CINETIX' || upper === 'IMAX30') {
        const discount = Math.round(currentTotal * 0.3);
        return { valid: true, discount, message: '30% Special Discount Applied!' };
      }
      return { valid: false, discount: 0, message: 'Invalid or expired promo code.' };
    }
    const percent = offer.discountPercent || 20;
    const discount = Math.round((currentTotal * percent) / 100);
    return { valid: true, discount, message: `${offer.discount} Applied!` };
  }

  public resetDatabase(): void {
    localStorage.removeItem(DB_KEY);
    this.state = this.getInitialState();
    this.save();
  }

  // ── SQL Dump Exporter (SQLite / PostgreSQL) ──
  public generateSqlDump(): string {
    const movies = this.state.movies;
    const bookings = this.state.bookings;

    let sql = `-- CINETIX CINEMA TICKETING SYSTEM
-- Schema & Seed Data (SQLite & PostgreSQL Compatible)
-- Generated on: ${new Date().toISOString()}

-- 1. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    genre VARCHAR(255),
    rating DECIMAL(2,1),
    duration VARCHAR(32),
    director VARCHAR(128),
    release_date DATE,
    certificate VARCHAR(16),
    synopsis TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Theaters Table
CREATE TABLE IF NOT EXISTS theaters (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    distance VARCHAR(32),
    rating DECIMAL(2,1)
);

-- 3. Showtimes Table
CREATE TABLE IF NOT EXISTS showtimes (
    id VARCHAR(64) PRIMARY KEY,
    movie_id VARCHAR(64) REFERENCES movies(id) ON DELETE CASCADE,
    theater_id VARCHAR(64) REFERENCES theaters(id) ON DELETE CASCADE,
    show_time VARCHAR(32) NOT NULL,
    screen_format VARCHAR(32) NOT NULL,
    ticket_price DECIMAL(8,2) NOT NULL,
    available_seats INT DEFAULT 120
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_ref VARCHAR(32) UNIQUE NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    theater_name VARCHAR(255) NOT NULL,
    show_date VARCHAR(64) NOT NULL,
    show_time VARCHAR(32) NOT NULL,
    screen_format VARCHAR(32) NOT NULL,
    seats TEXT NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    payment_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'confirmed',
    qr_data TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- ── SEED MOVIES ──
`;

    movies.forEach(m => {
      const escapedTitle = m.title.replace(/'/g, "''");
      const escapedSynopsis = m.synopsis.replace(/'/g, "''");
      const escapedDirector = m.director.replace(/'/g, "''");
      sql += `INSERT INTO movies (id, title, genre, rating, duration, director, certificate, synopsis, poster_url) VALUES ('${m.id}', '${escapedTitle}', '${m.genre.join(', ')}', ${m.rating}, '${m.duration}', '${escapedDirector}', '${m.certificate}', '${escapedSynopsis}', '${m.poster}') ON CONFLICT (id) DO NOTHING;\n`;
    });

    sql += `\n-- ── SEED THEATERS ──\n`;
    INITIAL_THEATERS.forEach(t => {
      sql += `INSERT INTO theaters (id, name, location, distance, rating) VALUES ('${t.id}', '${t.name.replace(/'/g, "''")}', '${t.location.replace(/'/g, "''")}', '${t.distance}', ${t.rating}) ON CONFLICT (id) DO NOTHING;\n`;
    });

    sql += `\n-- ── SEED EXISTING BOOKINGS ──\n`;
    bookings.forEach(b => {
      sql += `INSERT INTO bookings (id, booking_ref, movie_title, theater_name, show_date, show_time, screen_format, seats, total_amount, payment_method, payment_id, status, qr_data, created_at) VALUES ('${b.id}', '${b.bookingRef}', '${b.movieTitle.replace(/'/g, "''")}', '${b.theaterName.replace(/'/g, "''")}', '${b.date}', '${b.time}', '${b.format}', '${b.seats.join(',')}', ${b.total}, '${b.paymentMethod}', '${b.paymentId}', '${b.status}', '${b.qrData.replace(/'/g, "''")}', ${b.bookedAt}) ON CONFLICT (id) DO NOTHING;\n`;
    });

    return sql;
  }
}

export const db = new CinetixDatabase();
