import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SMS_API_URL = 'https://api.brevo.com/v3/transactionalSMS/sms';
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

export async function sendAdminNotificationSMS(orderDetails: any) {
  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not configured. SMS notification skipped.');
    return;
  }

  const message = `🎉 New Order Received!

Order ID: ${orderDetails.orderId}
Customer: ${orderDetails.customerName}
Phone: ${orderDetails.whatsapp}
Product: ${orderDetails.productType.toUpperCase()}${orderDetails.productType === 'rectangle' ? (orderDetails.withStand ? ' with Stand' : ' without Stand') : ''}
Quantity: ${orderDetails.quantity}
Amount: ₹${orderDetails.finalAmount}

Check admin panel for details and confirm order.`;

  const smsData = {
    sender: 'PhotoMagnet',
    recipient: adminPhoneNumber,
    content: message,
    type: 'transactional',
  };

  try {
    await axios.post(BREVO_SMS_API_URL, smsData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ SMS sent to admin successfully via Brevo');
  } catch (error) {
    console.error('❌ Failed to send SMS via Brevo:', error);
  }
}

export async function sendCustomerConfirmationSMS(orderDetails: any, customerPhone: string) {
  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not configured. SMS notification skipped.');
    return;
  }

  const message = `✅ Order Confirmed!

Dear ${orderDetails.customerName},

Your order (${orderDetails.orderId}) has been confirmed and is being processed.

Product: ${orderDetails.productType.toUpperCase()}${orderDetails.productType === 'rectangle' ? (orderDetails.withStand ? ' with Stand' : ' without Stand') : ''}
Quantity: ${orderDetails.quantity}
Amount Paid: ₹${orderDetails.finalAmount}

We'll notify you when your order is shipped.

Thank you for choosing Photo Magnet Celebrations! 🎉`;

  const smsData = {
    sender: 'PhotoMagnet',
    recipient: customerPhone,
    content: message,
    type: 'transactional',
  };

  try {
    await axios.post(BREVO_SMS_API_URL, smsData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Confirmation SMS sent to customer successfully via Brevo');
  } catch (error) {
    console.error('❌ Failed to send SMS to customer via Brevo:', error);
  }
}

// Optional: WhatsApp notification function using Brevo
export async function sendWhatsAppNotification(phoneNumber: string, message: string) {
  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not configured. WhatsApp notification skipped.');
    return;
  }

  // Brevo WhatsApp API endpoint (if enabled in your account)
  const BREVO_WHATSAPP_API_URL = 'https://api.brevo.com/v3/whatsapp/sendMessage';
  
  const whatsappData = {
    recipient: phoneNumber,
    message: message,
  };

  try {
    await axios.post(BREVO_WHATSAPP_API_URL, whatsappData, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ WhatsApp notification sent via Brevo');
  } catch (error) {
    console.error('❌ Failed to send WhatsApp notification:', error);
    // Don't throw error for WhatsApp - it's optional
  }
}

