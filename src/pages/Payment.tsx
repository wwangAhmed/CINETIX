import { useState } from 'react';
import type { Movie, Page, BookingState } from '../types';
import { db } from '../db/database';

interface Props {
  movie: Movie;
  bookingState: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

const BANKS = [
  { id: 'chase', name: 'JPMorgan Chase', icon: '🏛️' },
  { id: 'boa', name: 'Bank of America', icon: '🏦' },
  { id: 'wells', name: 'Wells Fargo', icon: '🏢' },
  { id: 'citi', name: 'Citibank', icon: '🌐' },
  { id: 'capital', name: 'Capital One', icon: '💳' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Instant 3D-Secure Visa, MC, Amex' },
  { id: 'upi_qr', label: 'UPI / Scan QR Code', icon: '📱', sub: 'GPay, PhonePe, Paytm, Any UPI' },
  { id: 'apple_pay', label: 'Apple Pay / Google Wallet', icon: '⚡', sub: 'One-tap biometric checkout' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏛️', sub: 'Direct bank portal authorization' },
];

export default function Payment({ movie, bookingState, navigate }: Props) {
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // 3D Secure Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');
  const [bankError, setBankError] = useState('');

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const seats = bookingState.selectedSeats.length ? bookingState.selectedSeats : ['E4', 'E5'];
  const showtime = bookingState.showtime;
  const ticketPrice = showtime?.price || 55;
  const ticketTotal = seats.length * ticketPrice;
  const foodTotal = (bookingState.foodItems || []).reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const fee = Math.round(ticketTotal * 0.05);
  const total = Math.max(0, ticketTotal + foodTotal + fee - discountAmount);

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const getCardType = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const handleApplyPromo = () => {
    const res = db.validatePromo(promoInput, ticketTotal);
    if (res.valid) {
      setDiscountAmount(res.discount);
      setPromoMessage(res.message);
    } else {
      setPromoMessage(res.message);
    }
  };

  const initiatePayment = () => {
    if (selectedMethod === 'upi_qr') {
      navigate('qr-payment', {
        totalAmount: total,
        paymentMethod: 'UPI / Dynamic QR',
        discount: discountAmount,
      });
      return;
    }

    if (selectedMethod === 'card') {
      const errors: Record<string, string> = {};
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardName.trim()) errors.cardName = 'Name on card is required';
      if (expiry.length < 5) errors.expiry = 'MM/YY required';
      if (cvv.length < 3) errors.cvv = 'CVV required';

      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;

      // Launch 3D Secure modal
      setShowOtpModal(true);
      return;
    }

    if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        setBankError('Please select a bank to proceed');
        return;
      }
      setBankError('');
      setProcessing(true);
      setTimeout(() => {
        completePayment(`Net Banking (${selectedBank.toUpperCase()})`);
      }, 1500);
      return;
    }

    if (selectedMethod === 'apple_pay') {
      setProcessing(true);
      setTimeout(() => {
        completePayment('Apple Pay Biometric Pass');
      }, 1200);
      return;
    }
  };

  const handleVerifyOtp = () => {
    if (simulatedOtp.length < 4) {
      setOtpError('Please enter a 4-digit code (e.g. 7492)');
      return;
    }
    setOtpError('');
    setShowOtpModal(false);
    setProcessing(true);
    setTimeout(() => {
      completePayment(`Card (•••• ${cardNumber.slice(-4)})`);
    }, 1200);
  };

  const completePayment = (methodName: string) => {
    const txnId = `TXN_${Date.now()}`;
    navigate('confirmed', {
      totalAmount: total,
      paymentMethod: methodName,
      discount: discountAmount,
      convenienceFee: fee,
    });
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
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
              SECURE CHECKOUT & PAYMENT
            </h1>
            <p style={{ color: '#C7BFB5', fontSize: 13 }}>
              256-Bit Encrypted Transaction · Cinetix High-Speed Gateway
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Payment Methods & Forms */}
          <div className="lg:col-span-2">

