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
                CINETIX SECURITY & TRUST
              </h3>
              <p style={{ color: '#22C55E', fontSize: 11, fontWeight: 700, margin: 0 }}>
                ● BANK-GRADE ENCRYPTION ACTIVE
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
          Your payment information and cinema seat reservations are safeguarded by international security standards, end-to-end SSL encryption, and certified payment gateways.
        </p>

        {/* Security Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            {
              title: '256-Bit TLS 1.3 Encryption',
              desc: 'All communications between your browser and our servers are encrypted using bank-grade AES-256 protocols.',
              badge: 'AES-256',
            },
            {
              title: 'PCI-DSS Level 1 Payment Security',
              desc: 'Card details are processed through secure tokenization. Card numbers and security codes are never stored.',
              badge: 'PCI COMPLIANT',
            },
            {
              title: 'Anti-Scalping & Bot Protection',
              desc: 'Automated ticket scalpers and unauthorized seat holds are blocked to ensure fair seat access for genuine fans.',
              badge: 'PROTECTED',
            },
            {
              title: 'Guaranteed 10-Minute Seat Hold',
              desc: 'Your selected seats are safely reserved while you complete payment, preventing accidental double-bookings.',
              badge: '10:00 HOLD',
            },
            {
              title: 'Secure Digital Pass Verification',
              desc: 'Each ticket features an authentic dynamic QR code verified upon entry at cinema gates.',
              badge: 'VERIFIED',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#1D1C19',
                border: '1px solid #3A3731',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 13, margin: 0, marginBottom: 2 }}>
                  {item.title}
                </p>
                <p style={{ color: '#88827A', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
              <span
                style={{
                  background: '#33312D',
                  color: '#FF9D16',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #665946',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            fontFamily: 'Bebas Neue',
            fontSize: 18,
            letterSpacing: '0.05em',
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255, 157, 22, 0.3)',
          }}
        >
          GOT IT — RETURN TO BOOKING
        </button>
      </div>
    </div>
  );
}
