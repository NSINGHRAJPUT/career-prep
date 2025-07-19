import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Roadmap from '@/models/Roadmap';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET a specific roadmap by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Find roadmap by ID
    const roadmap = await Roadmap.findById(id)
      .populate('career', 'title description category');
    
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}

// PUT update a roadmap (protected route)
export async function PUT(request, { params }) {
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
    
    const { id } = params;
    const body = await request.json();
    
    // Find and update roadmap
    const roadmap = await Roadmap.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update roadmap' },
      { status: 500 }
    );
  }
}

// DELETE a roadmap (protected route)
export async function DELETE(request, { params }) {
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
    
    const { id } = params;
    
    // Find and delete roadmap
    const roadmap = await Roadmap.findByIdAndDelete(id);
    
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete roadmap' },
      { status: 500 }
    );
  }
}