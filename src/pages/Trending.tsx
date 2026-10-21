import type { Page } from '../types';
import { db } from '../db/database';

interface Props {
  navigate: (page: Page) => void;
}

export default function Trending({ navigate }: Props) {
  const movies = db.getMovies();

  const trendingList = [
    { rank: 1, title: 'The Last Signal', genre: ['Sci-Fi', 'Thriller'], rating: 4.9, reviews: '3.8K', img: movies[0].poster, badge: '🔥 #1 Box Office Hit' },
    { rank: 2, title: 'Void Protocol', genre: ['Sci-Fi', 'Action'], rating: 4.7, reviews: '2.2K', img: movies[1]?.poster || 'https://images.unsplash.com/photo-1727672887892-875dd6e6534b?w=400&h=600&fit=crop', badge: '⚡ Trending Rapidly' },
    { rank: 3, title: 'Dark Meridian', genre: ['Thriller', 'Drama'], rating: 4.6, reviews: '1.8K', img: movies[2]?.poster || 'https://images.unsplash.com/photo-1641900278396-a9cf14207f27?w=400&h=600&fit=crop', badge: '💬 Critics Choice' },
    { rank: 4, title: 'Phantom Circuit', genre: ['Action', 'Thriller'], rating: 4.6, reviews: '1.9K', img: 'https://images.unsplash.com/photo-1748727958243-49861188953b?w=400&h=600&fit=crop', badge: '🌆 Visual Powerhouse' },
  ];

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 780 }}>

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          🔥 CINETIX TRENDING & BOX OFFICE LEADERBOARD
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 32 }}>
          Real-time ticket volume and crowd favorites across all IMAX halls
        </p>

        <div className="flex flex-col gap-4">
          {trendingList.map((m) => (
            <div
              key={m.rank}
              onClick={() => navigate('movie-detail')}
              style={{
                background: '#24221F',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                border: '1px solid #665946',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF9D16';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#665946';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Rank Block */}
              <div
                style={{
                  width: 68,
                  background: m.rank === 1 ? 'linear-gradient(135deg, #FF9D16, #CC903B)' : '#33312D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: 32,
                    color: m.rank === 1 ? '#181715' : '#C7BFB5',
                  }}
                >
                  #{m.rank}
                </span>
              </div>

              {/* Poster */}
              <img src={m.img} alt={m.title} style={{ width: 88, height: 124, objectFit: 'cover', flexShrink: 0 }} />

              {/* Info */}
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                <span
                  style={{
                    background: 'rgba(255, 157, 22, 0.15)',
                    color: '#FF9D16',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    width: 'fit-content',
                  }}
                >
                  {m.badge}
                </span>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em' }}>
                  {m.title}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {m.genre.map((g) => (
                    <span
                      key={g}
                      style={{
                        background: '#33312D',
                        color: '#C7BFB5',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {g}
                    </span>
                  ))}
                  <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, marginLeft: 8 }}>
                    ★ {m.rating} ({m.reviews})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', paddingRight: 20 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('booking');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.05em',
                    fontSize: 18,
                    whiteSpace: 'nowrap',
                  }}
                >
                  BOOK →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
