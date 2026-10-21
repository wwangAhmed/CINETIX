import { useState } from 'react';
import type { Page } from '../types';
import CinetixLogo from '../components/CinetixLogo';
import DynamicQRCode from '../components/DynamicQRCode';
import { db } from '../db/database';

interface Props {
  navigate: (page: Page) => void;
}

const COLOR_SWATCHES = [
  { hex: '#FF9D16', name: 'Cinema Amber Gold', role: 'Primary CTA, Active Seat, Highlight Badges', rgb: '255, 157, 22' },
  { hex: '#CC903B', name: 'Warm Honey Ochre', role: 'Secondary Accents, Hover States, Gradient Pair', rgb: '204, 144, 59' },
  { hex: '#99784B', name: 'Caramel Bronze', role: 'Tertiary Accents, Subtitles, Subtle Borders', rgb: '153, 120, 75' },
  { hex: '#665946', name: 'Deep Taupe Outline', role: 'Card Borders, Container Dividers, Outlines', rgb: '102, 89, 70' },
  { hex: '#33312D', name: 'Espresso Charcoal', role: 'Card Surfaces, Modals, Dropdown Panels', rgb: '51, 49, 45' },
  { hex: '#181715', name: 'Deep Cinema Void', role: 'Base Background, Film Canvas Backdrops', rgb: '24, 23, 21' },
];

