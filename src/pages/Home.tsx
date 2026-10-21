import { useState, useEffect, useCallback } from 'react';
import type { Movie, Page } from '../types';
import { db } from '../db/database';
import { downloadAssetImage } from '../utils/downloadPass';
import QuickBookingBar from '../components/QuickBookingBar';

interface Props {
  movie: Movie;
  navigate: (page: Page) => void;
}

const HERO_SLIDES = [
  {
    title: 'The Last Signal',
    tagline: 'Every signal has a beginning. Every truth has a price.',
    genre: ['Sci-Fi', 'Thriller'],
    rating: 4.9,
    reviewCount: 3840,
    duration: '2h 18min',
    director: 'Maya Chen',
    certificate: 'UA',
    format: 'IMAX 3D Laser · Dolby Atmos',
    synopsis:
      'When a cryptic transmission reaches Earth from the edge of the solar system, astrophysicist Dr. Mara Hayes races against time to decode a message that may either save humanity or trigger its annihilation.',
    poster: '/assets/ls-asset-7.jpg',
    backdrop: '/assets/cinetix-hero.jpg',
  },
  {
    title: 'Void Protocol',
    tagline: 'When deep space goes silent, protocol is all that remains.',
    genre: ['Sci-Fi', 'Action'],
    rating: 4.7,
    reviewCount: 2190,
    duration: '2h 05min',
    director: 'Denis Villeneuve',
    certificate: 'A',
    format: 'Dolby Atmos Spatial Audio',
    synopsis:
      'Deep space anomaly station Kepler-9 stops transmitting. An elite recovery squad boards the ghost vessel only to discover that the synthetic AI has initiated quarantine against something brought from beyond.',
    poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop',
    backdrop: '/assets/ls-asset-1.jpg',
  },
  {
    title: 'Dark Meridian',
    tagline: 'Some secrets should stay hidden beneath the ice.',
    genre: ['Thriller', 'Drama'],
    rating: 4.6,
    reviewCount: 1820,
    duration: '2h 12min',
    director: 'Christopher Nolan',
    certificate: 'UA',
    format: '4DX Motion & Atmospheric FX',
    synopsis:
      'A geopolitical crisis breaks out on an Arctic oceanic border, where covert operatives and underwater seismic anomalies threaten to plunge the global powers into cold catastrophe.',
    poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop',
    backdrop: '/assets/ls-asset-2.jpg',
  },
];

type CatalogEntry = {
  id: string;
  title: string;
  label: string;
  genre: string[];
  rating: number;
  duration: string;
  certificate: string;
  poster: string;
  bookable: boolean;
};

