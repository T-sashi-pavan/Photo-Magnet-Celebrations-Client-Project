import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: order.toObject(),
    });
  } catch (error: any) {
    console.error('Fetch order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    );
  }
}
