import { NextRequest, NextResponse } from 'next/server';

// Mock payment gateway for testing without KYC verification
export async function POST(req: NextRequest) {
  try {
    const { amount, customerName, customerPhone, customerEmail } = await req.json();

    console.log('🧪 MOCK MODE: Creating test order:', { amount, customerName, customerPhone });

    // Simulate Cashfree response
    const orderId = `MOCK_ORDER_${Date.now()}`;
    const paymentSessionId = `mock_session_${Date.now()}`;
    const orderToken = `mock_token_${Date.now()}`;

    console.log('✅ MOCK MODE: Order created successfully:', orderId);

    return NextResponse.json({
      orderId,
      paymentSessionId,
      orderToken,
      isMockMode: true,
      message: 'Mock payment mode - No real payment will be charged',
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Mock order creation error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to create mock order', 
        details: error.message,
      },
      { status: 500 }
    );
  }
}
