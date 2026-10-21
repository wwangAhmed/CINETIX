import { useState } from 'react';
import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

export default function Contact({ navigate: _navigate }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container">

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          CINETIX VIP CONCIERGE & GUEST SUPPORT
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 14, marginBottom: 36 }}>
          Have an inquiry regarding private auditorium rentals, VIP passes, or corporate bookings? Reach our 24/7 concierge.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid #22C55E',
                  borderRadius: 18,
                  padding: 44,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 50, marginBottom: 12 }}>✓</div>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 26, letterSpacing: '0.04em' }}>
                  DISPATCH CONFIRMED
                </h3>
                <p style={{ color: '#C7BFB5', fontSize: 14, marginTop: 4 }}>
                  Your request has been routed to our Lead Theatrical Concierge. Expect an answer within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: 20,
                    background: '#33312D',
                    border: '1px solid #665946',
                    color: '#FF9D16',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  background: '#24221F',
                  borderRadius: 18,
                  padding: 30,
                  border: '1px solid #665946',
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Alex Sterling"
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: '1px solid #665946',
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontFamily: 'Inter',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="alex.sterling@cinetix.io"
                      style={{
                        width: '100%',
                        background: '#33312D',
                        border: '1px solid #665946',
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontFamily: 'Inter',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Private IMAX Hall Reservation / Corporate Screening"
                    style={{
                      width: '100%',
                      background: '#33312D',
                      border: '1px solid #665946',
                      borderRadius: 10,
                      padding: '12px 14px',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontFamily: 'Inter',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ color: '#C7BFB5', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Detail your requirements, date, or booking reference..."
                    style={{
                      width: '100%',
                      background: '#33312D',
                      border: '1px solid #665946',
                      borderRadius: 10,
                      padding: '12px 14px',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontFamily: 'Inter',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                    color: '#181715',
                    borderRadius: 10,
                    padding: '13px 32px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.06em',
                    fontSize: 19,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  DISPATCH TO CONCIERGE →
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="flex flex-col gap-4">
            {[
              { icon: '📍', title: 'Global Headquarters', lines: ['123 Market Street, Financial District', 'San Francisco, CA 94105'] },
              { icon: '📧', title: 'Direct Communications', lines: ['concierge@cinetix.io', 'press@cinetix.io'] },
              { icon: '📞', title: 'Toll-Free Concierge Hotline', lines: ['+1 (800) 849-CINETIX', 'Mon-Sun: 24/7 Support'] },
            ].map((box) => (
              <div
                key={box.title}
                style={{
                  background: '#24221F',
                  border: '1px solid #4D473F',
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <span style={{ fontSize: 24 }}>{box.icon}</span>
                <h4 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 18, letterSpacing: '0.04em', marginTop: 8, marginBottom: 4 }}>
                  {box.title}
                </h4>
                {box.lines.map((l) => (
                  <p key={l} style={{ color: '#C7BFB5', fontSize: 13 }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
