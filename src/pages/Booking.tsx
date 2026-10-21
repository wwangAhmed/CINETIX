import { useState } from 'react';
import type { Movie, Page, BookingState, Showtime } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';

interface Props {
  movie: Movie;
  bookingState: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

export default function Booking({ movie, bookingState, navigate }: Props) {
  const theaters = db.getTheaters();
  const [selectedTheaterId, setSelectedTheaterId] = useState(
    bookingState.theaterId || theaters[0]?.id || 'cinetix-imax-downtown'
  );
  const [selectedDate, setSelectedDate] = useState(bookingState.date || MOVIE_DATES[0]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(bookingState.showtime || null);

  const theater = theaters.find((t) => t.id === selectedTheaterId) || theaters[0];

  const formatDate = (d: string) => {
    const date = new Date(d);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  };

  const handleProceedToSeats = () => {
    if (!selectedShowtime) return;
    navigate('seat-selection', {
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      theaterId: theater.id,
      theaterName: theater.name,
      date: selectedDate,
      showtime: selectedShowtime,
    });
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('movie-detail')}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#C7BFB5',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.04em', color: '#FFFFFF' }}>
              SELECT THEATRE, DATE & SHOWTIME
            </h1>
            <p style={{ color: '#FF9D16', fontSize: 13, fontWeight: 700 }}>
              {movie.title} · {movie.duration} · {movie.certificate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Theatre & Date & Timing selection */}
          <div className="lg:col-span-2">

            {/* Theatre Selector */}
            <div
              style={{
                background: '#24221F',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                border: '1px solid #665946',
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 16 }}>
                1. SELECT CINETIX THEATRE
              </h3>

              <div className="flex flex-col gap-3">
                {theaters.map((t) => {
                  const isSelected = selectedTheaterId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTheaterId(t.id);
                        setSelectedShowtime(null);
                      }}
                      style={{
                        background: isSelected ? 'rgba(255, 157, 22, 0.12)' : '#33312D',
                        border: `1.5px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                        borderRadius: 12,
                        padding: '14px 18px',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 700, color: isSelected ? '#FF9D16' : '#FFFFFF', fontSize: 15 }}>
                          {t.name}
                        </p>
                        <p style={{ color: '#C7BFB5', fontSize: 13 }}>
                          {t.location} · <strong style={{ color: '#99784B' }}>{t.distance}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ color: '#FF9D16', fontSize: 13, fontWeight: 700 }}>★ {t.rating}</span>
                        {isSelected && (
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              background: '#FF9D16',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#181715',
                              fontWeight: 900,
                              fontSize: 12,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Picker */}
            <div
              style={{
                background: '#24221F',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                border: '1px solid #665946',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em' }}>
                  2. SELECT PERFORMANCE DATE
                </h3>
                <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>Next 14 Days Open</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto scroll-no-bar pb-2">
                {MOVIE_DATES.map((d) => {
                  const fd = formatDate(d);
                  const active = d === selectedDate;
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedShowtime(null);
                      }}
                      style={{
                        background: active ? '#FF9D16' : '#33312D',
                        border: `1px solid ${active ? '#FF9D16' : '#4D473F'}`,
                        borderRadius: 12,
                        padding: '12px 16px',
                        textAlign: 'center',
                        minWidth: 70,
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <p style={{ color: active ? '#181715' : '#C7BFB5', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                        {fd.day}
                      </p>
                      <p style={{ color: active ? '#181715' : '#FFFFFF', fontWeight: 900, fontSize: 22, lineHeight: 1.2 }}>
                        {fd.date}
                      </p>
                      <p style={{ color: active ? '#181715' : '#99784B', fontSize: 10, fontWeight: 600 }}>
                        {fd.month}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Showtime Matrix */}
            <div
              style={{
                background: '#24221F',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #665946',
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 16 }}>
                3. SELECT SCREEN FORMAT & SHOWTIME
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {theater.showtimes.map((st) => {
                  const isSelected = selectedShowtime?.time === st.time;
                  return (
                    <button
                      key={st.id || st.time}
                      onClick={() => setSelectedShowtime(st)}
                      style={{
                        background: isSelected ? 'rgba(255, 157, 22, 0.18)' : '#33312D',
                        border: `1.5px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                        borderRadius: 12,
                        padding: '14px 10px',
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 0 12px rgba(255, 157, 22, 0.35)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <p style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 17, fontFamily: 'Inter' }}>
                        {st.time}
                      </p>
                      <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                        {st.format}
                      </p>
                      <p style={{ color: '#C7BFB5', fontSize: 12, marginTop: 4 }}>
                        ${st.price}.00
                      </p>
                      <span style={{ color: '#99784B', fontSize: 10 }}>
                        {st.available} seats left
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Summary Sidebar */}
          <div>
            <div
              style={{
                background: '#24221F',
                border: '1px solid #665946',
                borderRadius: 16,
                padding: 22,
                position: 'sticky',
                top: 90,
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 14 }}>
                SELECTION SUMMARY
              </h3>

              <div style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #3A3731' }}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: 60, height: 86, objectFit: 'cover', borderRadius: 8, border: '1px solid #665946' }}
                />
                <div>
                  <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 19, letterSpacing: '0.04em' }}>
                    {movie.title}
                  </h4>
                  <p style={{ color: '#C7BFB5', fontSize: 12 }}>{movie.duration} · {movie.certificate}</p>
                  <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                    {selectedShowtime?.format || 'Select showtime'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 20 }}>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>THEATRE</p>
                  <p style={{ color: '#FFFFFF', fontWeight: 600 }}>{theater.name}</p>
                </div>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>DATE</p>
                  <p style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedDate}</p>
                </div>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>SHOWTIME</p>
                  <p style={{ color: selectedShowtime ? '#FF9D16' : '#C7BFB5', fontWeight: 700 }}>
                    {selectedShowtime ? `${selectedShowtime.time} (${selectedShowtime.format})` : 'Please pick a time above'}
                  </p>
                </div>
              </div>

              <button
                disabled={!selectedShowtime}
                onClick={handleProceedToSeats}
                style={{
                  width: '100%',
                  background: selectedShowtime
                    ? 'linear-gradient(135deg, #FF9D16, #CC903B)'
                    : '#33312D',
                  color: selectedShowtime ? '#181715' : '#665946',
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 20,
                  cursor: selectedShowtime ? 'pointer' : 'not-allowed',
                  boxShadow: selectedShowtime ? '0 4px 16px rgba(255, 157, 22, 0.4)' : 'none',
                }}
              >
                {selectedShowtime ? 'CHOOSE SEATS ON MAP →' : 'SELECT SHOWTIME TO PROCEED'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
