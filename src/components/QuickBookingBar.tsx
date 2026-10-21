import { useState, useRef, useEffect } from 'react';
import type { Page, BookingState } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';

interface Props {
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
  floating?: boolean;
}

function Dropdown({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedItem = options.find((o) => o.value === selected);
  const isChosen = Boolean(selectedItem);

  return (
    <div ref={ref} style={{ flex: 1, position: 'relative' }}>
      <p style={{ color: '#99784B', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </p>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          height: 46,
          background: '#24221F',
          border: '1px solid #665946',
          borderRadius: 10,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: open ? '0 0 0 2px rgba(255,157,22,0.35)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FF9D16';
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = '#665946';
        }}
      >
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: isChosen ? 700 : 500,
            fontSize: 13,
            color: isChosen ? '#FFFFFF' : '#C7BFB5',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedItem?.label || label}
        </span>
        <span
          style={{
            color: '#FF9D16',
            fontSize: 11,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {/* Menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: '#24221F',
            border: '1px solid #FF9D16',
            borderRadius: 12,
            boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
            maxHeight: 250,
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                background: selected === opt.value ? 'rgba(255,157,22,0.18)' : 'none',
                color: selected === opt.value ? '#FF9D16' : '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: selected === opt.value ? 700 : 400,
                borderBottom: '1px solid rgba(102,89,70,0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,157,22,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  selected === opt.value ? 'rgba(255,157,22,0.18)' : 'none';
              }}
            >
              <span>{opt.label}</span>
              {selected === opt.value && <span style={{ color: '#FF9D16', fontSize: 12 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuickBookingBar({ navigate, floating = true }: Props) {
  const movies = db.getMovies().filter((m) => m.bookable !== false);
  const theaters = db.getTheaters();
  const primaryTheater = theaters[0] || { name: 'Cinetix Grand IMAX Downtown', id: 'cinetix-imax-downtown' };

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || 'the-last-signal');
  const [selectedDate, setSelectedDate] = useState(MOVIE_DATES[0] || 'Today');
  const [selectedTiming, setSelectedTiming] = useState('08:00 PM');
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const dateOptions = MOVIE_DATES.slice(0, 10).map((d, i) => {
    const dt = new Date(d);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = `${dayName}, ${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return { label: formatted, value: d };
  });

  const movieOptions = movies.map((m) => ({ label: m.title, value: m.id }));
  const timingOptions = [
    { label: '10:00 AM · IMAX 3D Laser ($55)', value: '10:00 AM' },
    { label: '01:30 PM · IMAX 3D Laser ($60)', value: '01:30 PM' },
    { label: '04:45 PM · IMAX 3D Laser ($65)', value: '04:45 PM' },
    { label: '08:00 PM · IMAX 3D Laser ($70)', value: '08:00 PM' },
    { label: '11:15 PM · IMAX 3D Laser ($55)', value: '11:15 PM' },
  ];

  const handleBookNow = () => {
    const selectedMovie = movies.find((m) => m.id === selectedMovieId) || movies[0];
    const showtime = primaryTheater.showtimes?.find((st) => st.time === selectedTiming) || primaryTheater.showtimes?.[0] || {
      id: 'st-imax-0800',
      time: selectedTiming,
      format: 'IMAX 3D',
      price: 60,
      available: 84,
    };

    navigate('booking', {
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      moviePoster: selectedMovie.poster,
      theaterId: primaryTheater.id,
      theaterName: primaryTheater.name,
      date: selectedDate,
      showtime: {
        ...showtime,
        time: selectedTiming,
      },
    });
  };

  const handleInstantQuickBook = () => {
    const selectedMovie = movies.find((m) => m.id === selectedMovieId) || movies[0];
    const showtime = primaryTheater.showtimes?.find((st) => st.time === selectedTiming) || {
      id: 'st-imax-0800',
      time: selectedTiming,
      format: 'IMAX 3D',
      price: 60,
      available: 84,
    };

    const showtimeKey = `${selectedMovie.id}_${selectedDate}_${selectedTiming}`;
    const taken = new Set(db.getBookedSeats(showtimeKey));
    const idealPairs = [['E4', 'E5'], ['E6', 'E7'], ['F4', 'F5'], ['D4', 'D5'], ['F6', 'F7']];
    let chosenSeats = ['E4', 'E5'];

    for (const pair of idealPairs) {
      if (!taken.has(pair[0]) && !taken.has(pair[1])) {
        chosenSeats = pair;
        break;
      }
    }

    const ticketPrice = showtime?.price || 60;
    const subtotal = chosenSeats.length * ticketPrice;
    const fee = Math.round(subtotal * 0.05);

    navigate('order-it-quick', {
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      moviePoster: selectedMovie.poster,
      theaterId: primaryTheater.id,
      theaterName: primaryTheater.name,
      date: selectedDate,
      showtime: {
        ...showtime,
        time: selectedTiming,
      },
      selectedSeats: chosenSeats,
      totalAmount: subtotal + fee,
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 40,
        maxWidth: 1240,
        margin: floating ? '-34px auto 36px' : '0 auto 36px',
        padding: '0 16px',
      }}
    >
      {/* Desktop Quick Booking Floating Console */}
      <div
        className="hidden md:flex items-center justify-between gap-4"
        style={{
          background: 'rgba(36, 34, 31, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid #FF9D16',
          borderRadius: 18,
          padding: '16px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 157, 22, 0.25)',
        }}
      >
        <div style={{ display: 'flex', gap: 14, flex: 1 }}>
          <Dropdown
            label="1. Choose Movie"
            options={movieOptions}
            selected={selectedMovieId}
            onSelect={setSelectedMovieId}
          />
          <Dropdown
            label="2. Select Date"
            options={dateOptions}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          <Dropdown
            label="3. IMAX Showtime"
            options={timingOptions}
            selected={selectedTiming}
            onSelect={setSelectedTiming}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0, paddingTop: 18 }}>
          <button
            onClick={handleBookNow}
            style={{
              height: 46,
              padding: '0 24px',
              background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
              borderRadius: 10,
              color: '#181715',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 19,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255, 157, 22, 0.35)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 157, 22, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 157, 22, 0.35)';
            }}
          >
            SELECT SEATS →
          </button>

          <button
            onClick={handleInstantQuickBook}
            style={{
              height: 46,
              padding: '0 18px',
              background: '#33312D',
              border: '1.5px solid #FF9D16',
              borderRadius: 10,
              color: '#FF9D16',
              fontFamily: 'Bebas Neue',
              letterSpacing: '0.06em',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 157, 22, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#33312D';
            }}
            title="Auto-selects optimal seats & fast-tracks to QR ticket"
          >
            <span>⚡</span>
            <span>1-TAP QUICK</span>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Booking Bar */}
      <div
        className="md:hidden"
        style={{
          background: 'rgba(36, 34, 31, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #FF9D16',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
        }}
      >
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          style={{
            width: '100%',
            padding: '13px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 19, letterSpacing: '0.04em', color: '#FF9D16' }}>
              QUICK CINEMA BOOKING BAR
            </span>
          </div>
          <span style={{ color: '#FF9D16', fontSize: 13 }}>
            {mobileExpanded ? '▲ Hide' : '▼ Select'}
          </span>
        </button>

        {mobileExpanded && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Dropdown
              label="Movie"
              options={movieOptions}
              selected={selectedMovieId}
              onSelect={setSelectedMovieId}
            />
            <Dropdown
              label="Date"
              options={dateOptions}
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <Dropdown
              label="Showtime"
              options={timingOptions}
              selected={selectedTiming}
              onSelect={setSelectedTiming}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={handleBookNow}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  color: '#181715',
                  borderRadius: 10,
                  padding: 12,
                  fontFamily: 'Bebas Neue',
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                SELECT SEATS →
              </button>
              <button
                onClick={handleInstantQuickBook}
                style={{
                  background: '#33312D',
                  border: '1px solid #FF9D16',
                  color: '#FF9D16',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontFamily: 'Bebas Neue',
                  fontSize: 18,
                }}
              >
                ⚡ 1-TAP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
