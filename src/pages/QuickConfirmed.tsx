import { useState } from 'react';
import type { Movie, Page, BookingState } from '../types';
import DynamicQRCode from '../components/DynamicQRCode';
import { db } from '../db/database';
import { downloadTicketPassImage, downloadQRCodePNG } from '../utils/downloadPass';

interface Props {
  movie: Movie;
  bookingState?: BookingState;
  navigate: (page: Page) => void;
}

export default function QuickConfirmed({ movie, bookingState, navigate }: Props) {
  const latestBooking = db.getBookings()[0];
  const refCode = bookingState?.bookingRef || latestBooking?.bookingRef || 'CTX-9481';
  const movieTitle = bookingState?.movieTitle || latestBooking?.movieTitle || movie.title;
  const moviePoster = bookingState?.moviePoster || latestBooking?.moviePoster || movie.poster;
  const theaterName = bookingState?.theaterName || latestBooking?.theaterName || 'Cinetix Grand IMAX Downtown';
  const date = bookingState?.date || latestBooking?.date || 'Today';
  const time = bookingState?.showtime?.time || latestBooking?.time || '08:00 PM';
  const format = bookingState?.showtime?.format || latestBooking?.format || 'IMAX 3D Laser';
  const seats = bookingState?.selectedSeats?.length ? bookingState.selectedSeats : (latestBooking?.seats || ['E4', 'E5']);
  const total = bookingState?.totalAmount || latestBooking?.total || 75;
  const qrData = latestBooking?.qrData || `CINETIX|${refCode}|${movieTitle}|${seats.join(',')}|TOTAL:$${total}|PASS_VALID`;

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPass = async () => {
    setDownloading(true);
    try {
      await downloadTicketPassImage({
        movieTitle,
        theaterName,
        date,
        time,
        format,
        seats,
        total,
        bookingRef: refCode,
        qrData,
      });
      setDownloaded(true);
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181715',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* Dynamic Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>⚡</div>
          <h1
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(34px, 5vw, 44px)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              marginBottom: 6,
            }}
          >
            YOU'RE IN — 1-TAP SECURED!
          </h1>
          <div
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              borderRadius: 20,
              padding: '6px 18px',
              marginBottom: 10,
            }}
          >
            <span style={{ color: '#181715', fontWeight: 800, fontSize: 13 }}>
              Secured prime seats in 0.4s with 256-Bit Vault ⚡
            </span>
          </div>
          <p style={{ color: '#C7BFB5', fontSize: 13 }}>
            Booking Reference: <strong style={{ color: '#FF9D16' }}>{refCode}</strong>
          </p>
        </div>

        {/* Dynamic Pass Card */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 20,
            padding: 24,
            border: '1.5px solid #FF9D16',
            marginBottom: 20,
            boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(255,157,22,0.2)',
          }}
        >
          <div className="flex gap-4 mb-5 text-left">
            <img
              src={moviePoster}
              alt={movieTitle}
              style={{ width: 72, height: 104, objectFit: 'cover', borderRadius: 10, border: '1px solid #665946' }}
            />
            <div style={{ flex: 1 }}>
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
                {format}
              </span>
              <h3
                style={{
                  fontFamily: 'Bebas Neue',
                  color: '#FFFFFF',
                  fontSize: 24,
                  marginTop: 4,
                  letterSpacing: '0.04em',
                  marginBottom: 2,
                }}
              >
                {movieTitle}
              </h3>
              <p style={{ color: '#C7BFB5', fontSize: 13 }}>
                {theaterName}
              </p>
              <p style={{ color: '#99784B', fontSize: 12, marginTop: 2, fontWeight: 700 }}>
                {date} · {time}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-5" style={{ borderTop: '1px solid #3A3731', paddingTop: 14 }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>PRIME SEATS</p>
              <div className="flex gap-2 mt-1">
                {seats.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: '#FF9D16',
                      color: '#181715',
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#99784B', fontSize: 11, fontWeight: 700 }}>PAID TOTAL</p>
              <p style={{ color: '#22C55E', fontWeight: 800, fontSize: 22, fontFamily: 'Inter' }}>
                ${total}.00 ✓
              </p>
            </div>
          </div>

          {/* Dynamic QR Code */}
          <div
            style={{
              borderTop: '1px dashed #665946',
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <DynamicQRCode data={qrData} size={145} showScanBeam={true} />
            <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800 }}>
              ● GATE PODIUM PASS ACTIVE & READY
            </p>
          </div>
        </div>

        {/* Primary Download Pass Button */}
        <button
          onClick={handleDownloadPass}
          disabled={downloading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
            color: '#181715',
            borderRadius: 12,
            padding: 15,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.06em',
            fontSize: 20,
            marginBottom: 12,
            cursor: downloading ? 'wait' : 'pointer',
            boxShadow: '0 4px 16px rgba(255, 157, 22, 0.4)',
          }}
        >
          {downloading ? 'GENERATING HIGH-RES PASS...' : downloaded ? 'PASS SAVED TO DOWNLOADS ✓' : '📥 DOWNLOAD DIGITAL PASS (PNG) →'}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => downloadQRCodePNG(qrData, `cinetix-qr-${refCode}.png`)}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              color: '#FF9D16',
              borderRadius: 12,
              padding: '12px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ⚡ Save QR (PNG)
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: '#33312D',
              border: '1px solid #665946',
              color: '#FFFFFF',
              borderRadius: 12,
              padding: '12px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            🖨️ Print / PDF
          </button>
        </div>

        <button
          onClick={() => navigate('profile')}
          style={{
            width: '100%',
            background: '#24221F',
            border: '1px solid #665946',
            color: '#C7BFB5',
            borderRadius: 12,
            padding: 12,
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          🎟 View All My Bookings in Profile →
        </button>

        <button
          onClick={() => navigate('home')}
          style={{
            color: '#99784B',
            fontSize: 13,
            background: 'none',
            cursor: 'pointer',
            padding: 6,
          }}
        >
          ← Return to Cinema Home
        </button>
      </div>
    </div>
  );
}
