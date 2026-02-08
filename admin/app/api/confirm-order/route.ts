import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendCustomerConfirmationEmail } from '@/lib/email';
import { sendCustomerConfirmationSMS } from '@/lib/sms';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status to confirmed
    order.orderStatus = 'confirmed';
    order.customerConfirmationSent = true;
    order.updatedAt = new Date();
    await order.save();

    // Send confirmation to customer via email
    if (order.email) {
      try {
        await sendCustomerConfirmationEmail(order, order.email);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }

    // Send confirmation to customer via SMS
    try {
      await sendCustomerConfirmationSMS(order, order.whatsapp);
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }

    // Redirect to a success page
    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/admin/dashboard?confirmed=${orderId}`,
      { status: 302 }
    );
  } catch (error: any) {
    console.error('Confirm order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to confirm order', error: error.message },
      { status: 500 }
    );
  }
}
