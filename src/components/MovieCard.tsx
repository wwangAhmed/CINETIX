import type { Movie, Page } from '../types';

interface MovieCardProps {
  movie: Movie;
  navigate: (page: Page) => void;
}

export default function MovieCard({ movie, navigate }: MovieCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(movie.rating) ? '★' : '☆'
  );

  return (
    <div
      style={{
        background: '#33312D',
        border: '1px solid #665946',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Poster */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(24, 23, 21, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 8,
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid rgba(255, 157, 22, 0.3)',
          }}
        >
          <span style={{ color: '#FF9D16', fontSize: 12 }}>★</span>
          <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'Inter' }}>
            {movie.rating}
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: '#FF9D16',
            borderRadius: 6,
            padding: '2px 8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              color: '#181715',
              fontSize: 11,
              fontWeight: 800,
              fontFamily: 'Inter',
            }}
          >
            {movie.certificate}
          </span>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.04em',
            fontSize: 20,
            color: '#FFFFFF',
            marginBottom: 4,
            lineHeight: 1.2,
          }}
        >
          {movie.title}
        </h3>
        <div style={{ color: '#FF9D16', fontSize: 13, marginBottom: 8 }}>
          {stars.join('')}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {movie.genre.map((g) => (
            <span
              key={g}
              style={{
                background: 'rgba(255, 157, 22, 0.12)',
                color: '#FF9D16',
                border: '1px solid rgba(255, 157, 22, 0.25)',
                fontSize: 11,
                fontFamily: 'Inter',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 20,
              }}
            >
              {g}
            </span>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
            marginTop: 'auto',
          }}
        >
          <span style={{ color: '#C7BFB5', fontSize: 13, fontFamily: 'Inter' }}>
            ⏱ {movie.duration}
          </span>
        </div>
        <button
          onClick={() => navigate('booking')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 10,
            padding: '10px 16px',
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 18,
            textAlign: 'center',
            boxShadow: '0 3px 10px rgba(255, 157, 22, 0.25)',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
}
