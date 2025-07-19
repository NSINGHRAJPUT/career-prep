import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import Roadmap from '@/models/Roadmap';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

// GET a specific progress record by ID
export async function GET(request, { params }) {
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
    
    // Find progress record by ID
    const progress = await UserProgress.findById(id)
      .populate('roadmap', 'title description estimatedDuration milestones');
    
    if (!progress) {
      return NextResponse.json(
        { success: false, message: 'Progress record not found' },
        { status: 404 }
      );
    }
    
    // Check if the progress record belongs to the authenticated user
    if (progress.user.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to access this progress record' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch progress record' },
      { status: 500 }
    );
  }
}

// PUT update a progress record (protected route)
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
    
    // Find progress record by ID
    const progress = await UserProgress.findById(id);
    
    if (!progress) {
      return NextResponse.json(
        { success: false, message: 'Progress record not found' },
        { status: 404 }
      );
    }
    
    // Check if the progress record belongs to the authenticated user
    if (progress.user.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this progress record' },
        { status: 401 }
      );
    }
    
    // Update progress record
    const updatedProgress = await UserProgress.findByIdAndUpdate(id, 
      {
        ...body,
        lastUpdatedAt: Date.now()
      }, 
      {
        new: true,
        runValidators: true
      }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedProgress
    });
  } catch (error) {
    console.error('Error updating progress record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update progress record' },
      { status: 500 }
    );
  }
}

// POST update milestone completion status
export async function POST(request, { params }) {
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
    const { 
      milestoneId, 
      itemType, 
      itemId, 
      completed 
    } = await request.json();
    
    if (!milestoneId) {
      return NextResponse.json(
        { success: false, message: 'Milestone ID is required' },
        { status: 400 }
      );
    }
    
    // Find progress record by ID
    const progress = await UserProgress.findById(id);
    
    if (!progress) {
      return NextResponse.json(
        { success: false, message: 'Progress record not found' },
        { status: 404 }
      );
    }
    
    // Check if the progress record belongs to the authenticated user
    if (progress.user.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this progress record' },
        { status: 401 }
      );
    }
    
    // Get the roadmap to calculate total items
    const roadmap = await Roadmap.findById(progress.roadmap);
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }
    
    // Find the milestone in the progress record
    let milestoneProgress = progress.milestoneProgress.find(
      mp => mp.milestoneId.toString() === milestoneId
    );
    
    // If milestone progress doesn't exist, create it
    if (!milestoneProgress) {
      milestoneProgress = {
        milestoneId,
        completedItems: [],
        isCompleted: false
      };
      progress.milestoneProgress.push(milestoneProgress);
    }
    
    // Update completed items
    if (itemType && itemId) {
      const itemIndex = milestoneProgress.completedItems.findIndex(
        item => item.itemType === itemType && item.itemId.toString() === itemId
      );
      
      if (completed && itemIndex === -1) {
        // Add item to completed items
        milestoneProgress.completedItems.push({
          itemType,
          itemId,
          completedAt: Date.now()
        });
      } else if (!completed && itemIndex !== -1) {
        // Remove item from completed items
        milestoneProgress.completedItems.splice(itemIndex, 1);
      }
    }
    
    // Calculate milestone completion status
    const milestone = roadmap.milestones.find(
      m => m._id.toString() === milestoneId
    );
    
    if (milestone) {
      const totalItems = (milestone.resources?.length || 0) + 
                        (milestone.projects?.length || 0) + 
                        (milestone.certifications?.length || 0);
      
      milestoneProgress.isCompleted = totalItems > 0 && 
        milestoneProgress.completedItems.length >= totalItems;
      
      if (milestoneProgress.isCompleted && !milestoneProgress.completedAt) {
        milestoneProgress.completedAt = Date.now();
      } else if (!milestoneProgress.isCompleted) {
        milestoneProgress.completedAt = undefined;
      }
    }
    
    // Calculate overall progress
    const totalMilestones = roadmap.milestones.length;
    const completedMilestones = progress.milestoneProgress.filter(mp => mp.isCompleted).length;
    progress.overallProgress = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100) 
      : 0;
    
    // Check if all milestones are completed
    progress.isCompleted = totalMilestones > 0 && completedMilestones === totalMilestones;
    if (progress.isCompleted && !progress.completedAt) {
      progress.completedAt = Date.now();
    } else if (!progress.isCompleted) {
      progress.completedAt = undefined;
    }
    
    // Update last updated timestamp
    progress.lastUpdatedAt = Date.now();
    
    // Save progress
    await progress.save();
    
    return NextResponse.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error updating milestone progress:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update milestone progress' },
      { status: 500 }
    );
  }
}