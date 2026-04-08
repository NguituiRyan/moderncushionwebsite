import React from 'react';
import { ChevronLeft } from 'lucide-react';
import './Catalog.css';

interface StadiaCatalogProps {
  onBack: () => void;
}

const StadiaCatalog: React.FC<StadiaCatalogProps> = ({ onBack }) => {
  const projects = [
    {
      id: 1,
      name: 'Kasarani Stadium — VIP Sector',
      image: '/modern cushions/20250403_142316.jpg',
      description:
        'Complete overhaul of the VIP and VVIP sectors with ergonomic leather padding matching the national colors. Designed for extreme durability and sun-fade resistance.',
    },
    {
      id: 2,
      name: 'Ulinzi Sports Complex',
      image: '/modern cushions/20250403_154519.jpg',
      description:
        'Deployed high-impact injected polymer seating across the main spectator stands. Built to withstand extreme weather conditions and heavy spectator loads.',
    },
    {
      id: 3,
      name: 'CAF Technical Benches',
      image: '/modern cushions/20250403_154708.jpg',
      description:
        'Custom-built dugout and technical bench seating adhering strictly to CAF (Confederation of African Football) regulations for player comfort and safety.',
    },
  ];

  return (
    <div className="catalog-page animate-fade-in">
      <div className="catalog-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Home
        </button>
        <h1 className="catalog-title">Stadia Seating</h1>
        <div style={{ width: 140 }} />
      </div>

      <div className="catalog-content">
        <div className="catalog-intro">
          <h2>Engineered for the Roar of the Crowd</h2>
          <p>
            Modern Cushions is a premier provider of major stadium seating across Kenya. All installations are{' '}
            <strong style={{ color: 'var(--gold)' }}>CAF Regulated</strong>, ensuring international compliance,
            exceptional durability against the elements, and supreme spectator comfort.
          </p>
        </div>

        <div className="catalog-grid">
          {projects.map((project) => (
            <div key={project.id} className="catalog-item">
              <div className="catalog-item-image">
                <img src={project.image} alt={project.name} />
                <div className="catalog-image-overlay">
                  <span>Explore</span>
                </div>
                <span className="catalog-category-badge">Stadia</span>
              </div>
              <div className="catalog-item-details">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="catalog-item-footer">
                  <span className="availability">CAF Certified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StadiaCatalog;
