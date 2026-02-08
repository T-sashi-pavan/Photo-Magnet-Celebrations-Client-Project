# Admin Panel Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Install
```bash
npm install
```

### 2. Environment Setup
Copy `.env.local` and fill in your values (see SETUP_GUIDE.md for detailed instructions)

### 3. Initialize Database (RUN ONCE)
```bash
npm run dev

# In another terminal:
curl -X POST http://localhost:3001/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"setupKey": "SETUP_ADMIN_2024"}'
```

### 4. Login
- URL: http://localhost:3001
- Email: admin@photomagnetcelebrations.com
- Password: Admin@123456

## 📦 What's Included

- ✅ Admin authentication with JWT
- ✅ Order management dashboard
- ✅ Stock management (auto-decreases on orders)
- ✅ Email & SMS notifications to admin
- ✅ One-click order confirmation to customers
- ✅ Beautiful dark-themed UI

## 🌐 Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or use Netlify Dashboard:
- Base directory: `admin`
- Build command: `npm run build`
- Publish directory: `admin/.next`

## 📖 Full Documentation

See `../SETUP_GUIDE.md` for complete setup, deployment, and troubleshooting guide.

## 📞 Support

Email: sashipavan111111@gmail.com
Phone: +91 7330775225
