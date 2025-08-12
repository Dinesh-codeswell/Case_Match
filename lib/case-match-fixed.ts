import { v4 as uuidv4 } from 'uuid';

// Types
export interface Participant {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  collegeName: string;
  currentYear: string;
  coreStrengths: string[];
  preferredRoles: string[];
  workingStyle?: string[];
  idealTeamStructure?: string;
  lookingFor?: string;
  availability: string;
  experience: string;
  workStyle?: string;
  casePreferences: string[];
  preferredTeamSize: number;
}

export interface Team {
  id: string;
  members: Participant[];
  skillVector: number[];
  compatibilityScore: number;
  teamSize: number;
  averageExperience: number;
  commonCaseTypes: string[];
  workStyleCompatibility: string;
  preferredTeamSizeMatch: number;
}

export interface MatchingResult {
  teams: Team[];
  unmatched: Participant[];
  statistics: {
    totalParticipants: number;
    teamsFormed: number;
    averageTeamSize: number;
    matchingEfficiency: number;
    teamSizeDistribution: { [key: number]: number };
    caseTypeDistribution: { [key: string]: number };
  };
}

// FIXED CSV Parser - Prevents duplicates and ensures accurate count
export function parseCSVToParticipants(csvData: string): Participant[] {
  console.log('🔍 FIXED: Starting CSV parsing...');
  
  // Split lines and remove empty ones
  const lines = csvData.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  console.log(`📝 Total lines in CSV: ${lines.length} (including header)`);
  
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);
  
  console.log(`📊 Headers found: ${headers.length}`);
  console.log(`📋 Headers: ${headers.join(', ')}`);

  const participants: Participant[] = [];
  const processedEmails = new Set<string>();

  // Process each data line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    console.log(`🔍 Processing line ${i}: ${line.substring(0, 100)}...`);

    try {
      const values = parseCSVLine(line);
      
      if (values.length < headers.length) {
        console.warn(`⚠️ Line ${i}: Expected ${headers.length} values, got ${values.length}`);
        continue;
      }

      // Create row object
      const row: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        row[header.trim()] = (values[index] || '').trim();
      });

      // Extract required fields
      const fullName = row['Full Name'] || '';
      const email = row['Email ID'] || '';
      
      if (!fullName || !email) {
        console.warn(`⚠️ Line ${i}: Missing required fields - Name: "${fullName}", Email: "${email}"`);
        continue;
      }

      // Check for duplicates
      const emailKey = email.toLowerCase();
      if (processedEmails.has(emailKey)) {
        console.warn(`⚠️ Line ${i}: Duplicate email found: ${email}`);
        continue;
      }
      processedEmails.add(emailKey);

      // Parse team size preference
      const teamSizeStr = row['Preferred Team Size'] || row['Preferred team size'] || '4';
      const preferredTeamSize = parseInt(teamSizeStr) || 4;
      
      // Validate team size
      if (![2, 3, 4].includes(preferredTeamSize)) {
        console.warn(`⚠️ Line ${i}: Invalid team size ${preferredTeamSize}, defaulting to 4`);
      }

      const participant: Participant = {
        id: uuidv4(),
        fullName,
        email,
        whatsappNumber: row['WhatsApp Number'] || '',
        collegeName: row['College Name'] || '',
        currentYear: parseCurrentYear(row['Current Year of Study'] || ''),
        coreStrengths: parseCoreStrengths(row['Top 3 Core Strengths'] || ''),
        preferredRoles: parsePreferredRoles(row['Preferred Role(s)'] || ''),
        workingStyle: parseWorkingStyle(row['Working Style Preferences'] || ''),
        idealTeamStructure: row['Ideal Team Structure'] || 'Diverse roles and specializations',
        lookingFor: row['Looking For'] || 'Build a new team from scratch',
        availability: parseAvailability(row['Availability (next 2–4 weeks)'] || ''),
        experience: parseExperience(row['Previous Case Comp Experience'] || ''),
        workStyle: parseWorkStyle(row['Work Style'] || ''),
        casePreferences: parseCasePreferences(row['Case Comp Preferences'] || ''),
        preferredTeamSize: [2, 3, 4].includes(preferredTeamSize) ? preferredTeamSize : 4
      };

      participants.push(participant);
      console.log(`✅ Added participant ${participants.length}: ${participant.fullName} (prefers team size ${participant.preferredTeamSize})`);
      
    } catch (error) {
      console.error(`❌ Error parsing line ${i}:`, error);
    }
  }

  console.log(`🎯 FINAL: Parsed ${participants.length} unique participants`);
  
  // Debug: Show team size distribution
  const sizeDistribution = participants.reduce((acc, p) => {
    acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log('📊 Team size preferences distribution:', sizeDistribution);
  
  return participants;
}

// FIXED: Enhanced Team Matching with ABSOLUTE strict team size preference adherence
export function matchParticipantsToTeams(participants: Participant[]): MatchingResult {
  console.log(`\n🚀 FIXED: Starting STRICT team matching for ${participants.length} participants`);
  
  if (participants.length < 2) {
    return {
      teams: [],
      unmatched: participants,
      statistics: generateStatistics([], participants)
    };
  }

  // Log initial team size preferences
  const initialSizePrefs = participants.reduce((acc, p) => {
    acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  console.log('🎯 Initial team size preferences:', initialSizePrefs);

  // Separate by education level (NEVER violated)
  const ugParticipants = participants.filter(p => 
    !p.currentYear.includes('PG') && !p.currentYear.includes('MBA')
  );
  const pgParticipants = participants.filter(p => 
    p.currentYear.includes('PG') || p.currentYear.includes('MBA')
  );

  console.log(`📚 Education separation: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);

  // Run STRICT iterative matching for each education level
  const ugResult = runStrictIterativeMatching(ugParticipants, 'UG');
  const pgResult = runStrictIterativeMatching(pgParticipants, 'PG');
  
  const allTeams = [...ugResult.teams, ...pgResult.teams];
  const unmatched = [...ugResult.unmatched, ...pgResult.unmatched];

  // Validate that ALL teams respect size preferences
  const invalidTeams = allTeams.filter(team => {
    const sizeMatches = team.members.filter(m => m.preferredTeamSize === team.teamSize).length;
    return sizeMatches !== team.members.length; // All members must prefer this size
  });

  if (invalidTeams.length > 0) {
    console.error('🚨 CRITICAL ERROR: Found teams that violate size preferences!');
    invalidTeams.forEach(team => {
      console.error(`❌ Team ${team.id}: ${team.members.length} members, preferences: ${team.members.map(m => m.preferredTeamSize).join(',')}`);
    });
  }

  const result: MatchingResult = {
    teams: allTeams,
    unmatched,
    statistics: generateStatistics(allTeams, unmatched)
  };

  console.log(`\n🎉 FINAL RESULTS:`);
  console.log(`✅ Teams formed: ${allTeams.length}`);
  console.log(`❌ Unmatched: ${unmatched.length}`);
  console.log(`📊 Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
  
  return result;
}

// STRICT Iterative Matching - 10 iterations with ABSOLUTE team size preference adherence
function runStrictIterativeMatching(participants: Participant[], educationLevel: string): { teams: Team[], unmatched: Participant[] } {
  if (participants.length === 0) {
    return { teams: [], unmatched: [] };
  }

  console.log(`\n🔄 Starting STRICT iterative matching for ${educationLevel}`);
  console.log(`👥 Participants: ${participants.length}`);

  let allTeams: Team[] = [];
  let remainingParticipants = [...participants];
  const maxIterations = 10;

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    console.log(`\n🔄 Iteration ${iteration}/${maxIterations} (${educationLevel})`);
    console.log(`👥 Processing ${remainingParticipants.length} unmatched participants`);

    if (remainingParticipants.length < 2) {
      console.log(`⏹️ Stopping: Less than 2 participants remaining`);
      break;
    }

    // Show current team size preferences
    const currentSizePrefs = remainingParticipants.reduce((acc, p) => {
      acc[p.preferredTeamSize] = (acc[p.preferredTeamSize] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    console.log(`📊 Current size preferences:`, currentSizePrefs);

    // Form teams with ABSOLUTE strict preferences
    const iterationTeams = formAbsoluteStrictTeams(remainingParticipants, iteration);
    
    if (iterationTeams.length === 0) {
      console.log(`❌ No teams formed in iteration ${iteration}`);
      continue;
    }

    // Validate all teams formed in this iteration
    const invalidIterationTeams = iterationTeams.filter(team => {
      const allMembersMatch = team.members.every(m => m.preferredTeamSize === team.teamSize);
      return !allMembersMatch;
    });

    if (invalidIterationTeams.length > 0) {
      console.error(`🚨 CRITICAL: Invalid teams formed in iteration ${iteration}!`);
      continue; // Skip this iteration
    }

    // Add valid teams
    allTeams = [...allTeams, ...iterationTeams];
    
    // Remove matched participants
    const matchedIds = new Set(iterationTeams.flatMap(team => team.members.map(m => m.id)));
    remainingParticipants = remainingParticipants.filter(p => !matchedIds.has(p.id));

    const newlyMatched = iterationTeams.reduce((sum, team) => sum + team.members.length, 0);
    console.log(`✅ Iteration ${iteration} results:`);
    console.log(`   🎯 Teams formed: ${iterationTeams.length}`);
    console.log(`   👥 Participants matched: ${newlyMatched}`);
    console.log(`   ⏳ Remaining: ${remainingParticipants.length}`);

    if (remainingParticipants.length === 0) {
      console.log(`🎉 All participants matched after ${iteration} iterations!`);
      break;
    }
  }

  return { teams: allTeams, unmatched: remainingParticipants };
}

// Form teams with ABSOLUTE strict team size preference adherence
function formAbsoluteStrictTeams(participants: Participant[], iteration: number): Team[] {
  const teams: Team[] = [];
  
  // Group by preferred team size
  const sizeGroups = {
    4: participants.filter(p => p.preferredTeamSize === 4),
    3: participants.filter(p => p.preferredTeamSize === 3),
    2: participants.filter(p => p.preferredTeamSize === 2)
  };

  console.log(`   📊 Size groups: 4-member(${sizeGroups[4].length}), 3-member(${sizeGroups[3].length}), 2-member(${sizeGroups[2].length})`);

  // Process each size group - ONLY form teams if we have exact multiples
  for (const [sizeStr, candidates] of Object.entries(sizeGroups)) {
    const targetSize = parseInt(sizeStr);
    const possibleTeams = Math.floor(candidates.length / targetSize);
    
    console.log(`   🔨 Size ${targetSize}: ${candidates.length} candidates → can form ${possibleTeams} teams`);
    
    if (possibleTeams === 0) continue;

    // Sort candidates by experience for better team formation
    candidates.sort((a, b) => getExperienceScore(b.experience) - getExperienceScore(a.experience));

    // Form exact number of teams possible
    for (let teamIndex = 0; teamIndex < possibleTeams; teamIndex++) {
      const startIndex = teamIndex * targetSize;
      const teamMembers = candidates.slice(startIndex, startIndex + targetSize);
      
      // VALIDATION: Ensure all members prefer this team size
      const allPreferCorrectSize = teamMembers.every(m => m.preferredTeamSize === targetSize);
      
      if (!allPreferCorrectSize) {
        console.error(`🚨 CRITICAL ERROR: Team members don't all prefer size ${targetSize}`);
        continue;
      }

      const team = createValidatedTeam(teamMembers, `${iteration}-${targetSize}-${teamIndex + 1}`);
      teams.push(team);
      
      console.log(`   ✅ Created team ${teamIndex + 1} of size ${targetSize}: ${teamMembers.map(m => m.fullName).join(', ')}`);
    }
  }

  return teams;
}

// Create validated team object
function createValidatedTeam(members: Participant[], teamId: string): Team {
  // VALIDATION: All members must prefer the same team size
  const teamSize = members.length;
  const allPreferSameSize = members.every(m => m.preferredTeamSize === teamSize);
  
  if (!allPreferSameSize) {
    console.error('🚨 VALIDATION FAILED: Not all members prefer the same team size!');
    console.error('Members and preferences:', members.map(m => `${m.fullName}: ${m.preferredTeamSize}`));
  }

  // Calculate compatibility
  let totalCompatibility = 0;
  let comparisons = 0;
  
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalCompatibility += calculateBasicCompatibility(members[i], members[j]);
      comparisons++;
    }
  }
  
  const compatibilityScore = comparisons > 0 ? totalCompatibility / comparisons : 100;

  // Find common case types
  const allCaseTypes = members.flatMap(m => m.casePreferences);
  const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonCaseTypes = Object.entries(caseTypeCounts)
    .filter(([_, count]) => count >= 2)
    .map(([type, _]) => type);

  // Calculate average experience
  const experienceValues = { 
    'None': 0, 
    'Participated in 1–2': 1, 
    'Participated in 3+': 2, 
    'Finalist/Winner in at least one': 3 
  };
  const avgExperience = members.reduce((sum, m) => sum + (experienceValues[m.experience] || 0), 0) / members.length;

  // Team size preference match should be 100% for strict matching
  const preferredTeamSizeMatch = allPreferSameSize ? 100 : 0;

  const team: Team = {
    id: `team-${teamId}`,
    members,
    skillVector: [],
    compatibilityScore: Math.min(100, Math.max(0, compatibilityScore)),
    teamSize,
    averageExperience: avgExperience,
    commonCaseTypes,
    workStyleCompatibility: 'Strict size preference match',
    preferredTeamSizeMatch
  };

  console.log(`   📋 Team validation: Size ${teamSize}, All prefer same size: ${allPreferSameSize}, Match: ${preferredTeamSizeMatch}%`);
  
  return team;
}

// Basic compatibility calculation
function calculateBasicCompatibility(p1: Participant, p2: Participant): number {
  let score = 50; // Base score

  // Experience diversity
  if (p1.experience !== p2.experience) score += 20;
  
  // Case type overlap
  const commonCases = p1.casePreferences.filter(c => p2.casePreferences.includes(c));
  score += commonCases.length * 10;
  
  // Skill diversity
  const commonSkills = p1.coreStrengths.filter(s => p2.coreStrengths.includes(s));
  score += (p1.coreStrengths.length + p2.coreStrengths.length - commonSkills.length) * 5;

  return Math.min(100, score);
}

// Helper functions
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseCurrentYear(value: string): string {
  if (!value) return 'First Year';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('pg') || normalized.includes('mba')) {
    return normalized.includes('1st') || normalized.includes('1') ? 'PG/MBA (1st Year)' : 'PG/MBA (2nd Year)';
  }
  
  if (normalized.includes('1st') || normalized.includes('first')) return 'First Year';
  if (normalized.includes('2nd') || normalized.includes('second')) return 'Second Year';
  if (normalized.includes('3rd') || normalized.includes('third')) return 'Third Year';
  if (normalized.includes('4th') || normalized.includes('final')) return 'Final Year';
  
  return 'First Year';
}

function parseCoreStrengths(value: string): string[] {
  if (!value) return [];
  return value.split(/[;,\n]/).map(s => s.trim()).filter(s => s).slice(0, 3);
}

function parsePreferredRoles(value: string): string[] {
  if (!value) return ['Flexible with any role'];
  const roles = value.split(/[;,\n]/).map(s => s.trim()).filter(s => s);
  return roles.length > 0 ? roles.slice(0, 2) : ['Flexible with any role'];
}

function parseWorkingStyle(value: string): string[] {
  if (!value) return ['I enjoy brainstorming and team sessions'];
  return value.split(/[;,\n]/).map(s => s.trim()).filter(s => s);
}

function parseAvailability(value: string): string {
  if (!value) return 'Moderately Available (5–10 hrs/week)';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('fully') || normalized.includes('10–15')) return 'Fully Available (10–15 hrs/week)';
  if (normalized.includes('moderately') || normalized.includes('5–10')) return 'Moderately Available (5–10 hrs/week)';
  if (normalized.includes('lightly') || normalized.includes('1–4')) return 'Lightly Available (1–4 hrs/week)';
  if (normalized.includes('not available')) return 'Not available now, but interested later';
  
  return 'Moderately Available (5–10 hrs/week)';
}

function parseExperience(value: string): string {
  if (!value) return 'None';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('finalist') || normalized.includes('winner')) return 'Finalist/Winner in at least one';
  if (normalized.includes('3+')) return 'Participated in 3+';
  if (normalized.includes('1–2') || normalized.includes('1-2')) return 'Participated in 1–2';
  
  return 'None';
}

function parseWorkStyle(value: string): string {
  if (!value) return 'Combination of both';
  const normalized = value.toLowerCase().trim();
  
  if (normalized.includes('structured') && !normalized.includes('flexible')) return 'Structured meetings and deadlines';
  if (normalized.includes('flexible') && !normalized.includes('structured')) return 'Flexible work with async updates';
  
  return 'Combination of both';
}

function parseCasePreferences(value: string): string[] {
  if (!value) return ['Consulting'];
  return value.split(/[;,\n]/).map(s => s.trim()).filter(s => s).slice(0, 3);
}

function parsePreferredTeamSize(value: string): number {
  if (!value) return 4;
  const normalized = value.toLowerCase().trim();
  
  if (normalized === '2' || normalized.includes('two')) return 2;
  if (normalized === '3' || normalized.includes('three')) return 3;
  if (normalized === '4' || normalized.includes('four')) return 4;
  
  const parsed = parseInt(value);
  return [2, 3, 4].includes(parsed) ? parsed : 4;
}

function getExperienceScore(experience: string): number {
  const values = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
  return values[experience] || 0;
}

function generateStatistics(teams: Team[], unmatched: Participant[]): MatchingResult['statistics'] {
  const totalParticipants = teams.reduce((sum, team) => sum + team.members.length, 0) + unmatched.length;
  const teamsFormed = teams.length;
  const averageTeamSize = teams.length > 0 ? teams.reduce((sum, team) => sum + team.teamSize, 0) / teams.length : 0;
  const matchingEfficiency = totalParticipants > 0 ? ((totalParticipants - unmatched.length) / totalParticipants) * 100 : 0;

  const teamSizeDistribution = teams.reduce((acc, team) => {
    acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const caseTypeDistribution = teams.reduce((acc, team) => {
    team.commonCaseTypes.forEach(caseType => {
      acc[caseType] = (acc[caseType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalParticipants,
    teamsFormed,
    averageTeamSize,
    matchingEfficiency,
    teamSizeDistribution,
    caseTypeDistribution
  };
}