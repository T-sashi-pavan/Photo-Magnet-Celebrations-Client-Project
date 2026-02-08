# Photo Magnet Celebrations - Complete Setup & Deployment Guide

## 📋 Overview

This project consists of TWO applications:
1. **Frontend** - Customer-facing e-commerce site (already deployed at https://photomagnetcelebrations.netlify.app/)
2. **Admin Panel** - Order and stock management system

## 🛠️ Complete Setup Process

### Step 1: Install Dependencies

#### Frontend
```bash
# In root directory
npm install
```

#### Admin Panel
```bash
cd admin
npm install
```

### Step 2: Configure Environment Variables

#### Frontend Environment (.env.local in root)
```env
# MongoDB Atlas (shared with admin)
MONGODB_URI=mongodb+srv://sessi111111_db_user:magnet@cluster0.qnuujtd.mongodb.net/photoMagnetCelebrations?retryWrites=true&w=majority&appName=Cluster0

# Cashfree Payment Gateway
NEXT_PUBLIC_CASHFREE_APP_ID=your_cashfree_app_id
NEXT_PUBLIC_CASHFREE_ENV=sandbox
CASHFREE_SECRET_KEY=your_cashfree_secret_key

# Cloudinary Image Uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Admin Panel URL (update after admin deployment)
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=https://photomagnetcelebrations.netlify.app

# Twilio SMS (for notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Email API (Resend or SMTP)
RESEND_API_KEY=your_resend_api_key
```

#### Admin Panel Environment (admin/.env.local)
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://sessi111111_db_user:magnet@cluster0.qnuujtd.mongodb.net/photoMagnetCelebrations?retryWrites=true&w=majority&appName=Cluster0

# Admin Credentials
ADMIN_EMAIL=admin@photomagnetcelebrations.com
ADMIN_PASSWORD=Admin@123456

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=generate-strong-random-string-here-minimum-32-characters

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

### Step 3: Initialize Database

**Run this ONCE to set up admin account and stock:**

```bash
cd admin
npm run dev

# In another terminal
curl -X POST http://localhost:3001/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"setupKey": "SETUP_ADMIN_2024"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Admin and stock initialized successfully"
}
```

This creates:
- Admin account with your credentials
- Initial stock: 100 units each for:
  - Square with Stand
  - Square without Stand
  - Rectangle with Stand
  - Rectangle without Stand

### Step 4: Test Locally

#### Start Frontend
```bash
npm run dev
# Runs on http://localhost:3000
```

#### Start Admin Panel (in another terminal)
```bash
cd admin
npm run dev
# Runs on http://localhost:3001
```

## 🌐 Deployment Guide

### Option 1: Deploy Admin to Netlify (Recommended)

#### Create Netlify Site for Admin

1. **Prepare for Deployment:**
   ```bash
   cd admin
   # Make sure all dependencies are installed
   npm install
   ```

2. **Create netlify.toml in admin folder:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   cd admin
   netlify deploy --prod
   ```

4. **Or Deploy via Netlify Dashboard:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Configure:
     ```
     Base directory: admin
     Build command: npm run build
     Publish directory: admin/.next
     ```

5. **Add Environment Variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add ALL variables from admin/.env.local
   - Important: Update FRONTEND_URL if needed

6. **Note Your Admin URL:**
   - Example: `https://photomagnet-admin.netlify.app`
   - Update `NEXT_PUBLIC_ADMIN_URL` in frontend environment

### Option 2: Deploy Admin to Vercel

```bash
npm i -g vercel
cd admin
vercel --prod
```

Then add environment variables in Vercel dashboard.

### Option 3: Keep Same Repository, Two Netlify Sites

**Current Setup:**
- Frontend: `https://photomagnetcelebrations.netlify.app`
- Admin: New site needed

**Steps:**
1. Keep everything in same repo
2. Frontend site configuration:
   ```
   Base directory: (leave empty or "/")
   Build command: npm run build
   Publish directory: .next
   ```

3. Create NEW site for admin:
   ```
   Base directory: admin
   Build command: npm run build
   Publish directory: admin/.next
   ```

## 🔧 Third-Party Service Setup

### Twilio (SMS Notifications)

1. Sign up at https://www.twilio.com/
2. Create a new project
3. Get your Account SID and Auth Token
4. Buy a phone number
5. Add credentials to both frontend and admin .env files

**Cost:** ~$1/month for phone number + $0.0079 per SMS to India

### Email Setup - Option 1: Gmail SMTP

1. Enable 2-factor authentication in Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
   - Create "Mail" app password
3. Use in SMTP_PASSWORD

### Email Setup - Option 2: Resend (Recommended)

1. Sign up at https://resend.com/
2. Verify your domain (or use test mode)
3. Get API key
4. Add to RESEND_API_KEY

**Cost:** Free tier includes 100 emails/day

### MongoDB Atlas (Already Configured)

Your connection string is already set up:
```
mongodb+srv://sessi111111_db_user:magnet@cluster0.qnuujtd.mongodb.net/photoMagnetCelebrations
```

To manage database:
1. Go to https://cloud.mongodb.com/
2. Login with credentials
3. Browse collections: Orders, Stock, Admin

## 🚀 Post-Deployment Checklist

### Frontend
- [ ] Update `NEXT_PUBLIC_ADMIN_URL` with deployed admin URL
- [ ] Test payment flow end-to-end
- [ ] Verify order creation after payment
- [ ] Check Cloudinary image uploads

### Admin Panel
- [ ] Login with admin credentials
- [ ] Verify stock displays correctly
- [ ] Test stock editing
- [ ] Create test order from frontend
- [ ] Verify order appears in admin
- [ ] Test order confirmation button

### Notifications
- [ ] Place test order
- [ ] Confirm SMS received at +917330775225
- [ ] Confirm email received at sashipavan111111@gmail.com
- [ ] Test "Confirm Order" button in email
- [ ] Verify customer receives confirmation

## 🔒 Security Recommendations

### Production Changes:

1. **Generate Strong JWT Secret:**
   ```bash
   openssl rand -base64 32
   ```
   Use output in JWT_SECRET

2. **Change Admin Password:**
   - Use strong password (min 12 characters)
   - Mix of uppercase, lowercase, numbers, symbols

3. **Enable HTTPS:**
   - Both sites should use HTTPS (Netlify provides this)

4. **Add Rate Limiting:**
   - Implement in admin login route
   - Prevent brute force attacks

5. **Restrict CORS:**
   - Only allow requests from your frontend domain

## 📊 How It Works

### Order Flow:

1. **Customer Places Order:**
   - Fills checkout form
   - Completes payment via Cashfree
   - Frontend creates order in database
   - Stock automatically decreases

2. **Admin Receives Notifications:**
   - SMS to +917330775225
   - Email to sashipavan111111@gmail.com
   - Email includes "Confirm Order" button

3. **Admin Confirms Order:**
   - Clicks button in email
   - Or confirms in admin dashboard
   - Customer receives confirmation (SMS + Email)

4. **Stock Management:**
   - Admin views current stock levels
   - Can manually adjust quantities
   - Low stock alerts displayed

## 📱 Admin Panel Features

### Dashboard:
- Total orders, pending orders, total stock
- Orders tab: View all orders with full details
- Stock tab: Manage inventory for all products

### Order Details Display:
- Customer information
- Product details with image
- Payment status
- Delivery address
- Coupon usage

### Stock Management:
- Square with Stand
- Square without Stand  
- Rectangle with Stand
- Rectangle without Stand
- Real-time stock levels
- Edit quantities
- Visual alerts (Low/Out of Stock)

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Verify MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)

