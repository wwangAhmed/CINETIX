import { useState } from 'react';
import type { Movie, Page } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import { db } from '../db/database';
import { downloadAssetImage } from '../utils/downloadPass';

interface Props {
  movie: Movie;
  navigate: (page: Page) => void;
}

const TABS = ['Overview', 'Showtimes', 'Cast & Characters', 'Reviews'];

export default function MovieDetail({ movie, navigate }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showTrailer, setShowTrailer] = useState(false);
  const theaters = db.getTheaters();

  const stars = (r: number) => Array.from({ length: 5 }, (_, i) => (i < Math.round(r) ? '★' : '☆')).join('');

  return (
    <div style={{ paddingTop: 72, paddingBottom: 104, background: '#181715', minHeight: '100vh' }}>
      {/* Backdrop Hero */}
      <div style={{ position: 'relative', height: 'clamp(460px, 68vh, 600px)', overflow: 'hidden' }}>
        <img
          src={movie.backdrop || '/assets/cinetix-hero.jpg'}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181715 0%, rgba(24,23,21,0.6) 55%, transparent 100%)' }} />

        <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0 }} className="max-container">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end text-center md:text-left">
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: 170,
                borderRadius: 16,
                boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                border: '1px solid #665946',
                flexShrink: 0,
              }}
              className="hidden md:block"
            />
            <div className="w-full">
              <div className="flex gap-2 mb-3 flex-wrap justify-center md:justify-start">
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: 6,
                  }}
                >
                  IMAX EXCLUSIVE
                </span>
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    style={{
                      background: '#33312D',
                      border: '1px solid #665946',
                      color: '#FF9D16',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: 20,
                    }}
                  >
                    {g}
                  </span>
                ))}
                <span
                  style={{
                    background: '#33312D',
                    color: '#C7BFB5',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {movie.certificate}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'Bebas Neue',
                  fontWeight: 900,
                  fontSize: 'clamp(32px, 5.5vw, 56px)',
                  color: '#FFFFFF',
                  marginBottom: 4,
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                }}
              >
                {movie.title}
              </h1>

              <p style={{ color: '#FF9D16', fontStyle: 'italic', fontSize: 'clamp(14px, 2vw, 17px)', marginBottom: 12 }}>
                "{movie.tagline}"
              </p>

              <div
                className="flex flex-wrap justify-center md:justify-start gap-4 text-sm"
                style={{ color: '#C7BFB5', marginBottom: 18 }}
              >
                <span>⏱ {movie.duration}</span>
                <span>·</span>
                <span>🎬 Dir. {movie.director}</span>
                <span>·</span>
                <span style={{ color: '#FF9D16', fontWeight: 700 }}>
                  {stars(movie.rating)} {movie.rating} / 5.0
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('booking')}
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: '12px 32px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 20,
                    boxShadow: '0 4px 16px rgba(255,157,22,0.4)',
                  }}
                >
                  BOOK TICKETS →
                </button>

                <button
                  onClick={() => setShowTrailer(true)}
                  style={{
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#FFFFFF',
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                  }}
                >
                  ▶ TRAILER
                </button>

                <button
                  onClick={() => navigate('order-it-quick')}
                  style={{
                    background: 'rgba(255, 157, 22, 0.12)',
                    border: '1.5px solid #FF9D16',
                    color: '#FF9D16',
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                  }}
                >
                  ⚡ 1-TAP QUICK
                </button>

                <button
                  onClick={() =>
                    downloadAssetImage(movie.poster, `${movie.title.replace(/\s+/g, '_')}_Official_Poster.jpg`)
                  }
                  style={{
                    background: '#24221F',
                    border: '1px solid #665946',
                    color: '#C7BFB5',
                    borderRadius: 10,
                    padding: '12px 20px',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                  title="Download Official 4K Movie Poster"
                >
                  <span>📥</span>
                  <span>Poster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          borderBottom: '1px solid #3A3731',
          position: 'sticky',
          top: 72,
          background: '#181715',
          zIndex: 100,
        }}
      >
        <div className="max-container">
          <div className="flex gap-8 overflow-x-auto scroll-no-bar">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '16px 4px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                    color: active ? '#FF9D16' : '#C7BFB5',
                    borderBottom: `3px solid ${active ? '#FF9D16' : 'transparent'}`,
                    background: 'none',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-container" style={{ marginTop: 36 }}>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 12 }}>
                OFFICIAL SYNOPSIS
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
                {movie.synopsis}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'DIRECTOR', value: movie.director },
                  { label: 'RUNTIME', value: movie.duration },
                  { label: 'LANGUAGE', value: movie.language },
                  { label: 'RELEASE DATE', value: movie.releaseDate },
                  { label: 'CERTIFICATION', value: movie.certificate },
                  { label: 'GENRES', value: movie.genre.join(', ') },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: '#24221F',
                      border: '1px solid #4D473F',
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>{item.label}</p>
                    <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginTop: 2 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Pricing & Teasers */}
            <div>
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 22,
                  marginBottom: 20,
                }}
              >
                <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 14 }}>
                  THEATRE FORMAT PRICING
                </h4>

                {[
                  { format: 'IMAX 3D Laser', price: '$55.00', sub: '12-channel high-dynamic sound' },
                  { format: 'Dolby Atmos Prime', price: '$48.00', sub: '360° spatial immersion' },
                  { format: '4DX Motion Recliner', price: '$65.00', sub: 'Environmental motion effects' },
                ].map((f) => (
                  <div
                    key={f.format}
                    style={{
                      background: '#33312D',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #4D473F',
                    }}
                  >
                    <div>
                      <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 14 }}>{f.format}</p>
                      <p style={{ color: '#C7BFB5', fontSize: 11 }}>{f.sub}</p>
                    </div>
                    <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 18, fontFamily: 'Inter' }}>
                      {f.price}
                    </span>
                  </div>
                ))}

                <button
                  onClick={() => navigate('booking')}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: 12,
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                    marginTop: 8,
                  }}
                >
                  RESERVE YOUR SHOWTIME →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Showtimes */}
        {activeTab === 'Showtimes' && (
          <div>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 20 }}>
              AVAILABLE THEATRES & SHOWTIMES
            </h3>
            {theaters.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#24221F',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20,
                  border: '1px solid #665946',
                }}
              >
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em' }}>
                      {t.name}
                    </h4>
                    <p style={{ color: '#C7BFB5', fontSize: 13 }}>
                      {t.location} · <strong style={{ color: '#FF9D16' }}>{t.distance} away</strong>
                    </p>
                  </div>
                  <span style={{ color: '#FF9D16', fontWeight: 800, fontSize: 15 }}>
                    ★ {t.rating}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {t.showtimes.map((st) => (
                    <button
                      key={st.id || st.time}
                      onClick={() =>
                        navigate('booking', {
                          theaterId: t.id,
                          theaterName: t.name,
                          showtime: st,
                        })
                      }
                      style={{
                        background: '#33312D',
                        border: '1px solid #4D473F',
                        borderRadius: 10,
                        padding: '12px 6px',
                        textAlign: 'center',
                        transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF9D16'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#4D473F'; }}
                    >
                      <p style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 16, fontFamily: 'Inter' }}>
                        {st.time}
                      </p>
                      <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                        {st.format}
                      </p>
                      <p style={{ color: '#C7BFB5', fontSize: 11 }}>${st.price}.00</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Cast & Characters */}
        {activeTab === 'Cast & Characters' && (
          <div>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 20 }}>
              LEAD CAST & STAR BILLING
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {movie.cast.map((c) => (
                <div
                  key={c.name}
                  style={{
                    background: '#24221F',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #665946',
                    textAlign: 'center',
                  }}
                >
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: 210, objectFit: 'cover' }} />
                  <div style={{ padding: 14 }}>
                    <p style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 18, letterSpacing: '0.04em' }}>
                      {c.name}
                    </p>
                    <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 600 }}>{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'Reviews' && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                  VERIFIED AUDIENCE & CRITIC REVIEWS
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 13 }}>
                  Based on {movie.reviewCount.toLocaleString()} verified theatrical ticket holders
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#FF9D16', lineHeight: 1 }}>
                  {movie.rating}
                </div>
                <div style={{ color: '#FF9D16', fontSize: 18 }}>★★★★★</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { name: 'Marcus K. (Verified IMAX Attendee)', rating: 5, text: 'Visually groundbreaking. The sound engineering in Dolby Atmos had the entire auditorium vibrating.', date: 'Yesterday' },
                { name: 'Elena R. (Film Critic)', rating: 5, text: 'The Last Signal is Maya Chen at her absolute finest. A masterclass in sci-fi tension and pacing.', date: '3 days ago' },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#24221F',
                    borderRadius: 14,
                    padding: 20,
                    border: '1px solid #4D473F',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 14 }}>{r.name}</p>
                    <span style={{ color: '#FF9D16', fontSize: 13 }}>★★★★★</span>
                  </div>
                  <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showTrailer && <VideoPlayer url={movie.trailerUrl} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}
