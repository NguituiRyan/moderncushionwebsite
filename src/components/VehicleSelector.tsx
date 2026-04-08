import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './VehicleSelector.css';

interface VehicleSelectorProps {
  onSelect: (vehicle: 'nissan' | 'toyota') => void;
  onBack: () => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onSelect, onBack }) => {
  const [hoveredVehicle, setHoveredVehicle] = useState<'nissan' | 'toyota' | null>(null);

  return (
    <div className="vs-page">

      {/* Header */}
      <div className="vs-header">
        <button className="vs-back-btn" onClick={onBack}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        <div className="vs-logo">
          <span className="logo-mark">MODERN</span>
          <span className="logo-bold">CUSHIONS</span>
          <span className="vs-logo-divider">|</span>
          <span className="vs-logo-sub">Configurator</span>
        </div>
        <div className="vs-header-spacer" />
      </div>

      {/* Intro text */}
      <div className="vs-intro">
        <span className="category-chip--gold">Step 01 of 03</span>
        <h2>Select Your Platform</h2>
        <p>Choose the base vehicle to begin customizing your interior</p>
      </div>

      {/* Split panels */}
      <div className="vs-split">

        {/* Nissan Caravan */}
        <div
          className={`vs-panel ${hoveredVehicle === 'nissan' ? 'is-hovered' : ''}`}
          onClick={() => onSelect('nissan')}
          onMouseEnter={() => setHoveredVehicle('nissan')}
          onMouseLeave={() => setHoveredVehicle(null)}
        >
          <img
            src="/modern cushions/20240424_155434.jpg"
            alt="Nissan Caravan E26"
            className="vs-panel-image"
          />
          <div className="vs-panel-overlay" />
          <div className="vs-panel-content">
            <span className="vs-platform-badge">E26 Platform</span>
            <h3>Nissan Caravan</h3>
            <p className="vs-panel-desc">Long-wheel-base workhorse — ideal for luxury PSV and VIP shuttle conversions.</p>
            <button className="vs-cta-btn">
              Begin Configuration <ChevronRight size={16} />
            </button>
          </div>
          <div className="vs-panel-line" />
        </div>

        {/* Toyota Hiace */}
        <div
          className={`vs-panel ${hoveredVehicle === 'toyota' ? 'is-hovered' : ''}`}
          onClick={() => onSelect('toyota')}
          onMouseEnter={() => setHoveredVehicle('toyota')}
          onMouseLeave={() => setHoveredVehicle(null)}
        >
          <img
            src="/modern cushions/20240430_090205.jpg"
            alt="Toyota Hiace H200"
            className="vs-panel-image"
          />
          <div className="vs-panel-overlay" />
          <div className="vs-panel-content">
            <span className="vs-platform-badge">H200 Platform</span>
            <h3>Toyota Hiace</h3>
            <p className="vs-panel-desc">The benchmark van for premium transport — trusted across East Africa for reliability and range.</p>
            <button className="vs-cta-btn">
              Begin Configuration <ChevronRight size={16} />
            </button>
          </div>
          <div className="vs-panel-line" />
        </div>

      </div>

    </div>
  );
};

export default VehicleSelector;
