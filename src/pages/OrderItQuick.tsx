import { useState, useMemo, useEffect } from 'react';
import type { Movie, Page, BookingState, Showtime } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';
import CinemaLoader from '../components/CinemaLoader';
import DynamicQRCode from '../components/DynamicQRCode';

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

  // 1. Flow Step: 'configure' -> 'bank_qr' -> (quick-confirmed: ticket in QR)
  const [checkoutStep, setCheckoutStep] = useState<'configure' | 'bank_qr'>('configure');
  const [bankRef, setBankRef] = useState(`CTX-BNK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bankTimer, setBankTimer] = useState(300);

  // 2. Dynamic Movie Selection
  const [currentMovieId, setCurrentMovieId] = useState(movie.id || allMovies[0]?.id || 'the-last-signal');
  const activeMovie = allMovies.find((m) => m.id === currentMovieId) || allMovies[0];

  // 3. Dynamic Date Selection
  const [selectedDate, setSelectedDate] = useState(MOVIE_DATES[0] || 'Today');

  // 4. Dynamic Showtime Selection
  const [selectedTime, setSelectedTime] = useState('08:00 PM');

  // 5. Dynamic Format Selection
  const [selectedFormat, setSelectedFormat] = useState('IMAX 3D Laser');

  // 6. Dynamic Seat Count
  const [seatCount, setSeatCount] = useState(2);

  // 7. Concessions Quick Add
  const [snackQty, setSnackQty] = useState<Record<string, number>>({});

  // 8. Dynamic Promo Code
  const [promoCode, setPromoCode] = useState('CINETIX30');
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(39);
  const [promoMessage, setPromoMessage] = useState('30% Special Discount Applied!');

  // 9. Processing Loader
  const [processing, setProcessing] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('CONNECTING TO SECURE BANK CLEARING GATEWAY...');

  // Bank countdown timer
  useEffect(() => {
    if (checkoutStep !== 'bank_qr') return;
    if (bankTimer <= 0) return;
    const interval = setInterval(() => {
      setBankTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutStep, bankTimer]);

  const bankMinutes = Math.floor(bankTimer / 60);
  const bankSeconds = bankTimer % 60;

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

  // Bank QR Payload (Instant Bank & Wallet Transfer protocol)
  const bankQRPayload = `cinetix://bank-pay?ref=${bankRef}&amount=${total}&currency=USD&payee=CINETIX_ENTERTAINMENT_CORP&account=482910482&routing=021000021&hash=tls256_fednow&time=${Date.now()}`;

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

  const handleProceedToBankQR = () => {
    setBankRef(`CTX-BNK-${Math.floor(1000 + Math.random() * 9000)}`);
    setBankTimer(300);
    setCheckoutStep('bank_qr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBankPayment = (simulated = false) => {
    setProcessing(true);
    setLoaderMessage(
      simulated
        ? 'SIMULATING MOBILE BANKING APP BIOMETRIC AUTHORIZATION...'
        : 'VERIFYING INCOMING BANK TRANSFER & CLEARING SEATS...'
    );

    setTimeout(() => {
      setLoaderMessage('PAYMENT CONFIRMED! GENERATING CINEMA TICKET IN QR FORMAT...');

      setTimeout(() => {
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
          paymentMethod: 'Instant Bank QR Transfer (FedNow / 256-Bit TLS)',
        });

        setProcessing(false);

        // Transition to Ticket in QR format!
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
      }, 700);
    }, 1300);
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      {processing && (
        <CinemaLoader
          message={loaderMessage}
          fullScreen={true}
        />
      )}

      {/* ================= STEP 2: BANK PAYMENT QR SCREEN ================= */}
      {checkoutStep === 'bank_qr' ? (
        <div className="max-container" style={{ maxWidth: 620 }}>
          {/* Header & Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setCheckoutStep('configure')}
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
              ← Back to Edit Booking
            </button>
            <div>
              <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                STEP 2 OF 3: BANK & WALLET PAYMENT
              </p>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px, 5vw, 36px)', letterSpacing: '0.04em', color: '#FFFFFF', margin: 0 }}>
                SCAN BANK PAYMENT QR
              </h1>
            </div>
          </div>

          {/* Stepper progress indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#24221F',
              borderRadius: 12,
              padding: '12px 18px',
              marginBottom: 20,
              border: '1px solid #665946',
              fontSize: 12,
            }}
          >
            <span style={{ color: '#22C55E', fontWeight: 700 }}>✓ 1. Seats Selected</span>
            <span style={{ color: '#99784B' }}>➔</span>
            <span style={{ color: '#FF9D16', fontWeight: 800 }}>● 2. Bank QR Payment</span>
            <span style={{ color: '#99784B' }}>➔</span>
            <span style={{ color: '#665946', fontWeight: 600 }}>○ 3. Ticket QR Pass</span>
          </div>

          {/* Main Bank Payment Card */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 20,
              padding: '28px 24px',
              border: '1.5px solid #FF9D16',
              boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(255,157,22,0.2)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {/* Security Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 157, 22, 0.12)',
                border: '1px solid #FF9D16',
                borderRadius: 20,
                padding: '5px 14px',
                marginBottom: 16,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em' }}>
                256-BIT TLS 1.3 SECURE BANK & WALLET GATEWAY
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: 34,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              SCAN TO PAY ${total}.00
            </h2>
            <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 4, marginBottom: 20 }}>
              Scan QR code with your Mobile Banking App (Chase, Bank of America, Citi, Wells Fargo, Revolut, Barclays, HSBC) or Apple/Google Wallet
            </p>

            {/* Bank QR Code Container with Scan Beam */}
            <div
              style={{
                background: '#181715',
                borderRadius: 16,
                padding: '22px 16px',
                display: 'inline-block',
                border: '1px solid #665946',
                marginBottom: 20,
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)',
              }}
            >
              <DynamicQRCode data={bankQRPayload} size={210} showScanBeam={true} />
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF9D16' }} />
                <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                  BANK PAYMENT QR CODE ACTIVE
                </span>
              </div>
            </div>

            {/* Bank Transfer Clearing Specs */}
            <div
              style={{
                background: '#181715',
                borderRadius: 14,
                padding: '16px 20px',
                border: '1px solid #3A3731',
                textAlign: 'left',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#99784B', fontSize: 12 }}>Payee / Beneficiary:</span>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>CINETIX ENTERTAINMENT CORP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#99784B', fontSize: 12 }}>Bank Clearing Network:</span>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>JPMorgan Chase · FedNow / ACH Direct</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#99784B', fontSize: 12 }}>Bank Account Number:</span>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>•••• •••• 4829</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#99784B', fontSize: 12 }}>Routing / SWIFT-BIC:</span>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>021000021 / CTNXUS33</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #33312D', paddingTop: 6 }}>
                <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>Payment Reference ID:</span>
                <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>{bankRef}</span>
              </div>
            </div>

            {/* Countdown Hold Timer & Pulse */}
            <div
              style={{
                background: '#33312D',
                borderRadius: 12,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                border: '1px solid #665946',
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 600 }}>
                  Awaiting incoming bank webhook signal...
                </span>
              </div>
              <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 15, fontFamily: 'Inter' }}>
                ⏱ {String(bankMinutes).padStart(2, '0')}:{String(bankSeconds).padStart(2, '0')}
              </span>
            </div>

            {/* Actions: Confirm Payment or Simulate Bank App Scan */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleConfirmBankPayment(false)}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 14,
                  padding: 16,
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 20,
                  cursor: processing ? 'wait' : 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 157, 22, 0.45)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ✓ I HAVE SENT / CONFIRM BANK PAYMENT (${total}.00) →
              </button>

              <button
                onClick={() => handleConfirmBankPayment(true)}
                disabled={processing}
                style={{
                  width: '100%',
                  background: '#33312D',
                  color: '#FF9D16',
                  border: '1px solid #FF9D16',
                  borderRadius: 12,
                  padding: 13,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: processing ? 'wait' : 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#443F38'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#33312D'; }}
              >
                📱 Simulate Banking App Instant Scan & Authorization
              </button>
            </div>

            <p style={{ color: '#99784B', fontSize: 11, marginTop: 14 }}>
              Once confirmed, your official Cinema Admission Ticket will be generated immediately in QR format.
            </p>
          </div>
        </div>
      ) : (
        /* ================= STEP 1: CONFIGURATION SCREEN ================= */
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
                Skip the Line · Best Center Recliner Seats Auto-Reserved
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
                <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, marginBottom: 6 }}>
                  Choose Active Cinema Title:
                </label>
                <select
                  value={currentMovieId}
                  onChange={(e) => setCurrentMovieId(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#33312D',
                    color: '#FFFFFF',
                    border: '1px solid #665946',
                    borderRadius: 10,
                    padding: '12px 14px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {allMovies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.rating}★ · {m.duration} · {m.genre.join(', ')})
                    </option>
                  ))}
                </select>
                <p style={{ color: '#99784B', fontSize: 12, marginTop: 6 }}>
                  {activeMovie.certificate} · {activeMovie.language} · Directed by {activeMovie.director}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Dynamic Performance Date */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #665946',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                STEP 2: SELECT DATE
              </span>
              <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700 }}>Next 14 Days Open</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-2">
              {MOVIE_DATES.slice(0, 7).map((d) => {
                const isSelected = selectedDate === d;
                const dateObj = new Date(d);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    style={{
                      background: isSelected ? '#FF9D16' : '#33312D',
                      border: `1px solid ${isSelected ? '#FF9D16' : '#4D473F'}`,
                      color: isSelected ? '#181715' : '#FFFFFF',
                      borderRadius: 12,
                      padding: '10px 14px',
                      minWidth: 70,
                      flexShrink: 0,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: 0, opacity: 0.85 }}>
                      {dayName}
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 900, margin: '2px 0', lineHeight: 1 }}>
                      {dayNum}
                    </p>
                    <p style={{ fontSize: 10, fontWeight: 600, margin: 0, opacity: 0.85 }}>
                      {monthName}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Screen Format Selector */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #665946',
            }}
          >
            <span style={{ display: 'block', color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              STEP 3: AUDITORIUM FORMAT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FORMAT_OPTIONS.map((f) => {
                const isSel = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    style={{
                      background: isSel ? 'rgba(255, 157, 22, 0.18)' : '#33312D',
                      border: `1.5px solid ${isSel ? '#FF9D16' : '#4D473F'}`,
                      borderRadius: 12,
                      padding: 14,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span style={{ background: '#FF9D16', color: '#181715', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                        {f.tag}
                      </span>
                      <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 15 }}>
                        ${f.price}
                      </span>
                    </div>
                    <p style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15, margin: 0 }}>
                      {f.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Showtime Picker */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #665946',
            }}
          >
            <span style={{ display: 'block', color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              STEP 4: SHOWTIME
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['01:30 PM', '04:45 PM', '08:00 PM', '11:15 PM'].map((t) => {
                const isSel = selectedTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      background: isSel ? '#FF9D16' : '#33312D',
                      border: `1.5px solid ${isSel ? '#FF9D16' : '#4D473F'}`,
                      color: isSel ? '#181715' : '#FFFFFF',
                      borderRadius: 10,
                      padding: '12px 10px',
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Guests & Acoustically Optimal Seats */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1.5px solid #FF9D16',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                STEP 5: GUEST COUNT & SMART SEAT ALLOCATION
              </span>
              <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700 }}>
                ● Best View Center Seats Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {SEAT_TIERS.map((tier) => {
                const isSel = seatCount === tier.count;
                return (
                  <button
                    key={tier.count}
                    onClick={() => setSeatCount(tier.count)}
                    style={{
                      background: isSel ? '#FF9D16' : '#33312D',
                      border: `1px solid ${isSel ? '#FF9D16' : '#4D473F'}`,
                      color: isSel ? '#181715' : '#FFFFFF',
                      borderRadius: 10,
                      padding: '10px 8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            {/* Allocated Seat Badges */}
            <div
              style={{
                background: '#181715',
                borderRadius: 12,
                padding: '14px 18px',
                border: '1px solid #4D473F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p style={{ color: '#C7BFB5', fontSize: 12, margin: 0 }}>
                  Optimal Center-View VIP Recliners:
                </p>
                <div className="flex gap-2 mt-1">
                  {allocatedSeats.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: '#FF9D16',
                        color: '#181715',
                        fontWeight: 900,
                        fontSize: 14,
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontFamily: 'monospace',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ color: '#99784B', fontSize: 12 }}>
                Row {allocatedSeats[0]?.charAt(0)} · Perfect Sightline
              </span>
            </div>
          </div>

          {/* 6. Concessions Quick Add-ons */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #665946',
            }}
          >
            <span style={{ display: 'block', color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              STEP 6: QUICK CONCESSIONS DINING (OPTIONAL)
            </span>
            <div className="flex flex-col gap-3">
              {QUICK_SNACKS.map((snack) => {
                const qty = snackQty[snack.id] || 0;
                return (
                  <div
                    key={snack.id}
                    style={{
                      background: '#33312D',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: `1px solid ${qty > 0 ? '#FF9D16' : '#4D473F'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 24 }}>{snack.icon}</span>
                      <div>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 14, margin: 0 }}>
                          {snack.name}
                        </p>
                        <p style={{ color: '#FF9D16', fontSize: 13, fontWeight: 800, margin: 0 }}>
                          ${snack.price}.00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {qty > 0 && (
                        <button
                          onClick={() => handleUpdateSnack(snack.id, -1)}
                          style={{
                            width: 32,
                            height: 32,
                            background: '#24221F',
                            border: '1px solid #665946',
                            color: '#FFFFFF',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontWeight: 800,
                          }}
                        >
                          -
                        </button>
                      )}
                      {qty > 0 && (
                        <span style={{ color: '#FFFFFF', fontWeight: 800, minWidth: 20, textAlign: 'center' }}>
                          {qty}
                        </span>
                      )}
                      <button
                        onClick={() => handleUpdateSnack(snack.id, 1)}
                        style={{
                          background: '#FF9D16',
                          color: '#181715',
                          borderRadius: 6,
                          padding: '6px 14px',
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: 'pointer',
                          border: 'none',
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Promo Voucher */}
          <div
            style={{
              background: '#24221F',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid #665946',
            }}
          >
            <span style={{ display: 'block', color: '#99784B', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              STEP 7: VIP VOUCHER CODE
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Promo Code (e.g. CINETIX30)"
                style={{
                  flex: 1,
                  background: '#33312D',
                  border: '1px solid #665946',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              />
              <button
                onClick={handleApplyPromo}
                style={{
                  background: '#FF9D16',
                  color: '#181715',
                  borderRadius: 10,
                  padding: '10px 20px',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p style={{ color: promoApplied ? '#22C55E' : '#EF4444', fontSize: 12, marginTop: 6, fontWeight: 600 }}>
                {promoMessage}
              </p>
            )}
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
                <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 700 }}>● Instant Reservation Confirmed</span>
              </div>
              <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 28, fontFamily: 'Inter' }}>
                ${total}.00
              </span>
            </div>
          </div>

          {/* 1-Tap Bank QR CTA */}
          <button
            onClick={handleProceedToBankQR}
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
            ⚡ PROCEED TO 1-CLICK BANK PAYMENT QR (${total}.00) →
          </button>

        </div>
      )}
    </div>
  );
}
