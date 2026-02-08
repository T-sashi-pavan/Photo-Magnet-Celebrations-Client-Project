# Photo Magnet Celebrations - Admin Panel

Complete admin panel for managing orders and stock for Photo Magnet Celebrations.

## 🚀 Features

- ✅ **Admin Authentication** - Secure login with JWT tokens
- 📦 **Order Management** - View all customer orders with details
- 📊 **Stock Management** - Track and update inventory in real-time
- 📧 **Email Notifications** - Automatic notifications to admin on new orders
- 📱 **SMS Notifications** - WhatsApp/SMS alerts for new orders
- ✓ **Order Confirmation** - One-click order confirmation to customers
- 🎨 **Dark Theme UI** - Beautiful, responsive admin dashboard

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Twilio account (for SMS notifications)
- Resend or Gmail SMTP (for email notifications)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file in the `admin` folder:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://sessi111111_db_user:magnet@cluster0.qnuujtd.mongodb.net/photoMagnetCelebrations?retryWrites=true&w=majority&appName=Cluster0

# Admin Credentials
ADMIN_EMAIL=admin@photomagnetcelebrations.com
ADMIN_PASSWORD=Admin@123456

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
ADMIN_PHONE_NUMBER=+917330775225

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sashipavan111111@gmail.com
SMTP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL_ADDRESS=sashipavan111111@gmail.com

# Frontend URL
FRONTEND_URL=https://photomagnetcelebrations.netlify.app
```

### 3. Initialize Admin and Stock

**Important:** Run this ONCE to create admin account and initialize stock:

```bash
# Start the development server
npm run dev

# In another terminal, make a POST request:
curl -X POST http://localhost:3001/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"setupKey": "SETUP_ADMIN_2024"}'
```

This will:
- Create admin account with credentials from `.env.local`
- Initialize stock with 100 units for each product type

### 4. Run Development Server

```bash
npm run dev
```

Admin panel will be available at: `http://localhost:3001`

### 5. Login

Use the credentials from your `.env.local`:
- **Email:** `admin@photomagnetcelebrations.com`
- **Password:** `Admin@123456`

## 📱 SMS Setup (Twilio)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env.local`

## 📧 Email Setup (Gmail)

### Option 1: Gmail SMTP

1. Enable 2-factor authentication in your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Create a new app password for "Mail"
3. Use this app password in `SMTP_PASSWORD`

### Option 2: Resend (Recommended)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Update the notification code to use Resend API

## 🌐 Deployment to Netlify

### Deploy Admin Panel as Separate Site

1. **Push code to GitHub** (if not already)

2. **Create new Netlify site:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Configure build settings:
     ```
     Base directory: admin
     Build command: npm run build
     Publish directory: admin/.next
     ```

3. **Add Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`
   - **Important:** Update `FRONTEND_URL` with your actual admin URL after deployment

4. **Deploy:**
   - Click "Deploy site"
   - Note the deployed URL (e.g., `https://photomagnet-admin.netlify.app`)

5. **Update Frontend:**
   - Add `NEXT_PUBLIC_ADMIN_URL=https://photomagnet-admin.netlify.app` to frontend env vars

### Alternative: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy admin
cd admin
vercel --prod
```

## 🔧 Frontend Integration

Update your frontend checkout flow to create orders after successful payment.

In `app/checkout/page.tsx`, after payment verification success:

```typescript
// After successful payment verification
const orderResponse = await fetch('/api/orders/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: formData.name,
    whatsapp: formData.whatsapp,
    email: formData.email,
    address: formData.address,
    pincode: formData.pincode,
    state: formData.state,
    productType: cartItems[0].category,
    orientation: cartItems[0].orientation,
    withStand: cartItems[0].withStand,
    quantity: cartItems[0].quantity,
    pricePerUnit: pricePerUnit,
    totalPrice: subtotal,
    deliveryCharge: deliveryCharge,
    couponApplied: appliedCoupon,
    discount: discount,
    finalAmount: finalTotal,
    croppedImageUrl: cartItems[0].croppedImageUrl,
    paymentId: paymentData.payment_id,
  }),
});
```

## 📊 Admin Dashboard Features

### Orders Tab
- View all customer orders
- See order details (images, customer info, product details)
- Order status tracking
- Payment information

### Stock Management Tab
- Real-time stock levels for:
  - Square magnets (with/without stand)
  - Rectangle magnets (with/without stand)
- Edit stock quantities
- Stock alerts (low stock, out of stock)
- Auto-decrease on successful orders

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Change JWT Secret:**
   ```
   JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Change Admin Password:**
   - Use a strong, unique password
   - Don't commit `.env.local` to Git

3. **Enable CORS:**
   - Restrict API access to your frontend domain only

4. **Use HTTPS:**
   - Both admin and frontend should use HTTPS in production

5. **Rate Limiting:**
   - Add rate limiting to login endpoint
   - Implement IP-based restrictions if needed

## 📞 Support

For issues or questions:
- **Email:** sashipavan111111@gmail.com
- **Phone:** +91 7330775225

## 📝 License

Proprietary - Photo Magnet Celebrations

---

**Built with ❤️ for Photo Magnet Celebrations**
