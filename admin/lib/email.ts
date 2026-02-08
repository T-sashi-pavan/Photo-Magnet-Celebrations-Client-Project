import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export async function sendAdminNotificationEmail(orderDetails: any) {
  const confirmUrl = `${process.env.FRONTEND_URL}/admin/api/confirm-order?orderId=${orderDetails.orderId}`;
  
  const emailData = {
    sender: {
      name: 'Photo Magnet Celebrations',
      email: 'orders@photomagnetcelebrations.com',
    },
    to: [
      {
        email: process.env.ADMIN_EMAIL_ADDRESS,
        name: 'Admin',
      },
    ],
    subject: `🎉 New Order Received - ${orderDetails.orderId}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📦 New Order Received!</h1>
          <p style="margin: 10px 0 0;">Order ID: <strong>${orderDetails.orderId}</strong></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #d97706; margin-top: 0;">Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>WhatsApp:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.whatsapp}</td>
            </tr>
            ${orderDetails.email ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.email}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.address}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Pincode:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.pincode}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>State:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.state}</td>
            </tr>
          </table>

          <h2 style="color: #d97706; margin-top: 30px;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.productType.toUpperCase()}${orderDetails.productType === 'rectangle' ? (orderDetails.withStand ? ' with Stand' : ' without Stand') : ''}</td>
            </tr>
            ${orderDetails.orientation ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Orientation:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.orientation}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.quantity} pieces</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Total Price:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₹${orderDetails.totalPrice}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Delivery:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₹${orderDetails.deliveryCharge}</td>
            </tr>
            ${orderDetails.couponApplied ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Coupon:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.couponApplied} (-₹${orderDetails.discount})</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 2px solid #d97706;"><strong style="font-size: 16px;">Final Amount:</strong></td>
              <td style="padding: 10px; border-bottom: 2px solid #d97706;"><strong style="font-size: 16px; color: #d97706;">₹${orderDetails.finalAmount}</strong></td>
            </tr>
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <img src="${orderDetails.croppedImageUrl}" alt="Customer Photo" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              ✓ Confirm Order & Notify Customer
            </a>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">Click this button to confirm the order and send confirmation to the customer</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await axios.post(BREVO_API_URL, emailData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Admin notification email sent via Brevo');
  } catch (error) {
    console.error('❌ Failed to send admin notification email:', error);
    throw error;
  }
}

export async function sendCustomerConfirmationEmail(orderDetails: any, customerEmail: string) {
  const emailData = {
    sender: {
      name: 'Photo Magnet Celebrations',
      email: 'orders@photomagnetcelebrations.com',
    },
    to: [
      {
        email: customerEmail,
        name: orderDetails.customerName,
      },
    ],
    subject: `Order Confirmed - ${orderDetails.orderId}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0;">Thank you for your order</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #374151;">Dear ${orderDetails.customerName},</p>
          <p style="font-size: 16px; color: #374151;">Your order has been confirmed and is being processed!</p>
          
          <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <strong style="color: #92400e;">Order ID:</strong> <span style="color: #92400e;">${orderDetails.orderId}</span>
          </div>

          <h2 style="color: #d97706; margin-top: 30px;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.productType.toUpperCase()}${orderDetails.productType === 'rectangle' ? (orderDetails.withStand ? ' with Stand' : ' without Stand') : ''}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderDetails.quantity} pieces</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 2px solid #d97706;"><strong>Total Amount Paid:</strong></td>
              <td style="padding: 10px; border-bottom: 2px solid #d97706;"><strong style="color: #d97706;">₹${orderDetails.finalAmount}</strong></td>
            </tr>
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <img src="${orderDetails.croppedImageUrl}" alt="Your Photo" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="margin: 0 0 10px; color: #374151;">Delivery Address:</h3>
            <p style="margin: 0; color: #6b7280;">${orderDetails.address}</p>
            <p style="margin: 5px 0 0; color: #6b7280;">${orderDetails.pincode}, ${orderDetails.state}</p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            For any queries, contact us at: ${process.env.ADMIN_EMAIL_ADDRESS}
          </p>
        </div>
      </div>
    `,
  };

  try {
    await axios.post(BREVO_API_URL, emailData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Customer confirmation email sent via Brevo');
  } catch (error) {
    console.error('❌ Failed to send customer confirmation email:', error);
    throw error;
  }
}
