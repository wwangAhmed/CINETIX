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
  const [qrDownloading, setQrDownloading] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

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

  const handleDownloadQR = async () => {
    setQrDownloading(true);
    try {
      await downloadQRCodePNG(qrData, `cinetix-qr-${refCode}.png`, 400);
    } catch {
      window.print();
    } finally {
      setQrDownloading(false);
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
        padding: '84px 20px 40px',
      }}
    >
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>

        {/* Dynamic Header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 48, marginBottom: 6 }}>🎟️</div>
          <h1
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(32px, 5vw, 42px)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              marginBottom: 6,
            }}
          >
            PAYMENT CONFIRMED — TICKET IN QR FORMAT
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
              ✓ Bank Transfer Verified · Cinema Gate Entry Pass Active
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

          {/* Dynamic Ticket in QR Format Box */}
          <div
            style={{
              background: '#181715',
              borderRadius: 14,
              padding: '18px 16px',
              border: '1px solid #FF9D16',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'inset 0 0 15px rgba(255, 157, 22, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ color: '#22C55E', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                DIGITAL CINEMA ADMISSION PASS (QR FORMAT)
              </span>
            </div>
            <DynamicQRCode data={qrData} size={165} showScanBeam={true} />
            <p style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
              ● READY TO SCAN AT THEATER ENTRANCE
            </p>
            <p style={{ color: '#C7BFB5', fontSize: 11 }}>
              Present this QR code on your mobile or download high-res pass below
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
            cursor: downloading ? 'wait' : 'pointer',
            marginBottom: 10,
            boxShadow: '0 8px 24px rgba(255, 157, 22, 0.35)',
            border: 'none',
          }}
        >
          {downloading ? 'RENDERING HIGH-RES PASS...' : downloaded ? '✓ TICKET PASS DOWNLOADED (PNG)!' : '📥 DOWNLOAD TICKET PASS (PNG)'}
        </button>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <button
            onClick={handleDownloadQR}
            disabled={qrDownloading}
            style={{
              background: '#33312D',
              color: '#FF9D16',
              border: '1px solid #FF9D16',
              borderRadius: 10,
              padding: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: qrDownloading ? 'wait' : 'pointer',
            }}
          >
            {qrDownloading ? 'Saving...' : '⚡ Download QR (PNG)'}
          </button>

          <button
            onClick={() => setWalletAdded(true)}
            style={{
              background: walletAdded ? '#22C55E' : '#33312D',
              color: walletAdded ? '#181715' : '#C7BFB5',
              border: '1px solid #4D473F',
              borderRadius: 10,
              padding: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {walletAdded ? '✓ Added to Wallet!' : '📱 Add to Wallet'}
          </button>
        </div>

        <button
          onClick={() => navigate('profile')}
          style={{
            width: '100%',
            background: '#24221F',
            color: '#FFFFFF',
            border: '1px solid #665946',
            borderRadius: 10,
            padding: 12,
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
            border: 'none',
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
