import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Career from '@/models/Career';
import { searchCareers } from '@/lib/ai';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // First, search in the database
    const dbCareers = await Career.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
    
    // If we have enough results from the database, return them
    if (dbCareers.length >= 5) {
      return NextResponse.json({
        success: true,
        source: 'database',
        data: dbCareers
      });
    }
    
    // Otherwise, use AI to generate career suggestions
    const aiCareers = await searchCareers(query);
    
    // Combine results, prioritizing database results
    const combinedResults = [
      ...dbCareers,
      ...aiCareers.filter(aiCareer => 
        !dbCareers.some(dbCareer => 
          dbCareer.title.toLowerCase() === aiCareer.title.toLowerCase()
        )
      )
    ];
    
    return NextResponse.json({
      success: true,
      source: dbCareers.length > 0 ? 'mixed' : 'ai',
      data: combinedResults
    });
  } catch (error) {
    console.error('Error searching careers:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to search careers' },
      { status: 500 }
    );
  }
}

// POST endpoint for AI-powered career search
export async function POST(request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Use AI to generate career suggestions
    const careers = await searchCareers(query);
    
    return NextResponse.json({
      success: true,
      source: 'ai',
      data: careers
    });
  } catch (error) {
    console.error('Error searching careers with AI:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to search careers with AI' },
      { status: 500 }
    );
  }
}