import { useState, useEffect } from 'react';
import type { Page, BookingRecord } from '../types';
import { db } from '../db/database';
import DynamicQRCode from '../components/DynamicQRCode';
import { downloadTicketPassImage, downloadQRCodePNG } from '../utils/downloadPass';

interface Props {
  navigate: (page: Page) => void;
  myBookings: BookingRecord[];
}

export default function Profile({ navigate }: Props) {
  const [user, setUser] = useState(db.getUserProfile());
  const [bookings, setBookings] = useState<BookingRecord[]>(db.getBookings());
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);

  useEffect(() => {
    return db.subscribe(() => {
      setUser(db.getUserProfile());
      setBookings(db.getBookings());
    });
  }, []);

  const handleCancelBooking = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? Your seats will be released back to the box office and a refund voucher will be credited.')) {
      db.cancelBooking(id);
    }
  };

  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 740 }}>

        {/* Profile Card */}
        <div
          style={{
            background: '#24221F',
            borderRadius: 24,
            padding: 30,
            marginBottom: 24,
            border: '1px solid #665946',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 76,
                height: 76,
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#181715',
                fontWeight: 900,
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 0 20px rgba(255, 157, 22, 0.4)',
              }}
            >
              {user.name.charAt(0)}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 22,
                  height: 22,
                  background: '#22C55E',
                  borderRadius: '50%',
                  border: '2px solid #24221F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: '#fff',
                }}
              >
                ✓
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 28, letterSpacing: '0.04em' }}>
                  {user.name}
                </h2>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {user.membershipTier}
                </span>
              </div>
              <p style={{ color: '#C7BFB5', fontSize: 13, marginTop: 2 }}>
                {user.email} · Member since 2024
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span style={{ color: '#FF9D16', fontSize: 12, fontWeight: 700 }}>
                  ★ {user.rewardPoints} VIP Loyalty Points
                </span>
                <span style={{ color: '#665946' }}>|</span>
                <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 700 }}>
                  ${user.walletBalance.toFixed(2)} Wallet Balance
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('edit-profile')}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                color: '#FF9D16',
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Edit Profile
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: String(18 + bookings.length), label: 'Premieres Watched' },
              { value: String(bookings.length), label: 'Total Reservations' },
              { value: `$${totalSpent}.00`, label: 'Total Invested' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: '#1D1C19',
                  borderRadius: 12,
                  padding: '14px 10px',
                  textAlign: 'center',
                  border: '1px solid #4D473F',
                }}
              >
                <p style={{ fontFamily: 'Inter', fontWeight: 800, color: '#FF9D16', fontSize: 20 }}>
                  {s.value}
                </p>
                <p style={{ color: '#C7BFB5', fontSize: 11, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Tickets & Booking History Section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, letterSpacing: '0.04em' }}>
              MY TICKETS & BOOKINGS ({bookings.length})
            </h3>
            <span style={{ color: '#99784B', fontSize: 12 }}>Saved in SQLite Persistent Store</span>
          </div>

          {bookings.length === 0 ? (
            <div
              style={{
                background: '#24221F',
                borderRadius: 16,
                border: '1px solid #665946',
                padding: 40,
                textAlign: 'center',
                color: '#C7BFB5',
              }}
            >
              <p style={{ fontSize: 36, marginBottom: 8 }}>🎟</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF', marginBottom: 4 }}>
                No active bookings recorded yet
              </p>
              <p style={{ fontSize: 13, marginBottom: 16 }}>
                Reserve your first cinema experience to view live tickets and gate passes here.
              </p>
              <button
                onClick={() => navigate('home')}
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: '10px 24px',
                  fontFamily: 'Bebas Neue',
                  fontSize: 18,
                  letterSpacing: '0.05em',
                }}
              >
                BROWSE MOVIES
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((b) => {
                const isCancelled = b.status === 'cancelled';
                return (
                  <div
                    key={b.id}
                    style={{
                      background: '#24221F',
                      borderRadius: 16,
                      border: `1px solid ${isCancelled ? '#4D473F' : '#665946'}`,
                      padding: 18,
                      opacity: isCancelled ? 0.6 : 1,
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <img
                      src={b.moviePoster}
                      alt={b.movieTitle}
                      style={{
                        width: 60,
                        height: 84,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #665946',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span
                          style={{
                            background: isCancelled ? '#4D473F' : 'rgba(255, 157, 22, 0.15)',
                            color: isCancelled ? '#C7BFB5' : '#FF9D16',
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {b.bookingRef}
                        </span>
                        <span style={{ color: '#99784B', fontSize: 11 }}>{b.format}</span>
                        {isCancelled && (
                          <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 700 }}>
                            [CANCELLED]
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 20, letterSpacing: '0.04em' }}>
                        {b.movieTitle}
                      </h4>
                      <p style={{ color: '#C7BFB5', fontSize: 12 }}>
                        {b.theaterName} · {b.date} · {b.time}
                      </p>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                        <span style={{ color: '#99784B', fontSize: 11 }}>Seats:</span>
                        {b.seats.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: '#33312D',
                              border: '1px solid #665946',
                              color: '#FFFFFF',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 13, marginLeft: 8 }}>
                          ${b.total}.00
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => setSelectedTicket(b)}
                            style={{
                              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                              color: '#181715',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontFamily: 'Bebas Neue',
                              letterSpacing: '0.05em',
                              fontSize: 16,
                            }}
                          >
                            VIEW QR PASS
                          </button>

                          <button
                            onClick={() =>
                              downloadTicketPassImage({
                                movieTitle: b.movieTitle,
                                theaterName: b.theaterName,
                                date: b.date,
                                time: b.time,
                                format: b.format,
                                seats: b.seats,
                                total: b.total,
                                bookingRef: b.bookingRef,
                                qrData: b.qrData,
                              })
                            }
                            style={{
                              background: '#33312D',
                              border: '1px solid #FF9D16',
                              color: '#FF9D16',
                              borderRadius: 8,
                              padding: '8px 12px',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Download official ticket pass PNG"
                          >
                            📥 Pass (PNG)
                          </button>

                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            style={{
                              background: '#33312D',
                              border: '1px solid #EF4444',
                              color: '#F87171',
                              borderRadius: 8,
                              padding: '8px 12px',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Menu Options */}
        <div style={{ background: '#24221F', borderRadius: 18, border: '1px solid #665946', overflow: 'hidden' }}>
          {[
            { icon: '🎨', label: 'Cinetix Design System & Guidelines', action: () => navigate('design-system') },
            { icon: '🎁', label: 'My Vouchers & Promo Codes', action: () => navigate('offers') },
            { icon: '💳', label: 'Saved Payment Methods', action: () => alert('Visa ending in •••• 4242 is primary.') },
            { icon: '📞', label: 'VIP Concierge & Help Desk', action: () => navigate('contact') },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: 'none',
                borderBottom: i < 3 ? '1px solid #3A3731' : 'none',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: '#FF9D16', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>

      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#24221F',
              border: '1px solid #FF9D16',
              borderRadius: 20,
              padding: 28,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#FF9D16', fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: '0.06em' }}>
                DIGITAL PASS · {selectedTicket.bookingRef}
              </span>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ color: '#C7BFB5', fontSize: 20, background: 'none' }}
              >
                ✕
              </button>
            </div>

            <DynamicQRCode data={selectedTicket.qrData} size={190} showScanBeam={true} />

            <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 24, marginTop: 14, letterSpacing: '0.04em' }}>
              {selectedTicket.movieTitle}
            </h3>
            <p style={{ color: '#C7BFB5', fontSize: 13, marginBottom: 8 }}>
              {selectedTicket.theaterName} · {selectedTicket.date} · {selectedTicket.time}
            </p>
            <p style={{ color: '#FF9D16', fontWeight: 800, fontSize: 14 }}>
              Seats: {selectedTicket.seats.join(', ')} · Total: ${selectedTicket.total}.00
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <button
                onClick={() =>
                  downloadTicketPassImage({
                    movieTitle: selectedTicket.movieTitle,
                    theaterName: selectedTicket.theaterName,
                    date: selectedTicket.date,
                    time: selectedTicket.time,
                    format: selectedTicket.format,
                    seats: selectedTicket.seats,
                    total: selectedTicket.total,
                    bookingRef: selectedTicket.bookingRef,
                    qrData: selectedTicket.qrData,
                  })
                }
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: '12px',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255,157,22,0.4)',
                }}
              >
                📥 DOWNLOAD TICKET PASS (PNG IMAGE)
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() =>
                    downloadQRCodePNG(selectedTicket.qrData, `cinetix-qr-${selectedTicket.bookingRef}.png`)
                  }
                  style={{
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#FF9D16',
                    borderRadius: 8,
                    padding: '10px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Download QR (PNG)
                </button>

                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#C7BFB5',
                    borderRadius: 8,
                    padding: '10px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🖨️ Print / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
