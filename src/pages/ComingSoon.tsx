import { useState } from 'react';
import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

const COMING_SOON_MOVIES = [
  { title: 'Project Olympus', date: 'Oct 28, 2026', genre: 'Action / Sci-Fi', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', synopsis: 'A covert orbital operation gone rogue sends an elite task force into uncharted solar coordinates.' },
  { title: 'Solaris Reborn', date: 'Nov 04, 2026', genre: 'Sci-Fi / Drama', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop', synopsis: 'Scientists encounter a sentient living oceanic entity at the perimeter of the Orion Arm.' },
  { title: 'The Dark Archive', date: 'Nov 18, 2026', genre: 'Thriller / Mystery', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', synopsis: 'An underground archivist uncovers encoded digital blueprints that threaten global communications.' },
  { title: 'Mirage Point', date: 'Dec 02, 2026', genre: 'Drama / IMAX', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop', synopsis: 'Two estranged astrophysicists share memories across divergent simulated timelines.' },
  { title: 'Steel Horizon', date: 'Dec 16, 2026', genre: 'Action / 4DX', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop', synopsis: 'The final defensive perimeter of Neo-Tokyo faces an airborne cybernetic fleet.' },
  { title: 'Neon Drift', date: 'Dec 30, 2026', genre: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop', synopsis: 'Hypersonic underground maglev racing collides with time distortion paradoxes.' },
];

export default function ComingSoon({ navigate }: Props) {
  const [notified, setNotified] = useState<Record<string, boolean>>({});

  const toggleNotify = (title: string) => {
    setNotified((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          CINETIX FUTURE PREMIERES & COMING SOON
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 36 }}>
          Upcoming blockbuster theatrical releases scheduled for IMAX 3D, Dolby Atmos & 4DX
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMING_SOON_MOVIES.map((m) => {
            const isSet = notified[m.title];
            return (
              <div
                key={m.title}
                style={{
                  background: '#24221F',
                  borderRadius: 18,
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
                  <img src={m.img} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24,23,21,0.95) 0%, transparent 60%)' }} />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: '#FF9D16',
                      borderRadius: 6,
                      padding: '3px 10px',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#181715',
                    }}
                  >
                    {m.date}
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                    <span
                      style={{
                        background: '#33312D',
                        border: '1px solid #665946',
                        color: '#FF9D16',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {m.genre}
                    </span>
                  </div>
                </div>

                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 6 }}>
                    {m.title}
                  </h3>
                  <p style={{ color: '#C7BFB5', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                    {m.synopsis}
                  </p>

                  <button
                    onClick={() => toggleNotify(m.title)}
                    style={{
                      width: '100%',
                      background: isSet ? 'rgba(34,197,94,0.15)' : '#33312D',
                      border: `1px solid ${isSet ? '#22C55E' : '#FF9D16'}`,
                      color: isSet ? '#22C55E' : '#FF9D16',
                      borderRadius: 8,
                      padding: '10px',
                      fontFamily: 'Bebas Neue',
                      letterSpacing: '0.05em',
                      fontSize: 17,
                      marginTop: 'auto',
                    }}
                  >
                    {isSet ? '✓ VIP REMINDER ACTIVE' : '🔔 SET VIP PREMIERE ALERT'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
