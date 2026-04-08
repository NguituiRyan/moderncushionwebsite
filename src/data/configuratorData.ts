export interface TrimOption {
  id: string;
  name: string;
  price: number;
  image: string;
  features: string[];
}

export interface ColorOption {
  id: string;
  name: string;
  price: number;
  hex: string;
  image: string;
}

export interface AccessoryOption {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface FlooringOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const trimOptions: TrimOption[] = [
  {
    id: "luxury_vip_seat",
    name: "Luxury VIP Captain Seat",
    price: 450000,
    image: "/modern cushions/20240426_165022.jpg",
    features: ["Premium Full-Grain Leather", "Ergonomic Memory Foam", "Adjustable Headrest & Armrests", "Individual Recliner Mechanism"],
  },
  {
    id: "executive_business_seat",
    name: "Executive Business Seat",
    price: 380000,
    image: "/modern cushions/20240426_165040.jpg",
    features: ["Quilted Leather Upholstery", "High-Density Foam Padding", "Fold-Down Centre Armrest", "Lumbar Support Built-In"],
  },
  {
    id: "recaro_sport_seat",
    name: "Recaro-Style Sport Seat",
    price: 320000,
    image: "/modern cushions/20240426_165101.jpg",
    features: ["Perforated Leather Bolsters", "Deep Side Contouring", "Racing-Inspired Profile", "Breathable Panel Inserts"],
  },
  {
    id: "offroad_rugged_seat",
    name: "4×4 Rugged Seat",
    price: 360000,
    image: "/modern cushions/20240430_090135.jpg",
    features: ["Heavy-Duty Vinyl & Leather Mix", "Water-Resistant Coating", "Enhanced Side Bolstering", "Steel Reinforced Frame"],
  },
  {
    id: "matatu_psv_seat",
    name: "Commercial PSV Seat",
    price: 195000,
    image: "/modern cushions/20240430_090156.jpg",
    features: ["High-Density Durable Foam", "Easy-Clean Surface", "NTSA LN 23 Compliant Frame", "Quick-Strip Service Access"],
  },
  {
    id: "sacco_fleet_seat",
    name: "SACCO Fleet Seat",
    price: 175000,
    image: "/modern cushions/20240430_090201.jpg",
    features: ["Heavy-Gauge Tubular Frame", "Anti-Vandal Vinyl Cover", "Stackable Row Configuration", "Available in Custom Livery"],
  },
  {
    id: "tour_shuttle_seat",
    name: "Tour & Shuttle Seat",
    price: 280000,
    image: "/modern cushions/20240430_090344.jpg",
    features: ["Padded Headrest with Neck Roll", "Armrest Each Side", "Footrest Compatible", "Ideal for Airport & Safari Transfers"],
  },
  {
    id: "bench_flat_seat",
    name: "Flat Bench Seat",
    price: 120000,
    image: "/modern cushions/20240430_090207.jpg",
    features: ["Full-Width Row Bench", "Folding Backrest Option", "Lightweight & Easy to Remove", "Ideal for Utility & Cargo-Dual"],
  },
];

export const colorOptions: ColorOption[] = [
  { id: "obsidian_black", name: "Modern Grey Texture", price: 0, hex: "#1a1a1a", image: "/modern cushions/20240426_165022.jpg" },
  { id: "cognac_brown", name: "Cognac Brown Distressed", price: 15000, hex: "#633918", image: "/modern cushions/20240426_165040.jpg" },
  { id: "crimson_red", name: "Recaro Red Perforated", price: 25000, hex: "#d92d20", image: "/modern cushions/20240426_165101.jpg" },
  { id: "pure_white", name: "Pure White Quilted", price: 12000, hex: "#ffffff", image: "/modern cushions/20240426_165037.jpg" },
];

export const flooringOptions: FlooringOption[] = [
  {
    id: "flooring_mat",
    name: "Rubber Mat Flooring",
    price: 18000,
    description: "Heavy-duty rubber mats with anti-slip ribbing. Easy to clean, waterproof, and ideal for PSV and utility builds.",
    image: "/modern cushions/20250403_161135.jpg",
  },
  {
    id: "flooring_iron_sheet",
    name: "Iron Sheet Flooring",
    price: 28000,
    description: "Corrugated iron-sheet floor panel with protective undercoat. Extremely durable — preferred for heavy-duty commercial use.",
    image: "/modern cushions/20250403_161200.jpg",
  },
  {
    id: "flooring_aluminium",
    name: "Aluminium Checker Plate",
    price: 45000,
    description: "Premium brushed aluminium checker-plate flooring. Lightweight, rust-proof, and adds a premium finish to VIP and executive builds.",
    image: "/modern cushions/20250403_161213.jpg",
  },
];

export const accessoryOptions: AccessoryOption[] = [
  {
    id: "armrest_set", category: "Interior", name: "Premium Leather Armrests", price: 22000,
    description: "Padded leather armrests fitted to each seat row, ergonomically positioned for long-distance comfort.",
    image: "/modern cushions/20240424_155446.jpg"
  },
  {
    id: "privacy_curtains", category: "Interior", name: "Privacy Window Curtains", price: 28000,
    description: "Bespoke blackout curtains for all passenger windows — essential for VIP and executive transport.",
    image: "/modern cushions/20240424_155541.jpg"
  },
  {
    id: "bull_bar", category: "Exterior", name: "Heavy-Duty Bull Bar", price: 55000,
    description: "Powder-coated steel bull bar — front protection and signature presence. Fitted and aligned to OEM mounting points.",
    image: "/modern cushions/20240424_155557.jpg"
  },
  {
    id: "speakers", category: "Audio & Tech", name: "Premium Pioneer Speakers", price: 42000,
    description: "Immersive cabin audio upgrade with flush-mount installation matched to the seat layout.",
    image: "/modern cushions/20240424_155424.jpg"
  },
  {
    id: "usb_ports", category: "Audio & Tech", name: "Integrated USB Charging", price: 18000,
    description: "Fast-charging USB-A and USB-C ports wired seamlessly into the seating structure.",
    image: "/modern cushions/20240424_155624.jpg"
  },
  {
    id: "starlit_roof", category: "Interior", name: "Starlit Roof Lining", price: 120000,
    description: "Fibre-optic star-pattern headliner creating a premium ambient atmosphere for VIP and executive builds.",
    image: "/modern cushions/20250403_161242.jpg"
  }
];
