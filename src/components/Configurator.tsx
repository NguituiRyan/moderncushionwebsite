import React, { useState } from 'react';
import { ChevronLeft, Check, ChevronRight } from 'lucide-react';
import { trimOptions, colorOptions, accessoryOptions, flooringOptions } from '../data/configuratorData';
import type { TrimOption, ColorOption } from '../data/configuratorData';
import QuoteModal from './QuoteModal';
import type { BuildData } from './QuoteModal';
import './Configurator.css';

interface ConfiguratorProps {
  vehicleType: 'nissan' | 'toyota';
  capacity: '7L' | '9L';
  onBack: () => void;
}

const STEPS = ['Seat Type', 'Texture', 'Flooring', 'Accessories', 'Summary'];

const CAPACITY_LABEL: Record<'7L' | '9L', string> = { '7L': '7-Seater', '9L': '9-Seater' };

const Configurator: React.FC<ConfiguratorProps> = ({ vehicleType, capacity, onBack }) => {
  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(trimOptions[0]);
  const [selectedExterior, setSelectedExterior] = useState<ColorOption>(colorOptions[0]);
  const [selectedFlooring, setSelectedFlooring] = useState<string>(flooringOptions[0].id);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectedFlooringOption = flooringOptions.find((f) => f.id === selectedFlooring)!;

  return (
    <div className="configurator">

      {/* ── Header ── */}
      <div className="cfg-header">
        <div className="cfg-header-left">
          <button className="cfg-back-btn" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <div className="cfg-vehicle-info">
            <span className="cfg-model">
              {vehicleType === 'nissan' ? 'Nissan Caravan' : 'Toyota Hiace'}
            </span>
            <span className="cfg-subtitle">{CAPACITY_LABEL[capacity]} · Custom Interior Build</span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="cfg-steps">
          {STEPS.map((step, i) => (
            <div key={i} className="cfg-step">
              <span className="cfg-step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="cfg-step-name">{step}</span>
            </div>
          ))}
        </div>

        {/* Quote CTA */}
        <div className="cfg-price-block">
          <span className="cfg-price-label">Pricing</span>
          <span className="cfg-price-value">On Request</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="cfg-body">

        {/* 3D Preview */}
        <div className="cfg-preview-pane">
          <div className="cfg-iframe-wrapper">
            <iframe
              title={`${vehicleType === 'nissan' ? 'Nissan Caravan' : 'Toyota Hiace'} 3D Model`}
              style={{ border: 0 }}
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src={`https://sketchfab.com/models/${
                vehicleType === 'nissan'
                  ? 'bfddc35e8b40441cbaa291ef0b120935'
                  : '19f82e92a8e04400baaa185b52995356'
              }/embed?transparent=1&autostart=1&ui_theme=dark`}
            />
          </div>
          <div className="cfg-preview-hint glass-dark">
            <span className="cfg-hint-title">Interactive 3D Model</span>
            <span className="cfg-hint-sub">Drag to rotate · Scroll to zoom</span>
          </div>
        </div>

        {/* Options pane */}
        <div className="cfg-options-pane">

          {/* Step 01 — Seat Type */}
          <div className="cfg-section">
            <div className="cfg-section-header">
              <span className="cfg-section-num">01</span>
              <h2 className="cfg-section-title">Select Seat Type</h2>
            </div>
            <div className="cfg-options-list">
              {trimOptions.map((trim) => (
                <div
                  key={trim.id}
                  className={`cfg-option-card ${selectedTrim.id === trim.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedTrim(trim)}
                >
                  {trim.image && (
                    <div className="cfg-option-img">
                      <img src={trim.image} alt={trim.name} />
                    </div>
                  )}
                  <div className="cfg-option-top">
                    <h3>{trim.name}</h3>
                  </div>
                  <ul className="cfg-feature-list">
                    {trim.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  {selectedTrim.id === trim.id && (
                    <div className="cfg-selected-badge">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 02 — Interior Texture */}
          <div className="cfg-section">
            <div className="cfg-section-header">
              <span className="cfg-section-num">02</span>
              <h2 className="cfg-section-title">Interior Texture</h2>
            </div>
            <div className="cfg-options-list">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className={`cfg-color-card ${selectedExterior.id === color.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedExterior(color)}
                >
                  {color.image ? (
                    <img src={color.image} alt={color.name} className="cfg-texture-swatch" />
                  ) : (
                    <div className="cfg-color-swatch" style={{ backgroundColor: color.hex }} />
                  )}
                  <div className="cfg-color-info">
                    <span className="cfg-color-name">{color.name}</span>
                  </div>
                  {selectedExterior.id === color.id && (
                    <div className="cfg-selected-badge cfg-selected-badge--right">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 03 — Flooring */}
          <div className="cfg-section">
            <div className="cfg-section-header">
              <span className="cfg-section-num">03</span>
              <h2 className="cfg-section-title">Flooring Type</h2>
            </div>
            <div className="cfg-options-list">
              {flooringOptions.map((floor) => (
                <div
                  key={floor.id}
                  className={`cfg-floor-card ${selectedFlooring === floor.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedFlooring(floor.id)}
                >
                  {floor.image && (
                    <div className="cfg-floor-img">
                      <img src={floor.image} alt={floor.name} />
                    </div>
                  )}
                  <div className="cfg-floor-body">
                    <span className="cfg-floor-name">{floor.name}</span>
                    <span className="cfg-floor-desc">{floor.description}</span>
                  </div>
                  {selectedFlooring === floor.id && (
                    <div className="cfg-selected-badge cfg-selected-badge--right">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 04 — Accessories */}
          <div className="cfg-section">
            <div className="cfg-section-header">
              <span className="cfg-section-num">04</span>
              <h2 className="cfg-section-title">Accessories</h2>
            </div>
            <div className="cfg-options-list">
              {accessoryOptions.map((acc) => {
                const isSelected = selectedAccessories.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    className={`cfg-acc-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => toggleAccessory(acc.id)}
                  >
                    <div className={`cfg-checkbox ${isSelected ? 'is-checked' : ''}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="cfg-acc-body">
                      {acc.image && (
                        <div className="cfg-acc-thumb">
                          <img src={acc.image} alt={acc.name} />
                        </div>
                      )}
                      <div className="cfg-acc-text">
                        <span className="cfg-acc-category">{acc.category}</span>
                        <span className="cfg-acc-name">{acc.name}</span>
                        <span className="cfg-acc-desc">{acc.description}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 05 — Summary */}
          <div className="cfg-section cfg-summary-section">
            <div className="cfg-section-header">
              <span className="cfg-section-num">05</span>
              <h2 className="cfg-section-title">Final Summary</h2>
            </div>

            <div className="cfg-summary-box">
              <div className="cfg-summary-row">
                <span>Configuration</span>
                <span>{CAPACITY_LABEL[capacity]}</span>
              </div>
              <div className="cfg-summary-row">
                <span>Seat Type</span>
                <span>{selectedTrim.name}</span>
              </div>
              <div className="cfg-summary-row">
                <span>Texture</span>
                <div className="cfg-summary-swatch-row">
                  {selectedExterior.image ? (
                    <img src={selectedExterior.image} alt="Texture" className="cfg-mini-swatch" />
                  ) : (
                    <div className="cfg-mini-dot" style={{ backgroundColor: selectedExterior.hex }} />
                  )}
                  <span>{selectedExterior.name}</span>
                </div>
              </div>
              <div className="cfg-summary-row">
                <span>Flooring</span>
                <span>{selectedFlooringOption.name}</span>
              </div>
              {selectedAccessories.map((id) => {
                const acc = accessoryOptions.find((a) => a.id === id)!;
                return (
                  <div key={id} className="cfg-summary-row">
                    <span>Accessory</span>
                    <span>{acc.name}</span>
                  </div>
                );
              })}
              <div className="cfg-summary-total">
                <span>Pricing</span>
                <span className="cfg-total-amount">Provided on quotation</span>
              </div>
            </div>

            <button className="cfg-quote-btn" onClick={() => setQuoteOpen(true)}>
              Request Quote For This Build <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {quoteOpen && (
        <QuoteModal
          buildData={{
            vehicle: vehicleType === 'nissan' ? 'Nissan Caravan' : 'Toyota Hiace',
            vehicleType,
            capacity: CAPACITY_LABEL[capacity],
            seatType: selectedTrim,
            texture: selectedExterior,
            flooring: selectedFlooringOption.name,
            accessories: selectedAccessories
              .map((id) => accessoryOptions.find((a) => a.id === id)!)
              .filter(Boolean),
          } satisfies BuildData}
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </div>
  );
};

export default Configurator;