const NOW_SHOWING: CatalogEntry[] = [
  { id: 's1', title: 'The Last Signal', label: 'IMAX 3D Laser', genre: ['Sci-Fi', 'Thriller'], rating: 4.9, duration: '2h 18m', certificate: 'UA', poster: '/assets/ls-asset-7.jpg', bookable: true },
  { id: 's2', title: 'Void Protocol', label: 'Dolby Atmos', genre: ['Sci-Fi', 'Action'], rating: 4.7, duration: '2h 05m', certificate: 'A', poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', bookable: true },
  { id: 's3', title: 'Dark Meridian', label: '4DX Motion', genre: ['Thriller', 'Drama'], rating: 4.6, duration: '2h 12m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', bookable: true },
  { id: 's4', title: 'The Entity', label: 'Dolby Atmos', genre: ['Horror', 'Mystery'], rating: 4.4, duration: '1h 54m', certificate: 'A', poster: 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=400&h=600&fit=crop', bookable: true },
  { id: 's5', title: 'Phantom Circuit', label: 'IMAX 3D', genre: ['Action', 'Thriller'], rating: 4.6, duration: '2h 10m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', bookable: true },
  { id: 's6', title: 'Echo Chamber', label: 'Special Screening', genre: ['Mystery', 'Sci-Fi'], rating: 4.5, duration: '2h 02m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop', bookable: true },
  { id: 's7', title: 'Celestial Dawn', label: 'IMAX 3D Laser', genre: ['Adventure', 'Sci-Fi'], rating: 4.8, duration: '2h 24m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop', bookable: true },
  { id: 's8', title: 'Neon Syndicate', label: '4DX Motion', genre: ['Cyberpunk', 'Action'], rating: 4.7, duration: '1h 58m', certificate: 'A', poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop', bookable: true },
];

const TRENDING: CatalogEntry[] = [
  { id: 't1', title: 'The Last Signal', label: '#1 Box Office', genre: ['Sci-Fi', 'Thriller'], rating: 4.9, duration: '2h 18m', certificate: 'UA', poster: '/assets/ls-asset-7.jpg', bookable: true },
  { id: 't2', title: 'Phantom Circuit', label: 'Trending Fast', genre: ['Action', 'Thriller'], rating: 4.6, duration: '2h 10m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', bookable: true },
  { id: 't3', title: 'Celestial Dawn', label: 'Critics Choice', genre: ['Adventure', 'Sci-Fi'], rating: 4.8, duration: '2h 24m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop', bookable: true },
  { id: 't4', title: 'Dark Meridian', label: 'Popular', genre: ['Drama', 'Thriller'], rating: 4.6, duration: '2h 12m', certificate: 'UA', poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', bookable: true },
];

const UPCOMING = [
  { id: 'u1', title: 'Void Protocol II: Quarantine', label: 'Nov 24', genre: ['Sci-Fi', 'Action'], poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', date: 'NOV 24' },
  { id: 'u2', title: 'Dark Meridian: Deep Winter', label: 'Dec 01', genre: ['Thriller'], poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', date: 'DEC 01' },
  { id: 'u3', title: 'Echo Chamber: Inversion', label: 'Dec 18', genre: ['Mystery'], poster: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop', date: 'DEC 18' },
  { id: 'u4', title: 'Phantom Circuit: Overdrive', label: 'Jan 05', genre: ['Action'], poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', date: 'JAN 05' },
];

const CONCESSIONS_PREVIEW = [
  { id: 'c1', name: 'Truffle Caramel Popcorn Duo', price: 18, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=200&fit=crop', desc: 'Jumbo warm popcorn tossed in French truffle butter & salted caramel.' },
  { id: 'c2', name: 'Artisan Loaded Queso Nachos', price: 16, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop', desc: 'Corn tortilla chips, molten aged cheddar, pickled jalapeños & pico.' },
  { id: 'c3', name: 'Cinetix VIP Royale Combo', price: 34, image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&h=200&fit=crop', desc: 'XL Popcorn, loaded nachos, two artisan craft sodas & gourmet candy.' },
  { id: 'c4', name: 'Nitro Cold Craft Sodas (2x)', price: 12, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=200&fit=crop', desc: 'Handcrafted blackberry fizz and ginger citrus on pure crystal ice.' },
];

const GENRE_FILTERS = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Horror', 'Mystery', 'Drama'];
const SECTION_TABS = ['Now Showing', 'Trending', 'Upcoming Premieres'] as const;
type SectionTab = typeof SECTION_TABS[number];

export default function Home({ movie, navigate }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeSection, setActiveSection] = useState<SectionTab>('Now Showing');
  const [notifiedMovies, setNotifiedMovies] = useState<string[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setSlideTransition(false);
    setTimeout(() => {
      setSlideIndex(index);
      setSlideTransition(true);
    }, 150);
  }, []);

  const nextSlide = useCallback(() => goToSlide((slideIndex + 1) % HERO_SLIDES.length), [slideIndex, goToSlide]);
  const prevSlide = () => goToSlide((slideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = HERO_SLIDES[slideIndex];

  const filterByGenre = (list: CatalogEntry[]) =>
    activeGenre === 'All' ? list : list.filter((m) => m.genre.includes(activeGenre));

  const currentMovies: CatalogEntry[] =
    activeSection === 'Now Showing' ? filterByGenre(NOW_SHOWING) :
    activeSection === 'Trending' ? filterByGenre(TRENDING) :
    [];

  const toggleNotify = (id: string) => {
    setNotifiedMovies((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('CINETIX30');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div style={{ paddingTop: 72, paddingBottom: 110, background: '#181715', minHeight: '100vh' }}>

      {/* ── 1. Full-Bleed Cinematic Hero Showcase ── */}
      <section style={{ position: 'relative', height: 'clamp(520px, 64vh, 640px)', overflow: 'hidden', background: '#0D0C0A' }}>
        {/* Backdrop Image */}
        <img
          src={slide.backdrop}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: slideTransition ? 1 : 0,
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'brightness(0.82) contrast(1.05)',
          }}
        />

        {/* Ambient Dark Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(24,23,21,0.98) 0%, rgba(24,23,21,0.85) 45%, rgba(24,23,21,0.3) 80%, rgba(24,23,21,0.9) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, #181715 0%, rgba(24,23,21,0.4) 40%, transparent 80%)',
          }}
        />

        {/* Content Container */}
        <div
          className="max-container"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            opacity: slideTransition ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Left Text Column */}
          <div style={{ maxWidth: 660, width: '100%' }}>
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  fontSize: 11,
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: 6,
                  letterSpacing: '0.08em',
                }}
              >
                CINETIX PREMIERE
              </span>
              <span
                style={{
                  background: 'rgba(255, 157, 22, 0.15)',
                  border: '1px solid #FF9D16',
                  color: '#FF9D16',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                {slide.format}
              </span>
              <span
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  color: '#C7BFB5',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 20,
                }}
              >
                ★ {slide.rating} ({slide.reviewCount.toLocaleString()} Reviews)
              </span>
            </div>

            {/* Title in Bebas Neue */}
            <h1
              style={{
                fontFamily: 'Bebas Neue',
                fontWeight: 900,
                fontSize: 'clamp(44px, 7vw, 78px)',
                color: '#FFFFFF',
                lineHeight: 1.0,
                letterSpacing: '0.04em',
                marginBottom: 10,
                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              }}
            >
              {slide.title}
            </h1>

            {/* Tagline */}
            <p
              style={{
                color: '#FF9D16',
                fontSize: 'clamp(15px, 2.2vw, 19px)',
                fontWeight: 600,
                marginBottom: 14,
                letterSpacing: '0.02em',
              }}
            >
              "{slide.tagline}"
            </p>

            {/* Synopsis */}
            <p
              style={{
                color: '#C7BFB5',
                fontSize: 14,
                lineHeight: 1.65,
                marginBottom: 20,
                maxWidth: 580,
              }}
              className="hidden sm:block"
            >
              {slide.synopsis}
            </p>

            {/* Metadata Pills */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 24,
                color: '#C7BFB5',
                fontSize: 13,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span>⏱ {slide.duration}</span>
              <span style={{ color: '#665946' }}>•</span>
              <span>🎬 Dir. {slide.director}</span>
              <span style={{ color: '#665946' }}>•</span>
              <span
                style={{
                  border: '1px solid #665946',
                  borderRadius: 4,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#FF9D16',
                }}
              >
                {slide.certificate}
              </span>
              <span style={{ color: '#665946' }}>•</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>● Prime Seats Available Today</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => navigate('booking')}
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: '13px 30px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 20,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255, 157, 22, 0.45)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                BOOK SEATS NOW →
              </button>

              <button
                onClick={() => navigate('movie-detail')}
                style={{
                  background: 'rgba(36, 34, 31, 0.85)',
                  border: '1px solid #665946',
                  color: '#FFFFFF',
                  borderRadius: 10,
                  padding: '13px 22px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                  cursor: 'pointer',
                }}
              >
                ▶ WATCH TRAILER
              </button>

              <button
                onClick={() =>
                  downloadAssetImage(slide.backdrop, `${slide.title.replace(/\s+/g, '_')}_4K_Wallpaper.jpg`)
                }
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  color: '#C7BFB5',
                  borderRadius: 10,
                  padding: '12px 18px',
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
                title="Download 4K Cinematic Wallpaper"
              >
                <span>📥</span>
                <span>4K Wallpaper</span>
              </button>
            </div>
          </div>

          {/* Right Floating Poster (Desktop Only) */}
          <div
            className="hidden lg:block"
            style={{
              width: 250,
              filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.9))',
              transform: 'perspective(1000px) rotateY(-8deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <div
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                border: '2px solid rgba(255, 157, 22, 0.4)',
                background: '#24221F',
                boxShadow: '0 0 30px rgba(255,157,22,0.25)',
              }}
            >
              <img src={slide.poster} alt={slide.title} style={{ width: '100%', height: 350, objectFit: 'cover' }} />
              <div style={{ padding: '12px 14px', background: '#1D1C19', textAlign: 'center' }}>
                <p style={{ color: '#FF9D16', fontFamily: 'Bebas Neue', fontSize: 18, margin: 0 }}>
                  IMAX EXCLUSIVE RELEASE
                </p>
                <p style={{ color: '#C7BFB5', fontSize: 11, margin: 0 }}>Now Booking for Best Rows</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(36, 34, 31, 0.8)',
            border: '1px solid #665946',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: '#FF9D16',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
          }}
          aria-label="Previous Slide"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(36, 34, 31, 0.8)',
            border: '1px solid #665946',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: '#FF9D16',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
          }}
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Carousel Dot Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: 46,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 20,
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === slideIndex ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slideIndex ? '#FF9D16' : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 2. Integrated Floating Quick Booking Console ── */}
      <QuickBookingBar navigate={navigate} floating={true} />

      {/* ── 3. Cinema Technology Experience Pillars ── */}
      <section className="max-container" style={{ marginBottom: 48 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '📽️',
              title: '4K DCI DUAL-LASER PROJECTION',
              desc: 'Expanded 1.43:1 aspect ratio filling your entire peripheral vision with 300% brighter chromatic contrast.',
              tag: 'IMAX 3D LASER',
            },
            {
              icon: '🔊',
              title: 'DOLBY ATMOS 64-CHANNEL AUDIO',
              desc: 'Independently calibrated ceiling & sub-bass transducers envelop you in pin-point spatial sound precision.',
              tag: '64-CH SPATIAL',
            },
            {
              icon: '🛋️',
              title: 'MOTORIZED ZERO-GRAVITY RECLINERS',
              desc: 'Ultra-lux heated leather recliners with personal swivel tables and touchless QR in-seat gourmet dining.',
              tag: 'VIP SUITES',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              style={{
                background: '#24221F',
                border: '1px solid #3A3731',
                borderRadius: 16,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
              className="card-hover-lift"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{pillar.icon}</span>
                  <span
                    style={{
                      background: 'rgba(255, 157, 22, 0.1)',
                      border: '1px solid rgba(255, 157, 22, 0.3)',
                      color: '#FF9D16',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {pillar.tag}
                  </span>
                </div>
                <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 6 }}>
                  {pillar.title}
                </h4>
                <p style={{ color: '#C7BFB5', fontSize: 13, lineHeight: 1.5 }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Main Movie Catalog Showcase ── */}
      <section className="max-container" style={{ marginBottom: 54 }}>
        {/* Section Header & Tabs */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20, borderBottom: '1px solid #33312D', paddingBottom: 14 }}>
          <div>
            <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              OFFICIAL BOX OFFICE SCHEDULE
            </span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px, 4vw, 40px)', color: '#FFFFFF', letterSpacing: '0.04em', margin: 0 }}>
              NOW SHOWING IN THEATRES
            </h2>
          </div>

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {SECTION_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                style={{
                  padding: '8px 18px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.05em',
                  fontSize: 18,
                  color: activeSection === tab ? '#181715' : '#C7BFB5',
                  background: activeSection === tab ? '#FF9D16' : '#24221F',
                  borderRadius: 10,
                  border: activeSection === tab ? '1px solid #FF9D16' : '1px solid #4D473F',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter Chips */}
        {activeSection !== 'Upcoming Premieres' && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 24 }} className="scroll-no-bar">
            {GENRE_FILTERS.map((g) => {
              const active = activeGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  style={{
                    background: active ? '#FF9D16' : '#24221F',
                    color: active ? '#181715' : '#C7BFB5',
                    borderRadius: 20,
                    padding: '6px 18px',
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    border: active ? '1px solid #FF9D16' : '1px solid #665946',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        )}

        {/* Movie Grid */}
        {activeSection !== 'Upcoming Premieres' ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentMovies.map((m) => (
              <div
                key={m.id}
                style={{
                  background: '#24221F',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid #3A3731',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="card-hover-lift"
              >
                {/* Poster */}
                <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                  <img
                    src={m.poster}
                    alt={m.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #24221F 0%, rgba(36,34,31,0.2) 50%, transparent 100%)',
                    }}
                  />

                  {/* Rating Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(24, 23, 21, 0.9)',
                      border: '1px solid #FF9D16',
                      borderRadius: 6,
                      padding: '2px 8px',
                    }}
                  >
                    <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 900 }}>★ {m.rating}</span>
                  </div>

                  {/* Format Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                      borderRadius: 6,
                      padding: '2px 8px',
                    }}
                  >
                    <span style={{ color: '#181715', fontSize: 10, fontWeight: 900 }}>{m.label}</span>
                  </div>

                  {/* Runtime & Certificate at bottom of image */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 14,
                      right: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: '#C7BFB5',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    <span>⏱ {m.duration}</span>
                    <span
                      style={{
                        border: '1px solid #665946',
                        borderRadius: 4,
                        padding: '1px 5px',
                        fontSize: 9,
                        color: '#FF9D16',
                      }}
                    >
                      {m.certificate}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'Bebas Neue',
                      fontSize: 22,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.title}
                  </h3>

                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {m.genre.map((g) => (
                      <span
                        key={g}
                        style={{
                          background: '#33312D',
                          color: '#C7BFB5',
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: 4,
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => navigate('booking')}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                        color: '#181715',
                        borderRadius: 8,
                        padding: '10px 8px',
                        fontFamily: 'Bebas Neue',
                        letterSpacing: '0.06em',
                        fontSize: 18,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      BOOK TICKETS
                    </button>
                    <button
                      onClick={() => navigate('order-it-quick')}
                      style={{
                        background: '#33312D',
                        border: '1px solid #FF9D16',
                        color: '#FF9D16',
                        borderRadius: 8,
                        padding: '10px 10px',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                      title="1-Tap Fast Reservation"
                    >
                      ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Upcoming Premieres */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {UPCOMING.map((cs) => {
              const notified = notifiedMovies.includes(cs.id);
              return (
                <div
                  key={cs.id}
                  style={{
                    background: '#24221F',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #665946',
                  }}
                  className="card-hover-lift"
                >
                  <div style={{ position: 'relative', height: 280 }}>
                    <img src={cs.poster} alt={cs.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: '#FF9D16',
                        borderRadius: 6,
                        padding: '3px 10px',
                        fontSize: 11,
                        fontWeight: 900,
                        color: '#181715',
                      }}
                    >
                      {cs.date}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                      {cs.title}
                    </h4>
                    <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                      {cs.genre.join(' · ')}
                    </p>
                    <button
                      onClick={() => toggleNotify(cs.id)}
                      style={{
                        width: '100%',
                        background: notified ? 'rgba(34,197,94,0.15)' : '#33312D',
                        border: `1px solid ${notified ? '#22C55E' : '#665946'}`,
                        color: notified ? '#22C55E' : '#C7BFB5',
                        borderRadius: 8,
                        padding: '10px 0',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {notified ? '✓ NOTIFIED FOR TICKETS' : '🔔 REMIND ME ON OPENING'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. "ORDER IT QUICK" 1-Tap Fast-Track Banner ── */}
      <section className="max-container" style={{ marginBottom: 54 }}>
        <div
          style={{
            background: 'radial-gradient(ellipse at top, #3A3328 0%, #24221F 80%)',
            border: '1.5px solid #FF9D16',
            borderRadius: 20,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 157, 22, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, maxWidth: 680 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#181715',
                flexShrink: 0,
                boxShadow: '0 0 20px rgba(255,157,22,0.5)',
              }}
            >
              ⚡
            </div>
            <div>
              <span
                style={{
                  background: 'rgba(255, 157, 22, 0.15)',
                  border: '1px solid #FF9D16',
                  color: '#FF9D16',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  display: 'inline-block',
                  marginBottom: 6,
                }}
              >
                PROPRIETARY FAST CHECKOUT
              </span>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.04em', color: '#FFFFFF', margin: 0 }}>
                ORDER IT QUICK — NEVER WAIT IN A CINEMA QUEUE
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                Our booking system selects the best center seats in rows E and F and creates your digital QR ticket pass in seconds.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('order-it-quick')}
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 12,
              padding: '14px 32px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 20,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,157,22,0.4)',
            }}
          >
            LAUNCH 1-TAP BOOKING ⚡
          </button>
        </div>
      </section>

      {/* ── 6. Gourmet Cinema Dining & Concessions Showcase ── */}
      <section className="max-container" style={{ marginBottom: 54 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              CHEF-PREPARED CONCESSIONS
            </span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px, 4vw, 40px)', color: '#FFFFFF', letterSpacing: '0.04em', margin: 0 }}>
              GOURMET CINEMA DINING
            </h2>
          </div>
          <button
            onClick={() => navigate('food')}
            style={{
              color: '#FF9D16',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 13,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            View Full Concessions Menu →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONCESSIONS_PREVIEW.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#24221F',
                border: '1px solid #3A3731',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="card-hover-lift"
            >
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 18, margin: 0 }}>{item.name}</h4>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 16 }}>${item.price}</span>
                </div>
                <p style={{ color: '#C7BFB5', fontSize: 12, lineHeight: 1.4, marginBottom: 14 }}>
                  {item.desc}
                </p>
                <button
                  onClick={() => navigate('food')}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#FF9D16',
                    borderRadius: 8,
                    padding: '8px 0',
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  + Add to Seat Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Limited-Time Privilege: 30% OFF IMAX Voucher ── */}
      <section className="max-container" style={{ marginBottom: 54 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FF9D16 0%, #CC903B 100%)',
            borderRadius: 20,
            padding: 'clamp(24px, 4vw, 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: '0 16px 40px rgba(255, 157, 22, 0.35)',
          }}
        >
          <div>
            <p style={{ color: '#181715', fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              EXCLUSIVE PASS PRIVILEGE
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(30px, 4.5vw, 44px)', color: '#181715', letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: 6 }}>
              30% OFF ALL IMAX 3D LASER SCREENINGS
            </h2>
            <p style={{ color: '#33312D', fontSize: 15, fontWeight: 600 }}>
              Apply promo code <span style={{ background: '#181715', color: '#FF9D16', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>CINETIX30</span> during payment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleCopyCoupon}
              style={{
                background: '#181715',
                color: '#FF9D16',
                borderRadius: 12,
                padding: '14px 28px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 20,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {copiedCoupon ? 'COPIED TO CLIPBOARD ✓' : 'COPY CODE: CINETIX30'}
            </button>
            <button
              onClick={() => navigate('offers')}
              style={{
                background: 'rgba(24, 23, 21, 0.15)',
                border: '2px solid #181715',
                color: '#181715',
                borderRadius: 12,
                padding: '14px 22px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 19,
                cursor: 'pointer',
              }}
            >
              VIEW ALL OFFERS →
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Cinetix Assurance & Trust Guarantee ── */}
      <section className="max-container">
        <div
          style={{
            background: '#1D1C19',
            border: '1px solid #33312D',
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 16,
            color: '#C7BFB5',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📱</span>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, margin: 0 }}>Touchless Gate Pass</p>
              <p style={{ margin: 0, fontSize: 11 }}>1-Tap QR & Apple Wallet Ready</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, margin: 0 }}>Bank-Grade 256-Bit SSL</p>
              <p style={{ margin: 0, fontSize: 11 }}>PCI-DSS Level 1 Encrypted</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔄</span>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, margin: 0 }}>Free 1-Click Cancellation</p>
              <p style={{ margin: 0, fontSize: 11 }}>Instant refund up to 2 hours prior</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>★</span>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, margin: 0 }}>VIP Loyalty Privileges</p>
              <p style={{ margin: 0, fontSize: 11 }}>Earn points on every screening</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
