import React, { useState } from 'react';
import {
  Car, Target, Wrench, ChevronRight, MapPin, Phone, Mail,
  Menu, X, Check, ChevronDown, ChevronUp,
  Shield, Clock, Award, Users, Truck,
} from 'lucide-react';

const IgIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FbIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import { HeroCarousel } from './HeroCarousel';
import './LandingPage.css';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const PHONES = ['+254 736 564 564', '+254 784 564 564', '+254 780 564 564'];
const PHONE = PHONES[0];
const WA_NUMBER = '254736564564';
const EMAIL = 'info@moderncushions.co.ke';
const ADDRESS = '64 Old Enterprise Road, Industrial Area, Nairobi, Kenya';

const faqs = [
  {
    q: 'How long does a full van interior build take?',
    a: 'A standard PSV build takes 3–5 working days. VIP and bespoke builds requiring custom fabrication take 7–10 days. Fleet orders of 5+ vehicles are quoted with a specific production schedule.',
  },
  {
    q: 'Are your materials NTSA and PSV compliant?',
    a: 'Yes. All foam densities, seat frames, and upholstery materials used in PSV builds meet NTSA LN 23 requirements for passenger safety. We provide a compliance certificate on request.',
  },
  {
    q: 'Do I need to leave my vehicle with you?',
    a: 'Yes — the vehicle is required on-site at 64 Old Enterprise Road for the full build duration. We offer early drop-off from 7:30 AM and collection up to 6 PM Monday–Friday.',
  },
  {
    q: 'Can you handle airbag-equipped seats?',
    a: 'Yes. Our technicians are trained to work around side-impact airbag systems. We use airbag-safe foam and do not modify or obstruct any SRS components.',
  },
  {
    q: 'What payment methods do you accept?',
    a: `We accept M-Pesa, bank transfer (Equity & KCB), and LPO for verified corporates and SACCOs. A 40% deposit confirms your build slot. Contact us for payment details.`,
  },
  {
    q: 'Do you offer a warranty on your work?',
    a: 'All builds carry a 12-month workmanship warranty covering stitching, foam compression, and frame integrity. Material defects are covered for 24 months. Warranty is voided by modifications from third parties.',
  },
  {
    q: 'Can you work on vehicles other than Nissan Caravan and Toyota Hiace?',
    a: 'Absolutely. While our configurator covers those two popular platforms, we build for any van, minibus, saloon, SUV, or custom application. Contact us with your vehicle details for a bespoke quote.',
  },
];

const testimonials = [
  {
    name: 'James Waweru',
    title: 'Fleet Manager, Bolt Kenya',
    quote: 'We contracted Modern Cushions for 22 vehicles in our driver-partner fleet. Delivery was on schedule, quality was consistent across every single unit, and the drivers have been extremely happy with comfort on long shifts.',
    stars: 5,
    category: 'Fleet',
  },
  {
    name: 'Grace Njoroge',
    title: 'Owner, Prestige Executive Shuttles',
    quote: 'The VIP captain chairs they did for my 4 Hiace Grand Cabins are absolutely world-class. Clients constantly ask who did the interior. I\'ve since referred three other shuttle operators to them.',
    stars: 5,
    category: 'VIP',
  },
  {
    name: 'David Ochieng',
    title: 'Chairman, Safari Sacco',
    quote: 'We\'ve been using Modern Cushions for our entire matatu SACCO for over 4 years. Consistent pricing, fast turnaround, and they understand PSV compliance requirements without needing to be reminded.',
    stars: 5,
    category: 'SACCO',
  },
  {
    name: 'Amina Hassan',
    title: 'Procurement Officer, Kenya Red Cross',
    quote: 'Our field vehicles needed rugged, easy-to-clean interiors for humanitarian deployments. Modern Cushions delivered practical, durable solutions on time and within our NGO budget.',
    stars: 5,
    category: 'Corporate',
  },
];

