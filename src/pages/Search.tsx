import { useState } from 'react';
import type { Page } from '../types';
import { db } from '../db/database';

interface Props {
  navigate: (page: Page) => void;
}

const POPULAR_CHIPS = ['Sci-Fi', 'Thriller', 'IMAX 3D', 'Dolby Atmos', 'Action', 'Horror'];
const RECENT_SEARCHES = ['The Last Signal', 'Cinetix Grand IMAX', 'Void Protocol'];

export default function Search({ navigate }: Props) {
  const [query, setQuery] = useState('');
  const allMovies = db.getMovies();
  const theaters = db.getTheaters();

  const filtered = allMovies.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
      m.director.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        <h1
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: 36,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            marginBottom: 20,
          }}
        >
          SEARCH MOVIES, THEATRES & GENRES
        </h1>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#FF9D16', fontSize: 18 }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, director, format or genre..."
            style={{
              width: '100%',
              background: '#24221F',
              border: '1.5px solid #665946',
              borderRadius: 14,
              padding: '16px 16px 16px 52px',
              color: '#FFFFFF',
              fontSize: 16,
              fontFamily: 'Inter',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#C7BFB5',
                background: 'none',
                fontSize: 18,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {!query ? (
          <>
            {/* Recent Searches */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 12 }}>
                RECENT SEARCHES
              </h3>
              <div className="flex flex-col gap-2.5">
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    style={{
                      background: '#24221F',
                      border: '1px solid #4D473F',
                      borderRadius: 10,
                      padding: '12px 16px',
                      color: '#C7BFB5',
                      fontSize: 14,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ color: '#FF9D16' }}>🕐</span>
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Chips */}
            <div style={{ marginBottom: 36 }}>
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 12 }}>
                POPULAR CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {POPULAR_CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQuery(c)}
                    style={{
                      background: '#33312D',
                      border: '1px solid #665946',
                      color: '#FF9D16',
                      borderRadius: 20,
                      padding: '7px 18px',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Theatre Listings */}
            <div>
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 14 }}>
                CINETIX PREMIUM THEATRES
              </h3>
              <div className="flex flex-col gap-3">
                {theaters.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: '#24221F',
                      borderRadius: 12,
                      padding: '16px 20px',
                      border: '1px solid #665946',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 19, letterSpacing: '0.04em' }}>
                        {t.name}
                      </h4>
                      <p style={{ color: '#C7BFB5', fontSize: 13 }}>{t.location}</p>
                      <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                        {t.distance} · ★ {t.rating}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('booking')}
                      style={{
                        background: '#33312D',
                        border: '1px solid #FF9D16',
                        color: '#FF9D16',
                        borderRadius: 8,
                        padding: '8px 18px',
                        fontFamily: 'Bebas Neue',
                        letterSpacing: '0.05em',
                        fontSize: 16,
                      }}
                    >
                      VIEW SHOWS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 20 }}>
              {filtered.length} Title{filtered.length !== 1 ? 's' : ''} matching "{query}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate('movie-detail')}
                  style={{
                    background: '#24221F',
                    borderRadius: 14,
                    overflow: 'hidden',
                    display: 'flex',
                    cursor: 'pointer',
                    border: '1px solid #665946',
                  }}
                >
                  <img src={m.poster} alt={m.title} style={{ width: 84, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em' }}>
                      {m.title}
                    </h4>
                    <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      ★ {m.rating} / 5.0
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
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
                    <p style={{ color: '#99784B', fontSize: 11, marginTop: 4 }}>{m.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
