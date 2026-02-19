import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('=== TEST PAYMENT FLOW ===');
    console.log('Received body:', JSON.stringify(body, null, 2));
    console.log('Body type:', typeof body);
    console.log('Items:', body.items);
    console.log('Items length:', body.items?.length);
    console.log('Items isArray:', Array.isArray(body.items));
    
    if (body.items && Array.isArray(body.items)) {
      console.log(`\n Processing ${body.items.length} items:`);
      
      for (let i = 0; i < body.items.length; i++) {
        const item = body.items[i];
        console.log(`\nItem ${i + 1}:`, JSON.stringify(item, null, 2));
        
        // Simulate order creation
        const orderPayload = {
          ...item,
          totalPrice: body.totalPrice / body.items.length,
          deliveryCharge: body.deliveryCharge,
          couponApplied: body.couponApplied,
          discount: body.discount / body.items.length,
          finalAmount: body.finalAmount / body.items.length,
          paymentId: 'TEST_PAYMENT_ID',
          paymentStatus: 'success',
        };
        
        console.log(`Order ${i + 1} payload:`, JSON.stringify(orderPayload, null, 2));
      }
      
      return NextResponse.json({
        success: true,
        message: `Would create ${body.items.length} orders`,
        itemsCount: body.items.length,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No items array or invalid items',
        bodyKeys: Object.keys(body),
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Test flow error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
