import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CASHFREE_API_URL = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error('Missing Cashfree credentials in environment variables');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const { amount, customerName, customerPhone, customerEmail } = await req.json();

    console.log('Creating Cashfree order:', { amount, customerName, customerPhone });

    const orderId = `ORDER_${Date.now()}`;

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail || `${customerPhone}@magnets.com`,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-success?order_id={order_id}`,
      },
    };

    console.log('Cashfree API URL:', CASHFREE_API_URL);
    console.log('Cashfree App ID:', process.env.NEXT_PUBLIC_CASHFREE_APP_ID?.substring(0, 10) + '...');

    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.NEXT_PUBLIC_CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2023-08-01',
        },
      }
    );

    console.log('Cashfree order created successfully:', response.data.order_id);

    return NextResponse.json({
      orderId: response.data.order_id,
      paymentSessionId: response.data.payment_session_id,
      orderToken: response.data.order_token,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating Cashfree order:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error.response?.data,
        message: errorMessage,
        hint: 'Please check your Cashfree credentials in .env.local file'
      },
      { status: 500 }
    );
  }
}
