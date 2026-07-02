export const CONTACT = {
  phones: ['+254 736 564 564', '+254 784 564 564', '+254 780 564 564'],
  whatsapp: '254736564564',
  email: 'info@moderncushions.co.ke',
  address: '64 Old Enterprise Road, Industrial Area, Nairobi',
  hours: 'Mon – Sat · 7:30 AM – 6:00 PM',
  instagram: 'https://instagram.com/moderncushions',
  facebook: 'https://facebook.com/moderncushions',
}

export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

export interface Seat {
  id: string
  name: string
  tag: string
  image: string
  blurb: string
  features: string[]
}

export const SEATS: Seat[] = [
  {
    id: 'vip-captain',
    name: 'Luxury VIP Captain',
    tag: 'VIP',
    image: 'seat-vip-captain',
    blurb: 'The flagship. Full-grain leather over memory foam, built for Grand Cabin conversions and executive shuttles.',
    features: ['Full-grain leather', 'Memory foam core', 'Recliner mechanism', 'Adjustable headrest & armrests'],
  },
  {
    id: 'executive',
    name: 'Executive Business',
    tag: 'Executive',
    image: 'seat-executive',
    blurb: 'Quilted upholstery and built-in lumbar support for corporate fleets that carry decision-makers.',
    features: ['Quilted upholstery', 'High-density foam', 'Fold-down armrest', 'Built-in lumbar support'],
  },
  {
    id: 'sport',
    name: 'Recaro-Style Sport',
    tag: 'Sport',
    image: 'seat-sport',
    blurb: 'Deep bolsters and a racing profile — with embossed headrests if you want your marque on every row.',
    features: ['Perforated bolsters', 'Deep side contouring', 'Embossed headrests', 'Breathable inserts'],
  },
  {
    id: 'rugged',
    name: '4×4 Rugged',
    tag: 'Overland',
    image: 'seat-rugged',
    blurb: 'Water-resistant, steel-reinforced seating for safari trucks, escort vehicles and hard country.',
    features: ['Water-resistant cover', 'Steel-reinforced frame', 'Enhanced bolstering', 'Easy-clean surface'],
  },
  {
    id: 'psv',
    name: 'Commercial PSV',
    tag: 'PSV',
    image: 'seat-psv',
    blurb: 'The workhorse. NTSA LN 23 compliant frames and foam that survives a decade of route work.',
    features: ['NTSA LN 23 compliant', 'High-density foam', 'Quick-strip servicing', 'Easy-clean surface'],
  },
  {
    id: 'sacco',
    name: 'SACCO Fleet',
    tag: 'Fleet',
    image: 'seat-sacco',
    blurb: 'Anti-vandal covers on heavy-gauge frames, built for whole-fleet rollouts with custom livery.',
    features: ['Anti-vandal vinyl', 'Heavy-gauge frame', 'Row configurations', 'Custom livery colours'],
  },
  {
    id: 'shuttle',
    name: 'Tour & Shuttle',
    tag: 'Shuttle',
    image: 'seat-shuttle',
    blurb: 'Neck-roll headrests and armrests each side — comfort tuned for airport runs and safari transfers.',
    features: ['Neck-roll headrest', 'Armrests each side', 'Three-point belts', 'Footrest compatible'],
  },
  {
    id: 'bench',
    name: 'Flat Bench',
    tag: 'Utility',
    image: 'seat-bench',
    blurb: 'Full-width rows with folding backrests — the honest option for utility and cargo-dual builds.',
    features: ['Full-width row', 'Folding backrest', 'Lightweight removal', 'Cargo-dual friendly'],
  },
]

export interface GalleryItem {
  image: string
  caption: string
  detail: string
  size: 'wide' | 'tall' | 'std'
}

