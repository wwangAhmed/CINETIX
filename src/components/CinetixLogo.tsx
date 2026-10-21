import React from 'react';

interface Props {
  height?: number;
  showSubtitle?: boolean;
}

export default function CinetixLogo({ height = 40, showSubtitle = true }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      {/* Modern Cinema Aperture Icon */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="cinetixGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9D16" />
            <stop offset="50%" stopColor="#CC903B" />
            <stop offset="100%" stopColor="#99784B" />
          </linearGradient>
          <filter id="cinetixGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF9D16" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Hexagon / Prism */}
        <polygon
          points="24,3 43,14 43,34 24,45 5,34 5,14"
          fill="#33312D"
          stroke="url(#cinetixGold)"
          strokeWidth="2.5"
          filter="url(#cinetixGlow)"
        />

        {/* Film Shutter Triangles */}
        <polygon points="24,12 36,24 24,36 12,24" fill="url(#cinetixGold)" opacity="0.9" />
        <polygon points="24,16 32,24 24,32 16,24" fill="#181715" />
        
        {/* Central Playhead Core */}
        <polygon points="22,20 28,24 22,28" fill="#FF9D16" />
      </svg>

      {/* Brand Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: height * 0.72,
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FF9D16 60%, #CC903B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
            }}
          >
            CINETIX
          </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              fontFamily: 'Inter',
              fontWeight: 900,
              fontSize: height * 0.26,
              padding: '2px 5px',
              borderRadius: 4,
              letterSpacing: '0.05em',
            }}
          >
            MAX
          </span>
        </div>
        {showSubtitle && (
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: height * 0.22,
              color: '#99784B',
              letterSpacing: '0.14em',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            Cinema Experience
          </span>
        )}
      </div>
    </div>
  );
}
