import React, { useState, useEffect } from 'react';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

const CINEMA_STATUSES = [
  'INITIALIZING 4K DCI LASER PROJECTION',
  'CALIBRATING 64-CHANNEL DOLBY ATMOS',
  'SYNCHRONIZING THEATRE SEATING MATRIX',
  'SECURING 256-BIT ENCRYPTED VAULT',
  'LOADING CINETIX IMAX EXPERIENCE',
];

export default function CinemaLoader({ message, fullScreen = true }: Props) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % CINEMA_STATUSES.length);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const displayMessage = message || CINEMA_STATUSES[statusIdx];

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
      }}
    >
      {/* Aperture / Film Reel Spinner */}
      <div
        style={{
          position: 'relative',
          width: 88,
          height: 88,
          marginBottom: 24,
        }}
      >
        {/* Outer glowing pulsing ring */}
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px dashed #FF9D16',
            animation: 'spin 12s linear infinite',
            opacity: 0.5,
          }}
        />

        {/* Middle reverse spinning ring with notch dots */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#FF9D16',
            borderBottomColor: '#CC903B',
            animation: 'spinReverse 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
          }}
        />

        {/* Center Golden Aperture Logo */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #33312D 0%, #181715 100%)',
            border: '1.5px solid #FF9D16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255, 157, 22, 0.45)',
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="14" stroke="#CC903B" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="17,6 23,17 11,17" fill="#FF9D16" opacity="0.9" />
            <polygon points="17,28 11,17 23,17" fill="#CC903B" opacity="0.9" />
            <circle cx="17" cy="17" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div
        style={{
          fontFamily: 'Bebas Neue',
          fontSize: 26,
          letterSpacing: '0.15em',
          background: 'linear-gradient(135deg, #FFB84D 0%, #FF9D16 50%, #CC903B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 6,
        }}
      >
        C I N E T I X
      </div>

      {/* Rotating Status with glowing badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 157, 22, 0.08)',
          border: '1px solid #665946',
          borderRadius: 20,
          padding: '6px 14px',
          marginTop: 4,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#FF9D16',
            boxShadow: '0 0 8px #FF9D16',
            animation: 'pulseGlowDot 1s ease-in-out infinite alternate',
          }}
        />
        <span
          style={{
            fontFamily: 'Inter',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#C7BFB5',
            textTransform: 'uppercase',
          }}
        >
          {displayMessage}
        </span>
      </div>

      {/* Sound & Security Badge */}
      <p style={{ color: '#665946', fontSize: 10, letterSpacing: '0.12em', marginTop: 14 }}>
        DOLBY ATMOS · 4K LASER · 256-BIT ENCRYPTED
      </p>

      <style>{`
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseGlowDot {
          from { opacity: 0.4; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(24, 23, 21, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
}
