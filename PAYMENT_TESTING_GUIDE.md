# Payment Gateway Testing Guide

## 🧪 TEST MODE (Without KYC Verification)

Since your Cashfree account doesn't have KYC verification yet, we've implemented a **TEST MODE** that simulates the entire payment flow without charging real money.

### ✅ What's Currently Enabled

**TEST_MODE is ACTIVE** (set in `.env.local`)

```env
NEXT_PUBLIC_TEST_MODE=true
```

### 🎯 What You Can Test

1. **Complete Checkout Flow**
   - Add products to cart
   - Fill customer details
   - Submit order
   - See order confirmation

2. **Order Creation**
   - Orders are created in your database
   - Admin notifications are sent (WhatsApp/Email)
   - Order records are saved with "MOCK_SUCCESS" payment status

3. **User Experience**
   - All UI elements work correctly
   - Form validation works
   - Toast notifications appear
   - Order summary displays correctly

### 📋 Testing Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Go to Homepage**
   - Open: http://localhost:3000

3. **Create an Order**
   - Select Square or Rectangle magnets
   - Upload a photo
   - Crop and add to cart
   - Click "Proceed to Checkout"

4. **Fill Checkout Form**
   - Enter customer details
   - Select Telangana or Andhra Pradesh (only serviceable states)
   - Click "Pay ₹XXX"

5. **See Results**
   - You'll see: "🧪 TEST MODE: Order created successfully! (No payment charged)"
   - Order will be saved in database
   - You'll be redirected to success page

### 🎨 Visual Indicators

When TEST_MODE is active, you'll see:
- **Yellow banner** on checkout page: "🧪 TEST MODE ACTIVE"
- **Console logs** showing "🧪 TEST MODE ENABLED"
- **Success message** says "TEST MODE: Order created successfully!"

### 🔄 Switching to Real Payments

When you get KYC verification:

1. **Update `.env.local`:**
   ```env
   # Get real credentials from Cashfree dashboard
   NEXT_PUBLIC_CASHFREE_APP_ID=your_real_app_id
   CASHFREE_SECRET_KEY=your_real_secret_key
   NEXT_PUBLIC_CASHFREE_ENV=sandbox
   
   # Disable test mode
   NEXT_PUBLIC_TEST_MODE=false
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Test with Cashfree Test Cards:**
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: 123

### 📊 Order Data Structure (Test Mode)

Orders created in test mode will have:
```json
{
  "customerName": "John Doe",
  "whatsapp": "9876543210",
  "paymentId": "MOCK_1676123456789",
  "paymentStatus": "MOCK_SUCCESS",
  "finalAmount": 299,
  "status": "pending"
}
```

### 🚀 Current Status

✅ Test mode is **ENABLED**  
✅ You can test the **complete order flow**  
✅ **No payment gateway** required  
✅ **No KYC verification** needed  
⏳ Ready to switch to real payments when KYC is complete

### 📝 Notes

- Test mode orders are real database entries
- Admin will receive notifications for test orders
- You can use any phone number/email for testing
- No actual money is charged in test mode
- Perfect for frontend testing and demo purposes

### 🔧 Troubleshooting

**Issue:** Don't see test mode banner  
**Fix:** Make sure `.env.local` has `NEXT_PUBLIC_TEST_MODE=true` and restart server

**Issue:** Order not created  
**Fix:** Check MongoDB connection in admin panel

**Issue:** No admin notification  
**Fix:** Check WhatsApp/Email API credentials in admin `.env.local`

---

**Ready to test!** 🎉

Just run `npm run dev` and go through the checkout process. Everything will work without needing Cashfree KYC!
