import { useState, useEffect } from 'react';
import type { Page } from '../types';
import CinetixLogo from './CinetixLogo';
import { db } from '../db/database';
import SecurityModal from './SecurityModal';

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [user, setUser] = useState(db.getUserProfile());

  useEffect(() => {
    return db.subscribe(() => {
      setUser(db.getUserProfile());
    });
  }, []);

  const links: { label: string; page: Page; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Movies', page: 'movie-detail' },
    { label: 'Offers', page: 'offers' },
    { label: 'Design System', page: 'design-system', badge: 'GUIDE' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <>
      <nav
        style={{
          backgroundColor: '#181715',
          borderBottom: '1px solid #33312D',
          height: '72px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="max-container h-full flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Cinetix Cinema Home"
          >
            <CinetixLogo height={38} />
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => {
              const active = currentPage === l.page;
              return (
                <button
                  key={l.page}
                  onClick={() => navigate(l.page)}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: active ? 700 : 500,
                    fontSize: 14,
                    color: active ? '#FF9D16' : '#C7BFB5',
                    background: 'none',
                    borderBottom: active ? '2px solid #FF9D16' : '2px solid transparent',
                    paddingBottom: 6,
                    paddingTop: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = '#C7BFB5';
                  }}
                >
                  <span>{l.label}</span>
                  {l.badge && (
                    <span
                      style={{
                        background: 'rgba(255, 157, 22, 0.15)',
                        border: '1px solid rgba(255, 157, 22, 0.35)',
                        color: '#FF9D16',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 4,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {l.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* 256-Bit SSL Security Badge */}
            <div
              onClick={() => setSecurityModalOpen(true)}
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22C55E',
                borderRadius: 20,
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Click to view Security Vault verification"
            >
              <span style={{ fontSize: 11 }}>🔒</span>
              <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700, fontFamily: 'Inter' }}>
                256-Bit TLS
              </span>
            </div>

            {/* VIP Loyalty Points pill */}
            <div
              onClick={() => navigate('profile')}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 20,
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
              title="Reward Points"
            >
              <span style={{ color: '#FF9D16', fontSize: 13 }}>★</span>
              <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'Inter' }}>
                {user.rewardPoints} pts
              </span>
            </div>

            {/* Profile Avatar Button */}
            <button
              onClick={() => navigate('profile')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#181715',
                fontWeight: 900,
                fontSize: 14,
                boxShadow: '0 2px 10px rgba(255, 157, 22, 0.35)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              aria-label="Profile"
            >
              {user.name.charAt(0)}
            </button>

            {/* Quick Login / Sign In */}
            <button
              onClick={() => navigate('login')}
              style={{
                border: '1px solid #665946',
                borderRadius: 10,
                padding: '7px 14px',
                color: '#C7BFB5',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 13,
                background: '#33312D',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#FF9D16';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#C7BFB5';
                e.currentTarget.style.borderColor = '#665946';
              }}
            >
              Sign In
            </button>

            {/* VIP Register Button */}
            <button
              onClick={() => navigate('register')}
              style={{
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                borderRadius: 10,
                padding: '7px 16px',
                color: '#181715',
                fontFamily: 'Inter',
                fontWeight: 800,
                fontSize: 13,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(255, 157, 22, 0.3)',
              }}
            >
              VIP Register
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              color: '#FF9D16',
              fontSize: 24,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            right: 0,
            width: 300,
            height: 'calc(100vh - 72px)',
            backgroundColor: '#33312D',
            zIndex: 999,
            padding: 24,
            borderLeft: '1px solid #665946',
            boxShadow: '-8px 0 24px rgba(0,0,0,0.6)',
            overflowY: 'auto',
          }}
          className="lg:hidden flex flex-col gap-4"
        >
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => {
                navigate(l.page);
                setMenuOpen(false);
              }}
              style={{
                color: currentPage === l.page ? '#FF9D16' : '#FFFFFF',
                fontWeight: 600,
                fontSize: 16,
                textAlign: 'left',
                background: 'none',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{l.label}</span>
              {l.badge && (
                <span
                  style={{
                    background: '#FF9D16',
                    color: '#181715',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {l.badge}
                </span>
              )}
            </button>
          ))}
          <hr style={{ borderColor: '#665946', margin: '8px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#C7BFB5', fontSize: 13 }}>VIP Reward Points:</span>
            <span style={{ color: '#FF9D16', fontWeight: 700 }}>★ {user.rewardPoints}</span>
          </div>
          <button
            onClick={() => {
              navigate('profile');
              setMenuOpen(false);
            }}
            style={{
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 16,
              textAlign: 'left',
              background: 'none',
              padding: '6px 0',
            }}
          >
            My Bookings & Profile
          </button>
          <button
            onClick={() => {
              navigate('login');
              setMenuOpen(false);
            }}
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 10,
              padding: '12px 20px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            SIGN IN / REGISTER
          </button>
        </div>
      )}

      <SecurityModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </>
  );
}