export const GALLERY: GalleryItem[] = [
  { image: 'gallery-dugout-track', caption: 'Stadium dugouts', detail: 'Nyayo National Stadium · team shelters', size: 'wide' },
  { image: 'gallery-production', caption: 'Fleet production', detail: '60-seat batch, ready for collection', size: 'std' },
  { image: 'gallery-embossed', caption: 'Embossed headrests', detail: 'Marque detailing on every row', size: 'tall' },
  { image: 'gallery-interior-captain', caption: 'Captain conversion', detail: 'Toyota Hiace · VIP layout', size: 'std' },
  { image: 'gallery-foam-pour', caption: 'Foam, poured in-house', detail: 'Industrial Area workshop', size: 'tall' },
  { image: 'gallery-seat-row', caption: 'Shuttle rows', detail: 'Three-point belts, neck rolls', size: 'std' },
  { image: 'gallery-dugout-pitch', caption: 'Pitch-side seating', detail: 'Weatherproof upholstery', size: 'wide' },
  { image: 'gallery-executive-row', caption: 'Executive rows', detail: 'Armrests, quilted panels', size: 'std' },
  { image: 'gallery-workshop', caption: 'The workshop', detail: 'Frames, foam and finishing', size: 'tall' },
  { image: 'gallery-van-side', caption: 'Ready for handover', detail: 'Full interior, quality-checked', size: 'std' },
]

export interface ProcessStep {
  num: string
  title: string
  desc: string
}

export const PROCESS: ProcessStep[] = [
  {
    num: '01',
    title: 'Consultation',
    desc: 'WhatsApp, call, or walk in. Tell us the vehicle, the use case and the timeline — we advise on seats, materials and budget before you spend a shilling.',
  },
  {
    num: '02',
    title: 'Design & quote',
    desc: 'A detailed itemised quote in KES with material samples and a layout diagram. No hidden charges. A 40% deposit confirms your build slot.',
  },
  {
    num: '03',
    title: 'The build',
    desc: 'Your vehicle enters the 64 Old Enterprise Road workshop. Frames welded, foam poured, covers cut and stitched — typically 3 to 10 days.',
  },
  {
    num: '04',
    title: 'Quality check & handover',
    desc: 'Stitch tension, foam density, frame torque, NTSA compliance — inspected line by line before you drive out. 12-month workmanship warranty.',
  },
]

export interface Testimonial {
  name: string
  title: string
  quote: string
  category: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Grace Njoroge',
    title: 'Owner, Prestige Executive Shuttles',
    quote: 'The VIP captain chairs they did for my four Hiace Grand Cabins are absolutely world-class. Clients constantly ask who did the interior.',
    category: 'VIP conversion',
  },
  {
    name: 'James Waweru',
    title: 'Fleet Manager, Bolt Kenya',
    quote: 'Twenty-two vehicles, delivered on schedule, quality consistent across every single unit. Drivers are extremely happy on long shifts.',
    category: 'Fleet rollout',
  },
  {
    name: 'David Ochieng',
    title: 'Chairman, Safari Sacco',
    quote: 'Four years, one supplier. Consistent pricing, fast turnaround, and they understand PSV compliance without needing to be reminded.',
    category: 'SACCO fleet',
  },
  {
    name: 'Amina Hassan',
    title: 'Procurement Officer, Kenya Red Cross',
    quote: 'Rugged, easy-to-clean interiors for humanitarian deployments — delivered on time and within an NGO budget.',
    category: 'Field vehicles',
  },
]

export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'How long does a full van interior take?',
    a: 'A standard PSV build takes 3–5 working days. VIP and bespoke builds with custom fabrication take 7–10 days. Fleet orders of 5+ vehicles get a dedicated production schedule.',
  },
  {
    q: 'Are your materials NTSA and PSV compliant?',
    a: 'Yes. Foam densities, seat frames and upholstery in PSV builds meet NTSA LN 23 requirements, and we provide a compliance certificate on request.',
  },
  {
    q: 'Do I need to leave the vehicle with you?',
    a: 'Yes — the vehicle stays at 64 Old Enterprise Road for the build. Early drop-off from 7:30 AM, collection up to 6 PM, Monday to Saturday.',
  },
  {
    q: 'Can you work around airbag-equipped seats?',
    a: 'Yes. Our technicians are trained on side-impact airbag systems. We use airbag-safe foam and never modify or obstruct SRS components.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'M-Pesa, bank transfer (Equity & KCB), and LPOs for verified corporates and SACCOs. A 40% deposit confirms your build slot.',
  },
  {
    q: 'Is there a warranty?',
    a: '12 months on workmanship — stitching, foam compression, frame integrity — and 24 months on material defects.',
  },
  {
    q: 'Only vans?',
    a: 'Vans are the heartland, but we build for buses, saloons, SUVs, boats — even stadium dugouts. If it has seats, we can upholster it.',
  },
]

