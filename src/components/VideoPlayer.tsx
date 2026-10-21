interface Props {
  url: string;
  onClose: () => void;
}

export default function VideoPlayer({ url, onClose }: Props) {
  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.95)', 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '16px' // Adds space so video doesn't touch screen edges
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: 900, 
          position: 'relative',
          background: '#000',
          borderRadius: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* IMPROVED CLOSE BUTTON: visible and clickable on mobile */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: -50, 
            right: 0, 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none',
            color: '#fff', 
            width: 40,
            height: 40,
            borderRadius: '50%',
            fontSize: 20, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* Video Aspect Ratio Box */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 16, overflow: 'hidden' }}>
          <iframe
            src={url}
            title="Trailer"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}