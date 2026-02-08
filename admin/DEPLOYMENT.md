# Admin Panel Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Environment Variables in Netlify
Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**

Add ALL these variables (copy from `.env.example`):
- MONGODB_URI
- ADMIN_EMAIL
- ADMIN_PASSWORD
- JWT_SECRET
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- BREVO_API_KEY
- BREVO_SMTP_HOST
- BREVO_SMTP_PORT
- BREVO_SMTP_USER
- BREVO_SMTP_PASSWORD
- ADMIN_PHONE_NUMBER
- ADMIN_EMAIL_ADDRESS
- FRONTEND_URL

### 2. Build Settings in Netlify
- **Base directory:** `admin`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `admin/.next`
- **Functions directory:** (auto-detected by Next.js plugin)

### 3. Deploy Settings
- **Node version:** 18 or higher (set in Environment Variables: `NODE_VERSION=18`)

---

## 🔧 Initial Setup After Deployment

### Step 1: Initialize Admin Account
Make ONE-TIME API call to setup endpoint:

```bash
curl -X POST https://your-admin-site.netlify.app/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@photomagnetcelebrations.com",
    "password": "Admin@123456"
  }'
```

**⚠️ IMPORTANT:** After successful setup, this endpoint should be disabled/removed for security.

### Step 2: Test Login
Visit: `https://your-admin-site.netlify.app`
- Email: `admin@photomagnetcelebrations.com`
- Password: `Admin@123456`

### Step 3: Verify Functionality
- ✅ Can view orders
- ✅ Can update stock
- ✅ Can confirm orders
- ✅ Email/SMS notifications working

---

## 🐛 Troubleshooting

### 502 Bad Gateway Error
**Cause:** Serverless function timeout or MongoDB connection issue

**Solutions:**
1. Check environment variables are set correctly in Netlify
2. Verify MongoDB URI is correct and cluster is accessible
3. Check Netlify function logs for detailed errors
4. Ensure MongoDB IP whitelist includes `0.0.0.0/0` (allow all)

### Login Returns "Invalid Credentials"
**Cause:** Admin account not created

**Solution:** 
Run the setup API call (Step 1 above)

### 404 on API Routes
**Cause:** Build configuration issue

**Solution:**
- Verify `base directory` is set to `admin` in Netlify
- Check build logs for successful compilation
- Ensure `@netlify/plugin-nextjs` is installed

### Database Connection Timeout
**Cause:** MongoDB Atlas network restrictions

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow from anywhere)
3. Or add Netlify's outbound IPs

---

## 🔒 Security Recommendations

1. **Change Default Password** after first login
2. **Disable setup endpoint** in production
3. **Use strong JWT secret** (minimum 32 characters)
4. **Enable MongoDB IP whitelist** after testing
5. **Set up custom domain** with HTTPS
6. **Monitor logs** for unauthorized access attempts

---

## 📝 Deployment Commands

```bash
# From root directory
git add .
git commit -m "Deploy admin panel"
git push origin main
```

Netlify will auto-deploy when changes are pushed to the repository.
