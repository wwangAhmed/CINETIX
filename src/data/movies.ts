import type { Movie, FoodItem, Offer } from "../types"

const RELEASE_DATE = new Date("2026-10-28")
const formatDate = (offset: number) => {
  const d = new Date(RELEASE_DATE)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}

export const MOVIE_DATES = Array.from({ length: 14 }, (_, i) => formatDate(i))

export const movies: Movie[] = [
  {
    id: "the-last-signal",
    title: "The Last Signal",
    tagline: "Every signal has a beginning",
    genre: ["Sci-Fi", "Thriller"],
    rating: 4.9,
    reviewCount: 2400,
    duration: "2h 18min",
    director: "Maya Chen",
    releaseDate: "2026-10-28",
    language: "English",
    certificate: "UA",
    synopsis:
      "When a cryptic transmission reaches Earth from the edge of the solar system, astrophysicist Dr. Mara Hayes races against time to decode a message that may either save humanity or trigger its annihilation. In a world where every signal has a cost, silence might be the only survival.",
    poster: "/assets/ls-asset-7.jpg",
    backdrop: "/assets/ls-asset-2.jpg",
    trailerUrl: "/assets/trailer.mp4",
    cast: [
      {
        name: "Marcus Cole",
        role: "Police Officer",
        image: "/assets/ls-asset-9.jpg",
      },
      {
        name: "Olivia Reed",
        role: "Investigative Journalist",
        image: "/assets/new-poster-1.jpg",
      },
      {
        name: "Sophia Vance",
        role: "Ethan's Sister",
        image: "/assets/new-poster-4.jpg",
      },
      {
        name: "Ethan Vance",
        role: "Young Radio Technician",
        image: "/assets/ls-asset-6.jpg",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-imax-downtown",
        name: "CineBuzz IMAX Downtown",
        location: "123 Market St, San Francisco, CA",
        distance: "0.8 mi",
        rating: 4.8,
        showtimes: [
          { time: "10:00 AM", format: "IMAX", price: 50, available: 120 },
          { time: "1:30 PM", format: "IMAX", price: 50, available: 85 },
          { time: "4:45 PM", format: "IMAX", price: 50, available: 42 },
          { time: "8:00 PM", format: "IMAX", price: 50, available: 12 },
          { time: "11:15 PM", format: "IMAX", price: 50, available: 98 },
        ],
      },
      {
        id: "amc-metreon",
        name: "AMC Metreon 16 & IMAX",
        location: "135 4th St, San Francisco, CA",
        distance: "1.2 mi",
        rating: 4.6,
        showtimes: [
          { time: "10:00 AM", format: "MAX 3D", price: 25, available: 200 },
          { time: "1:30 PM", format: "MAX 3D", price: 25, available: 160 },
          { time: "4:45 PM", format: "MAX 3D", price: 25, available: 90 },
          { time: "8:00 PM", format: "IMAX", price: 50, available: 30 },
          { time: "11:15 PM", format: "MAX 3D", price: 25, available: 180 },
        ],
      },
      {
        id: "cinebuzz-metreon",
        name: "CineBuzz Metreon 16",
        location: "101 Mission St, San Francisco, CA",
        distance: "1.5 mi",
        rating: 4.5,
        showtimes: [
          { time: "10:00 AM", format: "2D", price: 10, available: 300 },
          { time: "1:30 PM", format: "2D", price: 10, available: 250 },
          { time: "4:45 PM", format: "MAX 3D", price: 25, available: 140 },
          { time: "8:00 PM", format: "2D", price: 10, available: 200 },
          { time: "11:15 PM", format: "2D", price: 10, available: 280 },
        ],
      },
      {
        id: "cinebuzz-classic",
        name: "CineBuzz Classic",
        location: "450 Geary St, San Francisco, CA",
        distance: "2.1 mi",
        rating: 4.3,
        showtimes: [
          { time: "10:00 AM", format: "2D", price: 10, available: 180 },
          { time: "4:45 PM", format: "2D", price: 10, available: 220 },
          { time: "8:00 PM", format: "2D", price: 10, available: 160 },
        ],
      },
    ],
  },
  {
    id: "the-other-side",
    title: "The Other Side",
    tagline: "Truth is often the most dangerous lie",
    genre: ["Thriller", "Drama"],
    rating: 4.7,
    reviewCount: 1820,
    duration: "2h 05min",
    director: "Sarah Vertex",
    releaseDate: "2026-01-23",
    language: "English",
    certificate: "R",
    synopsis:
      "A gripping psychological thriller where two women — mirror images of each other — must confront the dangerous truth that binds them, as the line between identity and deception dissolves.",
    poster: "/assets/poster-1.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Elena Voss",
        role: "Claire",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Maya Hart",
        role: "Shadow",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
      {
        name: "Daniel Cross",
        role: "Detective Ray",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Lucia Kahn",
        role: "Dr. Monroe",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-imax-downtown",
        name: "CineBuzz IMAX Downtown",
        location: "123 Market St, San Francisco, CA",
        distance: "0.8 mi",
        rating: 4.8,
        showtimes: [
          { time: "11:00 AM", format: "IMAX", price: 50, available: 110 },
          { time: "2:30 PM", format: "IMAX", price: 50, available: 75 },
          { time: "7:00 PM", format: "IMAX", price: 50, available: 28 },
        ],
      },
      {
        id: "amc-metreon",
        name: "AMC Metreon 16 & IMAX",
        location: "135 4th St, San Francisco, CA",
        distance: "1.2 mi",
        rating: 4.6,
        showtimes: [
          { time: "10:30 AM", format: "2D", price: 10, available: 200 },
          { time: "3:00 PM", format: "MAX 3D", price: 25, available: 140 },
          { time: "8:30 PM", format: "2D", price: 10, available: 190 },
        ],
      },
    ],
  },
  {
    id: "the-last-horizon",
    title: "The Last Horizon",
    tagline: "Some journeys change you forever",
    genre: ["Drama", "Romance"],
    rating: 4.5,
    reviewCount: 1340,
    duration: "1h 58min",
    director: "James Calloway",
    releaseDate: "2026-08-15",
    language: "English",
    certificate: "PG",
    synopsis:
      "A story of love, loss, and new beginnings — one woman's transformative journey across continents to reclaim her sense of self after tragedy reshapes everything she thought she knew.",
    poster: "/assets/poster-2.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Aria Storm",
        role: "Lena",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Kai Monroe",
        role: "Marco",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Nora Blake",
        role: "Sofia",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
      {
        name: "Felix Grant",
        role: "Thomas",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-metreon",
        name: "CineBuzz Metreon 16",
        location: "101 Mission St, San Francisco, CA",
        distance: "1.5 mi",
        rating: 4.5,
        showtimes: [
          { time: "12:00 PM", format: "2D", price: 10, available: 260 },
          { time: "3:30 PM", format: "2D", price: 10, available: 210 },
          { time: "7:15 PM", format: "MAX 3D", price: 25, available: 130 },
        ],
      },
    ],
  },
  {
    id: "the-forgotten-island",
    title: "The Forgotten Island",
    tagline: "Some places are not meant to be found",
    genre: ["Adventure", "Action"],
    rating: 4.6,
    reviewCount: 1960,
    duration: "2h 24min",
    director: "Nolan Park",
    releaseDate: "2026-07-04",
    language: "English",
    certificate: "PG-13",
    synopsis:
      "An adventure beyond the map — a lone explorer stumbles onto an uncharted island teeming with ancient secrets, deadly traps, and a civilization that has been erased from history for a reason.",
    poster: "/assets/poster-3.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Jake Mercer",
        role: "Eli Cruz",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
      {
        name: "Priya Nair",
        role: "Dr. Asha",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Owen Fox",
        role: "Capt. Reed",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Rosa Dean",
        role: "Guide Mira",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-imax-downtown",
        name: "CineBuzz IMAX Downtown",
        location: "123 Market St, San Francisco, CA",
        distance: "0.8 mi",
        rating: 4.8,
        showtimes: [
          { time: "10:00 AM", format: "IMAX", price: 50, available: 100 },
          { time: "1:00 PM", format: "IMAX", price: 50, available: 64 },
          { time: "5:30 PM", format: "IMAX", price: 50, available: 20 },
          { time: "9:00 PM", format: "IMAX", price: 50, available: 88 },
        ],
      },
    ],
  },
  {
    id: "beyond-the-shadows",
    title: "Beyond The Shadows",
    tagline: "Some secrets should stay hidden",
    genre: ["Mystery", "Drama"],
    rating: 4.4,
    reviewCount: 980,
    duration: "2h 02min",
    director: "Claire Fontaine",
    releaseDate: "2026-10-10",
    language: "English",
    certificate: "PG-13",
    synopsis:
      "A mystery drama set in fog-drenched London. When a detective is pulled into a cold case tied to her own past, she must navigate a labyrinth of half-truths before the killer finds her first.",
    poster: "/assets/poster-4.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Isabelle Ray",
        role: "Det. Holt",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
      {
        name: "Marcus Grey",
        role: "Victor Kane",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Vera Solis",
        role: "Anna",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Leo Hunt",
        role: "Sgt. Webb",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-classic",
        name: "CineBuzz Classic",
        location: "450 Geary St, San Francisco, CA",
        distance: "2.1 mi",
        rating: 4.3,
        showtimes: [
          { time: "11:30 AM", format: "2D", price: 10, available: 160 },
          { time: "3:00 PM", format: "2D", price: 10, available: 140 },
          { time: "7:30 PM", format: "MAX 3D", price: 25, available: 90 },
        ],
      },
    ],
  },
  {
    id: "the-lost-algorithm",
    title: "The Lost Algorithm",
    tagline: "Some truths are better left undiscovered",
    genre: ["Thriller", "Sci-Fi"],
    rating: 4.8,
    reviewCount: 2100,
    duration: "2h 10min",
    director: "Zara Singh",
    releaseDate: "2026-11-05",
    language: "English",
    certificate: "PG-13",
    synopsis:
      "A tech thriller — a rogue hacker uncovers an AI algorithm buried by a trillion-dollar corporation that, if released, would expose the world's most dangerous secret. He has 48 hours before they erase him.",
    poster: "/assets/poster-5.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Finn Carter",
        role: "Hacker X",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
      {
        name: "Nina Zhao",
        role: "Dr. Lin",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Cole Webb",
        role: "Director Ash",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Mia Torres",
        role: "Agent Reyes",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-imax-downtown",
        name: "CineBuzz IMAX Downtown",
        location: "123 Market St, San Francisco, CA",
        distance: "0.8 mi",
        rating: 4.8,
        showtimes: [
          { time: "10:30 AM", format: "IMAX", price: 50, available: 90 },
          { time: "2:00 PM", format: "IMAX", price: 50, available: 55 },
          { time: "6:00 PM", format: "IMAX", price: 50, available: 18 },
          { time: "9:30 PM", format: "IMAX", price: 50, available: 75 },
        ],
      },
    ],
  },
  {
    id: "the-renewal",
    title: "The Renewal",
    tagline: "Not an end, but a fresh start",
    genre: ["Drama"],
    rating: 4.3,
    reviewCount: 870,
    duration: "1h 52min",
    director: "Amos Field",
    releaseDate: "2026-10-20",
    language: "English",
    certificate: "PG",
    synopsis:
      "A story of second chances — a man at the edge of despair finds unexpected redemption on a mountain peak, where the silence of nature forces him to confront the choices that brought him there.",
    poster: "/assets/poster-6.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Sam Ellis",
        role: "Daniel",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Grace Wu",
        role: "Mei",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Henry Vale",
        role: "Father Jonas",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
      {
        name: "Diane Ford",
        role: "Clara",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "cinebuzz-classic",
        name: "CineBuzz Classic",
        location: "450 Geary St, San Francisco, CA",
        distance: "2.1 mi",
        rating: 4.3,
        showtimes: [
          { time: "12:00 PM", format: "2D", price: 10, available: 200 },
          { time: "4:00 PM", format: "2D", price: 10, available: 175 },
          { time: "8:00 PM", format: "2D", price: 10, available: 150 },
        ],
      },
    ],
  },
  {
    id: "the-lost-protocol",
    title: "The Lost Protocol",
    tagline: "Truth is a dangerous code",
    genre: ["Thriller", "Action"],
    rating: 4.7,
    reviewCount: 1650,
    duration: "2h 15min",
    director: "Ivan Cross",
    releaseDate: "2026-12-01",
    language: "English",
    certificate: "R",
    synopsis:
      "A tech conspiracy thriller — a government analyst discovers a buried protocol that links every major political assassination of the past decade to a single encrypted source. Now he's the target.",
    poster: "/assets/poster-7.jpg",
    backdrop:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop&auto=format",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      {
        name: "Nathan Reid",
        role: "Agent Cole",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      },
      {
        name: "Sasha Blake",
        role: "Cipher",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      },
      {
        name: "Remy Park",
        role: "Director Voss",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      {
        name: "Clara Moon",
        role: "Ana",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      },
    ],
    theaters: [
      {
        id: "amc-metreon",
        name: "AMC Metreon 16 & IMAX",
        location: "135 4th St, San Francisco, CA",
        distance: "1.2 mi",
        rating: 4.6,
        showtimes: [
          { time: "11:00 AM", format: "MAX 3D", price: 25, available: 180 },
          { time: "2:30 PM", format: "IMAX", price: 50, available: 60 },
          { time: "6:30 PM", format: "MAX 3D", price: 25, available: 110 },
          { time: "10:00 PM", format: "IMAX", price: 50, available: 85 },
        ],
      },
    ],
  },
]

