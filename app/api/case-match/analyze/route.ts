import { NextRequest, NextResponse } from 'next/server';
import { parseCSVToParticipants } from '@/lib/case-match';

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

    console.log('Analyzing CSV file:', file.name, 'Size:', file.size, 'bytes');

    // Parse CSV to participants
    const participants = parseCSVToParticipants(csvContent);
    
    console.log(`Parsed ${participants.length} participants from CSV`);

    // Generate comprehensive statistics
    const ugParticipants = participants.filter(p => 
      !p.currentYear.includes('PG') && !p.currentYear.includes('MBA')
    );
    const pgParticipants = participants.filter(p => 
      p.currentYear.includes('PG') || p.currentYear.includes('MBA')
    );
    
    const teamSizeDistribution = participants.reduce((acc, p) => {
      acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const experienceDistribution = participants.reduce((acc, p) => {
      acc[p.experience] = (acc[p.experience] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const availabilityDistribution = participants.reduce((acc, p) => {
      acc[p.availability] = (acc[p.availability] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const casePreferenceDistribution = participants.reduce((acc, p) => {
      p.casePreferences.forEach(caseType => {
        acc[caseType] = (acc[caseType] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const analysis = {
      success: true,
      totalParticipants: participants.length,
      educationDistribution: {
        ug: ugParticipants.length,
        pg: pgParticipants.length
      },
      teamSizeDistribution,
      experienceDistribution,
      availabilityDistribution,
      casePreferenceDistribution,
      potentialMatchingIssues: []
    };

    // Add potential matching issue warnings
    const issues: string[] = [];
    
    if (teamSizeDistribution[2] && teamSizeDistribution[2] % 2 !== 0) {
      issues.push(`${teamSizeDistribution[2]} participants prefer team size 2 (${teamSizeDistribution[2] % 2} may be unmatched)`);
    }
    if (teamSizeDistribution[3] && teamSizeDistribution[3] % 3 !== 0) {
      issues.push(`${teamSizeDistribution[3]} participants prefer team size 3 (${teamSizeDistribution[3] % 3} may be unmatched)`);
    }
    if (teamSizeDistribution[4] && teamSizeDistribution[4] % 4 !== 0) {
      issues.push(`${teamSizeDistribution[4]} participants prefer team size 4 (${teamSizeDistribution[4] % 4} may be unmatched)`);
    }

    if (ugParticipants.length === 0) {
      issues.push('No UG participants found');
    }
    if (pgParticipants.length === 0) {
      issues.push('No PG participants found');
    }

    analysis.potentialMatchingIssues = issues;

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in case-match analyze API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze CSV file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}