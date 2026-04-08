import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Shield } from 'lucide-react';
import type { TrimOption, ColorOption, AccessoryOption } from '../data/configuratorData';
import './QuoteModal.css';

export interface BuildData {
  vehicle: string;
  vehicleType: 'nissan' | 'toyota';
  capacity: string;
  seatType: TrimOption;
  texture: ColorOption;
  accessories: AccessoryOption[];
  flooring?: string;
}

interface QuoteModalProps {
  buildData: BuildData;
  onClose: () => void;
}

const WA_NUMBER = '254736564564';
const EMAIL = 'info@moderncushions.co.ke';

function formatWhatsAppMessage(data: BuildData, name: string, phone: string): string {
  const lines: string[] = [
    `*Modern Cushions — Build Quote Request*`,
    ``,
  ];
  if (name) lines.push(`*Name:* ${name}`);
  if (phone) lines.push(`*Contact:* ${phone}`);
  if (name || phone) lines.push(``);
  lines.push(
    `*Vehicle:* ${data.vehicle}`,
    `*Configuration:* ${data.capacity}`,
    `*Seat Type:* ${data.seatType.name}`,
    `*Texture:* ${data.texture.name}`,
  );
  if (data.flooring) {
    lines.push(`*Flooring:* ${data.flooring}`);
  }
  if (data.accessories.length > 0) {
    lines.push(`*Accessories:*`);
    data.accessories.forEach((acc) => {
      lines.push(`  • ${acc.name}`);
    });
  }
  lines.push(
    ``,
    `Please provide a formal quote for this build.`,
  );
  return lines.join('\n');
}

const WaIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const QuoteModal: React.FC<QuoteModalProps> = ({ buildData, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const sendViaWhatsApp = () => {
    const msg = formatWhatsAppMessage(buildData, name, phone);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    const text = formatWhatsAppMessage(buildData, name, phone);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emailBody = formatWhatsAppMessage(buildData, name, phone).replace(/\*/g, '');
  const mailtoHref = `mailto:${EMAIL}?subject=Build Quote Request — ${buildData.vehicle}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="qm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Request Quote">
      <div className="qm-panel">

        {/* Header */}
        <div className="qm-header">
          <div>
            <span className="qm-eyebrow">04. Build Complete</span>
            <h2 className="qm-title">Request Your Quote</h2>
          </div>
          <button className="qm-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="qm-body">

          {/* Vehicle badge */}
          <div className="qm-vehicle-tag">
            <div className="qm-vehicle-left">
              <span className="qm-vehicle-name">{buildData.vehicle}</span>
              <span className="qm-vehicle-cap">{buildData.capacity}</span>
            </div>
            <span className="qm-vehicle-total">Quote on Request</span>
          </div>

          {/* Summary breakdown */}
          <div className="qm-summary">
            <div className="qm-row">
              <span className="qm-row-lbl">Seat Type</span>
              <span className="qm-row-val">{buildData.seatType.name}</span>
            </div>
            <div className="qm-row">
              <span className="qm-row-lbl">Texture</span>
              <div className="qm-row-swatch">
                {buildData.texture.image ? (
                  <img src={buildData.texture.image} alt="" className="qm-swatch-img" />
                ) : (
                  <span className="qm-swatch-dot" style={{ background: buildData.texture.hex }} />
                )}
                <span className="qm-row-val">{buildData.texture.name}</span>
              </div>
            </div>
            {buildData.flooring && (
              <div className="qm-row">
                <span className="qm-row-lbl">Flooring</span>
                <span className="qm-row-val">{buildData.flooring}</span>
              </div>
            )}
            {buildData.accessories.map((acc) => (
              <div className="qm-row" key={acc.id}>
                <span className="qm-row-lbl">Add-on</span>
                <span className="qm-row-val">{acc.name}</span>
              </div>
            ))}
            <div className="qm-total-row">
              <span>Pricing</span>
              <span className="qm-total-amt">Provided on quotation</span>
            </div>
          </div>

          {/* Optional contact fields */}
          <div className="qm-contact">
            <p className="qm-contact-lbl">Optional — include your details with this quote:</p>
            <div className="qm-fields">
              <input
                className="qm-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="qm-input"
                type="tel"
                placeholder="Phone / WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Trust strip */}
          <div className="qm-trust-strip">
            <span><Shield size={12} /> 12-month workmanship warranty</span>
            <span><Check size={12} /> NTSA-compliant materials</span>
            <span><Check size={12} /> 40% deposit to confirm build</span>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="qm-footer">
          <button className="qm-btn-wa" onClick={sendViaWhatsApp}>
            <WaIcon />
            Send Build via WhatsApp
          </button>
          <div className="qm-alt">
            <button className={`qm-btn-sec${copied ? ' qm-btn-sec--done' : ''}`} onClick={copyToClipboard}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <a className="qm-btn-sec" href={mailtoHref}>
              Email Instead
            </a>
          </div>
          <p className="qm-footer-note">
            Bank transfer &amp; LPO accepted · 40% deposit confirms your build slot
          </p>
        </div>

      </div>
    </div>
  );
};

export default QuoteModal;
