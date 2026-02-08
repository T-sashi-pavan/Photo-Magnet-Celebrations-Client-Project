import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const stock = await Stock.find({}).sort({ productType: 1, withStand: -1 });

    return NextResponse.json({
      success: true,
      stock,
    });
  } catch (error: any) {
    console.error('Get stock error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stock', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { productType, withStand, quantity } = await req.json();

    if (quantity < 0) {
      return NextResponse.json(
        { success: false, message: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    const updatedStock = await Stock.findOneAndUpdate(
      { productType, withStand },
      { quantity, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      stock: updatedStock,
    });
  } catch (error: any) {
    console.error('Update stock error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update stock', error: error.message },
      { status: 500 }
    );
  }
}