export default function DesignSystem({ navigate }: Props) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [testQRText, setTestQRText] = useState('CINETIX|VIP-999|THE LAST SIGNAL|E4,E5|$70.00|VERIFIED');
  const [sqlCopied, setSqlCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownloadSql = () => {
    const dump = db.generateSqlDump();
    const blob = new Blob([dump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cinetix_database_dump.sql';
    a.click();
    URL.revokeObjectURL(url);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  return (
    <div style={{ paddingTop: 90, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => navigate('home')}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#C7BFB5',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ← Back to Home
            </button>
            <span style={{ color: '#99784B' }}>/</span>
            <span style={{ color: '#FF9D16', fontWeight: 600, fontSize: 13 }}>Cinetix Design System v2.4</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: 'clamp(32px, 6vw, 54px)',
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                CINETIX DESIGN SYSTEM & GUIDELINES
              </h1>
              <p style={{ color: '#C7BFB5', fontSize: 16, maxWidth: 680 }}>
                The official visual language, typography pairing matrix, color tokens, and component architecture powering the Cinetix Next-Gen Cinema Platform.
              </p>
            </div>

            <button
              onClick={handleDownloadSql}
              style={{
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                color: '#181715',
                borderRadius: 10,
                padding: '12px 24px',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 18,
                boxShadow: '0 4px 16px rgba(255, 157, 22, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>💾</span>
              <span>{sqlCopied ? 'SQL DUMP EXPORTED!' : 'EXPORT SQLITE / PG DUMP'}</span>
            </button>
          </div>
        </div>

        {/* Section 1: Brand Mark & Identity */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #665946',
            borderRadius: 18,
            padding: 32,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', color: '#FF9D16' }}>
              1. BRAND IDENTITY & SYMBOL
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
              style={{
                background: '#181715',
                border: '1px solid #665946',
                borderRadius: 14,
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <CinetixLogo height={56} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span style={{ background: '#33312D', color: '#C7BFB5', fontSize: 11, padding: '3px 10px', borderRadius: 6 }}>Primary Mark</span>
                <span style={{ background: '#33312D', color: '#FF9D16', fontSize: 11, padding: '3px 10px', borderRadius: 6 }}>Hexagonal Shutter</span>
                <span style={{ background: '#33312D', color: '#CC903B', fontSize: 11, padding: '3px 10px', borderRadius: 6 }}>Gold Core</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#FFFFFF', marginBottom: 8 }}>
                THE CINETIX ETHOS
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                <strong>CINETIX</strong> redefines modern theatrical entertainment with speed, luxury, and clarity. The mark unites a precision camera aperture shutter with an amber holographic light crystal, symbolizing theatrical immersion and cutting-edge cinema technology.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#24221F', padding: 14, borderRadius: 10, border: '1px solid rgba(102,89,70,0.5)' }}>
                  <p style={{ color: '#FF9D16', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>VOICE</p>
                  <p style={{ color: '#FFFFFF', fontSize: 13 }}>Prestigious, Confident, Cinematic & Frictionless</p>
                </div>
                <div style={{ background: '#24221F', padding: 14, borderRadius: 10, border: '1px solid rgba(102,89,70,0.5)' }}>
                  <p style={{ color: '#FF9D16', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>THEATRE FORMATS</p>
                  <p style={{ color: '#FFFFFF', fontSize: 13 }}>IMAX 3D Laser, Dolby Atmos, 4DX Motion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette Architecture */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #665946',
            borderRadius: 18,
            padding: 32,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>🎨</span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', color: '#FF9D16' }}>
              2. COLOR PALETTE SYSTEM (EXACT SPECIFICATION)
            </h2>
          </div>

          <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 24 }}>
            Click on any color tile to instantly copy its HEX code to your clipboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLOR_SWATCHES.map((swatch) => (
              <div
                key={swatch.hex}
                onClick={() => copyToClipboard(swatch.hex)}
                style={{
                  background: '#24221F',
                  borderRadius: 14,
                  border: '1px solid #665946',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#FF9D16';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#665946';
                }}
              >
                {/* Color Block */}
                <div
                  style={{
                    height: 110,
                    background: swatch.hex,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    padding: 12,
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {copiedHex === swatch.hex ? 'COPIED! ✓' : swatch.hex}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#FFFFFF', marginBottom: 2 }}>
                    {swatch.name}
                  </h4>
                  <p style={{ color: '#99784B', fontSize: 12, marginBottom: 8 }}>
                    RGB({swatch.rgb})
                  </p>
                  <p style={{ color: '#C7BFB5', fontSize: 12, lineHeight: 1.5 }}>
                    {swatch.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Typography Pairing Matrix */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #665946',
            borderRadius: 18,
            padding: 32,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>🔤</span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', color: '#FF9D16' }}>
              3. TYPOGRAPHY PAIRING: "MODERN TECH CINEMA"
            </h2>
          </div>

          <div
            style={{
              background: '#24221F',
              borderRadius: 14,
              border: '1px solid #665946',
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ background: '#FF9D16', color: '#181715', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 6 }}>
                OFFICIAL WINNER
              </span>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#FFFFFF' }}>
                HEADER FONT: BEBAS NEUE + UI FONT: INTER
              </h3>
            </div>
            <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.6 }}>
              <strong>Why It Works:</strong> Bebas Neue saves headline space with its condensed, commanding vertical presence, evoking classic IMAX and marquee cinema posters. Inter provides extreme micro-readability for seats, showtimes, dollar figures, and fast checkout.
            </p>
          </div>

          {/* Typography Scale Preview */}
          <div className="flex flex-col gap-6">
            <div style={{ borderBottom: '1px solid #44403B', paddingBottom: 16 }}>
              <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>H1 DISPLAY (BEBAS NEUE 54px)</span>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 48, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                THE LAST SIGNAL — IMAX 3D PREMIERE
              </h1>
            </div>

            <div style={{ borderBottom: '1px solid #44403B', paddingBottom: 16 }}>
              <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>H2 SECTION TITLE (BEBAS NEUE 32px)</span>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                EXPERIENCE DOLBY ATMOS AUDIO & 4K LASER
              </h2>
            </div>

            <div style={{ borderBottom: '1px solid #44403B', paddingBottom: 16 }}>
              <span style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>UI FONT (INTER 15px & 13px)</span>
              <p style={{ fontFamily: 'Inter', fontSize: 15, color: '#FFFFFF', lineHeight: 1.6, marginTop: 4 }}>
                Seats: <strong>E4, E5 (Executive Center)</strong> · Show: <strong>08:00 PM</strong> · Subtotal: <strong>$140.00</strong> · Convenience Fee: <strong>$7.00</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Live Component Lab & QR Generator */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #665946',
            borderRadius: 18,
            padding: 32,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>🎟</span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', color: '#FF9D16' }}>
              4. LIVE INTERACTIVE TICKET & QR CODE GENERATOR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
                Every confirmed ticket generates an encoded digital QR pass with an integrated holographic scan beam. Type custom metadata below to test live real-time re-rendering:
              </p>
              <textarea
                value={testQRText}
                onChange={(e) => setTestQRText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: '#181715',
                  border: '1px solid #665946',
                  borderRadius: 10,
                  padding: 12,
                  color: '#FFFFFF',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  marginBottom: 16,
                  resize: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setTestQRText(`CINETIX|${Math.floor(1000 + Math.random() * 9000)}|VOID PROTOCOL|F6,F7|$120|OK`)}
                  style={{
                    background: '#24221F',
                    border: '1px solid #665946',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#FF9D16',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  🎲 Generate Random Ticket
                </button>
              </div>
            </div>

            <div
              style={{
                background: '#181715',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #665946',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <DynamicQRCode data={testQRText} size={200} showScanBeam={true} />
              <p style={{ color: '#FF9D16', fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: '0.05em', marginTop: 4 }}>
                LIVE SCANNER BEAM ACTIVE
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Interactive Seat Matrix States */}
        <div
          style={{
            background: '#33312D',
            border: '1px solid #665946',
            borderRadius: 18,
            padding: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 24 }}>💺</span>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.05em', color: '#FF9D16' }}>
              5. SEAT MATRIX COMPONENT STATES
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="seat seat-available">1</div>
              <span style={{ color: '#C7BFB5', fontSize: 13, fontFamily: 'Inter' }}>Available (#33312D / #665946)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="seat seat-selected">2</div>
              <span style={{ color: '#C7BFB5', fontSize: 13, fontFamily: 'Inter' }}>Selected (#FF9D16 Glowing Amber)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="seat seat-premium">3</div>
              <span style={{ color: '#C7BFB5', fontSize: 13, fontFamily: 'Inter' }}>VIP Premium (#FF9D16 Border)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="seat seat-taken">4</div>
              <span style={{ color: '#C7BFB5', fontSize: 13, fontFamily: 'Inter' }}>Taken (#252422 / Disabled)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
