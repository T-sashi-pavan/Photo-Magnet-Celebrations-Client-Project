import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CASHFREE_API_URL = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    const response = await axios.get(
      `${CASHFREE_API_URL}/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.NEXT_PUBLIC_CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2023-08-01',
        },
      }
    );

    const orderStatus = response.data.order_status;
    const isValid = orderStatus === 'PAID';

    return NextResponse.json(
      {
        message: isValid ? 'Payment verified successfully' : 'Payment not completed',
        isValid,
        orderStatus,
        paymentDetails: response.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying payment:', error.response?.data || error);
    return NextResponse.json(
      { error: 'Failed to verify payment', isValid: false },
      { status: 500 }
    );
  }
}
