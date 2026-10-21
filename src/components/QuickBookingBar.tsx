import { useState, useRef, useEffect } from 'react';
import type { Page, BookingState } from '../types';
import { db } from '../db/database';
import { MOVIE_DATES } from '../data/movies';

interface Props {
  navigate: (page: Page, updates?: Partial<BookingState>) => void;
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
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          height: 48,
          background: '#33312D',
          border: '1px solid #665946',
          borderRadius: 10,
          padding: '0 16px',
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
            fontWeight: isChosen ? 600 : 400,
            fontSize: 14,
            color: isChosen ? '#FFFFFF' : '#C7BFB5',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedItem ? selectedItem.label : label}
        </span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF9D16"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#33312D',
            borderRadius: 10,
            border: '1px solid #665946',
            zIndex: 300,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
            maxHeight: 260,
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
                padding: '11px 16px',
                textAlign: 'left',
                background: selected === opt.value ? 'rgba(255,157,22,0.18)' : 'none',
                color: selected === opt.value ? '#FF9D16' : '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: selected === opt.value ? 600 : 400,
                borderBottom: '1px solid rgba(102,89,70,0.3)',
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

export default function QuickBookingBar({ navigate }: Props) {
  const movies = db.getMovies().filter((m) => m.bookable !== false);
  const theaters = db.getTheaters();
  const primaryTheater = theaters[0] || { name: 'Cinetix Grand IMAX Downtown', id: 'cinetix-imax-downtown' };

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || 'the-last-signal');
  const [selectedDate, setSelectedDate] = useState(MOVIE_DATES[0] || 'Today');
  const [selectedTiming, setSelectedTiming] = useState('08:00 PM');
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Formatted date options
  const dateOptions = MOVIE_DATES.slice(0, 10).map((d, i) => {
    const dt = new Date(d);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dt.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = `${dayName}, ${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return { label: formatted, value: d };
  });

  const movieOptions = movies.map((m) => ({ label: m.title, value: m.id }));
  const timingOptions = [
    { label: '10:00 AM · IMAX 3D ($55)', value: '10:00 AM' },
    { label: '01:30 PM · IMAX 3D ($60)', value: '01:30 PM' },
    { label: '04:45 PM · IMAX 3D ($65)', value: '04:45 PM' },
    { label: '08:00 PM · IMAX 3D ($70)', value: '08:00 PM' },
    { label: '11:15 PM · IMAX 3D ($55)', value: '11:15 PM' },
  ];

  const handleBookNow = () => {
    const selectedMovie = movies.find((m) => m.id === selectedMovieId) || movies[0];
    const showtime = primaryTheater.showtimes.find((st) => st.time === selectedTiming) || primaryTheater.showtimes[0];

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
    const showtime = primaryTheater.showtimes.find((st) => st.time === selectedTiming) || primaryTheater.showtimes[0];

    // Find 2 best available seats
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
    <>
      {/* Desktop Quick Booking Bar */}
      <div
        className="hidden md:block"
        style={{
          background: '#24221F',
          borderBottom: '1px solid #3A3731',
          position: 'sticky',
          top: 72,
          zIndex: 900,
          padding: '14px 0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div
          className="max-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}
        >
          {/* 3 Interactive Dropdowns */}
          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            <Dropdown
              label="Select Movie"
              options={movieOptions}
              selected={selectedMovieId}
              onSelect={setSelectedMovieId}
            />
            <Dropdown
              label="Select Date"
              options={dateOptions}
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <Dropdown
              label="Select Showtime"
              options={timingOptions}
              selected={selectedTiming}
              onSelect={setSelectedTiming}
            />
          </div>

          {/* Action Buttons: Choose Seats + Instant Quick Book */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={handleBookNow}
              style={{
                height: 48,
                padding: '0 24px',
                background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                borderRadius: 10,
                color: '#181715',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 157, 22, 0.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 157, 22, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 157, 22, 0.3)';
              }}
            >
              BOOK NOW
            </button>

            <button
              onClick={handleInstantQuickBook}
              style={{
                height: 48,
                padding: '0 20px',
                background: '#33312D',
                border: '1.5px solid #FF9D16',
                borderRadius: 10,
                color: '#FF9D16',
                fontFamily: 'Bebas Neue',
                letterSpacing: '0.06em',
                fontSize: 19,
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
              <span>QUICK 1-TAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Bar */}
      <div
        className="md:hidden"
        style={{
          background: '#24221F',
          borderBottom: '1px solid #3A3731',
          position: 'sticky',
          top: 72,
          zIndex: 900,
        }}
      >
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          style={{
            width: '100%',
            padding: '13px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            color: '#FFFFFF',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#FF9D16' }}>🎬</span>
            <span>Quick Book: {movies.find((m) => m.id === selectedMovieId)?.title || 'Movie'}</span>
          </span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF9D16"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: mobileExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {mobileExpanded && (
          <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Movie Selector */}
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 8,
                padding: '11px 14px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: 13,
                width: '100%',
              }}
            >
              {movieOptions.map((o) => (
                <option key={o.value} value={o.value} style={{ background: '#33312D' }}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Date Selector */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 8,
                padding: '11px 14px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: 13,
                width: '100%',
              }}
            >
              {dateOptions.map((o) => (
                <option key={o.value} value={o.value} style={{ background: '#33312D' }}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Timing Selector */}
            <select
              value={selectedTiming}
              onChange={(e) => setSelectedTiming(e.target.value)}
              style={{
                background: '#33312D',
                border: '1px solid #665946',
                borderRadius: 8,
                padding: '11px 14px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: 13,
                width: '100%',
              }}
            >
              {timingOptions.map((o) => (
                <option key={o.value} value={o.value} style={{ background: '#33312D' }}>
                  {o.label}
                </option>
              ))}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
              <button
                onClick={handleBookNow}
                style={{
                  background: 'linear-gradient(135deg, #FF9D16, #CC903B)',
                  borderRadius: 10,
                  padding: '12px',
                  color: '#181715',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                }}
              >
                SELECT SEATS
              </button>
              <button
                onClick={handleInstantQuickBook}
                style={{
                  background: '#33312D',
                  border: '1.5px solid #FF9D16',
                  borderRadius: 10,
                  padding: '12px',
                  color: '#FF9D16',
                  fontFamily: 'Bebas Neue',
                  letterSpacing: '0.06em',
                  fontSize: 19,
                }}
              >
                ⚡ 1-TAP BOOK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
