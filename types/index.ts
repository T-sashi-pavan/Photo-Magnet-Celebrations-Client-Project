export type MagnetShape = 'square' | 'rectangle';
export type Orientation = 'portrait' | 'landscape' | 'none';
export type AspectRatio = '1:1' | '3:4' | '4:3';

export interface Product {
  id: string;
  name: string;
  shape: MagnetShape;
  size: string;
  orientation: Orientation;
  hasStand: boolean;
  aspectRatio: AspectRatio;
  basePrice: number;
  description: string;
}

export interface PricingSlab {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  croppedImageUrl: string;
  totalPrice: number;
}

export interface CheckoutForm {
  name: string;
  whatsapp: string;
  address: string;
  pincode: string;
  state: string;
  email?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CheckoutForm;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
}
