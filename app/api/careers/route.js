import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Career from '@/models/Career';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET all careers or filter by category
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query = category ? { category } : {};
    
    // Get careers
    const careers = await Career.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Career.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      count: careers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: careers
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

// POST a new career (protected route)
export async function POST(request) {
  try {
    // Verify authentication
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, no token' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, invalid token' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await request.json();
    
    // Create career
    const career = await Career.create({
      ...body,
      createdBy: decoded.id
    });
    
    return NextResponse.json(
      { success: true, data: career },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create career' },
      { status: 500 }
    );
  }
}