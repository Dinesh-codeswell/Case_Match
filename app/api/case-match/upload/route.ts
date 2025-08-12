import { NextRequest, NextResponse } from 'next/server';
import { parseCSVToParticipants } from '@/lib/case-match-parser';
import { runEnhancedIterativeMatching } from '@/lib/enhanced-iterative-matching';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();
    
    if (!csvContent.trim()) {
      return NextResponse.json(
        { error: 'Empty CSV file' },
        { status: 400 }
      );
    }

    console.log('Processing CSV file:', file.name, 'Size:', file.size, 'bytes');

    // Parse CSV to participants
    const participants = await parseCSVToParticipants(csvContent);
    
    if (participants.length === 0) {
      return NextResponse.json(
        { error: 'No valid participants found in CSV file' },
        { status: 400 }
      );
    }

    console.log(`Parsed ${participants.length} participants from CSV`);

    // Run enhanced 30-iteration team matching algorithm
    const result = runEnhancedIterativeMatching(participants, {
      maxIterations: 30,
      minParticipantsPerIteration: 2,
      logLevel: 'detailed'
    });
    
    console.log(`Enhanced iterative matching complete: ${result.teams.length} teams formed, ${result.unmatched.length} unmatched, ${result.iterations} iterations used`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in case-match upload API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process CSV file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}