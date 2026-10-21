import type { Page } from '../types';

interface Props {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const tabs = [
  { icon: '🏠', label: 'Home', page: 'home' as Page },
  { icon: '🎬', label: 'Movies', page: 'movie-detail' as Page },
  { icon: '🎁', label: 'Offers', page: 'offers' as Page },
  { icon: '🎨', label: 'Design', page: 'design-system' as Page },
  { icon: '👤', label: 'Profile', page: 'profile' as Page },
];

export default function BottomTabBar({ currentPage, navigate }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#24221F',
        borderTop: '1px solid #3A3731',
        display: 'flex',
        zIndex: 1000,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
      }}
      className="bottom-tab-bar"
    >
      {tabs.map((tab) => {
        const active = currentPage === tab.page;
        return (
          <button
            key={tab.page}
            onClick={() => navigate(tab.page)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'none',
              padding: 0,
              position: 'relative',
            }}
          >
            <span
              style={{
                fontSize: 20,
                filter: active ? 'none' : 'grayscale(1)',
                opacity: active ? 1 : 0.6,
                transform: active ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? '#FF9D16' : '#C7BFB5',
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#FF9D16',
                  position: 'absolute',
                  bottom: 4,
                  boxShadow: '0 0 6px #FF9D16',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
