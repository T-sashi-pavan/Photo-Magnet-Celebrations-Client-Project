// Product types and interfaces
export interface ProductPackage {
  quantity: number;
  price: number;
  label?: string;
}

export interface PriceTier {
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'square' | 'rectangle-stand' | 'rectangle-no-stand' | 'event-stall';
  aspectRatio: '1:1' | '3:4' | '4:3';
  description: string;
  packages: ProductPackage[];
  minimumOrder?: number;
  allowCustomQuantity?: boolean;
  priceTiers?: PriceTier[];
}

// Product catalog with new combo pricing
export const PRODUCTS: Product[] = [
  {
    id: 'square-no-stand',
    name: 'Square Photo Magnets',
    category: 'square',
    aspectRatio: '1:1',
    description: 'Without Stand - Perfect for your fridge',
    allowCustomQuantity: true,
    priceTiers: [
      { minQuantity: 1, maxQuantity: 1, pricePerUnit: 99 },
      { minQuantity: 2, maxQuantity: 3, pricePerUnit: 99 },
      { minQuantity: 4, maxQuantity: 7, pricePerUnit: 95 },
      { minQuantity: 8, maxQuantity: 15, pricePerUnit: 87 },
      { minQuantity: 16, maxQuantity: Infinity, pricePerUnit: 80 }
    ],
    packages: [
      { quantity: 1, price: 99, label: 'Single' },
      { quantity: 4, price: 380 },
      { quantity: 6, price: 570 },
      { quantity: 8, price: 696 },
      { quantity: 10, price: 870 }
    ]
  },
  {
    id: 'rectangle-with-stand',
    name: 'Rectangle Photo Magnets',
    category: 'rectangle-stand',
    aspectRatio: '3:4',
    description: 'With Stand - Premium Acrylic',
    allowCustomQuantity: true,
    priceTiers: [
      { minQuantity: 1, maxQuantity: 1, pricePerUnit: 259 },
      { minQuantity: 2, maxQuantity: 3, pricePerUnit: 240 },
      { minQuantity: 4, maxQuantity: 7, pricePerUnit: 205 },
      { minQuantity: 8, maxQuantity: Infinity, pricePerUnit: 190 }
    ],
    packages: [
      { quantity: 1, price: 259 },
      { quantity: 2, price: 480 },
      { quantity: 3, price: 720 },
      { quantity: 4, price: 820 }
    ]
  },
  {
    id: 'rectangle-without-stand',
    name: 'Rectangle Photo Magnets',
    category: 'rectangle-no-stand',
    aspectRatio: '3:4',
    description: 'Without Stand',
    allowCustomQuantity: true,
    priceTiers: [
      { minQuantity: 1, maxQuantity: 1, pricePerUnit: 229 },
      { minQuantity: 2, maxQuantity: 3, pricePerUnit: 200 },
      { minQuantity: 4, maxQuantity: 7, pricePerUnit: 162 },
      { minQuantity: 8, maxQuantity: Infinity, pricePerUnit: 150 }
    ],
    packages: [
      { quantity: 1, price: 229 },
      { quantity: 2, price: 400 },
      { quantity: 3, price: 600 },
      { quantity: 4, price: 648 }
    ]
  },
  {
    id: 'event-stall',
    name: 'Live Photo Magnet Stall',
    category: 'event-stall',
    aspectRatio: '1:1',
    description: 'Event Special Offer - Just ₹99 per Magnet',
    minimumOrder: 100,
    allowCustomQuantity: true,
    priceTiers: [
      { minQuantity: 100, maxQuantity: 199, pricePerUnit: 99 },
      { minQuantity: 200, maxQuantity: 299, pricePerUnit: 95 },
      { minQuantity: 300, maxQuantity: 499, pricePerUnit: 93 },
      { minQuantity: 500, maxQuantity: Infinity, pricePerUnit: 89 }
    ],
    packages: [
      { quantity: 100, price: 9900, label: 'Min Order' },
      { quantity: 150, price: 14850 },
      { quantity: 250, price: 23750 },
      { quantity: 300, price: 27900 },
      { quantity: 500, price: 44500 }
    ]
  }
];

// Serviceable states
export const SERVICEABLE_STATES = ['Telangana', 'Andhra Pradesh'];

export function isServiceableState(state: string): boolean {
  return SERVICEABLE_STATES.includes(state);
}

// Calculate price for custom quantity based on tiered pricing
export function calculateCustomPrice(product: Product, quantity: number): number {
  if (!product.priceTiers) return 0;

  const tier = product.priceTiers.find(
    t => quantity >= t.minQuantity && quantity <= t.maxQuantity
  );

  return tier ? tier.pricePerUnit * quantity : 0;
}

// Get price per unit for display
export function getPricePerUnit(product: Product, quantity: number): number {
  if (!product.priceTiers) return 0;

  const tier = product.priceTiers.find(
    t => quantity >= t.minQuantity && quantity <= t.maxQuantity
  );

  return tier ? tier.pricePerUnit : 0;
}

export function calculateDeliveryCharge(
  category: string,
  quantity: number,
  state: string
): number {
  if (!isServiceableState(state)) {
    return 0;
  }

  // Square magnets: free delivery for 4+ pieces
  if (category === 'square') {
    return quantity >= 4 ? 0 : 40;
  }

  // All other categories: free delivery
  return 0;
}