export const foodItems: FoodItem[] = [
  {
    id: "f1",
    name: "Classic Popcorn",
    description: "Freshly popped buttery goodness",
    price: 6,
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f2",
    name: "Cheese Nachos",
    description: "Crispy nachos with jalapeño cheese dip",
    price: 8,
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f3",
    name: "Pepsi Large",
    description: "Ice-cold refreshment, 20oz",
    price: 4,
    category: "beverages",
    image:
      "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f4",
    name: "Caramel Popcorn",
    description: "Sweet caramel drizzle on crispy kernels",
    price: 7,
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1606232859027-bd4d9ef15e18?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f5",
    name: "Movie Combo",
    description: "Large popcorn + 2 Pepsi + Nachos",
    price: 18,
    category: "combos",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f6",
    name: "Brownie Sundae",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 9,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop",
    isVeg: true,
  },
  {
    id: "f7",
    name: "Chicken Wings",
    description: "6 pieces, BBQ glazed",
    price: 12,
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=200&fit=crop",
    isVeg: false,
  },
  {
    id: "f8",
    name: "Coffee",
    description: "Hot brewed espresso blend, 12oz",
    price: 5,
    category: "beverages",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
    isVeg: true,
  },
]

export const offers: Offer[] = [
  {
    id: "o1",
    title: "30% Off IMAX",
    description: "Get 30% off on all IMAX screenings this weekend",
    code: "IMAX30",
    discount: "30%",
    validUntil: "2026-10-31",
    category: "IMAX",
    color: "#FF9D16",
  },
  {
    id: "o2",
    title: "Buy 2 Get 1 Free",
    description: "Purchase 2 tickets and get 1 free on weekdays",
    code: "B2G1FREE",
    discount: "Free ticket",
    validUntil: "2026-10-15",
    category: "All Movies",
    color: "#22C55E",
  },
  {
    id: "o3",
    title: "Food Combo Deal",
    description: "$5 off on movie + food combo orders above $30",
    code: "MUNCHTIME",
    discount: "$5",
    validUntil: "2026-10-01",
    category: "Food",
    color: "#F59E0B",
  },
  {
    id: "o4",
    title: "First Show 40% Off",
    description: "Catch the first show of the day at 40% discount",
    code: "EARLYBIRD",
    discount: "40%",
    validUntil: "2026-10-31",
    category: "First Show",
    color: "#EC4899",
  },
  {
    id: "o5",
    title: "Student Special",
    description: "Students get 25% off with valid ID on any show",
    code: "STUDENT25",
    discount: "25%",
    validUntil: "2026-12-31",
    category: "Students",
    color: "#06B6D4",
  },
  {
    id: "o6",
    title: "Premium Membership",
    description: "Join CineBuzz Premium for unlimited bookings",
    code: "PREMIUM99",
    discount: "$9.99/mo",
    validUntil: "2026-12-31",
    category: "Membership",
    color: "#CC903B",
  },
]
