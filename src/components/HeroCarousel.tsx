import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './HeroCarousel.css';

interface Slide {
  id: number;
  image: string;
  category: string;
  tagline: string;
  title: React.ReactNode;
  description: string;
  linkText: string;
  action: () => void;
}

interface HeroCarouselProps {
  onNavigate: (page: string) => void;
}

const SLIDE_DURATION = 6000;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const slides: Slide[] = [
    {
      id: 1,
      image: '/modern cushions/20240424_155624.jpg',
      category: 'Automotive',
      tagline: 'Modern Cushions',
      title: <>Seats For Passenger<br />Cars & Motorsports</>,
      description: 'A passionate, pioneering spirit. From luxury vehicle interiors to high-endurance matatu and PSV seating solutions.',
      linkText: 'Explore Automotive',
      action: () => onNavigate('automotive'),
    },
    {
      id: 2,
      image: '/modern cushions/20240329_124958.jpg',
      category: 'Configurator',
      tagline: 'Build Your Vision',
      title: <>Design Your<br />Interior Online</>,
      description: 'Customize your Nissan Caravan or Toyota Hiace in 3D. Choose seat types, textures, and accessories — then get an instant quote.',
      linkText: 'Start Configurator',
      action: () => onNavigate('vehicle-selector'),
    },
    {
      id: 3,
      image: '/modern cushions/20250403_154519.jpg',
      category: 'Stadia',
      tagline: 'Modern Cushions',
      title: <>Robust Stadium<br />Seating Solutions</>,
      description: 'Weather-resistant, ergonomic seating deployed across Kenyan stadiums. CAF regulated and built for the long game.',
      linkText: 'View Stadia Solutions',
      action: () => onNavigate('stadia'),
    },
  ];

  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setProgressKey((k) => k + 1);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  return (
    <div className="hero-carousel-container">

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="hero-carousel-slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background image with subtle zoom */}
          <motion.div
            className="hero-background-wrapper"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: 'linear' }}
          >
            <div className="hero-overlay" />
            <img
              src={slides[current].image}
              alt={slides[current].category}
              className="hero-bg-image"
            />
          </motion.div>

          {/* Text content */}
          <div className="hero-content-layer">
            <motion.div
              className="hero-text-content"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="slide-category category-chip--gold">{slides[current].category}</span>
              <span className="hero-tagline">{slides[current].tagline}</span>
              <h1 className="hero-title">{slides[current].title}</h1>
              <p className="hero-description">{slides[current].description}</p>
              <div className="hero-actions">
                <button className="hero-btn-primary" onClick={slides[current].action}>
                  {slides[current].linkText} <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Slide counter — top right */}
          <div className="slide-counter">
            <span className="slide-current">{String(current + 1).padStart(2, '0')}</span>
            <span className="slide-sep">/</span>
            <span className="slide-total">{String(slides.length).padStart(2, '0')}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button className="hero-arrow hero-arrow--prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeft size={22} />
      </button>
      <button className="hero-arrow hero-arrow--next" onClick={next} aria-label="Next slide">
        <ChevronRight size={22} />
      </button>

      {/* Progress lines */}
      <div className="hero-progress">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`progress-line ${idx === current ? 'active' : idx < current ? 'done' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className="progress-fill"
              key={idx === current ? progressKey : idx}
            />
          </button>
        ))}
      </div>

    </div>
  );
};
