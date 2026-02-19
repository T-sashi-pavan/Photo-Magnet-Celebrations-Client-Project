# Ad Placement Configuration

## Where Ads Will Appear:

### 1. Homepage
- **Top Banner** (after hero section)
- **Sidebar Ad** (next to product gallery)
- **Footer Ad** (before footer)

### 2. Product Pages (Square/Rectangle)
- **After Product Description**
- **In Sidebar**
- **Before Footer**

### 3. Legal Pages (Contact, Terms, Privacy, Refund)
- **Sidebar Ad**
- **Bottom Ad**

## Ad Unit Setup Instructions:

Once you get AdSense approval, create these ad units in your AdSense dashboard:

### Ad Unit 1: "Header Banner"
- **Size**: Responsive
- **Type**: Display ads
- **Format**: Horizontal

### Ad Unit 2: "Sidebar Square"
- **Size**: 300x250 (Medium Rectangle)
- **Type**: Display ads
- **Format**: Rectangle

### Ad Unit 3: "Footer Banner"
- **Size**: Responsive
- **Type**: Display ads
- **Format**: Horizontal

### Ad Unit 4: "In-Content"
- **Size**: Responsive (Multiplex)
- **Type**: In-article ads
- **Format**: Responsive

## After Creating Ad Units:

You'll get code like this for each ad unit:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

**Extract these values:**
- `data-ad-client`: Your Publisher ID (add to .env.local)
- `data-ad-slot`: The ad slot ID (you'll provide these for each placement)

## Example Setup:

When you send me:
```
Publisher ID: ca-pub-1234567890123456
Header Ad Slot: 1234567890
Sidebar Ad Slot: 0987654321
Footer Ad Slot: 5555666677
```

I'll activate the ads on your website!

## Important Notes:

✅ **Ads will NOT show until:**
1. You get AdSense approval
2. You provide Publisher ID
3. You create ad units
4. I update the configuration

⏱️ **Timeline:**
- Sign up: 10 minutes
- Approval: 1-2 weeks
- Setup: 5 minutes
- Ads Go Live: Immediately after setup
