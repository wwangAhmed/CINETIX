import { useState } from 'react';
import type { Page } from '../types';
import CinetixLogo from './CinetixLogo';

interface FooterProps {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #181715 0%, #11100E 100%)',
        borderTop: '1px solid #33312D',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.03,
          whiteSpace: 'nowrap',
          fontFamily: 'Bebas Neue',
          fontWeight: 900,
          fontSize: 160,
          color: '#FF9D16',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: 4,
        }}
      >
        CINETIX CINEMAS
      </div>

      <div className="max-container py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <CinetixLogo height={42} />
            </div>
            <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
              The next-generation cinema destination. Experience IMAX 3D, Dolby Atmos, and curated artisanal concessions with frictionless instant booking.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Instagram', icon: '📸', url: '#' },
                { label: 'YouTube', icon: '▶', url: '#' },
                { label: 'X', icon: '𝕏', url: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    background: '#33312D',
                    border: '1px solid #665946',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C7BFB5',
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF9D16';
                    e.currentTarget.style.color = '#FF9D16';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#665946';
                    e.currentTarget.style.color = '#C7BFB5';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.05em',
                fontSize: 18,
                color: '#FFFFFF',
                marginBottom: 16,
              }}
            >
              EXPLORE
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { l: 'Featured Movies', p: 'home' as Page },
                { l: 'Now Showing & Trailers', p: 'movie-detail' as Page },
                { l: 'Exclusive Offers', p: 'offers' as Page },
                { l: 'Food & Drinks Menu', p: 'food' as Page },
                { l: 'About Cinetix', p: 'about' as Page },
              ].map((item) => (
                <button
                  key={item.p}
                  onClick={() => navigate(item.p)}
                  style={{
                    color: '#C7BFB5',
                    fontSize: 14,
                    textAlign: 'left',
                    background: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FF9D16'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#C7BFB5'; }}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>

          {/* Legal & Policy */}
          <div>
            <h4
              style={{
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.05em',
                fontSize: 18,
                color: '#FFFFFF',
                marginBottom: 16,
              }}
            >
              SUPPORT & LEGAL
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { l: 'Privacy Policy', p: 'privacy' as Page },
                { l: 'Terms of Service', p: 'terms' as Page },
                { l: 'Contact Concierge', p: 'contact' as Page },
                { l: 'VIP Loyalty Program', p: 'profile' as Page },
              ].map((item) => (
                <button
                  key={item.p}
                  onClick={() => navigate(item.p)}
                  style={{
                    color: '#C7BFB5',
                    fontSize: 14,
                    textAlign: 'left',
                    background: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FF9D16'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#C7BFB5'; }}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>

          {/* VIP Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.05em',
                fontSize: 18,
                color: '#FFFFFF',
                marginBottom: 16,
              }}
            >
              CINETIX CLUB
            </h4>
            <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 14, lineHeight: 1.5 }}>
              Receive early premiere access, secret promo codes, and IMAX invites.
            </p>
            {subscribed ? (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22C55E',
                  borderRadius: 10,
                  padding: '12px 14px',
                  color: '#22C55E',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ✓ Welcome to the Club! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  style={{
                    flex: 1,
                    background: '#33312D',
                    border: '1px solid #665946',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontFamily: 'Inter',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: '10px 18px',
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: 'Inter',
                  }}
                >
                  →
                </button>
              </form>
            )}
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #33312D',
            paddingTop: 24,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ color: '#99784B', fontSize: 13 }}>
            © {new Date().getFullYear()} CINETIX THEATRES INC. ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#C7BFB5', fontSize: 13 }}>Built with Modern Tech Cinema Standards</span>
            <span
              style={{
                background: 'rgba(255, 157, 22, 0.15)',
                border: '1px solid #FF9D16',
                color: '#FF9D16',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              v2.4 DYNAMIC SQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
