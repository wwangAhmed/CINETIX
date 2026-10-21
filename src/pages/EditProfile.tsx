import { useState } from 'react';
import type { Page } from '../types';
import { db } from '../db/database';

interface Props {
  navigate: (page: Page) => void;
}

export default function EditProfile({ navigate }: Props) {
  const initial = db.getUserProfile();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    db.updateUserProfile({ name, email, phone });
    setSaved(true);
    setTimeout(() => {
      navigate('profile');
    }, 800);
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 560 }}>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('profile')}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#C7BFB5',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.04em', color: '#FFFFFF' }}>
            EDIT VIP PROFILE
          </h1>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                width: 90,
                height: 90,
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 900,
                color: '#181715',
                boxShadow: '0 0 24px rgba(255,157,22,0.35)',
              }}
            >
              {name.charAt(0) || 'U'}
            </div>
            <button
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                background: '#FF9D16',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#181715',
                border: '2px solid #181715',
              }}
            >
              📷
            </button>
          </div>
          <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 8 }}>Tier: {initial.membershipTier}</p>
        </div>

        <div
          style={{
            background: '#24221F',
            borderRadius: 20,
            padding: 28,
            border: '1px solid #665946',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
              NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Inter',
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Inter',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
              PHONE NUMBER
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Inter',
              }}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              background: saved ? '#22C55E' : 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 10,
              padding: 14,
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {saved ? '✓ PROFILE SAVED IN SQLITE DB!' : 'SAVE PROFILE UPDATES'}
          </button>
        </div>

      </div>
    </div>
  );
}
