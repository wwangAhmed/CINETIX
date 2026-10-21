import { useState } from 'react';
import type { Movie, Page, BookingState } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';

interface Props {
  movie: Movie;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

export default function OrderItQuick({ movie, navigate }: Props) {
  const allMovies = db.getMovies().filter((m) => m.bookable !== false);
  const theaters = db.getTheaters();
  const primaryTheater = theaters[0] || { name: 'Cinetix Grand IMAX Downtown', id: 'cinetix-imax-downtown' };

  const [currentMovieId, setCurrentMovieId] = useState(movie.id || 'the-last-signal');
  const [selectedDate, setSelectedDate] = useState(MOVIE_DATES[0] || 'Today');
  const [selectedTime, setSelectedTime] = useState('08:00 PM');
  const [promoCode, setPromoCode] = useState('CINETIX30');
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(30);

  const activeMovie = allMovies.find((m) => m.id === currentMovieId) || movie;

  const showtimeKey = `${activeMovie.id}_${selectedDate}_${selectedTime}`;
  const takenSeats = new Set(db.getBookedSeats(showtimeKey));
  const autoSeats = ['E4', 'E5'];

  const ticketPrice = 50;
  const subtotal = autoSeats.length * ticketPrice;
  const fee = 5;
  const total = Math.max(0, subtotal + fee - (promoApplied ? promoDiscount : 0));

  const handleApplyPromo = () => {
    const res = db.validatePromo(promoCode, subtotal);
    if (res.valid) {
      setPromoApplied(true);
      setPromoDiscount(res.discount);
    } else {
      alert(res.message);
    }
  };

  const handleInstantCheckout = () => {
    const booking = db.createBooking({
      movieId: activeMovie.id,
      movieTitle: activeMovie.title,
      moviePoster: activeMovie.poster,
      theaterId: primaryTheater.id,
      theaterName: primaryTheater.name,
      date: selectedDate,
      time: selectedTime,
      format: 'IMAX 3D',
      seats: autoSeats,
      subtotal,
      convenienceFee: fee,
      discount: promoApplied ? promoDiscount : 0,
      total,
      paymentMethod: 'Instant Apple Pay / Card',
    });

    navigate('quick-confirmed', {
      movieId: activeMovie.id,
      movieTitle: activeMovie.title,
      moviePoster: activeMovie.poster,
      theaterName: primaryTheater.name,
      date: selectedDate,
      selectedSeats: autoSeats,
      totalAmount: total,
    });
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 100, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 660 }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('home')}
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
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 26 }}>⚡</span>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                ORDER IT QUICK — 1-TAP CHECKOUT
              </h1>
            </div>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255, 157, 22, 0.15)',
                border: '1px solid #FF9D16',
                borderRadius: 20,
                padding: '2px 12px',
                marginTop: 2,
              }}
            >
              <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>
                Instant Best Seats Reserved · No Queues
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Movie Switcher */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <img
            src={activeMovie.poster}
            alt={activeMovie.title}
            style={{ width: 68, height: 96, objectFit: 'cover', borderRadius: 10, border: '1px solid #665946' }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
              Now Playing
            </p>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, letterSpacing: '0.04em', marginBottom: 4 }}>
              {activeMovie.title}
            </h3>
            <div className="flex gap-2 flex-wrap mb-2">
              {activeMovie.genre.map((g) => (
                <span
                  key={g}
                  style={{
                    background: '#33312D',
                    color: '#C7BFB5',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <select
            value={currentMovieId}
            onChange={(e) => setCurrentMovieId(e.target.value)}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              color: '#FF9D16',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {allMovies.map((m) => (
              <option key={m.id} value={m.id} style={{ background: '#33312D', color: '#FFFFFF' }}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Smart Defaults */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 16 }}>🧠</span>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 19, letterSpacing: '0.04em' }}>
              SMART DEFAULTS — PRE-CONFIGURED FOR YOU
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: '📍', label: 'Theater', value: primaryTheater.name, sub: 'IMAX Laser Screen 1' },
              { icon: '📅', label: 'Selected Date', value: selectedDate, sub: 'Prime Evening Showing' },
              { icon: '🕗', label: 'Showtime', value: `${selectedTime} · IMAX 3D`, sub: '$50.00 / ticket' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: '#33312D',
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  border: '1px solid #4D473F',
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>{item.label}</p>
                  <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 14 }}>{item.value}</p>
                  <p style={{ color: '#C7BFB5', fontSize: 12 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Seat Matrix */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 18, letterSpacing: '0.04em' }}>
              AUTO-RESERVED OPTIMAL SEATS
            </h3>
            <span
              style={{
                background: 'rgba(255, 157, 22, 0.15)',
                color: '#FF9D16',
                border: '1px solid #FF9D16',
                fontSize: 12,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 8,
              }}
            >
              E4, E5 · Prime Center View
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginBottom: 12 }}>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((row, ri) => (
              <div key={row} style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 8 }, (_, ci) => {
                  const isAuto = ri === 4 && (ci === 3 || ci === 4);
                  return (
                    <div
                      key={ci}
                      style={{
                        width: 22,
                        height: 18,
                        borderRadius: 3,
                        background: isAuto ? '#FF9D16' : '#33312D',
                        border: `1px solid ${isAuto ? '#FF9D16' : '#665946'}`,
                        boxShadow: isAuto ? '0 0 8px rgba(255, 157, 22, 0.8)' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(to bottom, #FF9D16, transparent)', height: 3, borderRadius: 2, maxWidth: 180, margin: '0 auto 6px', opacity: 0.5 }} />
          <p style={{ color: '#99784B', fontSize: 10, textAlign: 'center', letterSpacing: 2 }}>CINEMA SCREEN</p>
        </div>

        {/* Promo Voucher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo Code (e.g. CINETIX30)"
            style={{
              flex: 1,
              background: '#24221F',
              border: '1px solid #665946',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#FFFFFF',
              fontSize: 13,
            }}
          />
          <button
            onClick={handleApplyPromo}
            style={{
              background: '#33312D',
              border: '1px solid #FF9D16',
              color: '#FF9D16',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Apply Code
          </button>
        </div>

        {/* Order Summary & Instant Checkout */}
        <div
          style={{
            background: '#24221F',
            border: '1px solid #665946',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#C7BFB5', fontSize: 14 }}>2× IMAX 3D Tickets (E4, E5)</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${subtotal}.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#C7BFB5', fontSize: 14 }}>Convenience & Tech Fee</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${fee}.00</span>
          </div>
          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#22C55E', fontSize: 14 }}>VIP Promo Discount ({promoCode})</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>-${promoDiscount}.00</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #3A3731', paddingTop: 12, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16 }}>Final Amount</span>
            <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 24, fontFamily: 'Inter' }}>${total}.00</span>
          </div>
        </div>

        <button
          onClick={handleInstantCheckout}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 12,
            padding: 16,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 22,
            boxShadow: '0 6px 20px rgba(255, 157, 22, 0.4)',
          }}
        >
          ⚡ LOCK SEATS & GENERATE PASS (${total}.00)
        </button>

      </div>
    </div>
  );
}
