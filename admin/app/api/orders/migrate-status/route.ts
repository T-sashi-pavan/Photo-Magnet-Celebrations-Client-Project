import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Migrate old statuses to new ones
    // 'confirmed' and 'processing' -> 'preparing'
    const result = await Order.collection.updateMany(
      { orderStatus: { $in: ['confirmed', 'processing'] } },
      { $set: { orderStatus: 'preparing', updatedAt: new Date() } }
    );

    // Also check for any other invalid status values and set them to 'pending'
    const invalidStatusResult = await Order.collection.updateMany(
      { orderStatus: { $nin: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'] } },
      { $set: { orderStatus: 'pending', updatedAt: new Date() } }
    );

    console.log('Migration completed:', {
      confirmedToPreparingCount: result.modifiedCount,
      invalidStatusFixedCount: invalidStatusResult.modifiedCount,
    });

    return NextResponse.json({
      success: true,
      message: 'Orders migrated successfully',
      modifiedCount: result.modifiedCount,
      invalidStatusFixed: invalidStatusResult.modifiedCount,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: error.message },
      { status: 500 }
    );
  }
}