export interface Fabric {
  id: string
  label: string
  desc: string
  base: string
  accent: string
  stitch: string
}

export const FABRICS: Fabric[] = [
  { id: 'charcoal', label: 'Charcoal', desc: 'Full-grain, matte finish', base: '#262320', accent: '#171512', stitch: '#c2703c' },
  { id: 'cognac', label: 'Cognac', desc: 'Aniline leather, warm', base: '#8a4a22', accent: '#6b3517', stitch: '#e8d5b0' },
  { id: 'bone', label: 'Bone', desc: 'Quilted vinyl, cool touch', base: '#cfc4b0', accent: '#b5a88f', stitch: '#8a4a22' },
  { id: 'oxblood', label: 'Oxblood', desc: 'Perforated centre panels', base: '#5e1f1c', accent: '#471513', stitch: '#d9b48a' },
  { id: 'forest', label: 'Forest', desc: 'Brushed twill, FR-rated', base: '#2e3d2f', accent: '#1f2c21', stitch: '#d5c9a3' },
]

export interface Chapter {
  num: string
  title: string
  body: string
}

export const CHAPTERS: Chapter[] = [
  {
    num: '01',
    title: 'The shell',
    body: 'Every build starts the same way: a bare steel box on wheels. We see the finished cabin before the first panel goes in.',
  },
  {
    num: '02',
    title: 'The foundation',
    body: 'Heavy-duty flooring over marine ply, insulated wall and roof panels — bonded, sealed, and ready for Nairobi heat and upcountry dust.',
  },
  {
    num: '03',
    title: 'The seats',
    body: 'Frames welded in-house. Foam poured in our own plant. Covers cut, stitched and fitted to the millimetre — row by row.',
  },
  {
    num: '04',
    title: 'The details',
    body: 'Three-point belts on every captain, two-point lap belts on the bench, armrests, a starlit roof. The difference between a van and a vehicle people talk about.',
  },
  {
    num: '05',
    title: 'The handover',
    body: 'Stitch tension, foam density, frame torque, NTSA compliance — checked line by line. Twelve-month warranty. Ready for the road.',
  },
]

export const STATS = [
  { value: '3–5 days', label: 'Standard PSV build' },
  { value: '22', label: 'Vehicles in one fleet order' },
  { value: 'LN 23', label: 'NTSA compliant builds' },
  { value: '12 mo', label: 'Workmanship warranty' },
]

export interface Callout {
  anchor: 'frame' | 'foam' | 'cover' | 'headrest' | 'belt'
  side: 'left' | 'right'
  title: string
  body: string
}

export const CALLOUTS: Callout[] = [
  {
    anchor: 'frame',
    side: 'left',
    title: 'Steel, welded in-house',
    body: 'Powder-coated tube frame and zig-zag springs — torque-checked before any foam goes near it.',
  },
  {
    anchor: 'foam',
    side: 'right',
    title: 'Foam, poured on-site',
    body: 'High-resilience polyurethane from our own plant, density-matched to the job: PSV firm, VIP plush.',
  },
  {
    anchor: 'cover',
    side: 'left',
    title: 'Cut & double-stitched',
    body: 'Full-grain leather or FR-rated fabric, pattern-cut and double-stitched with contrast piping.',
  },
  {
    anchor: 'headrest',
    side: 'right',
    title: 'Details that finish it',
    body: 'Adjustable headrests, embossed marques, fold-down armrests — specified row by row.',
  },
  {
    anchor: 'belt',
    side: 'right',
    title: 'Belts, anchored to spec',
    body: 'Integrated three-point belts on captains and shuttles; NTSA-spec two-point lap belts on PSV rows — every anchor torque-tested.',
  },
]

export const MARQUEE_ITEMS = [
  'Van interiors',
  'VIP captain seats',
  'PSV & SACCO fleets',
  'Stadium dugouts',
  'Foam poured in-house',
  'NTSA LN 23 compliant',
  'Marine & aviation',
  'Custom embroidery',
]
