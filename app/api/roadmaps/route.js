import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Roadmap from '@/models/Roadmap';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET all roadmaps or filter by user
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const careerId = searchParams.get('career');
    const userId = searchParams.get('user');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (careerId) query.career = careerId;
    if (userId) query.createdBy = userId;
    
    // Get roadmaps
    const roadmaps = await Roadmap.find(query)
      .populate('career', 'title description category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Roadmap.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      count: roadmaps.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: roadmaps
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}

// POST a new roadmap (protected route)
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
    
    // Create roadmap
    const roadmap = await Roadmap.create({
      ...body,
      createdBy: decoded.id
    });
    
    return NextResponse.json(
      { success: true, data: roadmap },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create roadmap' },
      { status: 500 }
    );
  }
}