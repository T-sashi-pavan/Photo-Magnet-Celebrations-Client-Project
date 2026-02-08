import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { order } = await req.json();

    // Send Email to Admin
    try {
      const confirmUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}/api/confirm-order?orderId=${order.orderId}`;
      
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Photo Magnet Celebrations <orders@photomagnetcelebrations.com>',
          to: ['sashipavan111111@gmail.com'],
          subject: `🎉 New Order - ${order.orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>New Order Received!</h1>
              <h2>Order ID: ${order.orderId}</h2>
              
              <h3>Customer Details:</h3>
              <p><strong>Name:</strong> ${order.customerName}</p>
              <p><strong>Phone:</strong> ${order.whatsapp}</p>
              ${order.email ? `<p><strong>Email:</strong> ${order.email}</p>` : ''}
              <p><strong>Address:</strong> ${order.address}, ${order.pincode}, ${order.state}</p>
              
              <h3>Order Details:</h3>
              <p><strong>Product:</strong> ${order.productType.toUpperCase()} ${order.withStand ? 'with Stand' : 'without Stand'}</p>
              ${order.orientation ? `<p><strong>Orientation:</strong> ${order.orientation}</p>` : ''}
              <p><strong>Quantity:</strong> ${order.quantity} pieces</p>
              <p><strong>Amount:</strong> ₹${order.finalAmount}</p>
              
              <img src="${order.croppedImageUrl}" alt="Product Image" style="max-width: 300px; margin: 20px 0;" />
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${confirmUrl}" style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  ✓ Confirm Order & Notify Customer
                </a>
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email to admin');
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }

    // Send SMS to Admin (using Twilio or similar service)
    // Note: You'll need to configure Twilio in your environment variables
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
          },
          body: new URLSearchParams({
            To: '+917330775225',
            From: process.env.TWILIO_PHONE_NUMBER!,
            Body: `🎉 New Order: ${order.orderId}\nCustomer: ${order.customerName}\nPhone: ${order.whatsapp}\nProduct: ${order.productType.toUpperCase()}\nQty: ${order.quantity}\nAmount: ₹${order.finalAmount}\n\nCheck admin panel for details.`,
          }),
        });

        if (!twilioResponse.ok) {
          console.error('Failed to send SMS to admin');
        }
      }
    } catch (error) {
      console.error('SMS sending error:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
    });
  } catch (error: any) {
    console.error('Notify admin error:', error);
    return NextResponse.json(
      { success: false, message: 'Notification failed', error: error.message },
      { status: 500 }
    );
  }
}
