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

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    await connectDB();

    // First, try to find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Use direct MongoDB update to bypass Mongoose validation
    // This is necessary in case the order has old enum values that would fail validation
    const result = await Order.collection.updateOne(
      { orderId },
      { 
        $set: { 
          orderStatus: status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Fetch the updated order
    const updatedOrder = await Order.findOne({ orderId });

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder?.toObject(),
    });
  } catch (error: any) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update status', error: error.message },
      { status: 500 }
    );
  }
}
