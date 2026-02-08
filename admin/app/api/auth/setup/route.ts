import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Stock from '@/models/Stock';
import bcrypt from 'bcryptjs';

// This route is ONLY for initial setup - should be disabled in production
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { setupKey } = await req.json();

    // Require a setup key for security
    if (setupKey !== 'SETUP_ADMIN_2024') {
      return NextResponse.json(
        { success: false, message: 'Invalid setup key' },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    let adminMessage = '';
    if (!existingAdmin) {
      // Hash admin password
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

      // Create admin
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });
      adminMessage = 'Admin created. ';
    } else {
      adminMessage = 'Admin already exists. ';
    }

    // Initialize stock with default values (100 for each)
    // Square has no stand concept (single stock), Rectangle has with/without stand
    const stockItems = [
      { productType: 'square', withStand: null, quantity: 100 },
      { productType: 'rectangle', withStand: true, quantity: 100 },
      { productType: 'rectangle', withStand: false, quantity: 100 },
    ];

    let stockCreated = 0;
    for (const item of stockItems) {
      const result = await Stock.findOneAndUpdate(
        { productType: item.productType, withStand: item.withStand },
        { $setOnInsert: item },
        { upsert: true, new: true }
      );
      if (result) stockCreated++;
    }

    return NextResponse.json({
      success: true,
      message: `${adminMessage}Stock initialized: ${stockCreated} records created.`,
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, message: 'Setup failed', error: error.message },
      { status: 500 }
    );
  }
}
