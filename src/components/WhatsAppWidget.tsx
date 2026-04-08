import React, { useState } from 'react';
import './WhatsAppWidget.css';

const WA_NUMBER = '254736564564';
const DEFAULT_MSG = "Hello! I'd like to get a quote for a custom interior build or seating installation.";

interface WhatsAppWidgetProps {
  prefilledMessage?: string;
}

const WaIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ prefilledMessage }) => {
  const [open, setOpen] = useState(false);

  const openChat = (msg?: string) => {
    const message = msg || prefilledMessage || DEFAULT_MSG;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={`wa-root${open ? ' wa-root--open' : ''}`}>
      {open && (
        <div className="wa-popup" role="dialog" aria-label="Chat with Modern Cushions on WhatsApp">
          <div className="wa-popup-head">
            <div className="wa-avatar">
              <WaIcon size={20} />
            </div>
            <div className="wa-popup-meta">
              <strong>Modern Cushions</strong>
              <span className="wa-status">
                <span className="wa-status-dot" />
                Usually replies in under 1 hour
              </span>
            </div>
            <button className="wa-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="wa-popup-body">
            <div className="wa-time-label">Today</div>
            <div className="wa-bubble">
              <p>Hello! 👋 Welcome to <strong>Modern Cushions</strong>.</p>
              <p>Chat with us for a free quote on your vehicle interior, stadium seating, or bespoke build.</p>
              <p>We reply fast — usually within the hour.</p>
            </div>
          </div>

          <div className="wa-popup-quick">
            <p className="wa-quick-label">Quick enquiries:</p>
            <div className="wa-quick-btns">
              <button onClick={() => openChat("Hi, I'd like a quote for a van interior conversion.")} className="wa-quick-chip">
                Van Interior Quote
              </button>
              <button onClick={() => openChat("Hi, I need PSV/matatu seats — can you assist?")} className="wa-quick-chip">
                PSV / Matatu Seats
              </button>
              <button onClick={() => openChat("Hi, I'm interested in stadium seating for my facility.")} className="wa-quick-chip">
                Stadium Seating
              </button>
            </div>
          </div>

          <div className="wa-popup-foot">
            <button className="wa-btn-start" onClick={() => openChat()}>
              <WaIcon size={18} />
              Start Chat on WhatsApp
            </button>
          </div>
        </div>
      )}

      <button
        className="wa-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <WaIcon size={26} />
        {!open && <span className="wa-fab-label">Chat with us</span>}
      </button>
    </div>
  );
};

export default WhatsAppWidget;
