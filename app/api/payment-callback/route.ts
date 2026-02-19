import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      console.error('No order_id provided in payment callback');
      return NextResponse.redirect(new URL('/?error=no_order_id', req.url));
    }

    console.log('Payment callback received for order:', orderId);

    // Verify payment with Cashfree
    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/api/cashfree/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    const verifyData = await verifyResponse.json();
    console.log('Payment verification result:', verifyData);

    if (verifyData.status !== 'SUCCESS') {
      console.error('Payment verification failed:', verifyData);
      return NextResponse.redirect(new URL('/?payment=failed', req.url));
    }

    // Get order details from session storage or retrieve from Cashfree
    // Since we don't have the cart/form data here, we need to get it from somewhere
    // For now, redirect to a page that will complete the order creation client-side
    const redirectUrl = new URL('/payment-processing', req.url);
    redirectUrl.searchParams.set('cashfree_order_id', orderId);
    redirectUrl.searchParams.set('payment_status', 'success');

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/?payment=error', req.url));
  }
}
