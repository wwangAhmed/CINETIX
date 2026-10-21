import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

export default function About({ navigate: _navigate }: Props) {
  return (
    <div style={{ paddingTop: 72, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img
          src="/assets/cinetix-hero.jpg"
          alt="Cinetix Luxury Cinema Lobby"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181715 0%, rgba(24,23,21,0.65) 60%, transparent 100%)' }} />
        <div className="max-container" style={{ position: 'absolute', bottom: 50, left: 0, right: 0 }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              fontSize: 11,
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 6,
              letterSpacing: '0.05em',
            }}
          >
            THE CINETIX STORY
          </span>
          <h1
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(36px, 6vw, 64px)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            NEXT-GEN THEATRICAL EXCELLENCE
          </h1>
          <p style={{ color: '#FF9D16', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 600 }}>
            Where cutting-edge technology meets the sacred art of cinema.
          </p>
        </div>
      </div>

      <div className="max-container" style={{ marginTop: 50 }}>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20 items-center">
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 16 }}>
              PIONEERING THE FUTURE OF BIG-SCREEN ENTERTAINMENT
            </h2>
            <p style={{ color: '#C7BFB5', fontSize: 15, lineHeight: 1.8, marginBottom: 14 }}>
              Founded with the singular conviction that watching a film on a massive screen with laser precision and earth-shaking spatial audio is an irreplaceable human ritual, <strong>CINETIX</strong> was born to eliminate every barrier between audience and storyteller.
            </p>
            <p style={{ color: '#C7BFB5', fontSize: 15, lineHeight: 1.8, marginBottom: 14 }}>
              From our flagship Grand IMAX auditorium in Downtown to our growing network of Dolby Atmos auditoriums, CINETIX delivers frictionless booking, algorithmic prime-seat reservation with <em>Order It Quick</em>, and curated artisanal concessions delivered directly to luxury recliners.
            </p>
          </div>

          <div style={{ background: '#24221F', borderRadius: 20, overflow: 'hidden', border: '1px solid #665946' }}>
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=480&fit=crop"
              alt="Auditorium"
              style={{ width: '100%', height: 260, objectFit: 'cover' }}
            />
            <div style={{ padding: 24 }}>
              <p style={{ color: '#FF9D16', fontStyle: 'italic', fontSize: 15, lineHeight: 1.6 }}>
                "We don't just sell cinema tickets. We curate unforgettable sensory journeys where light, sound, and story transcend reality."
              </p>
              <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 8 }}>
                — Executive Directorate, Cinetix Theatres Inc.
              </p>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: '500+', label: 'Laser IMAX Screens' },
            { value: '14M+', label: 'Tickets Issued' },
            { value: '0.4s', label: '1-Tap Pass Speed' },
            { value: '4.95★', label: 'Verified App Score' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: '#24221F',
                border: '1px solid #4D473F',
                borderRadius: 16,
                padding: '24px 16px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 40, color: '#FF9D16', letterSpacing: '0.04em' }}>
                {s.value}
              </p>
              <p style={{ color: '#C7BFB5', fontSize: 13, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ background: '#24221F', border: '1px solid #665946', borderRadius: 16, padding: 28 }}>
            <span style={{ fontSize: 32 }}>🎯</span>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, letterSpacing: '0.04em', marginTop: 10, marginBottom: 8 }}>
              OUR MISSION
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.7 }}>
              To provide frictionless access to the greatest cinematic masterpieces on planet Earth, leveraging instant digital ticketing, verified gate barcodes, and ultra-high dynamic range projection systems.
            </p>
          </div>

          <div style={{ background: '#24221F', border: '1px solid #665946', borderRadius: 16, padding: 28 }}>
            <span style={{ fontSize: 32 }}>⚡</span>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, letterSpacing: '0.04em', marginTop: 10, marginBottom: 8 }}>
              OUR INNOVATION
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.7 }}>
              Engineered with a high-throughput relational backend architecture, real-time seat lock verification, and biometric 1-tap checkout, setting the gold benchmark for ticketing infrastructure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
