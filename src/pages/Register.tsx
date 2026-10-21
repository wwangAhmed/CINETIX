import { useState } from 'react';
import type { Page } from '../types';
import CinetixLogo from '../components/CinetixLogo';
import { db } from '../db/database';
import SecurityModal from '../components/SecurityModal';

interface Props {
  navigate: (page: Page) => void;
}

export default function Register({ navigate }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('IMAX 3D');
  const [agreed, setAgreed] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: '#665946', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#EF4444', width: '30%' };
    if (password.length < 10) return { label: 'Good', color: '#FF9D16', width: '70%' };
    return { label: 'Strong (256-Bit Salted)', color: '#22C55E', width: '100%' };
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreed) newErrors.agreed = 'Please accept Cinetix terms and security agreement';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      // Register into local SQLite state
      db.registerUser({
        name,
        email,
        phone: phone || '+1 (555) 019-2834',
        preferredFormat,
      });

      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('home');
      }, 1400);
    }, 1200);
  };

  const strength = getPasswordStrength();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181715',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '30px 20px',
      }}
    >
      {/* Background Ambience */}
      <img
        src="/assets/cinetix-hero.jpg"
        alt="Cinetix Luxury Hall"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.16,
          filter: 'blur(3px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(36,34,31,0.7) 0%, #181715 85%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 520 }}>
        <div
          style={{
            background: 'rgba(36, 34, 31, 0.96)',
            backdropFilter: 'blur(16px)',
            borderRadius: 24,
            padding: '36px 32px',
            border: '1px solid #665946',
            boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          }}
        >
          {/* Brand & Title */}
          <div className="text-center mb-6 flex flex-col items-center">
            <CinetixLogo height={42} />
            <h1
              style={{
                fontFamily: 'Bebas Neue',
                fontSize: 34,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                marginTop: 14,
                marginBottom: 2,
              }}
            >
              CREATE VIP PASS ACCOUNT
            </h1>
            <p style={{ color: '#C7BFB5', fontSize: 13 }}>
              Unlock instant 1-tap booking, seat locking & 500 Welcome Points
            </p>
          </div>

          {/* Welcome Perks Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 157, 22, 0.15), rgba(204, 144, 59, 0.08))',
              border: '1px solid #FF9D16',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>🎁</span>
            <div>
              <p style={{ color: '#FF9D16', fontWeight: 800, fontSize: 12, margin: 0 }}>
                NEW MEMBER EXCLUSIVE PRIVILEGE
              </p>
              <p style={{ color: '#FFFFFF', fontSize: 12, margin: 0 }}>
                Get <strong>500 VIP Points</strong> + <strong>$25 Welcome Credit</strong> automatically on signup!
              </p>
            </div>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 25px rgba(255,157,22,0.6)',
                }}
              >
                ✓
              </div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#FFFFFF', marginBottom: 6 }}>
                WELCOME TO CINETIX VIP!
              </h2>
              <p style={{ color: '#22C55E', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                Account successfully created with 500 VIP Points credited.
              </p>
              <p style={{ color: '#C7BFB5', fontSize: 12 }}>Redirecting you to cinema showcase...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="mb-3">
                <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                  FULL LEGAL NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Sterling"
                  style={{
                    width: '100%',
                    background: '#33312D',
                    border: `1px solid ${errors.name ? '#EF4444' : '#665946'}`,
                    borderRadius: 10,
                    padding: '11px 14px',
                    color: '#FFFFFF',
                    fontSize: 13,
                  }}
                />
                {errors.name && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.sterling@cinetix.io"
                  style={{
                    width: '100%',
                    background: '#33312D',
                    border: `1px solid ${errors.email ? '#EF4444' : '#665946'}`,
                    borderRadius: 10,
                    padding: '11px 14px',
                    color: '#FFFFFF',
                    fontSize: 13,
                  }}
                />
                {errors.email && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.email}</p>}
              </div>

              {/* Phone and Experience Format Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                    PHONE (FOR SMS PASS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    style={{
                      width: '100%',
                      background: '#33312D',
                      border: '1px solid #665946',
                      borderRadius: 10,
                      padding: '11px 14px',
                      color: '#FFFFFF',
                      fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                    PREFERRED FORMAT
                  </label>
                  <select
                    value={preferredFormat}
                    onChange={(e) => setPreferredFormat(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#33312D',
                      border: '1px solid #665946',
                      borderRadius: 10,
                      padding: '11px 14px',
                      color: '#FFFFFF',
                      fontSize: 13,
                    }}
                  >
                    <option value="IMAX 3D">IMAX 3D Laser</option>
                    <option value="Dolby Atmos">Dolby Atmos Audio</option>
                    <option value="4DX">4DX Motion & Effects</option>
                    <option value="Standard 2D">Standard 2D</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                  SECURITY PASSWORD *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{
                    width: '100%',
                    background: '#33312D',
                    border: `1px solid ${errors.password ? '#EF4444' : '#665946'}`,
                    borderRadius: 10,
                    padding: '11px 14px',
                    color: '#FFFFFF',
                    fontSize: 13,
                  }}
                />
                {/* Password Strength Meter */}
                {password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 4, background: '#1D1C19', borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: strength.width,
                          background: strength.color,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                      <span style={{ color: '#99784B', fontSize: 10 }}>Strength:</span>
                      <span style={{ color: strength.color, fontSize: 10, fontWeight: 700 }}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 5 }}>
                  CONFIRM PASSWORD *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  style={{
                    width: '100%',
                    background: '#33312D',
                    border: `1px solid ${errors.confirmPassword ? '#EF4444' : '#665946'}`,
                    borderRadius: 10,
                    padding: '11px 14px',
                    color: '#FFFFFF',
                    fontSize: 13,
                  }}
                />
                {errors.confirmPassword && (
                  <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="mb-5 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: 3, accentColor: '#FF9D16' }}
                />
                <label htmlFor="agreeTerms" style={{ color: '#C7BFB5', fontSize: 11, lineHeight: 1.4 }}>
                  I agree to the Cinetix{' '}
                  <span
                    onClick={() => navigate('terms')}
                    style={{ color: '#FF9D16', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span
                    onClick={() => setSecurityModalOpen(true)}
                    style={{ color: '#FF9D16', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    256-Bit Security Policy
                  </span>
                  .
                </label>
              </div>
              {errors.agreed && <p style={{ color: '#EF4444', fontSize: 11, marginBottom: 8 }}>{errors.agreed}</p>}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: submitting
                    ? '#665946'
                    : 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: 13,
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                  marginBottom: 16,
                  cursor: submitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 157, 22, 0.35)',
                }}
              >
                {submitting ? 'CREATING YOUR VIP ACCOUNT...' : 'CLAIM VIP MEMBERSHIP & REGISTER →'}
              </button>

              {/* Security Shield Indicator */}
              <div
                onClick={() => setSecurityModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: '#99784B',
                  fontSize: 11,
                  cursor: 'pointer',
                  marginBottom: 16,
                }}
              >
                <span>🛡️</span>
                <span>Protected by 256-Bit TLS & PCI-DSS Tokenization</span>
                <span style={{ color: '#FF9D16', textDecoration: 'underline' }}>Security Details</span>
              </div>

              {/* Login link */}
              <p style={{ color: '#C7BFB5', fontSize: 13, textAlign: 'center' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  style={{ color: '#FF9D16', fontWeight: 700, background: 'none' }}
                >
                  Sign In
                </button>
              </p>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  style={{ color: '#99784B', fontSize: 12, background: 'none' }}
                >
                  Skip and browse without account →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <SecurityModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </div>
  );
}
