import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Career from '@/models/Career';
import { generateCareerInfo } from '@/lib/ai';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET a specific career by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if it's a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      // If not a valid ObjectId, try to generate career info using AI
      const { searchParams } = new URL(request.url);
      const title = searchParams.get('title') || id;
      
      const careerInfo = await generateCareerInfo(title);
      
      return NextResponse.json({
        success: true,
        source: 'ai',
        data: {
          title,
          ...careerInfo,
          isAIGenerated: true
        }
      });
    }
    
    // Find career by ID
    const career = await Career.findById(id);
    
    if (!career) {
      return NextResponse.json(
        { success: false, message: 'Career not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      source: 'database',
      data: career
    });
  } catch (error) {
    console.error('Error fetching career:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch career' },
      { status: 500 }
    );
  }
}

// PUT update a career (protected route)
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
    
    // Find and update career
    const career = await Career.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!career) {
      return NextResponse.json(
        { success: false, message: 'Career not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update career' },
      { status: 500 }
    );
  }
}

// DELETE a career (protected route)
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
    
    // Find and delete career
    const career = await Career.findByIdAndDelete(id);
    
    if (!career) {
      return NextResponse.json(
        { success: false, message: 'Career not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete career' },
      { status: 500 }
    );
  }
}