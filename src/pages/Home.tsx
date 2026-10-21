import { useState, useEffect, useCallback } from 'react';
import type { Movie, Page } from '../types';
import { db } from '../db/database';

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
    duration: '2h 18min',
    director: 'Maya Chen',
    synopsis: 'When a cryptic transmission reaches Earth from the edge of the solar system, astrophysicist Dr. Mara Hayes races against time to decode a message that may either save humanity or trigger its annihilation.',
    poster: '/assets/ls-asset-7.jpg',
    backdrop: '/assets/cinetix-hero.jpg',
  },
  {
    title: 'Void Protocol',
    tagline: 'When deep space goes silent, protocol is all that remains.',
    genre: ['Sci-Fi', 'Action'],
    rating: 4.7,
    duration: '2h 05min',
    director: 'Denis Villeneuve',
    synopsis: 'Deep space anomaly station Kepler-9 stops transmitting. An elite recovery squad boards the ghost vessel only to discover that the synthetic AI has initiated quarantine against something brought from beyond.',
    poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop',
    backdrop: '/assets/ls-asset-1.jpg',
  },
  {
    title: 'Dark Meridian',
    tagline: 'Some Secrets Should Stay Hidden Beneath The Ice.',
    genre: ['Thriller', 'Drama'],
    rating: 4.6,
    duration: '2h 12min',
    director: 'Christopher Nolan',
    synopsis: 'A geopolitical crisis breaks out on an Arctic oceanic border, where covert operatives and underwater seismic anomalies threaten to plunge the global powers into cold catastrophe.',
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
  poster: string;
  bookable: boolean;
};

