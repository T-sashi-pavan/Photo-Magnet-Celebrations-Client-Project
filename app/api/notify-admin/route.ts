import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { order } = await req.json();

    console.log('Sending notifications for order:', order.orderId);

    // ========== ADMIN NOTIFICATIONS ==========

    // 1. Send Email to Admin
    const adminEmail = 'photomagnetcelebrations@gmail.com';
    const adminPhone = '917330775225'; // Format: countrycode + number (no + or spaces)

    try {
      const confirmUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}/api/confirm-order?orderId=${order.orderId}`;
      
      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
        },
        body: JSON.stringify({
          sender: { name: 'Photo Magnet Celebrations', email: 'photomagnetcelebrations@gmail.com' },
          to: [{ email: adminEmail, name: 'Admin' }],
          subject: `🎉 New Order - ${order.orderId}`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
              <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #059669; margin: 0;">🎉 New Order Received!</h1>
                </div>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 10px 0; color: #1f2937;">Order ID: ${order.orderId}</h2>
                  <p style="margin: 5px 0; color: #6b7280;">Placed on: ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
                </div>
                
                <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Details</h3>
                <table style="width: 100%; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.whatsapp}</td>
                  </tr>
                  ${order.email ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.email}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; vertical-align: top;"><strong>Address:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.address}, ${order.pincode}, ${order.state}</td>
                  </tr>
                </table>
                
                <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Details</h3>
                <table style="width: 100%; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Product:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.productType.toUpperCase()} Photo Magnet</td>
                  </tr>
                  ${order.orientation ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Orientation:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.orientation}</td>
                  </tr>
                  ` : ''}
                  ${order.withStand !== null ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Stand:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.withStand ? 'With Stand' : 'Without Stand'}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Quantity:</strong></td>
                    <td style="padding: 8px 0; color: #1f2937;">${order.quantity} piece(s)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;"><strong>Total Amount:</strong></td>
                    <td style="padding: 8px 0; color: #059669; font-size: 18px; font-weight: bold;">₹${order.finalAmount}</td>
                  </tr>
                </table>
                
                ${order.croppedImageUrl ? `
                <div style="margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-bottom: 10px;">Product Image</h3>
                  <img src="${order.croppedImageUrl}" alt="Product Image" style="max-width: 300px; width: 100%; border-radius: 8px; border: 2px solid #e5e7eb;" />
                </div>
                ` : ''}
                
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${confirmUrl}" style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                    ✓ Confirm Order & Notify Customer
                  </a>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
                  <p>Photo Magnet Celebrations</p>
                  <p>${adminPhone} | ${adminEmail}</p>
                </div>
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Failed to send email to admin:', errorData);
      } else {
        console.log('✅ Admin email sent successfully');
      }
    } catch (error) {
      console.error('Admin email sending error:', error);
    }

    // 2. Send SMS to Admin (using MSG91 or Twilio)
    try {
      if (process.env.MSG91_AUTH_KEY) {
        // Using MSG91 (Indian SMS service)
        const smsMessage = `🎉 New Order!\nID: ${order.orderId}\nCustomer: ${order.customerName}\nPhone: ${order.whatsapp}\nProduct: ${order.productType.toUpperCase()}\nQty: ${order.quantity}\nAmount: ₹${order.finalAmount}\n\nCheck admin panel.`;
        
        const msg91Response = await fetch(`https://api.msg91.com/api/v5/flow/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': process.env.MSG91_AUTH_KEY,
          },
          body: JSON.stringify({
            flow_id: process.env.MSG91_FLOW_ID || '',
            sender: process.env.MSG91_SENDER_ID || 'PHOTOM',
            mobiles: adminPhone,
            message: smsMessage,
          }),
        });

        if (!msg91Response.ok) {
          console.error('Failed to send SMS to admin');
        } else {
          console.log('✅ Admin SMS sent successfully');
        }
      }
    } catch (error) {
      console.error('Admin SMS sending error:', error);
    }

    // 3. Send WhatsApp to Admin (using WhatsApp Business API)
    try {
      if (process.env.WHATSAPP_API_KEY) {
        const whatsappMessage = `🎉 *New Order Received!*\n\n*Order ID:* ${order.orderId}\n*Customer:* ${order.customerName}\n*Phone:* ${order.whatsapp}\n*Product:* ${order.productType.toUpperCase()}\n*Quantity:* ${order.quantity}\n*Amount:* ₹${order.finalAmount}\n\nCheck your admin panel for more details.`;
        
        const whatsappResponse = await fetch(`https://api.whatsapp.com/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: adminPhone,
            type: 'text',
            text: { body: whatsappMessage },
          }),
        });

        if (!whatsappResponse.ok) {
          console.error('Failed to send WhatsApp to admin');
        } else {
          console.log('✅ Admin WhatsApp sent successfully');
        }
      }
    } catch (error) {
      console.error('Admin WhatsApp sending error:', error);
    }

    // ========== CUSTOMER NOTIFICATIONS ==========

    // 4. Send Email to Customer
    try {
      if (order.email) {
        const customerEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY || '',
          },
          body: JSON.stringify({
            sender: { name: 'Photo Magnet Celebrations', email: 'photomagnetcelebrations@gmail.com' },
            to: [{ email: order.email, name: order.customerName }],
            subject: `Order Confirmed - ${order.orderId}`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #059669; margin: 0;">✓ Order Confirmed!</h1>
                    <p style="color: #6b7280; margin: 10px 0;">Thank you for your order</p>
                  </div>
                  
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <h2 style="margin: 0 0 10px 0; color: #1f2937;">Order ID</h2>
                    <p style="margin: 0; color: #059669; font-size: 24px; font-weight: bold;">${order.orderId}</p>
                  </div>
                  
                  <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Summary</h3>
                  <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Product</td>
                      <td style="padding: 8px 0; color: #1f2937; text-align: right;">${order.productType.toUpperCase()} Photo Magnet</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Quantity</td>
                      <td style="padding: 8px 0; color: #1f2937; text-align: right;">${order.quantity} piece(s)</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                      <td style="padding: 8px 0; color: #1f2937; text-align: right;">₹${order.totalPrice}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Delivery</td>
                      <td style="padding: 8px 0; color: #1f2937; text-align: right;">₹${order.deliveryCharge}</td>
                    </tr>
                    ${order.discount > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #059669;">Discount</td>
                      <td style="padding: 8px 0; color: #059669; text-align: right;">-₹${order.discount}</td>
                    </tr>
                    ` : ''}
                    <tr style="border-top: 2px solid #e5e7eb;">
                      <td style="padding: 12px 0; color: #1f2937; font-weight: bold; font-size: 18px;">Total</td>
                      <td style="padding: 12px 0; color: #059669; font-weight: bold; font-size: 18px; text-align: right;">₹${order.finalAmount}</td>
                    </tr>
                  </table>
                  
                  <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Delivery Address</h3>
                  <div style="padding: 15px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 5px 0; color: #1f2937;"><strong>${order.customerName}</strong></p>
                    <p style="margin: 5px 0; color: #6b7280;">${order.address}</p>
                    <p style="margin: 5px 0; color: #6b7280;">${order.pincode}, ${order.state}</p>
                    <p style="margin: 5px 0; color: #6b7280;">${order.whatsapp}</p>
                  </div>
                  
                  ${order.croppedImageUrl ? `
                  <div style="margin: 20px 0; text-align: center;">
                    <h3 style="color: #1f2937; margin-bottom: 10px;">Your Customized Design</h3>
                    <img src="${order.croppedImageUrl}" alt="Your Design" style="max-width: 250px; width: 100%; border-radius: 8px; border: 2px solid #e5e7eb;" />
                  </div>
                  ` : ''}
                  
                  <div style="margin: 30px 0; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold;">We'll notify you once your order is shipped!</p>
                    <p style="margin: 10px 0; color: #60a5fa;">Expected delivery: 5-7 business days</p>
                  </div>
                  
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
                    <p style="margin: 5px 0;">Need help? Contact us:</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> +91 7330775225</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> photomagnetcelebrations@gmail.com</p>
                    <p style="margin: 15px 0; color: #9ca3af;">Photo Magnet Celebrations</p>
                  </div>
                </div>
              </div>
            `,
          }),
        });

        if (!customerEmailResponse.ok) {
          const errorData = await customerEmailResponse.json();
          console.error('Failed to send email to customer:', errorData);
        } else {
          console.log('✅ Customer email sent successfully');
        }
      }
    } catch (error) {
      console.error('Customer email sending error:', error);
    }

    // 5. Send SMS to Customer
    try {
      if (process.env.MSG91_AUTH_KEY && order.whatsapp) {
        // Remove any special characters and spaces from phone number
        const customerPhone = order.whatsapp.replace(/[^0-9]/g, '');
        const customerPhoneFormatted = customerPhone.startsWith('91') ? customerPhone : `91${customerPhone}`;
        
        const customerSmsMessage = `Dear ${order.customerName},\n\nYour order ${order.orderId} has been confirmed!\n\nProduct: ${order.productType.toUpperCase()} Magnet\nQuantity: ${order.quantity}\nAmount: ₹${order.finalAmount}\n\nWe'll notify you once shipped.\n\nPhoto Magnet Celebrations\n${adminPhone}`;
        
        const msg91Response = await fetch(`https://api.msg91.com/api/v5/flow/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': process.env.MSG91_AUTH_KEY,
          },
          body: JSON.stringify({
            flow_id: process.env.MSG91_FLOW_ID || '',
            sender: process.env.MSG91_SENDER_ID || 'PHOTOM',
            mobiles: customerPhoneFormatted,
            message: customerSmsMessage,
          }),
        });

        if (!msg91Response.ok) {
          console.error('Failed to send SMS to customer');
        } else {
          console.log('✅ Customer SMS sent successfully');
        }
      }
    } catch (error) {
      console.error('Customer SMS sending error:', error);
    }

    // 6. Send WhatsApp to Customer
    try {
      if (process.env.WHATSAPP_API_KEY && order.whatsapp) {
        const customerPhone = order.whatsapp.replace(/[^0-9]/g, '');
        const customerPhoneFormatted = customerPhone.startsWith('91') ? customerPhone : `91${customerPhone}`;
        
        const customerWhatsAppMessage = `Hello ${order.customerName}! 👋\n\n✅ *Order Confirmed*\n\n*Order ID:* ${order.orderId}\n*Product:* ${order.productType.toUpperCase()} Photo Magnet\n*Quantity:* ${order.quantity}\n*Amount Paid:* ₹${order.finalAmount}\n\n📦 Your order is being prepared and will be shipped soon!\n\nWe'll send you tracking details once it's dispatched.\n\n*Expected Delivery:* 5-7 business days\n\nThank you for choosing Photo Magnet Celebrations! 🎉\n\n*Need help?*\nCall/WhatsApp: ${adminPhone}\nEmail: ${adminEmail}`;
        
        const whatsappResponse = await fetch(`https://api.whatsapp.com/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: customerPhoneFormatted,
            type: 'text',
            text: { body: customerWhatsAppMessage },
          }),
        });

        if (!whatsappResponse.ok) {
          console.error('Failed to send WhatsApp to customer');
        } else {
          console.log('✅ Customer WhatsApp sent successfully');
        }
      }
    } catch (error) {
      console.error('Customer WhatsApp sending error:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent successfully',
    });
  } catch (error: any) {
    console.error('Notify admin error:', error);
    return NextResponse.json(
      { success: false, message: 'Notification failed', error: error.message },
      { status: 500 }
    );
  }
}
