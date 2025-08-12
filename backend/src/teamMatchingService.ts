import { parseCSVToParticipants } from './csv-parser';
import { matchParticipantsToTeams } from './matchmaking';
import { MatchingResult, Participant } from './types';

// Import iterative matching with proper error handling
import { 
  runIterativeMatching, 
  getIterativeMatchingStats, 
  IterativeMatchingResult,
  IterativeMatchingStats,
  IterativeMatchingOptions 
} from './iterativeMatchmaking';

// Helper function for availability level checking
function getAvailabilityLevel(participant: Participant): 'High' | 'Medium' | 'Low' {
  switch (participant.availability) {
    case 'Fully Available (10–15 hrs/week)': return 'High';
    case 'Moderately Available (5–10 hrs/week)': return 'Medium';
    case 'Lightly Available (1–4 hrs/week)': return 'Low';
    case 'Not available now, but interested later': return 'Low';
    default: return 'Medium';
  }
}

export interface TeamMatchingOptions {
  csvData: string;
  strictEducationSeparation?: boolean;
  strictTeamSizeMatching?: boolean;
  strictAvailabilityMatching?: boolean;
  useIterativeMatching?: boolean;
  maxIterations?: number;
  minParticipantsPerIteration?: number;
  logLevel?: 'minimal' | 'detailed' | 'verbose';
}

export interface ParseStats {
  totalRows: number;
  totalParsed: number;
  skippedRows: number;
  errors: string[];
}

export interface TeamMatchingResponse {
  success: boolean;
  result?: MatchingResult | IterativeMatchingResult;
  parseStats?: ParseStats;
  warnings?: string[];
  error?: string;
  details?: string;
  iterativeStats?: IterativeMatchingStats;
}

