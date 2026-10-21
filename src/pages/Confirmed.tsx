import { useEffect, useRef, useState } from 'react';
import type { Movie, Page, BookingState, BookingRecord } from '../types';
import DynamicQRCode from '../components/DynamicQRCode';
import { db } from '../db/database';
import { downloadTicketPassImage, downloadQRCodePNG } from '../utils/downloadPass';

interface Props {
  movie: Movie;
  bookingState: BookingState;
  navigate: (page: Page) => void;
  addBooking: (record: BookingRecord) => void;
}

export default function Confirmed({ movie, bookingState, navigate, addBooking }: Props) {
  const seats = bookingState.selectedSeats.length ? bookingState.selectedSeats : ['E4', 'E5'];
  const showtime = bookingState.showtime;
  const total = bookingState.totalAmount || 140;
  const bookingRef = useRef(`CTX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);

  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  // Save to database exactly once
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;

    const record = db.createBooking({
      movieTitle: bookingState.movieTitle || movie.title,
      moviePoster: bookingState.moviePoster || movie.poster,
      movieId: bookingState.movieId || movie.id,
      theaterName: bookingState.theaterName || 'Cinetix Grand IMAX Downtown',
      theaterId: bookingState.theaterId || 'cinetix-imax-downtown',
      date: bookingState.date || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: showtime?.time || '08:00 PM',
      format: showtime?.format || 'IMAX 3D',
      seats,
      foodItems: bookingState.foodItems || [],
      subtotal: total - (bookingState.convenienceFee || 7),
      convenienceFee: bookingState.convenienceFee || 7,
      discount: bookingState.discount || 0,
      total,
      paymentMethod: bookingState.paymentMethod || 'Credit Card (Instant Auth)',
    });

    setCreatedBooking(record);
    addBooking(record);
  }, []);

  const handleDownloadTicketImage = async () => {
    setDownloading(true);
    try {
      await downloadTicketPassImage({
        movieTitle: bookingState.movieTitle || movie.title,
        theaterName: bookingState.theaterName || 'Cinetix Grand IMAX Downtown',
        date: bookingState.date || 'Today',
        time: showtime?.time || '08:00 PM',
        format: showtime?.format || 'IMAX 3D',
        seats,
        total,
        bookingRef: createdBooking?.bookingRef || bookingRef.current,
        qrData,
      });
      setDownloaded(true);
    } catch (e) {
      console.error('Error generating pass:', e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = async () => {
    await downloadQRCodePNG(qrData, `cinetix-qr-${bookingRef.current}.png`);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3000);
  };

  const qrData = createdBooking?.qrData || `CINETIX|${bookingRef.current}|${movie.title}|${seats.join(',')}|${total}|VALID`;

  return (
    <div style={{ minHeight: '100vh', background: '#181715', paddingTop: 84, paddingBottom: 84 }}>
      <div className="max-container" style={{ maxWidth: 640 }}>

        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 76,
              height: 76,
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: 36,
              color: '#181715',
              boxShadow: '0 0 30px rgba(255, 157, 22, 0.45)',
            }}
          >
            ✓
          </div>
          <h1
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(32px, 5vw, 44px)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              marginBottom: 4,
            }}
          >
            BOOKING CONFIRMED & SEATS LOCKED!
          </h1>
          <p style={{ color: '#C7BFB5', fontSize: 15 }}>
            Booking Reference: <strong style={{ color: '#FF9D16' }}>{createdBooking?.bookingRef || bookingRef.current}</strong>
          </p>
        </div>

        {/* ── Cinema Ticket Pass ── */}
        <div
          style={{
            marginBottom: 28,
            filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.7))',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderRadius: 18,
              overflow: 'hidden',
              background: '#24221F',
              border: '1px solid #665946',
            }}
          >
            {/* Main Ticket Body */}
            <div style={{ flex: 1, padding: '24px 26px', position: 'relative' }}>
              {/* Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#FF9D16', fontSize: 16 }}>★</span>
                  <span style={{ color: '#C7BFB5', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
                    CINETIX OFFICIAL DIGITAL TICKET
                  </span>
                </div>
                <span
                  style={{
                    background: 'rgba(255, 157, 22, 0.15)',
                    border: '1px solid #FF9D16',
                    color: '#FF9D16',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {showtime?.format || 'IMAX 3D'}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: 28,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                  marginBottom: 14,
                  lineHeight: 1.1,
                }}
              >
                {bookingState.movieTitle || movie.title}
              </h2>

              <div style={{ borderTop: '1px solid #3A3731', marginBottom: 14 }} />

              {/* Rows */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 18 }}>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 600 }}>THEATRE</p>
                  <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
                    {bookingState.theaterName || 'Cinetix Grand IMAX Downtown'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 600 }}>DATE & TIME</p>
                  <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
                    {bookingState.date || 'Today'} · {showtime?.time || '08:00 PM'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 600 }}>ASSIGNED SEATS</p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 2, flexWrap: 'wrap' }}>
                    {seats.map((s) => (
                      <span
                        key={s}
                        style={{
                          background: '#FF9D16',
                          color: '#181715',
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: '#99784B', fontSize: 11, fontWeight: 600 }}>TOTAL PAID</p>
                  <p style={{ color: '#22C55E', fontSize: 15, fontWeight: 800, fontFamily: 'Inter' }}>
                    ${total}.00 ✓
                  </p>
                </div>
              </div>

              {/* Food Concessions */}
              {bookingState.foodItems && bookingState.foodItems.length > 0 && (
                <div
                  style={{
                    background: '#1D1C19',
                    border: '1px solid #3A3731',
                    borderRadius: 8,
                    padding: '8px 12px',
                    marginBottom: 16,
                  }}
                >
                  <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 700 }}>🍿 Concessions Pre-Ordered:</p>
                  {bookingState.foodItems.map((f) => (
                    <p key={f.item.id} style={{ color: '#C7BFB5', fontSize: 12 }}>
                      {f.quantity}× {f.item.name} (${f.item.price * f.quantity})
                    </p>
                  ))}
                </div>
              )}

              {/* Dynamic QR Code */}
              <div
                style={{
                  borderTop: '1px solid #3A3731',
                  paddingTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <DynamicQRCode data={qrData} size={105} showScanBeam={true} />
                <div>
                  <span
                    style={{
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid #22C55E',
                      color: '#22C55E',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    GATE READY · VERIFIED
                  </span>
                  <p style={{ color: '#C7BFB5', fontSize: 12, marginTop: 6 }}>
                    Scan QR code at the cinema entrance for fast ticketless entry.
                  </p>
                  <p style={{ color: '#FF9D16', fontSize: 11, fontWeight: 600, marginTop: 4 }}>
                    Method: {bookingState.paymentMethod || 'Credit Card'}
                  </p>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div
              style={{
                width: 2,
                background: 'repeating-linear-gradient(to bottom, #24221F 0px, #24221F 6px, #665946 6px, #665946 10px)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 20,
                  background: '#181715',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 20,
                  background: '#181715',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Admit Stub */}
            <div
              style={{
                width: 68,
                background: 'linear-gradient(180deg, #FF9D16 0%, #CC903B 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 0',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 22 }}>🎬</span>
              <div
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontFamily: 'Bebas Neue',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#181715',
                  letterSpacing: 4,
                }}
              >
                ADMIT ONE
              </div>
              <span style={{ color: '#181715', fontSize: 10, fontWeight: 900, fontFamily: 'Inter' }}>
                #{seats.length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDownloadTicketImage}
            disabled={downloading}
            style={{
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 12,
              padding: '14px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.05em',
              fontSize: 19,
              cursor: downloading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(255, 157, 22, 0.4)',
            }}
          >
            <span>📥</span>
            <span>{downloading ? 'GENERATING HIGH-RES PASS...' : downloaded ? 'PASS SAVED TO DOWNLOADS ✓' : 'DOWNLOAD TICKET PASS (PNG)'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              background: '#33312D',
              border: '1px solid #FF9D16',
              color: '#FF9D16',
              borderRadius: 12,
              padding: '14px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.05em',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🖨️</span>
            <span>PRINT TICKET / SAVE PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleDownloadQR}
            style={{
              background: '#24221F',
              border: '1px solid #665946',
              color: '#C7BFB5',
              borderRadius: 12,
              padding: '11px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>⚡</span>
            <span>Download Standalone QR (PNG)</span>
          </button>

          <button
            onClick={handleAddToWallet}
            style={{
              background: '#24221F',
              border: '1px solid #665946',
              color: '#C7BFB5',
              borderRadius: 12,
              padding: '11px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>📱</span>
            <span>{walletAdded ? 'Added to Wallet ✓' : 'Add to Apple / Google Wallet'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('profile')}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              color: '#181715',
              borderRadius: 12,
              padding: '14px',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            VIEW IN PROFILE BOOKINGS
          </button>

          <button
            onClick={() => navigate('home')}
            style={{
              background: '#24221F',
              border: '1px solid #665946',
              color: '#C7BFB5',
              borderRadius: 12,
              padding: '14px 20px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