            {/* Payment Method Selector */}
            <div
              style={{
                background: '#24221F',
                border: '1px solid #665946',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 14 }}>
                SELECT PAYMENT METHOD
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const selected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        background: selected ? 'rgba(255, 157, 22, 0.12)' : '#33312D',
                        border: `1.5px solid ${selected ? '#FF9D16' : '#4D473F'}`,
                        borderRadius: 12,
                        padding: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{method.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: selected ? '#FF9D16' : '#FFFFFF', fontWeight: 700, fontSize: 14 }}>
                          {method.label}
                        </p>
                        <p style={{ color: '#C7BFB5', fontSize: 11 }}>{method.sub}</p>
                      </div>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: `2px solid ${selected ? '#FF9D16' : '#665946'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF9D16' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Credit / Debit Card Interactive Form */}
            {selectedMethod === 'card' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                {/* Visual Virtual Card Preview */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #33312D 0%, #181715 100%)',
                    border: '1px solid #FF9D16',
                    borderRadius: 16,
                    padding: 22,
                    maxWidth: 380,
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <span style={{ fontFamily: 'Bebas Neue', color: '#FF9D16', fontSize: 20, letterSpacing: '0.06em' }}>
                      CINETIX PLATINUM
                    </span>
                    <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 12, letterSpacing: 1 }}>
                      {getCardType()}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 19, letterSpacing: 3, color: '#FFFFFF', marginBottom: 18, fontWeight: 600 }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#99784B', fontSize: 9 }}>CARDHOLDER</p>
                      <p style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                        {cardName || 'YOUR NAME'}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#99784B', fontSize: 9 }}>EXPIRES</p>
                      <p style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>
                        {expiry || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: `1px solid ${cardErrors.cardNumber ? '#EF4444' : '#665946'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontFamily: 'Inter',
                      }}
                    />
                    {cardErrors.cardNumber && (
                      <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{cardErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Sterling"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: `1px solid ${cardErrors.cardName ? '#EF4444' : '#665946'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                      }}
                    />
                    {cardErrors.cardName && (
                      <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{cardErrors.cardName}</p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: `1px solid ${cardErrors.expiry ? '#EF4444' : '#665946'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                      }}
                    />
                    {cardErrors.expiry && (
                      <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{cardErrors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: `1px solid ${cardErrors.cvv ? '#EF4444' : '#665946'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                      }}
                    />
                    {cardErrors.cvv && (
                      <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UPI QR Option */}
            {selectedMethod === 'upi_qr' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: 44 }}>📲</span>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, marginTop: 8, letterSpacing: '0.04em' }}>
                  INSTANT SCAN & PAY VIA UPI
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 14, maxWidth: 440, margin: '8px auto 18px' }}>
                  A dynamic, time-limited QR code will be generated specifically for your ${total}.00 cinema booking.
                </p>
                <button
                  onClick={initiatePayment}
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: '12px 28px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                  }}
                >
                  GENERATE PAYMENT QR NOW →
                </button>
              </div>
            )}

            {/* Net Banking */}
            {selectedMethod === 'netbanking' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 12 }}>
                  SELECT YOUR BANKING INSTITUTION
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {BANKS.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => { setSelectedBank(b.id); setBankError(''); }}
                      style={{
                        background: selectedBank === b.id ? 'rgba(255,157,22,0.15)' : '#33312D',
                        border: `1.5px solid ${selectedBank === b.id ? '#FF9D16' : '#665946'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{b.icon}</span>
                      <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{b.name}</span>
                    </div>
                  ))}
                </div>
                {bankError && <p style={{ color: '#EF4444', fontSize: 12 }}>{bankError}</p>}
              </div>
            )}

            {/* Apple Pay */}
            {selectedMethod === 'apple_pay' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: 44 }}></span>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, marginTop: 8 }}>
                  1-TOUCH APPLE PAY CHECKOUT
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 14, margin: '8px auto 18px' }}>
                  Double-click side button or confirm with Touch ID for instant booking.
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary & Promo */}
          <div>
            <div
              style={{
                background: '#24221F',
                border: '1px solid #665946',
                borderRadius: 16,
                padding: 22,
                position: 'sticky',
                top: 90,
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 14 }}>
                ORDER BREAKDOWN
              </h3>

              <div style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #3A3731' }}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #665946' }}
                />
                <div>
                  <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 18, letterSpacing: '0.04em' }}>
                    {bookingState.movieTitle || movie.title}
                  </h4>
                  <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>
                    {showtime?.format || 'IMAX 3D'} · {seats.length} Seats
                  </p>
                  <p style={{ color: '#C7BFB5', fontSize: 11 }}>
                    Seats: {seats.join(', ')}
                  </p>
                </div>
              </div>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#C7BFB5' }}>Tickets ({seats.length}× ${ticketPrice})</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${ticketTotal}.00</span>
                </div>
                {foodTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#C7BFB5' }}>Concessions & Snacks</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${foodTotal}.00</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#C7BFB5' }}>Convenience & Tech Fee</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>${fee}.00</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#22C55E' }}>Discount Voucher</span>
                    <span style={{ color: '#22C55E', fontWeight: 700 }}>-${discountAmount}.00</span>
                  </div>
                )}
              </div>

              {/* Promo input */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#33312D',
                    border: '1px solid #665946',
                    borderRadius: 8,
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontSize: 12,
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{
                    background: '#33312D',
                    border: '1px solid #FF9D16',
                    color: '#FF9D16',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p style={{ color: discountAmount > 0 ? '#22C55E' : '#FF9D16', fontSize: 11, marginBottom: 14 }}>
                  {promoMessage}
                </p>
              )}

              {/* Total & Submit */}
              <div style={{ borderTop: '1px solid #3A3731', paddingTop: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16 }}>Total Payable</span>
                  <span style={{ color: '#FF9D16', fontWeight: 900, fontSize: 26, fontFamily: 'Inter' }}>
                    ${total}.00
                  </span>
                </div>
              </div>

              <button
                onClick={initiatePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 20,
                  cursor: processing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 157, 22, 0.4)',
                }}
              >
                {processing ? 'PROCESSING PAYMENT...' : `CONFIRM & PAY $${total}.00`}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 3D-Secure OTP Simulation Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#24221F',
              border: '1px solid #FF9D16',
              borderRadius: 20,
              padding: 32,
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 26, letterSpacing: '0.04em' }}>
              3D SECURE AUTHENTICATION
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 4, marginBottom: 20 }}>
              A 4-digit code was sent to your registered mobile device for authorization of <strong>${total}.00</strong>.
            </p>

            <input
              type="text"
              maxLength={4}
              placeholder="7492"
              value={simulatedOtp}
              onChange={(e) => setSimulatedOtp(e.target.value)}
              style={{
                width: '100%',
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 10,
                padding: 14,
                color: '#FF9D16',
                fontSize: 24,
                letterSpacing: 8,
                textAlign: 'center',
                fontWeight: 800,
                marginBottom: 12,
              }}
            />
            {otpError && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 10 }}>{otpError}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowOtpModal(false)}
                style={{
                  flex: 1,
                  background: '#33312D',
                  color: '#C7BFB5',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: 12,
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.05em',
                  fontSize: 18,
                }}
              >
                VERIFY & PAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
