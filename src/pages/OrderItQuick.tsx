import { useState, useMemo } from 'react';
import type { Movie, Page, BookingState, Showtime } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';
import CinemaLoader from '../components/CinemaLoader';

interface Props {
  movie: Movie;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

const SEAT_TIERS = [
  { count: 1, label: '1 Guest (Solo View)' },
  { count: 2, label: '2 Guests (Prime Couple)' },
  { count: 3, label: '3 Guests (Trio)' },
  { count: 4, label: '4 Guests (VIP Group)' },
];

const FORMAT_OPTIONS = [
  { id: 'IMAX 3D Laser', label: 'IMAX 3D Laser', price: 65, tag: 'FLAGSHIP' },
  { id: 'Dolby Atmos', label: 'Dolby Atmos', price: 55, tag: '64-CH AUDIO' },
  { id: '4DX Motion', label: '4DX Motion', price: 60, tag: 'PHYSICAL FX' },
];

const QUICK_SNACKS = [
  { id: 'qs-1', name: 'Truffle Caramel Popcorn Duo', price: 18, icon: '🍿' },
  { id: 'qs-2', name: 'Artisan Loaded Queso Nachos', price: 16, icon: '🧀' },
  { id: 'qs-3', name: 'Nitro Cold Craft Sodas (2x)', price: 12, icon: '🥤' },
];

export default function OrderItQuick({ movie, navigate }: Props) {
  const allMovies = db.getMovies().filter((m) => m.bookable !== false);
  const theaters = db.getTheaters();
  const primaryTheater = theaters[0] || { name: 'Cinetix Grand IMAX Downtown', id: 'cinetix-imax-downtown' };

  // 1. Dynamic Movie Selection
  const [currentMovieId, setCurrentMovieId] = useState(movie.id || allMovies[0]?.id || 'the-last-signal');
  const activeMovie = allMovies.find((m) => m.id === currentMovieId) || allMovies[0];

  // 2. Dynamic Date Selection
  const [selectedDate, setSelectedDate] = useState(MOVIE_DATES[0] || 'Today');

  // 3. Dynamic Showtime Selection
  const [selectedTime, setSelectedTime] = useState('08:00 PM');

  // 4. Dynamic Format Selection
  const [selectedFormat, setSelectedFormat] = useState('IMAX 3D Laser');

  // 5. Dynamic Seat Count
  const [seatCount, setSeatCount] = useState(2);

  // 6. Concessions Quick Add
  const [snackQty, setSnackQty] = useState<Record<string, number>>({});

  // 7. Dynamic Promo Code
  const [promoCode, setPromoCode] = useState('CINETIX30');
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(39);
  const [promoMessage, setPromoMessage] = useState('30% Special Discount Applied!');

  // 8. 1-Tap Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay (Instant Biometric)');

  // 9. Processing Loader
  const [processing, setProcessing] = useState(false);

  // Calculate dynamic seat allocation based on occupied seats in DB
  const showtimeKey = `${activeMovie.id}_${selectedDate}_${selectedTime}`;
  const takenSeats = useMemo(() => new Set(db.getBookedSeats(showtimeKey)), [showtimeKey]);

  // Find contiguous optimal seats in prime rows E, F, D
  const allocatedSeats = useMemo(() => {
    const candidateRows = ['E', 'F', 'D', 'G', 'C'];
    for (const r of candidateRows) {
      for (let startCol = 3; startCol <= 12 - seatCount; startCol++) {
        const potential = Array.from({ length: seatCount }, (_, i) => `${r}${startCol + i}`);
        if (potential.every((s) => !takenSeats.has(s))) {
          return potential;
        }
      }
    }
    // Fallback if prime is booked
    return Array.from({ length: seatCount }, (_, i) => `E${4 + i}`);
  }, [takenSeats, seatCount]);

  // Price calculations
  const formatObj = FORMAT_OPTIONS.find((f) => f.id === selectedFormat) || FORMAT_OPTIONS[0];
  const ticketPrice = formatObj.price;
  const ticketSubtotal = seatCount * ticketPrice;

  const snackTotal = Object.entries(snackQty).reduce((sum, [id, qty]) => {
    const item = QUICK_SNACKS.find((s) => s.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const convenienceFee = Math.round((ticketSubtotal + snackTotal) * 0.05);
  const subtotalBeforeDiscount = ticketSubtotal + snackTotal;
  const total = Math.max(0, subtotalBeforeDiscount + convenienceFee - (promoApplied ? promoDiscount : 0));

  const handleApplyPromo = () => {
    const res = db.validatePromo(promoCode, subtotalBeforeDiscount);
    if (res.valid) {
      setPromoApplied(true);
      setPromoDiscount(res.discount);
      setPromoMessage(res.message);
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoMessage(res.message);
    }
  };

  const handleUpdateSnack = (id: string, delta: number) => {
    setSnackQty((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  const handleInstantCheckout = () => {
    setProcessing(true);

    setTimeout(() => {
      // Build selected concessions items
      const orderedSnacks = Object.entries(snackQty).map(([id, qty]) => {
        const item = QUICK_SNACKS.find((s) => s.id === id)!;
        return { name: item.name, quantity: qty, price: item.price };
      });

      const showtimeRecord: Showtime = {
        id: `st-${Date.now()}`,
        time: selectedTime,
        format: selectedFormat.includes('IMAX') ? 'IMAX 3D' : selectedFormat.includes('Dolby') ? 'Dolby Atmos' : '4DX',
        price: ticketPrice,
        available: 84,
      };

      const booking = db.createBooking({
        movieId: activeMovie.id,
        movieTitle: activeMovie.title,
        moviePoster: activeMovie.poster,
        theaterId: primaryTheater.id,
        theaterName: primaryTheater.name,
        date: selectedDate,
        time: selectedTime,
        format: selectedFormat,
        seats: allocatedSeats,
        subtotal: subtotalBeforeDiscount,
        convenienceFee,
        discount: promoApplied ? promoDiscount : 0,
        total,
        paymentMethod: `${paymentMethod} (1-Tap Vault Auth)`,
      });

      setProcessing(false);

      navigate('quick-confirmed', {
        movieId: activeMovie.id,
        movieTitle: activeMovie.title,
        moviePoster: activeMovie.poster,
        theaterId: primaryTheater.id,
        theaterName: primaryTheater.name,
        date: selectedDate,
        showtime: showtimeRecord,
        selectedSeats: allocatedSeats,
        totalAmount: total,
        paymentMethod: booking.paymentMethod,
        bookingRef: booking.bookingRef,
      });
    }, 1100);
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      {processing && (
        <CinemaLoader
          message="AUTHORIZING 1-TAP CRYPTOGRAPHIC VAULT PASS..."
          fullScreen={true}
        />
      )}

      <div className="max-container" style={{ maxWidth: 720 }}>

        {/* Header Breadcrumb */}
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
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 26 }}>⚡</span>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px, 5vw, 36px)', letterSpacing: '0.04em', color: '#FFFFFF', margin: 0 }}>
                ORDER IT QUICK — 1-TAP CHECKOUT
              </h1>
            </div>
            <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, margin: '2px 0 0' }}>
              Zero Queues · Acoustically Optimal Prime Seats Auto-Reserved in 0.4s
            </p>
          </div>
        </div>

        {/* 1. Dynamic Movie Picker */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1.5px solid #FF9D16',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              STEP 1: SELECT FEATURE MOVIE
            </span>
            <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700 }}>● Now Showing</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img
              src={activeMovie.poster}
              alt={activeMovie.title}
              style={{
                width: 76,
                height: 108,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid #FF9D16',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 26, letterSpacing: '0.04em', margin: 0 }}>
                  {activeMovie.title}
                </h3>
                <span
                  style={{
                    background: '#FF9D16',
                    color: '#181715',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  ★ {activeMovie.rating}
                </span>
              </div>
              <p style={{ color: '#C7BFB5', fontSize: 13, marginBottom: 8 }}>
                {activeMovie.duration} · {activeMovie.certificate} · Dir. {activeMovie.director}
              </p>

              {/* Dynamic Select Dropdown */}
              <select
                value={currentMovieId}
                onChange={(e) => setCurrentMovieId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#33312D',
                  border: '1px solid #665946',
                  color: '#FF9D16',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {allMovies.map((m) => (
                  <option key={m.id} value={m.id} style={{ background: '#24221F', color: '#FFFFFF' }}>
                    {m.title} ({m.rating}★ · {m.duration})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Dynamic Date & Showtime Selectors */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
          }}
        >
          <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            STEP 2: DATE & SHOWTIME
          </span>

          {/* Date Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scroll-no-bar">
            {MOVIE_DATES.slice(0, 7).map((d, i) => {
              const dt = new Date(d);
              const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              const isSelected = selectedDate === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #FF9D16, #CC903B)' : '#33312D',
                    color: isSelected ? '#181715' : '#FFFFFF',
                    border: `1px solid ${isSelected ? '#FF9D16' : '#665946'}`,
                    borderRadius: 10,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Showtime Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['10:00 AM', '01:30 PM', '04:45 PM', '08:00 PM', '11:15 PM'].map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    background: isSelected ? '#FF9D16' : '#33312D',
                    color: isSelected ? '#181715' : '#C7BFB5',
                    border: `1px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                    borderRadius: 8,
                    padding: '9px 4px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Format & Seat Count Selectors */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
          }}
        >
          <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            STEP 3: CINEMA FORMAT & PARTY SIZE
          </span>

          {/* Format Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {FORMAT_OPTIONS.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  style={{
                    background: isSelected ? 'rgba(255, 157, 22, 0.15)' : '#33312D',
                    border: `1.5px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 13 }}>{fmt.label}</span>
                    <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 14 }}>${fmt.price}</span>
                  </div>
                  <span style={{ color: '#99784B', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{fmt.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Seat Count Selector */}
          <p style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>NUMBER OF SEATS:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEAT_TIERS.map((tier) => {
              const isSelected = seatCount === tier.count;
              return (
                <button
                  key={tier.count}
                  onClick={() => setSeatCount(tier.count)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #FF9D16, #CC903B)' : '#33312D',
                    color: isSelected ? '#181715' : '#C7BFB5',
                    border: `1px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                    borderRadius: 8,
                    padding: '10px 8px',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Live Seat Allocation Preview */}
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
            <div>
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', margin: 0 }}>
                ALGORITHMICALLY RESERVED PRIME SEATS
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 12, margin: '2px 0 0' }}>
                Center soundstage acoustic alignment in {primaryTheater.name}
              </p>
            </div>
            <div className="flex gap-1.5">
              {allocatedSeats.map((s) => (
                <span
                  key={s}
                  style={{
                    background: '#FF9D16',
                    color: '#181715',
                    fontSize: 13,
                    fontWeight: 900,
                    padding: '4px 10px',
                    borderRadius: 6,
                    boxShadow: '0 0 10px rgba(255, 157, 22, 0.7)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Mini Interactive Seat Map Representation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', padding: '12px 0' }}>
            {['C', 'D', 'E', 'F', 'G'].map((row) => (
              <div key={row} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: '#665946', fontSize: 10, width: 14, textAlign: 'center', fontWeight: 700 }}>
                  {row}
                </span>
                {Array.from({ length: 12 }, (_, ci) => {
                  const seatId = `${row}${ci + 1}`;
                  const isAllocated = allocatedSeats.includes(seatId);
                  const isTaken = takenSeats.has(seatId);

                  return (
                    <div
                      key={seatId}
                      style={{
                        width: 22,
                        height: 18,
                        borderRadius: 4,
                        background: isAllocated ? '#FF9D16' : isTaken ? '#181715' : '#33312D',
                        border: `1px solid ${isAllocated ? '#FF9D16' : isTaken ? '#252422' : '#665946'}`,
                        boxShadow: isAllocated ? '0 0 10px rgba(255,157,22,0.8)' : 'none',
                        opacity: isTaken ? 0.35 : 1,
                      }}
                      title={isAllocated ? `Your reserved seat: ${seatId}` : seatId}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(to bottom, #FF9D16, transparent)', height: 3, borderRadius: 2, maxWidth: 240, margin: '6px auto', opacity: 0.7 }} />
          <p style={{ color: '#99784B', fontSize: 9, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase' }}>
            CURVED 4K LASER IMAX SCREEN
          </p>
        </div>

        {/* 5. Fast Concessions Add-on */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: '1px solid #665946',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              STEP 4: OPTIONAL CONCESSIONS FAST-PACK
            </span>
            <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>
              {snackTotal > 0 ? `+$${snackTotal}.00 added` : 'Delivered to your seat'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {QUICK_SNACKS.map((snack) => {
              const qty = snackQty[snack.id] || 0;
              return (
                <div
                  key={snack.id}
                  style={{
                    background: '#33312D',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #4D473F',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{snack.icon}</span>
                    <div>
                      <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, margin: 0 }}>{snack.name}</p>
                      <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 800, margin: 0 }}>${snack.price}.00</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => handleUpdateSnack(snack.id, -1)}
                      disabled={qty === 0}
                      style={{
                        width: 28,
                        height: 28,
                        background: '#24221F',
                        border: '1px solid #665946',
                        color: qty > 0 ? '#FFFFFF' : '#665946',
                        borderRadius: 6,
                        cursor: qty > 0 ? 'pointer' : 'default',
                        fontSize: 16,
                        fontWeight: 900,
                      }}
                    >
                      -
                    </button>
                    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => handleUpdateSnack(snack.id, 1)}
                      style={{
                        width: 28,
                        height: 28,
                        background: '#FF9D16',
                        border: 'none',
                        color: '#181715',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 16,
                        fontWeight: 900,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Dynamic Promo Voucher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Promo Code (e.g. CINETIX30)"
            style={{
              flex: 1,
              background: '#24221F',
              border: '1px solid #665946',
              borderRadius: 10,
              padding: '12px 14px',
              color: '#FFFFFF',
              fontSize: 13,
              fontFamily: 'Inter',
            }}
          />
          <button
            onClick={handleApplyPromo}
            style={{
              background: '#33312D',
              border: '1px solid #FF9D16',
              color: '#FF9D16',
              borderRadius: 10,
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Apply Promo
          </button>
        </div>
        {promoMessage && (
          <p style={{ color: promoApplied ? '#22C55E' : '#EF4444', fontSize: 12, marginTop: -8, marginBottom: 14, fontWeight: 700 }}>
            {promoMessage}
          </p>
        )}

        {/* 7. 1-Tap Payment Method Selection */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            border: '1px solid #665946',
          }}
        >
          <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            STEP 5: 1-TAP AUTHORIZATION METHOD
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'Apple Pay (Instant Biometric)', label: ' Apple Pay', sub: 'Instant Touch ID / Face ID' },
              { id: 'Google Pay Pass', label: 'Google Pay', sub: 'Android Biometric Pass' },
              { id: 'Credit Card Vault (Visa •••• 4242)', label: '💳 Primary Card', sub: 'Visa •••• 4242' },
              { id: 'PayPal Express', label: '🅿️ PayPal', sub: 'One-click wallet checkout' },
            ].map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    background: isSelected ? 'rgba(255, 157, 22, 0.15)' : '#33312D',
                    border: `1.5px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                    borderRadius: 10,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, margin: 0 }}>{method.label}</p>
                    <p style={{ color: '#C7BFB5', fontSize: 11, margin: 0 }}>{method.sub}</p>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#FF9D16' : '#665946'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF9D16' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Order Summary Breakdown */}
        <div
          style={{
            background: '#24221F',
            border: '1px solid #665946',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#C7BFB5', fontSize: 14 }}>
              {seatCount}× {selectedFormat} ({allocatedSeats.join(', ')})
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${ticketSubtotal}.00</span>
          </div>

          {snackTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#C7BFB5', fontSize: 14 }}>Pre-Ordered Concessions</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${snackTotal}.00</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#C7BFB5', fontSize: 14 }}>Convenience & Tech Fee</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${convenienceFee}.00</span>
          </div>

          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#22C55E', fontSize: 14 }}>VIP Promo Discount ({promoCode})</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>-${promoDiscount}.00</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #3A3731', paddingTop: 12, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16, display: 'block' }}>Total Payable</span>
              <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700 }}>● 256-Bit Cryptographically Locked</span>
            </div>
            <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 28, fontFamily: 'Inter' }}>
              ${total}.00
            </span>
          </div>
        </div>

        {/* 1-Tap Instant Booking CTA */}
        <button
          onClick={handleInstantCheckout}
          disabled={processing}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 14,
            padding: 18,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 22,
            cursor: processing ? 'wait' : 'pointer',
            boxShadow: '0 8px 24px rgba(255, 157, 22, 0.45)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {processing ? 'AUTHORIZING 1-TAP VAULT...' : `⚡ LOCK SEATS & PAY $${total}.00 NOW →`}
        </button>

      </div>
    </div>
  );
}