export async function processTeamMatching(options: TeamMatchingOptions): Promise<TeamMatchingResponse> {
  const { 
    csvData, 
    strictEducationSeparation = true, 
    strictTeamSizeMatching = true, 
    strictAvailabilityMatching = true,
    useIterativeMatching = true,
    maxIterations,
    minParticipantsPerIteration = 2,
    logLevel = 'detailed' 
  } = options;
  
  try {
    if (logLevel !== 'minimal') {
      console.log('Starting enhanced team matching process...');
      console.log(`Options: strictEducationSeparation=${strictEducationSeparation}, strictTeamSizeMatching=${strictTeamSizeMatching}, strictAvailabilityMatching=${strictAvailabilityMatching}, useIterativeMatching=${useIterativeMatching}`);
    }

    // Parse CSV data
    const participants = await parseCSVToParticipants(csvData);
    
    if (participants.length === 0) {
      return {
        success: false,
        error: 'No valid participants found in CSV',
        details: 'Please check that your CSV file has the correct format and contains valid participant data.'
      };
    }

    const parseStats: ParseStats = {
      totalRows: csvData.split('\n').length - 1, // Subtract header row
      totalParsed: participants.length,
      skippedRows: 0,
      errors: []
    };
    parseStats.skippedRows = parseStats.totalRows - parseStats.totalParsed;

    if (logLevel !== 'minimal') {
      console.log(`Parsed ${participants.length} participants from ${parseStats.totalRows} rows`);
    }

    // Validate data quality
    const warnings: string[] = [];
    
    // Check for missing critical data
    const missingNames = participants.filter(p => !p.fullName.trim()).length;
    const missingEmails = participants.filter(p => !p.email.trim()).length;
    const missingColleges = participants.filter(p => !p.collegeName.trim()).length;
    
    if (missingNames > 0) warnings.push(`${missingNames} participants have missing names`);
    if (missingEmails > 0) warnings.push(`${missingEmails} participants have missing emails`);
    if (missingColleges > 0) warnings.push(`${missingColleges} participants have missing college names`);

    // Check education level distribution
    const ugParticipants = participants.filter(p => 
      !p.currentYear.includes('PG') && !p.currentYear.includes('MBA')
    );
    const pgParticipants = participants.filter(p => 
      p.currentYear.includes('PG') || p.currentYear.includes('MBA')
    );

    if (ugParticipants.length === 0) {
      warnings.push('No undergraduate participants found');
    }
    if (pgParticipants.length === 0) {
      warnings.push('No postgraduate participants found');
    }

    if (logLevel === 'verbose') {
      console.log(`Education distribution: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);
    }

    // Check team size preferences
    const teamSizeDistribution = participants.reduce((acc, p) => {
      acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    if (logLevel !== 'minimal') {
      console.log('Team size preferences:', teamSizeDistribution);
    }

    // Check for potential matching issues with strict constraints
    if (strictTeamSizeMatching) {
      warnings.push('STRICT TEAM SIZE MATCHING: Students will only be matched with their preferred team size');
      Object.entries(teamSizeDistribution).forEach(([size, count]) => {
        const sizeNum = parseInt(size);
        if (count % sizeNum !== 0) {
          warnings.push(`${count} participants prefer team size ${size} - ${count % sizeNum} will be unmatched due to strict size matching`);
        }
      });
    }

    if (strictAvailabilityMatching) {
      warnings.push('STRICT AVAILABILITY MATCHING: Only compatible availability levels will be matched (High↔High/Medium, Medium↔High/Medium/Low, Low↔Medium/Low)');
      
      // Check availability distribution
      const availabilityDistribution = participants.reduce((acc, p) => {
        const level = getAvailabilityLevel(p);
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      if (logLevel !== 'minimal') {
        console.log('Availability distribution:', availabilityDistribution);
      }
    }

    // Run matchmaking algorithm
    if (logLevel !== 'minimal') {
      console.log(`Starting ${useIterativeMatching ? 'iterative' : 'single-pass'} matchmaking algorithm...`);
    }
    
    let result: MatchingResult | IterativeMatchingResult;
    let iterativeStats: IterativeMatchingStats | undefined;
    
    if (useIterativeMatching) {
      try {
        if (logLevel !== 'minimal') {
          console.log('Starting iterative matchmaking...');
        }
        
        const iterativeOptions: IterativeMatchingOptions = {
          maxIterations: maxIterations || Math.max(10, participants.length), // Ensure minimum 10 iterations
          minParticipantsPerIteration,
          logLevel
        };
        
        const iterativeResult = runIterativeMatching(participants, iterativeOptions);
        result = iterativeResult;
        iterativeStats = getIterativeMatchingStats(iterativeResult);
        
        if (logLevel !== 'minimal') {
          console.log(`Iterative matchmaking complete: ${iterativeResult.teams.length} teams formed over ${iterativeResult.iterations} iterations, ${iterativeResult.unmatched.length} unmatched`);
          console.log(`Final efficiency: ${iterativeResult.statistics.matchingEfficiency.toFixed(1)}%`);
        }
      } catch (error) {
        console.error('Error in iterative matching, falling back to single-pass:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        
        // Fallback to single-pass matching
        result = matchParticipantsToTeams(participants);
        
        if (logLevel !== 'minimal') {
          console.log(`Fallback single-pass matchmaking complete: ${result.teams.length} teams formed, ${result.unmatched.length} unmatched`);
        }
      }
    } else {
      result = matchParticipantsToTeams(participants);
      
      if (logLevel !== 'minimal') {
        console.log(`Single-pass matchmaking complete: ${result.teams.length} teams formed, ${result.unmatched.length} unmatched`);
      }
    }

    // Add additional statistics
    const enhancedResult: MatchingResult = {
      ...result,
      statistics: {
        ...result.statistics,
        teamSizeDistribution: result.teams.reduce((acc, team) => {
          acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
          return acc;
        }, {} as Record<number, number>),
        caseTypeDistribution: result.teams.reduce((acc, team) => {
          team.commonCaseTypes.forEach(caseType => {
            acc[caseType] = (acc[caseType] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>)
      }
    };

    // Final validation warnings
    if (result.unmatched.length > 0) {
      warnings.push(`${result.unmatched.length} participants could not be matched to teams`);
    }

    if (result.statistics.matchingEfficiency < 80) {
      warnings.push(`Low matching efficiency (${result.statistics.matchingEfficiency.toFixed(1)}%) - consider adjusting team size preferences`);
    }

    return {
      success: true,
      result: enhancedResult,
      parseStats,
      warnings: warnings.length > 0 ? warnings : undefined,
      iterativeStats
    };

  } catch (error) {
    console.error('Error in team matching process:', error);
    return {
      success: false,
      error: 'Failed to process team matching',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}