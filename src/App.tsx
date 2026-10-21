import { useState, useEffect, useRef } from 'react';
import type { Page, BookingState, BookingRecord } from './types';
import { db } from './db/database';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickBookingBar from './components/QuickBookingBar';
import BottomTabBar from './components/BottomTabBar';
import CinemaLoader from './components/CinemaLoader';
import Login from './pages/Login';
import Register from './pages/Register';
import Otp from './pages/Otp';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import SeatSelection from './pages/SeatSelection';
import OrderItQuick from './pages/OrderItQuick';
import Food from './pages/Food';
import Payment from './pages/Payment';
import QRPayment from './pages/QRPayment';
import Confirmed from './pages/Confirmed';
import QuickConfirmed from './pages/QuickConfirmed';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ComingSoon from './pages/ComingSoon';
import Trending from './pages/Trending';
import DesignSystem from './pages/DesignSystem';

const NAVBAR_PAGES: Page[] = [
  'home', 'movie-detail', 'search', 'offers', 'profile', 'about', 'contact',
  'privacy', 'terms', 'coming-soon', 'trending', 'design-system',
];
const FOOTER_PAGES: Page[] = [
  'home', 'movie-detail', 'search', 'offers', 'about', 'contact',
  'privacy', 'terms', 'design-system',
];
const BOTTOM_TAB_PAGES: Page[] = [
  'home', 'movie-detail', 'search', 'offers', 'profile', 'about',
  'contact', 'privacy', 'terms', 'coming-soon', 'trending', 'food',
  'payment', 'design-system',
];

const defaultBookingState: BookingState = {
  movieId: 'the-last-signal',
  movieTitle: 'The Last Signal',
  theaterId: 'cinetix-imax-downtown',
  theaterName: 'Cinetix Grand IMAX Downtown',
  date: 'Today',
  showtime: null,
  selectedSeats: ['E4', 'E5'],
  foodItems: [],
  totalAmount: 140,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [bookingState, setBookingState] = useState<BookingState>(defaultBookingState);
  const [transitioning, setTransitioning] = useState(false);
  const [myBookings, setMyBookings] = useState<BookingRecord[]>(() => db.getBookings());

  const addBooking = (record: BookingRecord) => {
    setMyBookings((prev) => {
      if (prev.find((b) => b.id === record.id)) return prev;
      return [record, ...prev];
    });
  };

  const pendingPage = useRef<{ page: Page; updates?: Partial<BookingState> } | null>(null);

  const navigate = (page: Page, updates?: Partial<BookingState>) => {
    pendingPage.current = { page, updates };
    setTransitioning(true);
  };

  useEffect(() => {
    if (!transitioning || !pendingPage.current) return;
    const timer = setTimeout(() => {
      const { page, updates } = pendingPage.current!;
      if (updates) setBookingState((prev) => ({ ...prev, ...updates }));
      setCurrentPage(page);
      window.scrollTo(0, 0);
      pendingPage.current = null;
      setTransitioning(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [transitioning]);

  const movie = db.getMovies().find((m) => m.id === bookingState.movieId) || db.getMovies()[0];

  const showNavbar = NAVBAR_PAGES.includes(currentPage);
  const showFooter = FOOTER_PAGES.includes(currentPage);
  const showBottomTab = BOTTOM_TAB_PAGES.includes(currentPage);
  const showQuickBar = currentPage === 'home';

  return (
    <div
      style={{
        backgroundColor: '#181715',
        minHeight: '100vh',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {showNavbar && <Navbar currentPage={currentPage} navigate={navigate} />}

      <main
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {currentPage === 'login' && <Login navigate={navigate} />}
        {currentPage === 'register' && <Register navigate={navigate} />}
        {currentPage === 'otp' && <Otp navigate={navigate} />}
        {currentPage === 'home' && (
          <>
            {showQuickBar && <QuickBookingBar navigate={navigate} />}
            <Home movie={movie} navigate={navigate} />
          </>
        )}
        {currentPage === 'movie-detail' && <MovieDetail movie={movie} navigate={navigate} />}
        {currentPage === 'booking' && <Booking movie={movie} bookingState={bookingState} navigate={navigate} />}
        {currentPage === 'seat-selection' && (
          <SeatSelection movie={movie} bookingState={bookingState} navigate={navigate} />
        )}
        {currentPage === 'order-it-quick' && <OrderItQuick movie={movie} navigate={navigate} />}
        {currentPage === 'food' && (
          <Food bookingState={bookingState} navigate={navigate} setBookingState={setBookingState} />
        )}
        {currentPage === 'payment' && <Payment movie={movie} bookingState={bookingState} navigate={navigate} />}
        {currentPage === 'qr-payment' && <QRPayment bookingState={bookingState} navigate={navigate} />}
        {currentPage === 'confirmed' && (
          <Confirmed movie={movie} bookingState={bookingState} navigate={navigate} addBooking={addBooking} />
        )}
        {currentPage === 'quick-confirmed' && <QuickConfirmed movie={movie} navigate={navigate} />}
        {currentPage === 'search' && <Search navigate={navigate} />}
        {currentPage === 'offers' && <Offers navigate={navigate} />}
        {currentPage === 'profile' && <Profile navigate={navigate} myBookings={myBookings} />}
        {currentPage === 'edit-profile' && <EditProfile navigate={navigate} />}
        {currentPage === 'about' && <About navigate={navigate} />}
        {currentPage === 'contact' && <Contact navigate={navigate} />}
        {currentPage === 'privacy' && <PrivacyPolicy navigate={navigate} />}
        {currentPage === 'terms' && <Terms navigate={navigate} />}
        {currentPage === 'coming-soon' && <ComingSoon navigate={navigate} />}
        {currentPage === 'trending' && <Trending navigate={navigate} />}
        {currentPage === 'design-system' && <DesignSystem navigate={navigate} />}
      </main>

      {showFooter && <Footer navigate={navigate} />}
      {showBottomTab && <BottomTabBar currentPage={currentPage} navigate={navigate} />}
    </div>
  );
}