const processSteps = [
  {
    num: '01',
    icon: <Phone size={22} />,
    title: 'Consultation',
    desc: 'Contact us via WhatsApp, phone, or our configurator. Tell us your vehicle, use case, and timeline. We\'ll advise on the best seat type, materials, and budget.',
  },
  {
    num: '02',
    icon: <Award size={22} />,
    title: 'Design & Quote',
    desc: 'We prepare a detailed quote with material samples, layout diagram, and itemised pricing in KES. No hidden charges. 40% deposit confirms your slot.',
  },
  {
    num: '03',
    icon: <Wrench size={22} />,
    title: 'Build',
    desc: 'Your vehicle enters our 64 Old Enterprise Road workshop. Our craftsmen build, fit, and finish every seat to spec — typically 3–10 days depending on complexity.',
  },
  {
    num: '04',
    icon: <Shield size={22} />,
    title: 'Quality Check',
    desc: 'Every build undergoes a full quality inspection: stitch tension, foam density, frame torque, NTSA compliance check, and a final fit review before handover.',
  },
  {
    num: '05',
    icon: <Check size={22} />,
    title: 'Handover',
    desc: 'We walk you through the completed build, provide your warranty certificate, care guide, and NTSA compliance document. Balance payment on collection.',
  },
];

const galleryImages = [
  { src: '/modern cushions/20240424_155624.jpg', label: 'Luxury PSV Build' },
  { src: '/modern cushions/20240430_090205.jpg', label: 'Toyota Hiace Interior' },
  { src: '/modern cushions/20240426_165040.jpg', label: 'Cognac Leather Finish' },
  { src: '/modern cushions/20250403_142316.jpg', label: 'Kasarani VIP Sector' },
  { src: '/modern cushions/20240426_165101.jpg', label: 'Recaro-Style Bolstered' },
  { src: '/modern cushions/20250403_154519.jpg', label: 'Ulinzi Stadium' },
  { src: '/modern cushions/20250403_161242.jpg', label: 'Starlit Roof Lining' },
  { src: '/modern cushions/20240424_155434.jpg', label: 'Nissan Caravan E26' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openWhatsApp = (msg?: string) => {
    const text = msg || "Hello! I'd like to enquire about your upholstery services.";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const scrollTo = (id: string) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page animate-fade-in">

      {/* ── Navigation ── */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-mark">MODERN</span>
          <span className="logo-bold">CUSHIONS</span>
        </div>

        <div className="nav-links">
          <a onClick={() => onNavigate('automotive')}>Automotive</a>
          <a onClick={() => onNavigate('stadia')}>Stadia</a>
          <a onClick={() => scrollTo('misc')}>Bespoke</a>
          <a onClick={() => scrollTo('fleet')}>Fleet</a>
          <a onClick={() => scrollTo('contact')}>Contact</a>
          <button className="btn-red btn-sm" onClick={() => onNavigate('vehicle-selector')}>
            Configure Van <ChevronRight size={14} />
          </button>
        </div>

        <button className="nav-hamburger" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-head">
              <span className="logo-mark">MODERN</span>
              <span className="logo-bold">CUSHIONS</span>
              <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}><X size={20} /></button>
            </div>
            <div className="mobile-nav-links">
              <a onClick={() => { setMobileNavOpen(false); onNavigate('automotive'); }}>Automotive Seating</a>
              <a onClick={() => { setMobileNavOpen(false); onNavigate('stadia'); }}>Stadium Seating</a>
              <a onClick={() => scrollTo('misc')}>Bespoke Builds</a>
              <a onClick={() => scrollTo('fleet')}>Fleet & Corporate</a>
              <a onClick={() => scrollTo('process')}>How It Works</a>
              <a onClick={() => scrollTo('contact')}>Contact</a>
            </div>
            <div className="mobile-nav-ctas">
              <button className="btn-red" style={{ width: '100%' }} onClick={() => { setMobileNavOpen(false); onNavigate('vehicle-selector'); }}>
                Configure Your Van <ChevronRight size={14} />
              </button>
              <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openWhatsApp()}>
                Chat on WhatsApp
              </button>
            </div>
            <div className="mobile-nav-info">
              <span><MapPin size={12} /> 64 Old Enterprise Road, Industrial Area, Nairobi</span>
              <span><Clock size={12} /> Mon–Fri 8:00–17:30 · Sat 9:00–14:00</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Carousel ── */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Vehicles Customized</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">3</span>
          <span className="stat-label">Major Stadia</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">10+</span>
          <span className="stat-label">Years of Craft</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">CAF</span>
          <span className="stat-label">Certified Installs</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">NTSA</span>
          <span className="stat-label">Approved Bodybuilder</span>
        </div>
      </div>

      {/* ── Services Section ── */}
      <section className="services-section">
        <div className="service-card" id="automotive">
          <div className="service-card-img-wrapper">
            <img src="/modern cushions/20240424_155624.jpg" alt="Automotive Seats" />
          </div>
          <div className="service-card-content">
            <span className="category-chip">Automotive</span>
            <Car className="service-icon" />
            <h3>Automotive Seating</h3>
            <p>Dynamic support and peerless aesthetics. From luxury VIP interiors to high-endurance matatu and PSV seating — all fabricated locally in Nairobi with NTSA-compliant materials.</p>
            <div className="service-trust-row">
              <span><Check size={12} /> NTSA Compliant</span>
              <span><Check size={12} /> 12-Month Warranty</span>
              <span><Check size={12} /> Made to Order</span>
            </div>
            <button className="btn-gold" onClick={() => onNavigate('automotive')}>
              Explore Automotive <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="service-card" id="stadia">
          <div className="service-card-img-wrapper">
            <img src="/modern cushions/20250403_154519.jpg" alt="Stadia Seats" />
          </div>
          <div className="service-card-content">
            <span className="category-chip">Stadia</span>
            <Target className="service-icon" />
            <h3>Stadium Seating</h3>
            <p>Robust, weather-resistant stadium seating built for maximum durability and crowd comfort. Deployed at Kasarani, Ulinzi, and CAF-regulated facilities across Kenya.</p>
            <div className="service-trust-row">
              <span><Check size={12} /> CAF Regulated</span>
              <span><Check size={12} /> UV Resistant</span>
              <span><Check size={12} /> High-Impact Polymer</span>
            </div>
            <button className="btn-gold" onClick={() => onNavigate('stadia')}>
              Explore Stadia <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="service-card" id="misc">
          <div className="service-card-img-wrapper bespoke-placeholder">
            <div className="bespoke-icon-wrap">
              <Wrench size={56} />
              <span>BESPOKE BUILDS</span>
            </div>
          </div>
          <div className="service-card-content">
            <span className="category-chip">Bespoke</span>
            <Wrench className="service-icon" />
            <h3>Miscellaneous Builds</h3>
            <p>Specialized upholstery for any commercial environment — kids' play areas, bowling alleys, boxing equipment padding, office furniture, and more — fully tailored to your specification.</p>
            <div className="featured-project">
              <span className="fp-label">Featured Project</span>
              <span className="fp-name">Westgate Shopping Mall Installations</span>
            </div>
            <button className="btn-gold" onClick={() => openWhatsApp("Hello! I need a quote for a bespoke upholstery project.")}>
              Contact for Custom Builds <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="process-section" id="process">
        <div className="process-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span>Our Process</span>
          </div>
          <h2 className="section-heading">From Consultation<br />to Handover</h2>
          <p className="section-sub">Every build follows a transparent five-step process. No surprises — just craftsmanship delivered on schedule.</p>

          <div className="process-steps">
            {processSteps.map((step) => (
              <div className="process-step" key={step.num}>
                <div className="ps-num">{step.num}</div>
                <div className="ps-icon">{step.icon}</div>
                <h4 className="ps-title">{step.title}</h4>
                <p className="ps-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="process-cta-row">
            <div className="process-meta-item">
              <Clock size={16} />
              <span><strong>3–10 days</strong> typical turnaround</span>
            </div>
            <div className="process-meta-divider" />
            <div className="process-meta-item">
              <Shield size={16} />
              <span><strong>12-month</strong> workmanship warranty</span>
            </div>
            <div className="process-meta-divider" />
            <div className="process-meta-item">
              <Users size={16} />
              <span><strong>40% deposit</strong> confirms your slot</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio Gallery ── */}
      <section className="gallery-section" id="gallery">
        <div className="gallery-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span>Our Work</span>
          </div>
          <h2 className="section-heading">Built in Nairobi.<br />Recognised Across Kenya.</h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div className="gallery-item" key={i}>
              <img src={img.src} alt={img.label} loading="lazy" />
              <div className="gallery-item-overlay">
                <span>{img.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="gallery-cta">
          <button className="btn-gold" onClick={() => onNavigate('automotive')}>
            View Full Automotive Catalog <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section" id="testimonials">
        <div className="testimonials-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span>Client Feedback</span>
          </div>
          <h2 className="section-heading">Trusted by Fleets,<br />SACCOs &amp; Corporates.</h2>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="t-stars">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="t-star">★</span>
                  ))}
                </div>
                <p className="t-quote">"{t.quote}"</p>
                <div className="t-footer">
                  <div className="t-avatar">{t.name.charAt(0)}</div>
                  <div className="t-meta">
                    <strong className="t-name">{t.name}</strong>
                    <span className="t-title">{t.title}</span>
                  </div>
                  <span className="t-category-badge">{t.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet / B2B ── */}
      <section className="fleet-section" id="fleet">
        <div className="fleet-inner">
          <div className="fleet-text">
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span>Fleet &amp; Corporate</span>
            </div>
            <h2 className="section-heading fleet-heading">High-Volume Builds<br />for SACCOs &amp; Fleets.</h2>
            <p className="fleet-desc">We are the preferred upholstery supplier for matatu SACCOs, corporate transport fleets, NGOs, car hire operators, and government agencies across Nairobi. Our workshop capacity handles 20+ seats per week with consistent quality across every unit.</p>

            <div className="fleet-features">
              <div className="fleet-feature">
                <Truck size={18} className="fleet-feature-icon" />
                <div>
                  <strong>Bulk Volume Discounts</strong>
                  <span>Tiered pricing for orders of 5, 10, and 20+ vehicles</span>
                </div>
              </div>
              <div className="fleet-feature">
                <Shield size={18} className="fleet-feature-icon" />
                <div>
                  <strong>NTSA &amp; PSV Compliance</strong>
                  <span>All PSV builds meet LN 23 safety seat standards. Cert provided.</span>
                </div>
              </div>
              <div className="fleet-feature">
                <Users size={18} className="fleet-feature-icon" />
                <div>
                  <strong>LPO &amp; Corporate Accounts</strong>
                  <span>We accept Local Purchase Orders from verified companies and SACCOs</span>
                </div>
              </div>
              <div className="fleet-feature">
                <Award size={18} className="fleet-feature-icon" />
                <div>
                  <strong>Dedicated Fleet Manager</strong>
                  <span>A single point of contact manages your entire fleet order from quote to handover</span>
                </div>
              </div>
            </div>

            <div className="fleet-ctas">
              <button className="btn-red" onClick={() => openWhatsApp("Hello! I manage a fleet/SACCO and would like to discuss bulk seating requirements.")}>
                Request Fleet Quote <ChevronRight size={16} />
              </button>
              <a className="btn-gold" href={`tel:${PHONE.replace(/\s/g, '')}`}>
                Call: {PHONE}
              </a>
            </div>
          </div>

          <div className="fleet-badge-panel">
            <div className="fleet-badge">
              <span className="fb-number">20+</span>
              <span className="fb-label">Seats / Week Capacity</span>
            </div>
            <div className="fleet-badge-divider" />
            <div className="fleet-badge">
              <span className="fb-number">4yr</span>
              <span className="fb-label">Avg. SACCO Relationship</span>
            </div>
            <div className="fleet-badge-divider" />
            <div className="fleet-badge">
              <span className="fb-number">LPO</span>
              <span className="fb-label">Accepted</span>
            </div>
            <div className="fleet-badge-divider" />
            <div className="fleet-badge">
              <span className="fb-number">NTSA</span>
              <span className="fb-label">Compliant Builds</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Warranty & Care ── */}
      <section className="warranty-section" id="warranty">
        <div className="warranty-inner">
          <div className="warranty-card">
            <Shield size={32} className="warranty-shield" />
            <h3>12-Month Workmanship Warranty</h3>
            <p>Every build we complete is guaranteed for 12 months against defects in stitching, foam compression, and frame integrity. Material defects are covered for 24 months from the date of installation.</p>
            <ul className="warranty-list">
              <li><Check size={13} /> Covers stitching, foam, frame, and headliner</li>
              <li><Check size={13} /> 24-month material defect coverage</li>
              <li><Check size={13} /> NTSA compliance certificate issued at handover</li>
              <li><Check size={13} /> Care guide provided for all leather and vinyl finishes</li>
            </ul>
          </div>
          <div className="care-card">
            <Award size={32} className="care-icon" />
            <h3>Kenya-Adapted Care Guide</h3>
            <p>Nairobi's high UV, dust, and heat conditions affect upholstery faster than temperate climates. Follow our care guide to maximise the life of your build.</p>
            <div className="care-tips">
              <div className="care-tip">
                <span className="care-tip-label">Monthly</span>
                <span>Wipe with a slightly damp microfibre cloth. Remove dust from seams.</span>
              </div>
              <div className="care-tip">
                <span className="care-tip-label">Quarterly</span>
                <span>Apply a UV-protective leather conditioner. Avoid alcohol-based products.</span>
              </div>
              <div className="care-tip">
                <span className="care-tip-label">Always</span>
                <span>Use a windshield sunshade when parked in direct sun. Prevents leather cracking.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span>FAQ</span>
          </div>
          <h2 className="section-heading">Common Questions</h2>

          <div className="faq-list">
            {faqs.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? ' faq-item--open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-still-question">
            <p>Still have questions?</p>
            <button className="btn-gold" onClick={() => openWhatsApp("Hello, I have a question about Modern Cushions services.")}>
              Ask on WhatsApp <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-bg-overlay" />
        <div className="cta-content">
          <div className="gold-accent-bar" />
          <h2>Design Your Interior</h2>
          <p>Use our interactive 3D configurator to build your Nissan Caravan or Toyota Hiace interior. Select seat types, textures, and accessories — then request an instant quote.</p>
          <div className="cta-actions">
            <button className="btn-red" onClick={() => onNavigate('vehicle-selector')}>
              Start Configurator <ChevronRight size={18} />
            </button>
            <button className="btn-gold" onClick={() => onNavigate('automotive')}>
              View Catalog
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-mark">MODERN</span>
              <span className="logo-bold">CUSHIONS</span>
            </div>
            <p className="footer-tagline">Nairobi's premier luxury automotive and stadium upholstery since 2015. NTSA Approved Bodybuilder · CAF-certified · Est. 64 Old Enterprise Road.</p>
            <div className="footer-social">
              <a href="https://instagram.com/moderncushions" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                <IgIcon size={16} />
              </a>
              <a href="https://facebook.com/moderncushions" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-link">
                <FbIcon size={16} />
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="footer-social-link footer-social-wa"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <a onClick={() => onNavigate('automotive')}>Automotive Seating</a>
            <a onClick={() => onNavigate('stadia')}>Stadium Seating</a>
            <a onClick={() => scrollTo('misc')}>Bespoke Builds</a>
            <a onClick={() => onNavigate('vehicle-selector')}>Van Configurator</a>
            <a onClick={() => scrollTo('gallery')}>Our Portfolio</a>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <a>Custom Van Builds</a>
            <a>PSV / Matatu Seating</a>
            <a>Stadium &amp; Stadia</a>
            <a>VIP Executive Interiors</a>
            <a>Fleet &amp; SACCO Orders</a>
            <a>CAF-Certified Installs</a>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact</h4>
            <a href={`https://maps.google.com/?q=64+Old+Enterprise+Road,+Industrial+Area,+Nairobi`} target="_blank" rel="noopener noreferrer">
              <MapPin size={13} /> {ADDRESS}
            </a>
            {PHONES.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>
                <Phone size={13} /> {p}
              </a>
            ))}
            <a href={`mailto:${EMAIL}`}>
              <Mail size={13} /> {EMAIL}
            </a>
            <div className="footer-hours">
              <Clock size={13} />
              <div>
                <span>Mon–Fri 8:00 AM – 5:30 PM</span>
                <span>Sat 9:00 AM – 2:00 PM</span>
              </div>
            </div>
            <div className="footer-mpesa">
              <span className="mpesa-label">M-Pesa · Bank Transfer · LPO</span>
              <span className="mpesa-till">Payment details provided on quotation</span>
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="footer-map">
          <iframe
            title="Modern Cushions Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176!2d36.8419!3d-1.3005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zEnterprise+Road%2C+Nairobi!5e0!3m2!1sen!2ske!4v1"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Modern Cushions Ltd. All rights reserved.</span>
          <span className="footer-location">64 Old Enterprise Road · Industrial Area · Nairobi, Kenya</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
