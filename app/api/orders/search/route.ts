import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'Phone or email required' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (phone) {
      query.whatsapp = phone;
    }
    if (email) {
      query.email = email;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders: orders.map(order => order.toObject()),
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Search orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search orders', error: error.message },
      { status: 500 }
    );
  }
}
