import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import './CapacitySelector.css';

interface CapacitySelectorProps {
  vehicleType: 'nissan' | 'toyota';
  onSelect: (capacity: '7L' | '9L') => void;
  onBack: () => void;
}

const capacities = [
  {
    id: '7L' as const,
    number: '7',
    label: '7-Seater',
    badge: 'Executive Layout',
    tagline: 'Premium comfort per passenger',
    specs: [
      'Wider captain chair spacing',
      'Extended legroom per row',
      'Ideal for VIP & executive transport',
      'Enhanced ergonomic support',
    ],
  },
  {
    id: '9L' as const,
    number: '9',
    label: '9-Seater',
    badge: 'High Capacity',
    tagline: 'Maximum capacity, zero compromise',
    specs: [
      'Full 3-row seating configuration',
      'Optimised seat spacing for PSV',
      'Durable heavy-duty upholstery',
      'CAF-compliant group transport',
    ],
  },
];

const CapacitySelector: React.FC<CapacitySelectorProps> = ({ vehicleType, onSelect, onBack }) => {
  const [hovered, setHovered] = useState<'7L' | '9L' | null>(null);

  const vehicleName = vehicleType === 'nissan' ? 'Nissan Caravan' : 'Toyota Hiace';

  return (
    <div className="cap-page">

      {/* Header */}
      <div className="cap-header">
        <button className="cap-back-btn" onClick={onBack}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        <div className="cap-logo">
          <span className="logo-mark">MODERN</span>
          <span className="logo-bold">CUSHIONS</span>
          <span className="cap-logo-divider">|</span>
          <span className="cap-logo-sub">Configurator</span>
        </div>
        <div className="cap-header-spacer" />
      </div>

      {/* Intro */}
      <div className="cap-intro">
        <span className="category-chip--gold">Step 02</span>
        <h2>Choose Configuration</h2>
        <p>Select the seating capacity for your <strong>{vehicleName}</strong></p>
      </div>

      {/* Panels */}
      <div className="cap-split">
        {capacities.map((cap) => (
          <div
            key={cap.id}
            className={`cap-panel ${hovered === cap.id ? 'is-hovered' : ''}`}
            onClick={() => onSelect(cap.id)}
            onMouseEnter={() => setHovered(cap.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Giant decorative number */}
            <span className="cap-bg-number">{cap.number}</span>

            <div className="cap-panel-content">
              <div className="cap-seats-row">
                <Users size={16} className="cap-seats-icon" />
                <span className="cap-seats-label">{cap.label}</span>
              </div>
              <span className="cap-panel-badge">{cap.badge}</span>
              <h3 className="cap-panel-title">{cap.number}-Seater</h3>
              <p className="cap-panel-tagline">{cap.tagline}</p>

              <ul className="cap-specs-list">
                {cap.specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>

              <button className="cap-cta-btn">
                Select {cap.label} <ChevronRight size={16} />
              </button>
            </div>

            <div className="cap-panel-line" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default CapacitySelector;
