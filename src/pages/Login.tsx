import { useState } from 'react';
import type { Page } from '../types';
import CinetixLogo from '../components/CinetixLogo';

interface Props {
  navigate: (page: Page) => void;
}

export default function Login({ navigate }: Props) {
  const [email, setEmail] = useState('alex.sterling@cinetix.io');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181715',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 20,
      }}
    >
      {/* Cinematic Background */}
      <img
        src="/assets/cinetix-hero.jpg"
        alt="Cinetix Luxury Hall"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
          filter: 'blur(2px)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(36,34,31,0.7) 0%, #181715 85%)' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}>
        <div
          style={{
            background: 'rgba(36, 34, 31, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: 24,
            padding: '36px 32px',
            border: '1px solid #665946',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}
        >
          {/* Brand */}
          <div className="text-center mb-6 flex flex-col items-center">
            <CinetixLogo height={44} />
            <h1
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: 32,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                marginTop: 16,
                marginBottom: 2,
              }}
            >
              WELCOME TO CINETIX
            </h1>
            <p style={{ color: '#C7BFB5', fontSize: 13 }}>
              Access VIP screenings, stored tickets & fast checkout
            </p>
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.sterling@cinetix.io"
              style={{
                width: '100%',
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 10,
                padding: '13px 16px',
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Inter',
              }}
            />
          </div>

          <button
            onClick={() => navigate('otp')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 10,
              padding: 14,
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              marginBottom: 20,
              boxShadow: '0 4px 14px rgba(255, 157, 22, 0.35)',
            }}
          >
            CONTINUE WITH VIP PASS →
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#4D473F' }} />
            <span style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>OR FAST AUTH</span>
            <div style={{ flex: 1, height: 1, background: '#4D473F' }} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { name: 'Google Account', icon: 'G' },
              { name: 'Apple ID', icon: '' },
            ].map((s) => (
              <button
                key={s.name}
                onClick={() => navigate('home')}
                style={{
                  background: '#33312D',
                  border: '1px solid #665946',
                  borderRadius: 10,
                  padding: '11px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: '#FF9D16', fontWeight: 900 }}>{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <p style={{ color: '#C7BFB5', fontSize: 13, textAlign: 'center' }}>
            New to Cinetix?{' '}
            <button
              onClick={() => navigate('otp')}
              style={{ color: '#FF9D16', fontWeight: 700, background: 'none' }}
            >
              Register VIP Account
            </button>
          </p>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => navigate('home')}
              style={{ color: '#99784B', fontSize: 12, background: 'none' }}
            >
              Skip and browse without login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
