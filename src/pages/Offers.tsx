import { useState } from 'react';
import type { Page } from '../types';
import { db } from '../db/database';

interface Props {
  navigate: (page: Page) => void;
}

const CATEGORIES = ['All', 'IMAX', 'Special', 'Combos'];

export default function Offers({ navigate }: Props) {
  const offers = db.getOffers();
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState('');

  const filtered = activeCategory === 'All'
    ? offers
    : offers.filter((o) => o.category === activeCategory);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          CINETIX PRIVILEGES & OFFERS
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 28 }}>
          Exclusive promotional vouchers and VIP discounts across all theatres
        </p>

        {/* Hero Promo Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF9D16 0%, #CC903B 100%)',
            borderRadius: 20,
            padding: '28px 36px',
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: '0 8px 30px rgba(255,157,22,0.3)',
          }}
        >
          <div>
            <span
              style={{
                background: '#181715',
                color: '#FF9D16',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 2,
                padding: '3px 10px',
                borderRadius: 4,
                textTransform: 'uppercase',
              }}
            >
              FALL PREMIERE PASS
            </span>
            <h2
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: 36,
                color: '#181715',
                letterSpacing: '0.04em',
                marginTop: 6,
                marginBottom: 2,
              }}
            >
              30% OFF ALL IMAX 3D TICKETS
            </h2>
            <p style={{ color: '#24221F', fontSize: 14, fontWeight: 600 }}>
              Use coupon code <strong>CINETIX30</strong> at checkout · Valid on all movies
            </p>
          </div>

          <button
            onClick={() => copyCode('CINETIX30')}
            style={{
              background: '#181715',
              color: '#FF9D16',
              borderRadius: 10,
              padding: '12px 28px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {copiedCode === 'CINETIX30' ? '✓ CODE COPIED!' : 'COPY CODE CINETIX30'}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto scroll-no-bar mb-8 pb-2">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  background: active ? '#FF9D16' : '#24221F',
                  color: active ? '#181715' : '#C7BFB5',
                  borderRadius: 20,
                  padding: '7px 20px',
                  fontWeight: 700,
                  fontSize: 13,
                  border: active ? '1px solid #FF9D16' : '1px solid #665946',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((offer) => (
            <div
              key={offer.id}
              style={{
                background: '#24221F',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid #665946',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 6, background: offer.color || '#FF9D16' }} />
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span
                    style={{
                      background: '#33312D',
                      color: offer.color || '#FF9D16',
                      border: `1px solid ${offer.color || '#FF9D16'}`,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {offer.category}
                  </span>
                  <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 18, fontFamily: 'Bebas Neue', letterSpacing: '0.04em' }}>
                    {offer.discount}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 6 }}>
                  {offer.title}
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>
                  {offer.description}
                </p>

                <div
                  style={{
                    background: '#1D1C19',
                    border: '1px dashed #665946',
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  <span style={{ color: '#FF9D16', fontWeight: 800, fontSize: 14, fontFamily: 'Inter', letterSpacing: 1 }}>
                    {offer.code}
                  </span>
                  <button
                    onClick={() => copyCode(offer.code)}
                    style={{
                      color: copiedCode === offer.code ? '#22C55E' : '#C7BFB5',
                      fontSize: 12,
                      fontWeight: 700,
                      background: 'none',
                    }}
                  >
                    {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
