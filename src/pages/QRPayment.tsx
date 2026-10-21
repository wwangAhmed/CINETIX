import { useState, useEffect, useRef } from 'react';
import type { Page, BookingState } from '../types';
import DynamicQRCode from '../components/DynamicQRCode';
import { db } from '../db/database';

interface Props {
  bookingState?: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

export default function QRPayment({ bookingState, navigate }: Props) {
  const [timer, setTimer] = useState(300);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');

  const total = bookingState?.totalAmount || 140;
  const rawRef = useRef(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
  const upiId = 'cinetix.theatres@hdfcbank';
  const qrPayload = `upi://pay?pa=${upiId}&pn=Cinetix%20Cinemas&am=${total}.00&cu=USD&tn=Cinetix%20Ticket%20${rawRef.current}`;

  useEffect(() => {
    if (timer <= 0) {
      navigate('payment');
      return;
    }
    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timer, navigate]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmPaid = () => {
    setStatus('verifying');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        navigate('confirmed', {
          totalAmount: total,
          paymentMethod: 'UPI Instant Scan (Auto-Verified)',
          bookingRef: rawRef.current,
        });
      }, 900);
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#181715',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#24221F',
          borderRadius: 20,
          padding: '36px 32px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          border: '1px solid #665946',
          boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
        }}
      >
        <span style={{ fontSize: 32 }}>📲</span>
        <h2
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: 32,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            marginTop: 6,
            marginBottom: 4,
          }}
        >
          SCAN DYNAMIC PAYMENT QR
        </h2>
        <p style={{ color: '#C7BFB5', fontSize: 13, marginBottom: 20 }}>
          Open Google Pay, PhonePe, Paytm, or any UPI app to authorize <strong>${total}.00</strong>
        </p>

        {/* Dynamic QR Code */}
        <div style={{ margin: '0 auto 20px', display: 'inline-block' }}>
          <DynamicQRCode data={qrPayload} size={210} showScanBeam={true} />
        </div>

        {/* Countdown Timer */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #4D473F',
            borderRadius: 12,
            padding: '10px 18px',
            marginBottom: 16,
            display: 'inline-block',
          }}
        >
          <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
            QR Code Expires In
          </p>
          <p
            style={{
              color: timer < 60 ? '#EF4444' : '#FF9D16',
              fontWeight: 800,
              fontSize: 24,
              fontFamily: 'Inter',
              marginTop: 2,
            }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>

        {/* UPI ID copy */}
        <div
          style={{
            background: '#1D1C19',
            border: '1px solid #4D473F',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#99784B', fontSize: 10, fontWeight: 600 }}>UPI VPA</p>
            <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{upiId}</p>
          </div>
          <button
            onClick={handleCopyUpi}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              color: '#FF9D16',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {copiedUpi ? 'COPIED! ✓' : 'COPY'}
          </button>
        </div>

        {/* Security badge */}
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#22C55E', fontSize: 14 }}>🔒</span>
          <span style={{ color: '#22C55E', fontWeight: 600, fontSize: 12 }}>
            Secured by Cinetix Instant FastPay
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={handleConfirmPaid}
          disabled={status !== 'waiting'}
          style={{
            width: '100%',
            background: status === 'success'
              ? '#22C55E'
              : 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 12,
            padding: 14,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 20,
            marginBottom: 10,
            boxShadow: '0 4px 16px rgba(255, 157, 22, 0.35)',
            cursor: status === 'waiting' ? 'pointer' : 'wait',
          }}
        >
          {status === 'verifying'
            ? 'VERIFYING BANK CLEARANCE...'
            : status === 'success'
            ? '✓ PAYMENT CONFIRMED!'
            : `I HAVE COMPLETED PAYMENT ($${total}.00) →`}
        </button>

        <button
          onClick={() => navigate('payment')}
          style={{ background: 'none', color: '#C7BFB5', fontSize: 13, border: 'none' }}
        >
          ← Choose another payment option
        </button>
      </div>
    </div>
  );
}
