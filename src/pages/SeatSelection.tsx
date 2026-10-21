import { useState, useMemo } from 'react';
import type { Movie, Page, BookingState } from '../types';
import { db } from '../db/database';

interface Props {
  movie: Movie;
  bookingState: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLS = 14;

export default function SeatSelection({ movie, bookingState, navigate }: Props) {
  const showtimeKey = `${bookingState.movieId || movie.id}_${bookingState.date || 'Today'}_${bookingState.showtime?.time || '08:00 PM'}`;
  const takenSeats = useMemo(() => new Set(db.getBookedSeats(showtimeKey)), [showtimeKey]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>(
    bookingState.selectedSeats.length ? bookingState.selectedSeats : ['E4', 'E5']
  );

  const pricePerSeat = bookingState.showtime?.price || 55;

  const toggleSeat = (seatId: string) => {
    if (takenSeats.has(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const total = selectedSeats.length * pricePerSeat;
  const convenienceFee = Math.round(total * 0.05);

  const handleContinue = () => {
    navigate('food', {
      selectedSeats,
      totalAmount: total + convenienceFee,
      convenienceFee,
    });
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 130, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        {/* Header Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('booking')}
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
            <h1
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: 'clamp(26px, 5vw, 36px)',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              SELECT YOUR SEATS
            </h1>
            <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 4 }}>
              {bookingState.movieTitle || movie.title} · {bookingState.showtime?.time || '08:00 PM'} · {bookingState.theaterName || 'Cinetix Grand IMAX Downtown'}
            </p>
          </div>
        </div>

        {/* Screen Indicator */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 157, 22, 0.7), transparent)',
              height: 8,
              borderRadius: '50% 50% 0 0 / 8px 8px 0 0',
              maxWidth: 620,
              margin: '0 auto 8px',
              boxShadow: '0 0 20px rgba(255, 157, 22, 0.4)',
            }}
          />
          <div
            style={{
              maxWidth: 620,
              margin: '0 auto',
              background: 'rgba(255, 157, 22, 0.08)',
              borderBottom: '1px solid rgba(255, 157, 22, 0.25)',
              borderRadius: '0 0 20px 20px',
              padding: '6px 0',
            }}
          >
            <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' }}>
              IMAX CURVED SCREEN
            </p>
          </div>
        </div>

        {/* Seat Grid */}
        <div style={{ maxWidth: 740, margin: '0 auto 36px', overflowX: 'auto', paddingBottom: 10 }}>
          {ROWS.map((row, rowIdx) => (
            <div key={row} className="seat-row" style={{ justifyContent: 'center' }}>
              <span className="seat-row-label">{row}</span>
              <div className="seat-cols" style={{ justifyContent: 'center' }}>
                {Array.from({ length: COLS }, (_, colIdx) => {
                  const seatId = `${row}${colIdx + 1}`;
                  const isTaken = takenSeats.has(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const isPremium = rowIdx < 2;

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      className={`seat ${isTaken ? 'seat-taken' : isSelected ? 'seat-selected' : 'seat-available'} ${isPremium ? 'seat-premium' : ''}`}
                      title={`${seatId} ${isTaken ? '(Taken)' : isSelected ? '(Selected)' : isPremium ? '(VIP Premium)' : '(Available)'}`}
                    >
                      {colIdx + 1}
                    </button>
                  );
                })}
              </div>
              <span className="seat-row-label">{row}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            marginBottom: 36,
            flexWrap: 'wrap',
            background: '#24221F',
            border: '1px solid #4D473F',
            borderRadius: 12,
            padding: '12px 20px',
            maxWidth: 640,
            margin: '0 auto 36px',
          }}
        >
          {[
            { color: '#33312D', border: '1px solid #665946', label: 'Available ($55)' },
            { color: '#FF9D16', border: '1px solid #FF9D16', label: 'Selected' },
            { color: '#252422', border: '1px solid #33312D', label: 'Taken', opacity: 0.4 },
            { color: '#33312D', border: '1px solid #FF9D16', label: 'VIP Row ($65)' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: item.color,
                  border: item.border,
                  borderRadius: 4,
                  opacity: item.opacity || 1,
                }}
              />
              <span style={{ color: '#C7BFB5', fontSize: 12, fontFamily: 'Inter' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Snack Promo Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 157, 22, 0.12), rgba(204, 144, 59, 0.05))',
            border: '1px solid rgba(255, 157, 22, 0.3)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            maxWidth: 740,
            margin: '0 auto 24px',
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 32 }}>🍿</span>
            <div>
              <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15 }}>
                Add Artisanal Truffle Popcorn & Beverages
              </p>
              <p style={{ color: '#C7BFB5', fontSize: 13 }}>
                Pre-order concessions with tickets and get express queue bypass
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            style={{
              background: '#33312D',
              border: '1px solid #FF9D16',
              color: '#FF9D16',
              borderRadius: 10,
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            Add Snacks →
          </button>
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
              {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} Selected:{' '}
              <strong style={{ color: '#FF9D16' }}>{selectedSeats.join(', ') || 'None'}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 2, alignItems: 'center' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 20, fontFamily: 'Inter' }}>
                ${total}.00
              </span>
              <span style={{ color: '#99784B', fontSize: 12 }}>+${convenienceFee} fee</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleContinue}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                color: '#C7BFB5',
                borderRadius: 10,
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              + Add Concessions
            </button>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() =>
                navigate('payment', {
                  selectedSeats,
                  totalAmount: total + convenienceFee,
                  convenienceFee,
                })
              }
              style={{
                background: selectedSeats.length
                  ? 'linear-gradient(135deg, #FF9D16, #CC903B)'
                  : '#33312D',
                color: selectedSeats.length ? '#181715' : '#665946',
                borderRadius: 10,
                padding: '10px 24px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 19,
                cursor: selectedSeats.length ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                boxShadow: selectedSeats.length ? '0 4px 14px rgba(255,157,22,0.35)' : 'none',
              }}
            >
              CONTINUE TO PAYMENT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
