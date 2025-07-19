import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Roadmap from '@/models/Roadmap';
import Career from '@/models/Career';
import { generateCareerRoadmap } from '@/lib/ai';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

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
    
    const { 
      careerTitle, 
      careerId,
      background = '',
      experience = '',
      education = '',
      skills = []
    } = await request.json();
    
    if (!careerTitle && !careerId) {
      return NextResponse.json(
        { success: false, message: 'Career title or ID is required' },
        { status: 400 }
      );
    }
    
    // If careerId is provided, get the career from the database
    let career;
    if (careerId) {
      career = await Career.findById(careerId);
      if (!career) {
        return NextResponse.json(
          { success: false, message: 'Career not found' },
          { status: 404 }
        );
      }
    }
    
    // Generate roadmap using AI
    const roadmapData = await generateCareerRoadmap(
      career?.title || careerTitle,
      { background, experience, education }
    );
    
    // Format milestones with order
    const milestones = roadmapData.milestones.map((milestone, index) => ({
      ...milestone,
      order: index + 1
    }));
    
    // Create roadmap in database
    const roadmap = await Roadmap.create({
      title: roadmapData.title || `${career?.title || careerTitle} Roadmap`,
      description: roadmapData.description,
      career: careerId || null,
      estimatedDuration: roadmapData.estimatedDuration,
      milestones,
      isAIGenerated: true,
      createdBy: decoded.id,
      userBackground: {
        education,
        experience,
        skills: Array.isArray(skills) ? skills : []
      }
    });
    
    return NextResponse.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}