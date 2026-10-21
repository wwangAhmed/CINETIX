import { useState, useEffect } from 'react';
import type { Movie, Page, BookingState } from '../types';
import { db } from '../db/database';
import SecurityModal from '../components/SecurityModal';
import CinemaLoader from '../components/CinemaLoader';

interface Props {
  movie: Movie;
  bookingState: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

const BANKS = [
  { id: 'chase', name: 'JPMorgan Chase & Co.', icon: '🏛️', sub: 'Instant Wire / ACH' },
  { id: 'boa', name: 'Bank of America', icon: '🏦', sub: 'Direct Account Sync' },
  { id: 'wells', name: 'Wells Fargo Bank', icon: '🏢', sub: 'Verified Corporate Portal' },
  { id: 'citi', name: 'Citibank N.A.', icon: '🌐', sub: 'Global Swift Clearing' },
  { id: 'capital', name: 'Capital One', icon: '💳', sub: '360 Checking Instant' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, MasterCard, Amex, Discover (3D-Secure 2.0)' },
  { id: 'apple_pay', label: 'Apple Pay / Google Wallet', icon: '⚡', sub: 'One-tap biometric touchless checkout' },
  { id: 'paypal', label: 'PayPal Express', icon: '🅿️', sub: 'Instant authorization with Buyer Protection' },
  { id: 'klarna', label: 'Klarna / Affirm (Pay in 4)', icon: '✨', sub: 'Split total into 4 zero-interest installments' },
  { id: 'wire', label: 'Direct Bank Wire (ACH / Swift)', icon: '🏛️', sub: 'JPMorgan, BoA, Citi, Wells Fargo' },
];

// Luhn formula validation for credit cards
function luhnCheck(num: string): boolean {
  const clean = num.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function Payment({ movie, bookingState, navigate }: Props) {
  const [selectedMethod, setSelectedMethod] = useState('card');

  // Reservation hold timer (10 minutes = 600 seconds)
  const [holdTimer, setHoldTimer] = useState(600);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

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
  const [processingMsg, setProcessingMsg] = useState('SECURING 256-BIT PAYMENT TOKEN...');

  // Bank selection
  const [selectedBank, setSelectedBank] = useState('chase');
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

  // Timer countdown
  useEffect(() => {
    const t = setInterval(() => {
      setHoldTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const timerMin = Math.floor(holdTimer / 60);
  const timerSec = holdTimer % 60;

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
    if (clean.startsWith('4')) return { name: 'VISA', color: '#1A1F71' };
    if (clean.startsWith('5')) return { name: 'MASTERCARD', color: '#EB001B' };
    if (clean.startsWith('3')) return { name: 'AMEX', color: '#0070BA' };
    if (clean.startsWith('6')) return { name: 'DISCOVER', color: '#FF6000' };
    return { name: 'CARD', color: '#665946' };
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
    if (selectedMethod === 'card') {
      const errors: Record<string, string> = {};
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 16) {
        errors.cardNumber = 'Enter a valid 16-digit card number';
      } else if (!luhnCheck(cleanNum)) {
        errors.cardNumber = 'Card number checksum invalid (Luhn algorithm failed)';
      }
      if (!cardName.trim()) errors.cardName = 'Name on card is required';
      if (expiry.length < 5) errors.expiry = 'MM/YY required';
      if (cvv.length < 3) errors.cvv = 'CVV required';

      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;

      // Launch 3D Secure modal
      setShowOtpModal(true);
      return;
    }

    if (selectedMethod === 'apple_pay') {
      setProcessingMsg('VERIFYING BIOMETRIC PASS VIA APPLE PAY...');
      setProcessing(true);
      setTimeout(() => {
        completePayment('Apple Pay Biometric Pass');
      }, 1500);
      return;
    }

    if (selectedMethod === 'paypal') {
      setProcessingMsg('CONNECTING TO PAYPAL ENCRYPTED VAULT...');
      setProcessing(true);
      setTimeout(() => {
        completePayment('PayPal Express (Verified)');
      }, 1600);
      return;
    }

    if (selectedMethod === 'klarna') {
      setProcessingMsg('CONFIRMING KLARNA 4-PAYMENT SPLIT ($' + (total / 4).toFixed(2) + '/mo)...');
      setProcessing(true);
      setTimeout(() => {
        completePayment('Klarna Pay in 4');
      }, 1600);
      return;
    }

    if (selectedMethod === 'wire') {
      if (!selectedBank) {
        setBankError('Please choose your banking institution');
        return;
      }
      setBankError('');
      setProcessingMsg('SECURING DIRECT ACH WIRE CLEARING...');
      setProcessing(true);
      setTimeout(() => {
        completePayment(`Direct Wire (${selectedBank.toUpperCase()})`);
      }, 1700);
      return;
    }
  };

  const handleVerifyOtp = () => {
    if (simulatedOtp.length < 4) {
      setOtpError('Please enter the 4-digit code (e.g. 7492)');
      return;
    }
    setOtpError('');
    setShowOtpModal(false);
    setProcessingMsg('TOKENIZING 3D-SECURE 2.0 TRANSACTION...');
    setProcessing(true);
    setTimeout(() => {
      completePayment(`Card (•••• ${cardNumber.slice(-4)})`);
    }, 1400);
  };

  const completePayment = (methodName: string) => {
    const txnId = `TXN_${Date.now()}`;
    navigate('confirmed', {
      totalAmount: total,
      paymentMethod: methodName,
      discount: discountAmount,
      convenienceFee: fee,
      bookingRef: `CTX-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const cardType = getCardType();

  return (
    <div style={{ minHeight: '100vh', background: '#181715', paddingTop: 84, paddingBottom: 84 }}>
      {processing && <CinemaLoader message={processingMsg} fullScreen={true} />}

      <div className="max-container">

        {/* Live Reservation Security Hold Timer */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(255,157,22,0.12), rgba(36,34,31,0.95))',
            border: '1px solid #FF9D16',
            borderRadius: 14,
            padding: '12px 18px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, margin: 0 }}>
                SEATS RESERVED IN ENCRYPTED VAULT
              </p>
              <p style={{ color: '#C7BFB5', fontSize: 11, margin: 0 }}>
                Seats {seats.join(', ')} are cryptographically locked to prevent double-booking.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#99784B', fontSize: 10, fontWeight: 700, display: 'block' }}>
                HOLD EXPIRES IN
              </span>
              <span style={{ color: '#FF9D16', fontFamily: 'Inter', fontSize: 17, fontWeight: 800 }}>
                {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => setSecurityModalOpen(true)}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                color: '#22C55E',
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>🛡️</span>
              <span>Vault Verified</span>
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(32px, 5vw, 44px)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            SECURE CINEMA CHECKOUT
          </h1>
          <p style={{ color: '#C7BFB5', fontSize: 14, margin: '4px 0 0' }}>
            Choose your preferred international payment method. Protected by 256-bit TLS encryption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Payment Methods & Inputs */}
          <div className="lg:col-span-2">

            {/* Payment Method Selector */}
            <div
              style={{
                background: '#24221F',
                border: '1px solid #665946',
                borderRadius: 16,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em', marginBottom: 12 }}>
                SELECT PAYMENT METHOD
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PAYMENT_METHODS.map((m) => {
                  const isSelected = selectedMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      style={{
                        background: isSelected ? 'rgba(255, 157, 22, 0.12)' : '#33312D',
                        border: `1.5px solid ${isSelected ? '#FF9D16' : '#665946'}`,
                        borderRadius: 12,
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{m.icon}</span>
                        <div>
                          <p style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'Inter' }}>
                            {m.label}
                          </p>
                          <p style={{ color: '#C7BFB5', fontSize: 11, margin: 0 }}>{m.sub}</p>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? '#FF9D16' : '#665946'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF9D16' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Credit / Debit Card Form */}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', margin: 0 }}>
                    ENTER CARD DETAILS
                  </h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'].map((brand) => (
                      <span
                        key={brand}
                        style={{
                          background: cardType.name === brand ? '#FF9D16' : '#33312D',
                          color: cardType.name === brand ? '#181715' : '#C7BFB5',
                          fontSize: 9,
                          fontWeight: 800,
                          padding: '3px 7px',
                          borderRadius: 4,
                          border: '1px solid #665946',
                        }}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Number */}
                <div className="mb-4">
                  <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    CARD NUMBER
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8921"
                      maxLength={19}
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
                        letterSpacing: 1.5,
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#FF9D16',
                      }}
                    >
                      {cardType.name}
                    </span>
                  </div>
                  {cardErrors.cardNumber && (
                    <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{cardErrors.cardNumber}</p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div className="mb-4">
                  <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    CARDHOLDER NAME
                  </label>
                  <input
                    type="text"
                    placeholder="ALEX STERLING"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
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

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', color: '#C7BFB5', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
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
                      CVV / CVC (MASKED)
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
                  <span style={{ color: '#22C55E', fontSize: 13 }}>🔒</span>
                  <span style={{ color: '#99784B', fontSize: 11 }}>
                    Raw card details are encrypted on-device. CINETIX never stores CVVs.
                  </span>
                </div>
              </div>
            )}

            {/* Apple Pay / Google Wallet */}
            {selectedMethod === 'apple_pay' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 28,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 50, marginBottom: 10 }}></div>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 26, letterSpacing: '0.04em' }}>
                  BIOMETRIC 1-TAP EXPRESS CHECKOUT
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 13, maxWidth: 440, margin: '8px auto 18px' }}>
                  Authenticate using Face ID, Touch ID, or Google Passkey. No typing required.
                </p>
                <button
                  onClick={initiatePayment}
                  style={{
                    background: '#FFFFFF',
                    color: '#000000',
                    borderRadius: 12,
                    padding: '14px 32px',
                    fontFamily: 'Inter',
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
                  }}
                >
                  Pay with Pay (${total}.00)
                </button>
              </div>
            )}

            {/* PayPal */}
            {selectedMethod === 'paypal' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 28,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 46, marginBottom: 8, color: '#0070BA' }}>🅿️</div>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 26, letterSpacing: '0.04em' }}>
                  PAYPAL INSTANT CHECKOUT
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 13, maxWidth: 440, margin: '8px auto 18px' }}>
                  Pay securely using your PayPal balance, connected credit card, or bank account.
                </p>
                <button
                  onClick={initiatePayment}
                  style={{
                    background: '#0070BA',
                    color: '#FFFFFF',
                    borderRadius: 12,
                    padding: '13px 32px',
                    fontFamily: 'Inter',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  Authorize via PayPal (${total}.00)
                </button>
              </div>
            )}

            {/* Klarna / Affirm */}
            {selectedMethod === 'klarna' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>✨</span>
                  <div>
                    <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, margin: 0 }}>
                      PAY IN 4 INTEREST-FREE INSTALLMENTS
                    </h3>
                    <p style={{ color: '#C7BFB5', fontSize: 12, margin: 0 }}>No fees when paid on time.</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        background: '#33312D',
                        border: '1px solid #665946',
                        borderRadius: 8,
                        padding: '10px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <span style={{ color: '#99784B', fontSize: 10, fontWeight: 700, display: 'block' }}>
                        DUE {step === 1 ? 'TODAY' : `WK ${step * 2}`}
                      </span>
                      <span style={{ color: '#FF9D16', fontWeight: 800, fontSize: 15 }}>
                        ${(total / 4).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={initiatePayment}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: 12,
                    fontFamily: 'Bebas Neue',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  CONFIRM KLARNA INSTALLMENT PLAN →
                </button>
              </div>
            )}

            {/* Bank Wire / ACH */}
            {selectedMethod === 'wire' && (
              <div
                style={{
                  background: '#24221F',
                  border: '1px solid #665946',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em', marginBottom: 12 }}>
                  SELECT CLEARING INSTITUTION
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
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{b.icon}</span>
                      <div>
                        <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, margin: 0 }}>{b.name}</p>
                        <p style={{ color: '#C7BFB5', fontSize: 10, margin: 0 }}>{b.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {bankError && <p style={{ color: '#EF4444', fontSize: 12 }}>{bankError}</p>}

                <button
                  onClick={initiatePayment}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: 12,
                    fontFamily: 'Bebas Neue',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  AUTHORIZE ACH CLEARING (${total}.00) →
                </button>
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
                    <span style={{ color: '#C7BFB5' }}>Concessions Pre-Order</span>
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
                  placeholder="Promo (e.g. CINETIX)"
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
                {processing ? 'AUTHORIZING TRANSACTION...' : `CONFIRM & PAY $${total}.00 →`}
              </button>

              {/* Security Badges Footer */}
              <div
                onClick={() => setSecurityModalOpen(true)}
                style={{
                  marginTop: 18,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderTop: '1px solid #3A3731',
                  paddingTop: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, color: '#22C55E', fontSize: 11, fontWeight: 700 }}>
                  <span>🛡️</span>
                  <span>PCI-DSS Level 1 · 256-Bit Encrypted</span>
                </div>
                <p style={{ color: '#99784B', fontSize: 10, margin: '3px 0 0' }}>
                  Tap to review our banking security credentials
                </p>
              </div>
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
              3D SECURE 2.0 AUTHENTICATION
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 4, marginBottom: 20 }}>
              A 4-digit token was dispatched to your mobile device for authorization of <strong>${total}.00</strong>.
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
                VERIFY & COMPLETE
              </button>
            </div>
          </div>
        </div>
      )}

      <SecurityModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </div>
  );
}
