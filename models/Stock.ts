import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStock extends Document {
  productType: 'square' | 'rectangle';
  withStand: boolean | null; // null for square (no stand concept)
  quantity: number;
  updatedAt: Date;
}

const StockSchema: Schema = new Schema({
  productType: {
    type: String,
    enum: ['square', 'rectangle'],
    required: true,
  },
  withStand: {
    type: Boolean,
    required: false, // Not required for square
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    default: 100,
    min: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index - allows null for withStand (square products)
StockSchema.index({ productType: 1, withStand: 1 }, { unique: true, sparse: false });

const Stock: Model<IStock> = mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
