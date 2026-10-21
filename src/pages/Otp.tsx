import { useState, useRef, useEffect } from 'react';
import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

export default function Otp({ navigate }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (next.every((v) => v) && next.join('').length === 6) {
      setTimeout(() => navigate('home'), 300);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const resend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181715',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#24221F',
          borderRadius: 24,
          padding: 40,
          width: '100%',
          maxWidth: 440,
          border: '1px solid #665946',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        <div className="text-center mb-8">
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
              color: '#181715',
              boxShadow: '0 0 20px rgba(255,157,22,0.3)',
            }}
          >
            🔒
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
            VERIFY CINETIX PASSCODE
          </h1>
          <p style={{ color: '#C7BFB5', fontSize: 13 }}>
            A 6-digit access code was sent to your registered account
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 30 }}>
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              type="text"
              inputMode="numeric"
              style={{
                width: 48,
                height: 56,
                textAlign: 'center',
                background: '#33312D',
                border: `2px solid ${val ? '#FF9D16' : '#665946'}`,
                borderRadius: 10,
                color: '#FF9D16',
                fontSize: 22,
                fontWeight: 800,
                boxShadow: val ? '0 0 8px rgba(255,157,22,0.4)' : 'none',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('home')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 10,
            padding: 14,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 20,
            marginBottom: 16,
          }}
        >
          AUTHENTICATE & ENTER
        </button>

        <p style={{ textAlign: 'center', color: '#C7BFB5', fontSize: 13 }}>
          {canResend ? (
            <button
              onClick={resend}
              style={{ color: '#FF9D16', fontWeight: 700, background: 'none' }}
            >
              Resend verification code
            </button>
          ) : (
            <span>Resend code in {timer}s</span>
          )}
        </p>
      </div>
    </div>
  );
}
