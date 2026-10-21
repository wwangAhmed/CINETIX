import type { Page } from '../types';

interface Props {
  navigate: (page: Page) => void;
}

const SECTIONS = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, purchase cinema tickets, reserve concessions, or contact concierge support. This includes your name, email, phone number, encrypted tokenized payment identifiers, and reservation history.' },
  { title: 'How We Use Your Data', content: 'We process your information strictly to generate digital passes, verify QR barcodes at auditorium gates, calculate loyalty point balances, and send security receipts and real-time schedule notifications.' },
  { title: 'Data Security Standards', content: 'We employ 256-bit TLS encryption, PCI-DSS Level 1 compliance for digital card authorization, zero-knowledge tokenization, and strict access controls across our PostgreSQL and SQLite database infrastructure.' },
  { title: 'No Sale of Personal Information', content: 'Cinetix does not sell, lease, or monetize your personal data. Information is exchanged solely with certified cinema hall projection systems to validate seat access.' },
  { title: 'Your Rights & Data Portability', content: 'You can view, export, or purge your account and booking history at any moment by contacting privacy@cinetix.io.' },
];

export default function PrivacyPolicy({ navigate: _navigate }: Props) {
  return (
    <div style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100vh', background: '#181715' }}>
      <div className="max-container" style={{ maxWidth: 860 }}>

        <p style={{ color: '#99784B', fontSize: 13, marginBottom: 4, fontWeight: 700 }}>
          LEGAL NOTICE · EFFECTIVE OCTOBER 2026
        </p>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 44, letterSpacing: '0.04em', color: '#FFFFFF', marginBottom: 4 }}>
          CINETIX GLOBAL PRIVACY POLICY
        </h1>
        <p style={{ color: '#C7BFB5', fontSize: 15, marginBottom: 36 }}>
          How we protect your confidential records and digital ticketing data
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
