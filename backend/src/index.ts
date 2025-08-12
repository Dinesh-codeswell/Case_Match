import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { processTeamMatching, TeamMatchingOptions, TeamMatchingResponse } from './teamMatchingService';
import { parseCSVToParticipants } from './csv-parser';
import { matchParticipantsToTeams } from './matchmaking';
import { MatchingResult } from './types';

// Express setup
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept CSV files
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Enhanced CSV upload endpoint with comprehensive team matching
app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
  console.log('Received upload request');
  
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded.',
      details: 'Please upload a CSV file containing participant data.'
    });
  }

  console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes`);

  try {
    // Parse query parameters for configuration
    const strictEducationSeparation = req.query.strictEducationSeparation !== 'false';
    const strictTeamSizeMatching = req.query.strictTeamSizeMatching !== 'false';
    const strictAvailabilityMatching = req.query.strictAvailabilityMatching !== 'false';
    const useIterativeMatching = req.query.useIterativeMatching !== 'false'; // Default to true
    const maxIterations = req.query.maxIterations ? parseInt(req.query.maxIterations as string) : undefined;
    const minParticipantsPerIteration = req.query.minParticipantsPerIteration ? parseInt(req.query.minParticipantsPerIteration as string) : 2;
    const logLevel = (req.query.logLevel as 'minimal' | 'detailed' | 'verbose') || 'detailed';

    // Process CSV data
    const csvData = req.file.buffer.toString();
    console.log('CSV data preview:', csvData.substring(0, 200) + '...');
    
    // Use the enhanced team matching process
    const matchingOptions: TeamMatchingOptions = {
      csvData,
      strictEducationSeparation,
      strictTeamSizeMatching,
      strictAvailabilityMatching,
      useIterativeMatching,
      maxIterations,
      minParticipantsPerIteration,
      logLevel
    };

    console.log('Processing with options:', {
      strictEducationSeparation,
      strictTeamSizeMatching,
      strictAvailabilityMatching,
      useIterativeMatching,
      maxIterations: maxIterations || 'auto (total participants)',
      minParticipantsPerIteration,
      logLevel
    });

    const response: TeamMatchingResponse = await processTeamMatching(matchingOptions);

    if (!response.success) {
      console.error('Team matching failed:', response.error);
      return res.status(400).json({ 
        error: response.error || 'Team matching failed',
        details: response.details
      });
    }

    if (!response.result) {
      console.error('No result returned from team matching');
      return res.status(500).json({ 
        error: 'No result returned from team matching process'
      });
    }

    console.log('Team matching completed successfully');
    console.log(`- Teams formed: ${response.result.teams.length}`);
    console.log(`- Total participants: ${response.parseStats?.totalParsed || 0}`);
    console.log(`- Matching efficiency: ${response.result.statistics.matchingEfficiency.toFixed(2)}%`);

    // Log warnings if any
    if (response.warnings && response.warnings.length > 0) {
      console.warn('Warnings generated during processing:');
      response.warnings.forEach((warning, index) => {
        console.warn(`  ${index + 1}. ${warning}`);
      });
    }

    // Return the result in the format expected by the frontend
    res.json(response.result);
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process CSV file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Legacy endpoint for backward compatibility (simplified processing)
app.post('/upload-csv-simple', upload.single('csvFile'), async (req, res) => {
  console.log('Received simple upload request (legacy endpoint)');
  
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes`);

  try {
    // Process CSV data using direct functions (legacy behavior)
    const csvData = req.file.buffer.toString();
    console.log('Received CSV data:', csvData.substring(0, 200) + '...');
    
    const participants = await parseCSVToParticipants(csvData);
    
    console.log(`Parsed ${participants.length} participants from CSV`);
    
    // Log team size distribution
    const teamSizeDistribution = participants.reduce((acc, p) => {
      acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    console.log('Team size preferences:', teamSizeDistribution);
    
    if (participants.length === 0) {
      return res.status(400).json({ error: 'No valid participants found in CSV.' });
    }

    // Run matchmaking algorithm
    console.log('Starting matchmaking algorithm...');
    const result: MatchingResult = matchParticipantsToTeams(participants);
    console.log(`Matchmaking complete: ${result.teams.length} teams formed, ${result.unmatched.length} unmatched`);

    // Log final team distribution
    const finalTeamSizeDistribution = result.teams.reduce((acc, team) => {
      acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    console.log('Final team distribution:', finalTeamSizeDistribution);

    // Send result
    res.json(result);
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ 
      error: 'Failed to process CSV file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get parsing statistics endpoint
app.post('/analyze-csv', upload.single('csvFile'), async (req, res) => {
  console.log('Received CSV analysis request');
  
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded for analysis.'
    });
  }

  try {
    const csvData = req.file.buffer.toString();
    const participants = await parseCSVToParticipants(csvData);
    
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

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing CSV:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze CSV file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get API documentation
app.get('/api-docs', (req, res) => {
  const docs = {
    endpoints: [
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint'
      },
      {
        path: '/upload-csv',
        method: 'POST',
        description: 'Upload CSV and perform enhanced team matching',
        parameters: {
          file: 'CSV file (form-data)',
          strictEducationSeparation: 'boolean (query, default: true)',
          strictTeamSizeMatching: 'boolean (query, default: true)',
          strictAvailabilityMatching: 'boolean (query, default: true)',
          useIterativeMatching: 'boolean (query, default: true)',
          maxIterations: 'number (query, default: total participants)',
          minParticipantsPerIteration: 'number (query, default: 2)',
          logLevel: 'string (query, options: minimal|detailed|verbose, default: detailed)'
        },
        response: 'TeamMatchingResponse with comprehensive results and warnings'
      },
      {
        path: '/upload-csv-simple',
        method: 'POST',
        description: 'Legacy endpoint for simple team matching',
        parameters: {
          file: 'CSV file (form-data)'
        },
        response: 'MatchingResult object'
      },
      {
        path: '/analyze-csv',
        method: 'POST',
        description: 'Analyze CSV file and return statistics without performing matching',
        parameters: {
          file: 'CSV file (form-data)'
        },
        response: 'Analysis object with participant statistics and potential issues'
      }
    ],
    configuration: {
      maxFileSize: '10MB',
      allowedFileTypes: ['text/csv', '.csv'],
      defaultTeamSize: 3,
      supportedTeamSizes: [2, 3, 4]
    }
  };
  
  res.json(docs);
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        details: 'Maximum file size is 10MB'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message || 'Unknown error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: ['/health', '/upload-csv', '/upload-csv-simple', '/analyze-csv', '/api-docs']
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  - GET  /health (Health check)');
  console.log('  - POST /upload-csv (Enhanced team matching)');
  console.log('  - POST /upload-csv-simple (Legacy team matching)');
  console.log('  - POST /analyze-csv (CSV analysis only)');
  console.log('  - GET  /api-docs (API documentation)');
});
