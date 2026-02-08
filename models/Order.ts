import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  address: string;
  pincode: string;
  state: string;
  productType: 'square' | 'rectangle';
  orientation?: 'portrait' | 'landscape';
  withStand: boolean;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  deliveryCharge: number;
  couponApplied?: string;
  discount: number;
  finalAmount: number;
  croppedImageUrl: string;
  paymentId: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  adminNotificationSent: boolean;
  customerConfirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    enum: ['square', 'rectangle'],
    required: true,
  },
  orientation: {
    type: String,
    enum: ['portrait', 'landscape'],
  },
  withStand: {
    type: Boolean,
    required: false, // Not required for square
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    required: true,
  },
  couponApplied: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  croppedImageUrl: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  adminNotificationSent: {
    type: Boolean,
    default: false,
  },
  customerConfirmationSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
