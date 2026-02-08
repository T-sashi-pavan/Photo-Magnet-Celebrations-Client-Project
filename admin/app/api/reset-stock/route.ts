import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// This route drops the stock collection and recreates it with new schema
export async function POST(req: NextRequest) {
  try {
    const { resetKey } = await req.json();

    // Require a reset key for security
    if (resetKey !== 'RESET_STOCK_2024') {
      return NextResponse.json(
        { success: false, message: 'Invalid reset key' },
        { status: 403 }
      );
    }

    await connectDB();

    // Drop the stocks collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    await db.collection('stocks').drop();
    console.log('✅ Successfully dropped stocks collection');

    return NextResponse.json({
      success: true,
      message: 'Stocks collection dropped successfully. Now run setup endpoint to recreate with 3 records.',
    });
  } catch (error: any) {
    // If collection doesn't exist, that's fine
    if (error.message.includes('ns not found')) {
      return NextResponse.json({
        success: true,
        message: 'Stocks collection does not exist or already dropped.',
      });
    }
    
    console.error('Reset stock error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset stock', error: error.message },
      { status: 500 }
    );
  }
}
