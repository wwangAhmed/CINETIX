export type Page =
  | 'login' | 'otp' | 'home' | 'movie-detail' | 'booking' | 'seat-selection'
  | 'order-it-quick' | 'food' | 'payment' | 'qr-payment' | 'confirmed' | 'quick-confirmed'
  | 'search' | 'offers' | 'profile' | 'edit-profile' | 'about' | 'contact'
  | 'privacy' | 'terms' | 'coming-soon' | 'trending' | 'design-system';

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface Showtime {
  id: string;
  time: string;
  format: 'IMAX 3D' | 'Dolby Atmos' | '4DX' | 'Standard 2D';
  price: number;
  available: number;
  theaterId?: string;
  movieId?: string;
  date?: string;
  takenSeats?: string[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  showtimes: Showtime[];
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  genre: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  director: string;
  cast: CastMember[];
  poster: string;
  backdrop: string;
  trailerUrl: string;
  theaters: Theater[];
  synopsis: string;
  releaseDate: string;
  language: string;
  certificate: string;
  bookable?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'snacks' | 'beverages' | 'combos' | 'desserts';
  image: string;
  isVeg: boolean;
  popular?: boolean;
  calories?: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface BookingState {
  movieId: string;
  movieTitle?: string;
  moviePoster?: string;
  theaterId: string;
  theaterName: string;
  date: string;
  showtime: Showtime | null;
  selectedSeats: string[];
  foodItems: CartItem[];
  totalAmount: number;
  discount?: number;
  convenienceFee?: number;
  promoCode?: string;
  paymentMethod?: string;
  bookingRef?: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  movieId?: string;
  movieTitle: string;
  moviePoster: string;
  theaterId?: string;
  theaterName: string;
  date: string;
  time: string;
  format: string;
  seats: string[];
  foodItems?: { name: string; quantity: number; price: number }[];
  subtotal?: number;
  convenienceFee?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
  status: 'confirmed' | 'cancelled';
  qrData: string;
  bookedAt: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  discountPercent?: number;
  validUntil: string;
  category: string;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  membershipTier: 'Silver' | 'Gold' | 'Black VIP';
  rewardPoints: number;
  walletBalance: number;
}
