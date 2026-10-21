import { useState } from 'react';
import type { BookingState, Page, CartItem } from '../types';
import { db } from '../db/database';

interface Props {
  bookingState: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
  setBookingState: (fn: (prev: BookingState) => BookingState) => void;
}

const CATEGORIES = ['All', 'Combos', 'Snacks', 'Beverages', 'Desserts'];

export default function Food({ bookingState, navigate, setBookingState }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>(bookingState.foodItems || []);

  const foodItems = db.getFoodItems();
  const filtered = activeCategory === 'All'
    ? foodItems
    : foodItems.filter((f) => f.category.toLowerCase() === activeCategory.toLowerCase());

  const getQty = (id: string) => cart.find((c) => c.item.id === id)?.quantity || 0;

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const item = foodItems.find((f) => f.id === id);
      if (!item) return prev;
      const existing = prev.find((c) => c.item.id === id);
      if (!existing) return delta > 0 ? [...prev, { item, quantity: 1 }] : prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter((c) => c.item.id !== id);
      return prev.map((c) => (c.item.id === id ? { ...c, quantity: newQty } : c));
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  const handleContinue = () => {
    setBookingState((prev) => ({
      ...prev,
      foodItems: cart,
      totalAmount: prev.totalAmount + cartTotal,
    }));
    navigate('payment', {
      foodItems: cart,
      totalAmount: bookingState.totalAmount + cartTotal,
    });
  };

  const handleSkip = () => {
    navigate('payment', {
      foodItems: [],
      totalAmount: bookingState.totalAmount,
    });
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 120, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        {/* Header Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('seat-selection')}
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
            ← Back to Seats
          </button>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.04em', color: '#FFFFFF' }}>
              ARTISANAL CINEMA CONCESSIONS
            </h1>
            <p style={{ color: '#C7BFB5', fontSize: 13 }}>
              Pre-order gourmet snacks & signature drinks for seamless seat delivery
            </p>
          </div>
        </div>

        {/* VIP Combo Highlight */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 157, 22, 0.15), rgba(204, 144, 59, 0.05))',
            border: '1px solid #FF9D16',
            borderRadius: 16,
            padding: 22,
            marginBottom: 24,
            display: 'flex',
            gap: 18,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 44 }}>🍿</span>
          <div style={{ flex: 1 }}>
            <span
              style={{
                background: '#FF9D16',
                color: '#181715',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 4,
                fontFamily: 'Inter',
              }}
            >
              VIP BEST VALUE
            </span>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginTop: 4 }}>
              CINETIX ROYALE DUO COMBO — $32.00
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 13 }}>
              Large Truffle Butter Popcorn + 2 Cold Drinks + Pretzel Bites with Honey Mustard (Save $8)
            </p>
          </div>
          <button
            onClick={() => updateQty('f-3', 1)}
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 10,
              padding: '10px 24px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 18,
            }}
          >
            + ADD COMBO
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2.5 overflow-x-auto scroll-no-bar mb-6 pb-2">
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
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  border: active ? '1px solid #FF9D16' : '1px solid #665946',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: '#24221F',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${qty > 0 ? '#FF9D16' : '#665946'}`,
                  transition: 'border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: 170 }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      width: 22,
                      height: 22,
                      border: `2px solid ${item.isVeg ? '#22C55E' : '#EF4444'}`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(24, 23, 21, 0.85)',
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.isVeg ? '#22C55E' : '#EF4444' }} />
                  </div>
                  {item.calories && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#C7BFB5',
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {item.calories}
                    </span>
                  )}
                </div>

                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 4 }}>
                    {item.name}
                  </h4>
                  <p style={{ color: '#C7BFB5', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                    <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 20, fontFamily: 'Inter' }}>
                      ${item.price}.00
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          background: '#33312D',
                          border: '1px solid #FF9D16',
                          color: '#FF9D16',
                          borderRadius: 8,
                          padding: '7px 18px',
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        + Add
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          background: '#33312D',
                          border: '1px solid #FF9D16',
                          borderRadius: 8,
                          padding: '5px 12px',
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{ color: '#FF9D16', fontWeight: 800, fontSize: 18, background: 'none' }}
                        >
                          −
                        </button>
                        <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15, minWidth: 16, textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{ color: '#FF9D16', fontWeight: 800, fontSize: 18, background: 'none' }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#24221F',
          borderTop: '1px solid #3A3731',
          padding: '14px 0',
          zIndex: 100,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="max-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ color: '#C7BFB5', fontSize: 12 }}>
              {cart.length > 0
                ? `${cart.reduce((s, c) => s + c.quantity, 0)} Items Added`
                : 'No concessions selected'}
            </p>
            <p style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 20, fontFamily: 'Inter' }}>
              ${bookingState.totalAmount + cartTotal}.00
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {cart.length === 0 && (
              <button
                onClick={handleSkip}
                style={{
                  background: 'none',
                  border: '1px solid #665946',
                  color: '#C7BFB5',
                  borderRadius: 10,
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Skip Concessions
              </button>
            )}

            <button
              onClick={handleContinue}
              style={{
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                color: '#181715',
                borderRadius: 10,
                padding: '10px 26px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 19,
                boxShadow: '0 4px 14px rgba(255,157,22,0.35)',
              }}
            >
              PROCEED TO PAYMENT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
