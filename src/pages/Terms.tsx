import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

const SECTIONS = [
  { title: 'Theatrical Entry & Digital Passes', content: 'Admission to Cinetix auditoriums is contingent upon presenting a valid, non-tampered digital QR code pass generated through our platform. All seats are strictly numbered and reserved.' },
  { title: 'Ticket Cancellation & Refund Protocol', content: 'Tickets may be cancelled directly in the profile portal up to 60 minutes prior to scheduled screening time for full refund credit or voucher reissue.' },
  { title: 'Concessions & Dietary Standards', content: 'Gourmet concessions pre-ordered online will be queued at express pick-up stations or delivered to VIP recliner tables upon auditorium check-in.' },
  { title: 'Code of Conduct & Copyright Protection', content: 'Any unauthorized recording, optical capture, or broadcast of projected material inside Cinetix auditoriums is strictly prohibited under international copyright laws.' },
];

export default function Terms({ navigate: _navigate }: Props) {
  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 860 }}>

        <p style={{ color: '#99784B', fontSize: 13, marginBottom: 4, fontWeight: 700 }}>
          LEGAL AGREEMENT · CINETIX THEATRES INC.
        </p>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 44, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          TERMS OF THEATRICAL SERVICE
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 15, marginBottom: 36 }}>
          Standard conditions governing ticket reservation, seat allocations, and VIP membership
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SECTIONS.map((s, i) => (
            <div
              key={s.title}
              style={{
                background: '#24221F',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #4D473F',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span
                  style={{
                    background: '#FF9D16',
                    color: '#181715',
                    borderRadius: 6,
                    width: 26,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {i + 1}
                </span>
                <h3 style={{ fontFamily: 'Bebas Neue', color: '#FFFFFF', fontSize: 22, letterSpacing: '0.04em' }}>
                  {s.title}
                </h3>
              </div>
              <p style={{ color: '#C7BFB5', fontSize: 14, lineHeight: 1.7 }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