### "Admin login not working"
- Run setup endpoint first: `/api/auth/setup`
- Check ADMIN_EMAIL and ADMIN_PASSWORD in .env

### "No notifications received"
- Verify Twilio credentials
- Check email SMTP settings
- Test with curl/Postman first

### "Order not created after payment"
- Check browser console for errors
- Verify MongoDB connection
- Check `/api/orders/create` endpoint

### "Stock not decreasing"
- Check Stock model in MongoDB
- Verify update query in order creation

## 💰 Cost Estimation

| Service | Cost |
|---------|------|
| Netlify (both sites) | Free (100GB bandwidth) |
| MongoDB Atlas | Free (512MB storage) |
| Twilio SMS | ~₹80/month (phone + messages) |
| Resend Email | Free (100/day) |
| Cloudinary | Free (25GB/month) |
| **Total** | **~₹100-200/month** |

## 📞 Support

**Developer Contact:**
- Email: sashipavan111111@gmail.com  
- Phone: +91 7330775225

## 🎯 Next Steps

1. Complete all environment variable setup
2. Run database initialization
3. Test locally on both ports
4. Deploy admin to Netlify
5. Update frontend with admin URL
6. Place test order
7. Verify entire flow works

---

**✨ Your admin panel is ready! Follow this guide step-by-step for successful deployment.**
