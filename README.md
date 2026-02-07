# Photo Magnets - Custom Fridge Magnet E-commerce

A full-stack Next.js e-commerce application for selling custom photo magnets with image cropping, Cloudinary upload, and Razorpay payment integration.

## Features

### Products
- **Square Magnets**: 2×2 inch, no stand
- **Rectangle Magnets**:
  - Portrait (3×4 inch) - with/without stand
  - Landscape (4×3 inch) - with/without stand

### User Experience
- Product selection with multiple variants
- Image upload and Instagram-style cropping (react-easy-crop)
- Aspect ratios: 1:1, 3:4, 4:3
- Real-time quantity-based pricing
- Interactive shopping cart

### Business Logic
- **Quantity-based pricing slabs**
- **Delivery Rules**:
  - Only serviceable in Telangana & Andhra Pradesh
  - Square magnets: Free delivery on 4+ pieces (₹40 otherwise)
  - Rectangle magnets: Free delivery from 1 piece
- Form validation with WhatsApp number, pincode, and state verification

### Payment
- Razorpay integration (UPI, GPay, PhonePe supported)
- Server-side payment verification
- Order confirmation

## Setup Instructions

### 1. Install Dependencies
```bash
cd magnets
npm install
```

### 2. Environment Variables
The `.env.local` file is already configured with your Cloudinary credentials. You need to add your Razorpay keys:

```env
# Cloudinary (Already configured)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlujb9uqv
CLOUDINARY_API_KEY=647741526875949
CLOUDINARY_API_SECRET=6fsBwWr6oK-U9ObI5rI5KMBm0Uw

# Razorpay (You need to add these)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Cloudinary Setup
⚠️ **IMPORTANT**: You need to create an unsigned upload preset in Cloudinary:

1. Go to https://cloudinary.com/console
2. Navigate to Settings → Upload
3. Scroll to "Upload presets"
4. Click "Add upload preset"
5. Set the preset name to: **`magnets_unsigned`**
6. Set signing mode to: **Unsigned**
7. Save

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
magnets/
├── app/
│   ├── page.tsx              # Main page with cart & checkout logic
│   ├── layout.tsx            # Root layout with Razorpay script
│   ├── globals.css           # Global styles
│   └── api/
│       └── razorpay/
│           ├── create-order/  # Create Razorpay order
│           └── verify-payment/ # Verify payment signature
├── components/
│   ├── ProductCustomizer.tsx  # Product selection & customization
│   ├── ImageCropper.tsx       # Image cropping with react-easy-crop
│   ├── CheckoutForm.tsx       # Checkout form with validation
│   └── CartSummary.tsx        # Cart display & pricing
├── lib/
│   ├── products.ts            # Product data & pricing logic
│   ├── imageUtils.ts          # Image cropping & Cloudinary upload
│   └── cloudinary.ts          # Cloudinary config
├── types/
│   └── index.ts               # TypeScript types
└── .env.local                 # Environment variables
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-easy-crop** - Image cropping
- **Cloudinary** - Image storage
- **Razorpay** - Payment gateway

## Pricing Logic

The pricing is based on quantity slabs defined in `lib/products.ts`:

**Square Magnets (2×2)**:
- 1-3 pieces: ₹50 each
- 4-9 pieces: ₹45 each
- 10-19 pieces: ₹40 each
- 20+ pieces: ₹35 each

**Rectangle with Stand**:
- 1-3 pieces: ₹80 each
- 4-9 pieces: ₹75 each
- 10-19 pieces: ₹70 each
- 20+ pieces: ₹65 each

**Rectangle without Stand**:
- 1-3 pieces: ₹70 each
- 4-9 pieces: ₹65 each
- 10-19 pieces: ₹60 each
- 20+ pieces: ₹55 each

## Delivery Logic

- **States**: Only Telangana & Andhra Pradesh
- **Square magnets**: Free delivery on 4+ pieces, otherwise ₹40
- **Rectangle magnets**: Free delivery from 1 piece

## Next Steps

1. ✅ Get Razorpay API keys from https://dashboard.razorpay.com/
2. ✅ Create Cloudinary unsigned upload preset named `magnets_unsigned`
3. ✅ Update `.env.local` with Razorpay keys
4. 🎨 Customize colors and branding
5. 📧 Add email notifications (optional)
6. 🗄️ Add database for order management (optional)
7. 🚀 Deploy to Vercel

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy to Vercel:
```bash
npx vercel
```

Make sure to add all environment variables in your Vercel project settings!

## Notes

- Payment verification happens server-side for security
- Images are automatically uploaded to Cloudinary after cropping
- Form validation includes mobile number and pincode format checks
- Cart persists in component state (consider adding localStorage for persistence)
- Responsive design works on mobile, tablet, and desktop

## Support

For issues or questions, refer to:
- Next.js: https://nextjs.org/docs
- Cloudinary: https://cloudinary.com/documentation
- Razorpay: https://razorpay.com/docs/
- react-easy-crop: https://github.com/ValentinH/react-easy-crop
