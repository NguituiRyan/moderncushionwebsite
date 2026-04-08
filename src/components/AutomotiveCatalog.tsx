import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Catalog.css';

interface AutomotiveCatalogProps {
  onBack: () => void;
  onStartConfigurator: () => void;
}

const AutomotiveCatalog: React.FC<AutomotiveCatalogProps> = ({ onBack, onStartConfigurator }) => {
  const seats = [
    {
      id: 1,
      name: 'Luxury VIP Recliner',
      image: '/modern cushions/20240428_095514.jpg',
      description:
        'Premium leather finishing with deep cushioning, perfect for high-end PSV conversions and VIP transport. Features multi-angle recliners and heavy-duty armrests.',
    },
    {
      id: 2,
      name: 'Standard Matatu 14-Seater Build',
      image: '/modern cushions/20240424_155624.jpg',
      description:
        'The core setup for the Kenyan PSV system. Optimized for maximum spacing while maintaining durability against heavy daily usage. Finished in distressed cognac brown.',
    },
    {
      id: 3,
      name: 'Sport Custom Seats',
      image: '/modern cushions/20240426_165040.jpg',
      description:
        'Recaro-inspired deeply bolstered bucket seats for passenger or motorsport usage. Extreme lateral support wrapped in high-texture, breathable materials.',
    },
    {
      id: 4,
      name: 'Executive Captain Chairs',
      image: '/modern cushions/20240426_165037.jpg',
      description:
        'Independent luxury captain seats for the middle row of customized SUVs or premium shuttles. Featuring quilt stitching and headrest wings.',
    },
  ];

  return (
    <div className="catalog-page animate-fade-in">
      <div className="catalog-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Home
        </button>
        <h1 className="catalog-title">Automotive Seats</h1>
        <button className="btn-red btn-sm" onClick={onStartConfigurator}>
          Open Configurator <ChevronRight size={14} />
        </button>
      </div>

      <div className="catalog-content">
        <div className="catalog-intro">
          <h2>Peerless Craftsmanship for the Road</h2>
          <p>
            Modern Cushions provides an extensive range of automotive solutions — from robust matatu setups to VIP luxury transport.
            All fabricated locally at Enterprise Road, Nairobi, with obsessive attention to material quality and ergonomics.
          </p>
        </div>

        <div className="catalog-grid">
          {seats.map((seat) => (
            <div key={seat.id} className="catalog-item">
              <div className="catalog-item-image">
                <img src={seat.image} alt={seat.name} />
                <div className="catalog-image-overlay">
                  <span>Explore</span>
                </div>
                <span className="catalog-category-badge">Automotive</span>
              </div>
              <div className="catalog-item-details">
                <h3>{seat.name}</h3>
                <p>{seat.description}</p>
                <div className="catalog-item-footer">
                  <span className="availability">Made to Order</span>
                  <button className="btn-link" onClick={onStartConfigurator}>
                    Configure <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomotiveCatalog;
