import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#24221F',
          border: '1px solid #FF9D16',
          borderRadius: 20,
          maxWidth: 540,
          width: '100%',
          padding: '32px 28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 157, 22, 0.2)',
          color: '#FFFFFF',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255, 157, 22, 0.15)',
                border: '1.5px solid #FF9D16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#FF9D16',
              }}
            >
              🛡️
            </div>
            <div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.04em', margin: 0, color: '#FFFFFF' }}>
                CINETIX SECURITY VAULT
              </h3>
              <p style={{ color: '#22C55E', fontSize: 11, fontWeight: 700, margin: 0 }}>
                ● ALL PROTOCOLS ACTIVE & ENCRYPTED
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              color: '#C7BFB5',
              width: 32,
              height: 32,
              borderRadius: '50%',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#C7BFB5', fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
          CINETIX enforces military-grade transport encryption and zero-knowledge storage architecture to safeguard your payment and reservation credentials.
        </p>

        {/* Security Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            {
              title: '256-Bit TLS 1.3 Transport Encryption',
              desc: 'All communication between your browser and our ticketing servers is protected by SHA-256 with RSA encryption.',
              badge: 'AES-256',
            },
            {
              title: 'PCI-DSS Level 1 Service Provider Standards',
              desc: 'Payment card numbers are converted into cryptographic single-use tokens. Raw CVVs are never saved to disks.',
              badge: 'PCI COMPLIANT',
            },
            {
              title: 'FraudShield AI & Anti-Bot Protection',
              desc: 'Real-time telemetry detects automated ticket scalpers, credential stuffing, and unauthorized seat holds.',
              badge: '0.01% RISK SCORE',
            },
            {
              title: 'Seat Reservation Lock Guard',
              desc: 'Seat assignments are cryptographically locked for 10:00 to prevent double-booking collisions.',
              badge: 'ACTIVE LOCK',
            },
            {
              title: 'Content Security Policy & XSS Shield',
              desc: 'Strict frame options, clickjacking defense, and modern subresource integrity enforced.',
              badge: 'STRICT CSP',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#1D1C19',
                border: '1px solid #3A3731',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ color: '#22C55E', fontSize: 14 }}>✓</span>
                  <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
                    {item.title}
                  </span>
                </div>
                <p style={{ color: '#99784B', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
              <span
                style={{
                  background: 'rgba(255, 157, 22, 0.12)',
                  border: '1px solid #FF9D16',
                  color: '#FF9D16',
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  padding: '3px 8px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Security Logos Banner */}
        <div
          style={{
            background: '#181715',
            border: '1px solid #33312D',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 20,
            color: '#C7BFB5',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span>🔒 SSL VERIFIED</span>
          <span style={{ color: '#665946' }}>|</span>
          <span>🛡️ NORTON SECURED</span>
          <span style={{ color: '#665946' }}>|</span>
          <span>💳 VISA SECURE</span>
          <span style={{ color: '#665946' }}>|</span>
          <span>⚡ MASTERCARD ID CHECK</span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 10,
            padding: 12,
            fontFamily: 'Bebas Neue',
            fontSize: 18,
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          UNDERSTOOD · PROCEED SECURELY
        </button>
      </div>
    </div>
  );
}