const NOW_SHOWING: CatalogEntry[] = [
  { id: 's1', title: 'The Last Signal', label: 'IMAX 3D Laser', genre: ['Sci-Fi', 'Thriller'], rating: 4.9, poster: '/assets/ls-asset-7.jpg', bookable: true },
  { id: 's2', title: 'Void Protocol', label: 'Dolby Atmos', genre: ['Sci-Fi', 'Action'], rating: 4.7, poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', bookable: true },
  { id: 's3', title: 'Dark Meridian', label: '4DX Motion', genre: ['Thriller', 'Drama'], rating: 4.6, poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', bookable: true },
  { id: 's4', title: 'The Entity', label: 'Dolby Atmos', genre: ['Horror', 'Mystery'], rating: 4.4, poster: 'https://images.unsplash.com/photo-1778585040075-0991abfd4ed9?w=400&h=600&fit=crop', bookable: true },
  { id: 's5', title: 'Echo Chamber', label: 'Full House', genre: ['Mystery', 'Sci-Fi'], rating: 4.5, poster: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop', bookable: false },
  { id: 's6', title: 'Phantom Circuit', label: 'IMAX 3D', genre: ['Action', 'Thriller'], rating: 4.6, poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', bookable: true },
];

const TRENDING: CatalogEntry[] = [
  { id: 't1', title: 'The Last Signal', label: '#1 Box Office', genre: ['Sci-Fi', 'Thriller'], rating: 4.9, poster: '/assets/ls-asset-7.jpg', bookable: true },
  { id: 't2', title: 'Phantom Circuit', label: 'Trending Fast', genre: ['Action', 'Thriller'], rating: 4.6, poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', bookable: true },
  { id: 't3', title: 'Dark Meridian', label: 'Critics Choice', genre: ['Drama', 'Thriller'], rating: 4.6, poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', bookable: true },
  { id: 't4', title: 'Void Protocol', label: 'Sci-Fi Hit', genre: ['Sci-Fi', 'Action'], rating: 4.7, poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', bookable: true },
];

const UPCOMING = [
  { id: 'u1', title: 'Void Protocol II', label: 'Coming Nov 24', genre: ['Sci-Fi'], poster: 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', date: 'Nov 24' },
  { id: 'u2', title: 'Dark Meridian: Deep Winter', label: 'Coming Dec 01', genre: ['Thriller'], poster: 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', date: 'Dec 01' },
  { id: 'u3', title: 'Echo Chamber', label: 'Coming Dec 18', genre: ['Mystery'], poster: 'https://images.unsplash.com/photo-1778973812223-e5079431fa47?w=400&h=600&fit=crop', date: 'Dec 18' },
  { id: 'u4', title: 'Phantom Circuit: Overdrive', label: 'Coming Jan 05', genre: ['Action'], poster: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', date: 'Jan 05' },
];

const GENRE_FILTERS = ['All', 'Sci-Fi', 'Thriller', 'Action', 'Drama', 'Mystery', 'Horror'];
const SECTION_TABS = ['Now Showing', 'Trending', 'Upcoming'] as const;
type SectionTab = typeof SECTION_TABS[number];

export default function Home({ movie, navigate }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeSection, setActiveSection] = useState<SectionTab>('Now Showing');
  const [notifiedMovies, setNotifiedMovies] = useState<string[]>([]);

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
    const timer = setInterval(nextSlide, 6000);
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

  return (
    <div style={{ paddingTop: 72, paddingBottom: 104, background: '#181715' }}>

      {/* ── Cinematic Hero Marquee Carousel ── */}
      <div style={{ position: 'relative', height: 'clamp(440px, 62vw, 640px)', overflow: 'hidden', background: '#11100E' }}>
        {/* Backdrop */}
        <img
          src={slide.backdrop}
          alt={slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: slideTransition ? 1 : 0,
            transition: 'opacity 0.4s ease',
            filter: 'brightness(0.85)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(24,23,21,0.96) 35%, rgba(24,23,21,0.4) 75%, rgba(24,23,21,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181715 0%, rgba(24,23,21,0.6) 30%, transparent 70%)' }} />

        {/* Content */}
        <div
          className="max-container"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            opacity: slideTransition ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <div style={{ maxWidth: 600, width: '100%' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  fontSize: 11,
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontFamily: 'Inter',
                  letterSpacing: '0.05em',
                }}
              >
                CINETIX EXCLUSIVE
              </span>
              {slide.genre.map((g) => (
                <span
                  key={g}
                  style={{
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#FF9D16',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {g}
                </span>
              ))}
              <span
                style={{
                  background: 'rgba(255, 157, 22, 0.15)',
                  border: '1px solid #FF9D16',
                  color: '#FF9D16',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                ★ {slide.rating} / 5.0
              </span>
            </div>

            {/* Title in Bebas Neue */}
            <h1
              style={{
                fontFamily: 'Bebas Neue',
                fontWeight: 900,
                fontSize: 'clamp(38px, 6vw, 68px)',
                color: '#FFFFFF',
                lineHeight: 1.05,
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}
            >
              {slide.title}
            </h1>

            {/* Tagline */}
            <p style={{ color: '#FF9D16', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 600, marginBottom: 12 }}>
              "{slide.tagline}"
            </p>

            <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.65, marginBottom: 16, maxWidth: 520 }} className="hidden sm:block">
              {slide.synopsis}
            </p>

            <div style={{ display: 'flex', gap: 14, marginBottom: 22, color: '#C7BFB5', fontSize: 13, flexWrap: 'wrap' }}>
              <span>⏱ {slide.duration}</span>
              <span>·</span>
              <span>🎬 Dir. {slide.director}</span>
              <span>·</span>
              <span style={{ color: '#FF9D16', fontWeight: 600 }}>IMAX 3D Laser & Dolby Atmos</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('booking')}
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: '12px 28px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 20,
                  boxShadow: '0 4px 16px rgba(255, 157, 22, 0.4)',
                }}
              >
                BOOK TICKETS →
              </button>

              <button
                onClick={() => navigate('movie-detail')}
                style={{
                  background: '#33312D',
                  border: '1px solid #665946',
                  color: '#FFFFFF',
                  borderRadius: 10,
                  padding: '12px 22px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                }}
              >
                ▶ WATCH TRAILER
              </button>

              <button
                onClick={() => navigate('order-it-quick')}
                style={{
                  background: 'rgba(255, 157, 22, 0.12)',
                  border: '1.5px solid #FF9D16',
                  color: '#FF9D16',
                  borderRadius: 10,
                  padding: '12px 20px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                }}
              >
                ⚡ 1-TAP QUICK BOOK
              </button>
            </div>
          </div>
        </div>

        {/* Poster on Right (Desktop) */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            right: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 220,
            opacity: slideTransition ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <img
            src={slide.poster}
            alt={slide.title}
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 157, 22, 0.3)',
              border: '1px solid #665946',
            }}
          />
        </div>

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(36, 34, 31, 0.85)',
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
            zIndex: 10,
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
            background: 'rgba(36, 34, 31, 0.85)',
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
            zIndex: 10,
          }}
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 10,
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === slideIndex ? 30 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slideIndex ? '#FF9D16' : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Order It Quick Banner ── */}
      <div className="max-container" style={{ marginTop: 32 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 157, 22, 0.12), rgba(204, 144, 59, 0.08))',
            border: '1px solid #FF9D16',
            borderRadius: 16,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: '0 4px 20px rgba(255, 157, 22, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 36 }}>⚡</div>
            <div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                ORDER IT QUICK — ZERO QUEUES
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 14 }}>
                Instant best VIP seats auto-selected by algorithm. One tap to generated digital QR ticket.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('order-it-quick')}
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 10,
              padding: '12px 28px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              whiteSpace: 'nowrap',
            }}
          >
            TRY 1-TAP BOOKING ⚡
          </button>
        </div>
      </div>

      {/* ── Movie Catalog Tabs & Filters ── */}
      <div className="max-container" style={{ marginTop: 40 }}>
        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #3A3731' }}>
          {SECTION_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              style={{
                padding: '12px 24px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 20,
                color: activeSection === tab ? '#FF9D16' : '#C7BFB5',
                borderBottom: `3px solid ${activeSection === tab ? '#FF9D16' : 'transparent'}`,
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Genre Filter Chips */}
        {activeSection !== 'Upcoming' && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }} className="scroll-no-bar">
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
                    fontSize: 13,
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
        {activeSection !== 'Upcoming' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {currentMovies.length > 0 ? (
              currentMovies.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: '#24221F',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #665946',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ position: 'relative', height: 260 }}>
                    <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24,23,21,0.9) 0%, transparent 60%)' }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#FF9D16',
                        borderRadius: 6,
                        padding: '2px 8px',
                      }}
                    >
                      <span style={{ color: '#181715', fontSize: 11, fontWeight: 800 }}>★ {m.rating}</span>
                    </div>
                  </div>

                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'Bebas Neue',
                        fontSize: 18,
                        color: '#FFFFFF',
                        letterSpacing: '0.04em',
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {m.title}
                    </h3>
                    <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                      {m.label}
                    </p>
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {m.genre.map((g) => (
                        <span
                          key={g}
                          style={{
                            background: '#33312D',
                            color: '#C7BFB5',
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate('booking')}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                        color: '#181715',
                        borderRadius: 8,
                        padding: '9px 12px',
                        fontFamily: 'Bebas Neue',
                        letterSpacing: '0.06em',
                        fontSize: 17,
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginTop: 'auto',
                      }}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#C7BFB5' }}>
                No titles in this genre currently scheduled.
              </div>
            )}
          </div>
        ) : (
          /* Upcoming Releases */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                >
                  <div style={{ position: 'relative' }}>
                    <img src={cs.poster} alt={cs.title} style={{ width: '100%', height: 230, objectFit: 'cover' }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#FF9D16',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#181715',
                      }}
                    >
                      {cs.date}
                    </div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                      {cs.title}
                    </h4>
                    <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>{cs.label}</p>
                    <button
                      onClick={() => toggleNotify(cs.id)}
                      style={{
                        width: '100%',
                        background: notified ? 'rgba(34,197,94,0.15)' : '#33312D',
                        border: `1px solid ${notified ? '#22C55E' : '#665946'}`,
                        color: notified ? '#22C55E' : '#C7BFB5',
                        borderRadius: 8,
                        padding: '8px 0',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {notified ? '✓ NOTIFIED' : '🔔 REMIND ME'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Offers / IMAX Banner ── */}
      <div className="max-container" style={{ marginTop: 56 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FF9D16 0%, #CC903B 100%)',
            borderRadius: 20,
            padding: 'clamp(24px, 4vw, 44px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: '0 12px 36px rgba(255, 157, 22, 0.3)',
          }}
        >
          <div>
            <p style={{ color: '#181715', fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              LIMITED TIME PRIVILEGE
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px, 4.5vw, 42px)', color: '#181715', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 6 }}>
              30% OFF ALL IMAX 3D SCREENINGS
            </h2>
            <p style={{ color: '#33312D', fontSize: 15, fontWeight: 600 }}>
              Use coupon code <strong>CINETIX30</strong> at checkout · Valid across all theatres
            </p>
          </div>
          <button
            onClick={() => navigate('offers')}
            style={{
              background: '#181715',
              color: '#FF9D16',
              borderRadius: 12,
              padding: '14px 32px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 20,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            CLAIM VOUCHER →
          </button>
        </div>
      </div>

    </div>
  );
}
