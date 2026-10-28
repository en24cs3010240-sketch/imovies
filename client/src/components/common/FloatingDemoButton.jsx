import React, { useState } from 'react';
import { Play, Video, Sparkles, ExternalLink } from 'lucide-react';
import DemoModal from './DemoModal';

const FloatingDemoButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button - Always visible bottom-right */}
      <aside
        aria-label="Demo Video Tour Shortcut"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1055,
        }}
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn d-flex align-items-center gap-2 text-white fw-bold shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #e50914 0%, #b80610 100%)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 8px 30px rgba(229, 9, 20, 0.65), 0 0 15px rgba(229, 9, 20, 0.4)',
            transition: 'all 0.25s ease-in-out',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(229, 9, 20, 0.85), 0 0 25px rgba(229, 9, 20, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(229, 9, 20, 0.65), 0 0 15px rgba(229, 9, 20, 0.4)';
          }}
          title="Watch complete product video walkthrough & user guide"
        >
          {/* Pulsing indicator dot */}
          <span
            className="d-inline-block rounded-circle bg-white"
            style={{
              width: '8px',
              height: '8px',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <Play size={17} className="fill-white" />
          <span>Demo Video</span>
        </button>
      </aside>

      {/* Embedded Demo Modal */}
      <DemoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default FloatingDemoButton;
