import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Stock from '@/models/Stock';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const orderData = await req.json();

    // Generate unique order ID
    const orderId = `PMC${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order
    const order = await Order.create({
      orderId,
      customerName: orderData.customerName,
      whatsapp: orderData.whatsapp,
      email: orderData.email,
      address: orderData.address,
      pincode: orderData.pincode,
      state: orderData.state,
      productType: orderData.productType,
      orientation: orderData.orientation,
      withStand: orderData.withStand,
      quantity: orderData.quantity,
      pricePerUnit: orderData.pricePerUnit,
      totalPrice: orderData.totalPrice,
      deliveryCharge: orderData.deliveryCharge,
      couponApplied: orderData.couponApplied,
      discount: orderData.discount || 0,
      finalAmount: orderData.finalAmount,
      croppedImageUrl: orderData.croppedImageUrl,
      paymentId: orderData.paymentId,
      paymentStatus: 'success',
      orderStatus: 'pending',
    });

    // Update stock - decrease quantity
    // For square, withStand should be null in database
    const stockQuery: any = {
      productType: orderData.productType,
    };
    
    if (orderData.productType === 'square') {
      stockQuery.withStand = null;
    } else {
      stockQuery.withStand = orderData.withStand;
    }
    
    await Stock.findOneAndUpdate(
      stockQuery,
      {
        $inc: { quantity: -orderData.quantity },
        updatedAt: new Date(),
      }
    );

    // Send notification to admin (email + SMS)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}
