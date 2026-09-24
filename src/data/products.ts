import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // READY COMBOS
  {
    id: 'combo-1',
    name: 'Stealth Urban Streetwear Combo',
    subtitle: 'Heavyweight Oversized Tee + Tactical Cargo + Free Keychain',
    category: 'combos',
    price: 949,
    originalPrice: 1899,
    stock: 4, // "Only 4 left"
    sizes: ['M (Oversized)', 'L (Oversized)', 'XL (Oversized)'],
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Our #1 best-selling street combo. Features a 240 GSM pre-shrunk cotton oversized t-shirt in washed obsidian black paired with multi-pocket relaxed tactical parachute cargos. Engineered for maximum drape and effortless swag.',
    details: [
      'Top: 240 GSM 100% Terry Combed Cotton',
      'Bottom: 6-pocket durable ripstop parachute fabric',
      'Fit: Streetwear oversized drop-shoulder fit',
      'Pre-shrunk fabric with anti-pilling wash',
      'Free shipping from Kota dispatch facility'
    ],
    isNewArrival: true,
    featured: true
  },
  {
    id: 'combo-2',
    name: 'Old Money Linen Resort Combo',
    subtitle: 'Cuban Collar Textured Shirt + Relaxed Chino Pants',
    category: 'combos',
    price: 999,
    originalPrice: 2199,
    stock: 2, // "Only 2 left"
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevate your evening look with the quiet luxury aesthetic. Breathable waffle-textured waffle Cuban collar shirt in ecru stone, styled with tailored straight-fit drawstring trousers.',
    details: [
      'Top: Premium waffle-knit cotton blend (breathable)',
      'Bottom: Structured linen-cotton blend with elasticated waistband',
      'Color: Ivory Sand & Deep Charcoal',
      'Perfect for dates, sundowners & campus hangs',
      'COD available with express Kota dispatch'
    ],
    isNewArrival: true,
    featured: true
  },
  {
    id: 'combo-3',
    name: 'Monochrome Acid Wash Drip Set',
    subtitle: 'Acid Wash Boxy Tee + Straight Cut Charcoal Denim',
    category: 'combos',
    price: 899,
    originalPrice: 1799,
    stock: 7,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vintage vintage wash meets contemporary oversized cut. Made with heavy 260 GSM vintage washed cotton and relaxed fit straight denim.',
    details: [
      'Top: 260 GSM acid wash heavy knit cotton',
      'Bottom: 12.5 oz non-stretch durable denim',
      'Fade-resistant wash treatment',
      'Relaxed skater aesthetic'
    ],
    isNewArrival: false,
    featured: false
  },
  {
    id: 'combo-4',
    name: 'Club Minimalist All-Black Outfit',
    subtitle: 'Waffle Knit Half-Zip + Baggy Pleated Trousers',
    category: 'combos',
    price: 949,
    originalPrice: 1999,
    stock: 0, // SOLD OUT DEMO
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The definitive all-black Saturday night silhouette. Clean lines, subtle metallic gold hardware, and fluid draping.',
    details: [
      'Top: Luxury ribbed micro-waffle with antique brass zipper',
      'Bottom: High-rise pleated fluid formal trousers',
      'Wrinkle-resistant fabric blend',
      'Currently awaiting restock at Kota warehouse'
    ],
    isNewArrival: false,
    featured: false
  },

  // CHEAP WATCHES (High luxury aesthetic, pocket price!)
  {
    id: 'watch-1',
    name: 'Zyle Royal Sunburst Gold Watch',
    subtitle: 'Roman numerals, brushed gold bezel & black dial',
    category: 'watches',
    comboRole: 'watch',
    price: 449,
    originalPrice: 1299,
    stock: 3, // "Only 3 left"
    sizes: ['Adjustable Strap (Free Size)'],
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-71dfa6358264?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Looks like a ₹25,000 Swiss heritage piece at a genuine pocket price. Features a high-shine gold-plated case, sunburst black dial, date window, and a precision Japanese quartz movement.',
    details: [
      'Case Diameter: 41mm | Slim 9.5mm profile',
      'Dial: Sunburst Jet Black with 18k gold-tone indices',
      'Strap: Premium matte black leatherette with gold buckle',
      'Movement: High precision Japanese analog quartz',
      'Glass: Hardened scratch-resistant mineral crystal',
      'Water Resistance: 30M Splash resistant'
    ],
    isNewArrival: true,
    featured: true
  },
  {
    id: 'watch-2',
    name: 'Stealth Tactical Chrono Watch',
    subtitle: 'Matte black case with sub-dials & military silicone strap',
    category: 'watches',
    comboRole: 'watch',
    price: 499,
    originalPrice: 1499,
    stock: 5, // "Only 5 left"
    sizes: ['Adjustable Silicone Strap (Free Size)'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rugged, aggressive, and pitch black. Designed for daily beaters, gym, and streetwear styling. Deep etched dials with luminous hands that glow in low light.',
    details: [
      'Case Diameter: 43mm matte black alloy',
      'Strap: Sweat-proof textured hypoallergenic silicone',
      'Dial: Carbon texture with multi-function display accents',
      'Weight: 78g solid wrist presence',
      'Includes complimentary Zyle gift box'
    ],
    isNewArrival: true,
    featured: true
  },
  {
    id: 'watch-3',
    name: 'Emerald Roman Imperial Mesh Watch',
    subtitle: 'Deep emerald green sunray dial with gold stainless mesh',
    category: 'watches',
    comboRole: 'watch',
    price: 489,
    originalPrice: 1399,
    stock: 12,
    sizes: ['Milanese Magnetic Mesh (Free Size)'],
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The emerald dial catches sunlight with an iridescent green shimmer. Paired with a featherlight magnetic Milanese gold mesh strap that fits any wrist size effortlessly.',
    details: [
      'Dial: Sunburst Forest Emerald Green',
      'Strap: Gold Milanese woven stainless mesh with magnetic clasp',
      'Ultra-thin 8mm luxury profile',
      'Perfect for parties, weddings & casual fits'
    ],
    isNewArrival: false,
    featured: true
  },
  {
    id: 'watch-4',
    name: 'Vintage Dual-Tone Steel Executive',
    subtitle: 'Silver & Gold jubilee bracelet with fluted bezel',
    category: 'watches',
    comboRole: 'watch',
    price: 499,
    originalPrice: 1599,
    stock: 1, // "Only 1 left"
    sizes: ['Link Bracelet (Includes adjustment tool)'],
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Classic boardroom aesthetic inspired by iconic vintage timepieces. The two-tone polished stainless steel jubilee bracelet exudes timeless confidence.',
    details: [
      'Case: 39mm fluted bezel with date cyclops lens',
      'Bracelet: Two-tone solid link folding clasp',
      'Luminous hour markers & hands',
      'Shock resistant quartz engine'
    ],
    isNewArrival: true,
    featured: false
  },
  {
    id: 'watch-5',
    name: 'Midnight Onyx Minimalist Watch',
    subtitle: 'Clean zero-numeral black dial with black leather band',
    category: 'watches',
    comboRole: 'watch',
    price: 399,
    originalPrice: 999,
    stock: 9,
    sizes: ['Genuine Finish Leather Strap (Free Size)'],
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure Nordic minimalism. Stripped of all clutter with slender gold hands on an inky black face. Extremely comfortable for all-day wear.',
    details: [
      'Case: 40mm ultra-matte black coated alloy',
      'Strap: Soft-touch black strap with reinforced stitching',
      'Clean bauhaus inspired dial',
      'Pocket price champion under ₹400'
    ],
    isNewArrival: false,
    featured: false
  },

  // INDIVIDUAL TOPS (for Combo Builder & individual purchase)
  {
    id: 'top-1',
    name: '240 GSM Obsidian Drop-Shoulder Tee',
    subtitle: 'Heavyweight pure cotton with relaxed ribbed collar',
    category: 'tops',
    comboRole: 'top',
    price: 449,
    originalPrice: 899,
    stock: 14,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The holy grail everyday oversized t-shirt. Thick 240 GSM combed cotton that holds its boxy structure without clinging. Deep black reactive dye that doesn’t fade after washes.',
    details: [
      'Material: 100% Bio-Washed Combed Cotton',
      'Weight: 240 GSM Heavyweight Terry',
      'Collar: 1.25 inch thick ribbed neckline that doesn’t sag',
      'Fit: Modern boxy streetwear drape'
    ],
    isNewArrival: false,
    featured: false
  },
  {
    id: 'top-2',
    name: 'Sand Ecru Waffle Cuban Collar Shirt',
    subtitle: 'Textured breathable resort shirt with wooden buttons',
    category: 'tops',
    comboRole: 'top',
    price: 499,
    originalPrice: 1099,
    stock: 3, // "Only 3 left"
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breezy textured waffle weave shirt with an open retro Cuban collar. Perfect layer over a tank or worn buttoned up for smart casual evenings.',
    details: [
      'Fabric: Honeycomb textured breathable cotton blend',
      'Finish: Coconut shell buttons & revere collar',
      'Care: Machine wash cold, quick drying'
    ],
    isNewArrival: true,
    featured: false
  },
  {
    id: 'top-3',
    name: 'Washed Charcoal Graphic Heavy Tee',
    subtitle: 'Vintage acid wash with distressed typography',
    category: 'tops',
    comboRole: 'top',
    price: 479,
    originalPrice: 949,
    stock: 5, // "Only 5 left"
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-distressed acid wash giving each piece a 1-of-1 aesthetic. Heavyweight cotton with screen-printed minimalist streetwear typography.',
    details: [
      'GSM: 250 GSM heavy gauge cotton',
      'Treatment: Stone-washed distress finish',
      'Fit: Relaxed drop shoulder'
    ],
    isNewArrival: false,
    featured: false
  },

  // INDIVIDUAL BOTTOMS (for Combo Builder & individual purchase)
  {
    id: 'bottom-1',
    name: 'Matte Black Parachute Tactical Cargo',
    subtitle: '6 utility pockets with adjustable toggle ankles',
    category: 'bottoms',
    comboRole: 'bottom',
    price: 599,
    originalPrice: 1299,
    stock: 8,
    sizes: ['28-30 (M)', '32-34 (L)', '36-38 (XL)'],
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The most versatile streetwear bottoms in your rotation. Built with lightweight yet ultra-durable ripstop weave with drawstring waist and toggle cuffs to customize the fit from balloon to straight.',
    details: [
      'Fabric: High-density matte micro-ripstop',
      'Pockets: 2 side slash, 2 deep cargo bellows, 2 rear pockets',
      'Waist: Elasticated waistband with heavy-duty cord',
      'Hem: Bungee cords with metal toggles'
    ],
    isNewArrival: true,
    featured: false
  },
  {
    id: 'bottom-2',
    name: 'Relaxed Tailored Pleated Chinos',
    subtitle: 'Double front pleats in deep olive grey',
    category: 'bottoms',
    comboRole: 'bottom',
    price: 599,
    originalPrice: 1399,
    stock: 4, // "Only 4 left"
    sizes: ['30 (M)', '32 (L)', '34 (XL)'],
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Classic British tailoring infused with relaxed Japanese drape. Features deep double pleats that give freedom of movement while looking razor sharp.',
    details: [
      'Fabric: 98% Cotton, 2% Spandex for comfortable flex',
      'Closure: Extended tab button closure with YKK metal zip',
      'Pockets: Reinforced side pockets & welt back pockets'
    ],
    isNewArrival: false,
    featured: false
  },
  {
    id: 'bottom-3',
    name: 'Charcoal Vintage Straight Denims',
    subtitle: 'Non-stretch 13oz cotton denim with raw hem',
    category: 'bottoms',
    comboRole: 'bottom',
    price: 649,
    originalPrice: 1499,
    stock: 5,
    sizes: ['30', '32', '34'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavyweight authentic vintage washed denim. Sits right at the natural waist with a straight cut that stacks effortlessly over your favorite sneakers.',
    details: [
      'Fabric: 100% Cotton 13oz premium ring-spun denim',
      'Wash: Stone-softened charcoal black wash',
      'Stitching: Heavy contrast tonal stitching'
    ],
    isNewArrival: false,
    featured: false
  }
];
