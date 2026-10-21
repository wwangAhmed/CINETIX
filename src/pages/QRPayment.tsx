import { useState, useEffect, useRef } from 'react';
import type { Page, BookingState } from '../types';
import DynamicQRCode from '../components/DynamicQRCode';

interface Props {
  bookingState?: BookingState;
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
}

export default function QRPayment({ bookingState, navigate }: Props) {
  const [timer, setTimer] = useState(300);
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');

  const total = bookingState?.totalAmount || 140;
  const rawRef = useRef(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
  const qrPayload = `https://cinetix.cinema/checkout/express?ref=${rawRef.current}&amt=${total}&cur=USD&sec=tls256`;

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

  const handleConfirmPaid = () => {
    setStatus('verifying');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        navigate('confirmed', {
          totalAmount: total,
          paymentMethod: 'Express Mobile QR (Apple / Google Wallet)',
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
          SCAN EXPRESS PAYMENT QR
        </h2>
        <p style={{ color: '#C7BFB5', fontSize: 13, marginBottom: 20 }}>
          Open your phone camera, Apple Wallet, or PayPal app to authorize <strong>${total}.00</strong>
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
            Token Expires In
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

        {/* Compatible Wallets */}
        <div
          style={{
            background: '#1D1C19',
            border: '1px solid #33312D',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            color: '#C7BFB5',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span> Apple Wallet</span>
          <span style={{ color: '#4D473F' }}>•</span>
          <span>Google Wallet</span>
          <span style={{ color: '#4D473F' }}>•</span>
          <span>PayPal</span>
        </div>

        {/* Verification Status */}
        {status === 'waiting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleConfirmPaid}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                color: '#181715',
                borderRadius: 12,
                padding: 14,
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 19,
                boxShadow: '0 4px 16px rgba(255, 157, 22, 0.4)',
                cursor: 'pointer',
              }}
            >
              SIMULATE SCAN & CONFIRM PAYMENT ✓
            </button>
            <button
              onClick={() => navigate('payment')}
              style={{ color: '#C7BFB5', fontSize: 13, background: 'none' }}
            >
              ← Choose another payment method
            </button>
          </div>
        )}

        {status === 'verifying' && (
          <div style={{ padding: '10px 0' }}>
            <div
              style={{
                width: 24,
                height: 24,
                border: '3px solid #665946',
                borderTopColor: '#FF9D16',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 10px',
              }}
            />
            <p style={{ color: '#FF9D16', fontWeight: 700, fontSize: 14 }}>
              Verifying Mobile Payment Authorization...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ padding: '10px 0' }}>
            <span style={{ color: '#22C55E', fontSize: 24 }}>✓</span>
            <p style={{ color: '#22C55E', fontWeight: 800, fontSize: 16 }}>
              Payment Authorized! Generating Gate Pass...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
