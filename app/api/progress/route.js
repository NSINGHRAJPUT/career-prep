import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET all progress for the authenticated user
export async function GET(request) {
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmap');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { user: decoded.id };
    if (roadmapId) query.roadmap = roadmapId;
    
    // Get progress records
    const progress = await UserProgress.find(query)
      .populate('roadmap', 'title description estimatedDuration')
      .sort({ lastUpdatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await UserProgress.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      count: progress.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST a new progress record (protected route)
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
    
    const { roadmap: roadmapId } = await request.json();
    
    if (!roadmapId) {
      return NextResponse.json(
        { success: false, message: 'Roadmap ID is required' },
        { status: 400 }
      );
    }
    
    // Check if progress record already exists
    const existingProgress = await UserProgress.findOne({
      user: decoded.id,
      roadmap: roadmapId
    });
    
    if (existingProgress) {
      return NextResponse.json(
        { success: false, message: 'Progress record already exists for this roadmap' },
        { status: 400 }
      );
    }
    
    // Create progress record
    const progress = await UserProgress.create({
      user: decoded.id,
      roadmap: roadmapId,
      milestoneProgress: [],
      overallProgress: 0,
      isCompleted: false
    });
    
    return NextResponse.json(
      { success: true, data: progress },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating progress record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create progress record' },
      { status: 500 }
    );
  }
}