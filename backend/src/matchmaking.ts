import { v4 as uuidv4 } from 'uuid';
import { Participant, Team, MatchingResult, MatchingConfig, CoreStrength, CaseType, PreferredRole } from './types';

// Configuration for team matching
const config: MatchingConfig = {
  preferredTeamSize: 4,
  minTeamSize: 2,
  maxTeamSize: 4,
  weights: {
    skillCompatibility: 0.20,
    experienceBalance: 0.15,
    availabilityMatch: 0.15,
    workStyleMatch: 0.10,
    caseTypeMatch: 0.25,
    educationLevelMatch: 0.10,
    teamSizePreference: 0.05,
  },
};

// Required roles for balanced teams (Skill Complementarity)
const requiredRoles = {
  strategist: ['Strategy & Structuring', 'Innovation & Ideation'],
  analyst: ['Data Analysis & Research', 'Financial Modeling', 'Market Research'],
  communicator: ['Public Speaking & Pitching', 'Storytelling', 'Presentation Design (PPT/Canva)'],
  designer: ['UI/UX or Product Thinking', 'Storytelling', 'Presentation Design (PPT/Canva)']
};

// Role mapping for conflict prevention (Preferred Role Matching)
const roleMapping = {
  'Team Lead': 'lead',
  'Researcher': 'researcher',
  'Data Analyst': 'analyst',
  'Designer': 'designer',
  'Presenter': 'presenter',
  'Coordinator': 'coordinator',
  'Flexible with any role': 'flexible'
};

/**
 * Anti-Bias Team Matching Algorithm
 * 
 * This algorithm is designed to eliminate bias and ensure fair team selection:
 * 1. Education Level Matching (UG with UG, PG with PG)
 * 2. Preferred Team Size Matching (respect individual preferences)
 * 3. Case Type Diversity (ensure teams have diverse case interests)
 * 4. Role Conflict Prevention (balanced role distribution)
 * 5. Skill Complementarity (ensure each team has required roles)
 * 6. Experience Level Balancing (diverse experience levels)
 * 7. Availability Matching (similar availability levels)
 */
export function matchParticipantsToTeams(participants: Participant[], relaxedMode: boolean = false): MatchingResult {
  console.log(`Starting anti-bias matchmaking for ${participants.length} participants`);
  
  // Step 1: Education Level Matching (UG matched with UG, PG matched with PG)
  const ugParticipants = participants.filter(p => 
    !p.currentYear.includes('PG') && !p.currentYear.includes('MBA')
  );
  const pgParticipants = participants.filter(p => 
    p.currentYear.includes('PG') || p.currentYear.includes('MBA')
  );

  console.log(`Education level separation: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);

  // Step 2: Form teams within each education level with anti-bias approach
  const ugTeams = formTeamsAntiBias(ugParticipants, relaxedMode);
  const pgTeams = formTeamsAntiBias(pgParticipants, relaxedMode);
  
  const allTeams = [...ugTeams.teams, ...pgTeams.teams];
  const unmatched = [...ugTeams.unmatched, ...pgTeams.unmatched];

  // Calculate enhanced statistics
  const teamSizeDistribution = calculateTeamSizeDistribution(allTeams);
  const caseTypeDistribution = calculateCaseTypeDistribution(allTeams);
  
  const statistics = {
    totalParticipants: participants.length,
    teamsFormed: allTeams.length,
    averageTeamSize: allTeams.length > 0 ? 
      allTeams.reduce((acc, team) => acc + team.teamSize, 0) / allTeams.length : 0,
    matchingEfficiency: participants.length > 0 ? 
      ((participants.length - unmatched.length) / participants.length) * 100 : 0,
    teamSizeDistribution,
    caseTypeDistribution
  };

  console.log(`Anti-bias matching complete: ${allTeams.length} teams formed, ${unmatched.length} unmatched`);
  console.log(`Team size distribution:`, teamSizeDistribution);
  console.log(`Case type distribution:`, caseTypeDistribution);
  
  return { teams: allTeams, unmatched, statistics };
}

function formTeamsAntiBias(participants: Participant[], relaxedMode: boolean = false): { teams: Team[], unmatched: Participant[] } {
  if (participants.length === 0) {
    return { teams: [], unmatched: [] };
  }

  const teams: Team[] = [];
  const availableParticipants = [...participants];
  
  // Sort by experience (most experienced first) for better team formation
  availableParticipants.sort((a, b) => getExperienceScore(b.experience) - getExperienceScore(a.experience));

  console.log(`Forming anti-bias teams from ${availableParticipants.length} participants`);

  // Group participants by preferred team size
  const size2Participants = availableParticipants.filter(p => p.preferredTeamSize === 2);
  const size3Participants = availableParticipants.filter(p => p.preferredTeamSize === 3);
  const size4Participants = availableParticipants.filter(p => p.preferredTeamSize === 4);

  console.log(`Team size preferences: 2=${size2Participants.length}, 3=${size3Participants.length}, 4=${size4Participants.length}`);

  // Form teams prioritizing preferred team sizes
  const size2Teams = formTeamsBySize(size2Participants, 2, relaxedMode);
  const size3Teams = formTeamsBySize(size3Participants, 3, relaxedMode);
  const size4Teams = formTeamsBySize(size4Participants, 4, relaxedMode);

  // Combine all teams
  const allTeams = [...size2Teams.teams, ...size3Teams.teams, ...size4Teams.teams];
  let remainingParticipants = [...size2Teams.unmatched, ...size3Teams.unmatched, ...size4Teams.unmatched];

  // ALWAYS STRICT: Never form additional teams with flexible constraints
  console.log(`🔒 ABSOLUTE STRICT MODE: ${remainingParticipants.length} participants remain unmatched due to absolute constraints`);
  console.log(`🔒 NO FLEXIBILITY: Team size and team preferences are non-negotiable`);
  
  const finalTeams = allTeams;
  const unmatched = remainingParticipants;

  console.log(`Anti-bias team formation complete: ${finalTeams.length} teams, ${unmatched.length} unmatched`);
  return { teams: finalTeams, unmatched };
}

function formTeamsBySize(participants: Participant[], targetSize: number, relaxedMode: boolean = false): { teams: Team[], unmatched: Participant[] } {
  const teams: Team[] = [];
  const availableParticipants = [...participants];

  // Form teams of EXACTLY the target size - NO flexibility allowed
  while (availableParticipants.length >= targetSize) {
    const team = createTeamWithAbsoluteStrictConstraints(availableParticipants, targetSize);
      
    if (team && team.members.length === targetSize) {
      teams.push(team);
      console.log(`🔒 Formed ABSOLUTELY STRICT ${targetSize}-member team with exactly ${team.members.length} members`);
      
      // Remove team members from available participants
      team.members.forEach(member => {
        const index = availableParticipants.findIndex(p => p.id === member.id);
        if (index !== -1) {
          availableParticipants.splice(index, 1);
        }
      });
    } else {
      console.log(`🔒 Cannot form more ${targetSize}-member teams with ABSOLUTE STRICT constraints`);
      break; // Can't form more teams with current constraints
    }
  }

  return { teams, unmatched: availableParticipants };
}

function createTeamWithAbsoluteStrictConstraints(participants: Participant[], targetSize: number): Team | null {
  if (participants.length < targetSize) return null;

  // ABSOLUTE STRICT: Only consider participants who prefer this EXACT team size
  const strictParticipants = participants.filter(p => p.preferredTeamSize === targetSize);
  
  if (strictParticipants.length < targetSize) {
    console.log(`🔒 Not enough participants prefer team size ${targetSize}: ${strictParticipants.length} available, ${targetSize} needed`);
    return null;
  }

  // Start with the most experienced participant as anchor
  const anchor = strictParticipants[0];
  const team: Participant[] = [anchor];
  const remaining = strictParticipants.slice(1);

  console.log(`🔒 Starting ABSOLUTELY STRICT ${targetSize}-member team with anchor: ${anchor.fullName} (prefers size ${anchor.preferredTeamSize}, team pref: ${anchor.teamPreference})`);

  // Build team following ABSOLUTE strict constraints
  while (team.length < targetSize && remaining.length > 0) {
    const nextMember = findBestMatchAbsoluteStrict(team, remaining, targetSize);
    if (nextMember) {
      team.push(nextMember);
      console.log(`🔒 Added member: ${nextMember.fullName} (prefers size ${nextMember.preferredTeamSize}, team pref: ${nextMember.teamPreference})`);
      const index = remaining.findIndex(p => p.id === nextMember.id);
      remaining.splice(index, 1);
    } else {
      console.log(`🔒 No suitable member found for absolutely strict team of size ${team.length}`);
      break;
    }
  }

  // ABSOLUTE STRICT: Only return team if it has exactly the target size
  if (team.length !== targetSize) {
    console.log(`🔒 Absolutely strict team formation failed: got ${team.length} members, needed ${targetSize}`);
    return null;
  }

  console.log(`🔒 Created ABSOLUTELY STRICT ${targetSize}-member team with exactly ${team.length} members`);
  return createTeamObject(team);
}

function findBestMatchAbsoluteStrict(currentTeam: Participant[], candidates: Participant[], targetSize: number): Participant | null {
  console.log(`🔒 Finding ABSOLUTELY STRICT match for ${targetSize}-member team of size ${currentTeam.length} from ${candidates.length} candidates`);

  // ABSOLUTE STRICT Step 1: Team size preference - all candidates must prefer the EXACT target size
  const candidatesWithExactSize = candidates.filter(c => c.preferredTeamSize === targetSize);
  console.log(`🔒 After exact team size filtering: ${candidatesWithExactSize.length} candidates`);
  
  if (candidatesWithExactSize.length === 0) {
    console.log('🔒 No candidates with exact team size preference');
    return null;
  }

  // ABSOLUTE STRICT Step 2: Team preference compatibility - must be EXACTLY compatible
  const candidatesWithExactTeamPref = filterByAbsoluteStrictTeamPreference(currentTeam, candidatesWithExactSize);
  console.log(`🔒 After absolute team preference filtering: ${candidatesWithExactTeamPref.length} candidates`);
  
  if (candidatesWithExactTeamPref.length === 0) {
    console.log('🔒 No candidates with compatible team preferences');
    return null;
  }

  // ABSOLUTE STRICT Step 3: Availability matching - must be compatible
  const candidatesWithStrictAvailability = filterByStrictAvailabilityMatch(currentTeam, candidatesWithExactTeamPref);
  console.log(`🔒 After strict availability filtering: ${candidatesWithStrictAvailability.length} candidates`);
  
  if (candidatesWithStrictAvailability.length === 0) {
    console.log('🔒 No candidates with compatible availability');
    return null;
  }

  // Step 4: Apply other constraints (case diversity, skills, etc.)
  return findBestMatchWithAbsoluteStrictCandidates(currentTeam, candidatesWithStrictAvailability, targetSize);
}

function findBestMatchWithAbsoluteStrictCandidates(currentTeam: Participant[], candidates: Participant[], targetSize: number): Participant | null {
  // Apply case type diversity
  const candidatesWithCaseDiversity = filterByCaseTypeDiversity(currentTeam, candidates);
  console.log(`After case diversity filtering: ${candidatesWithCaseDiversity.length} candidates`);
  
  if (candidatesWithCaseDiversity.length === 0) {
    console.log('No candidates with case type diversity, trying relaxed case constraints');
    const candidatesWithRelaxedCase = filterByCaseTypeRelaxed(currentTeam, candidates);
    console.log(`After relaxed case filtering: ${candidatesWithRelaxedCase.length} candidates`);
    if (candidatesWithRelaxedCase.length === 0) {
      console.log('No candidates even with relaxed case constraints');
      return null;
    }
    return selectBestCandidateAbsoluteStrict(currentTeam, candidatesWithRelaxedCase, targetSize);
  }

  return selectBestCandidateAbsoluteStrict(currentTeam, candidatesWithCaseDiversity, targetSize);
}

/**
 * Step 1: Case Type Diversity - prioritize candidates with different case types
 * This is the key anti-bias mechanism
 */
function filterByCaseTypeDiversity(team: Participant[], candidates: Participant[]): Participant[] {
  if (team.length === 0) return candidates;

  const teamCaseTypes = team.flatMap(member => member.casePreferences);
  const uniqueTeamCaseTypes = new Set(teamCaseTypes);
  
  // If team has no case types, allow any candidate
  if (uniqueTeamCaseTypes.size === 0) {
    return candidates;
  }

  // Prioritize candidates with different case types to avoid bias
  const candidatesWithDifferentCaseTypes = candidates.filter(candidate => {
    const candidateCaseTypes = new Set(candidate.casePreferences);
    
    // Check if candidate has any case types that are NOT in the team
    const hasDifferentCaseTypes = candidate.casePreferences.some(caseType => 
      !uniqueTeamCaseTypes.has(caseType)
    );
    
    return hasDifferentCaseTypes;
  });

  // If no candidates with different case types, fall back to all candidates
  return candidatesWithDifferentCaseTypes.length > 0 ? candidatesWithDifferentCaseTypes : candidates;
}

/**
 * Relaxed case type filtering - allows candidates with similar case types if diversity fails
 */
function filterByCaseTypeRelaxed(team: Participant[], candidates: Participant[]): Participant[] {
  if (team.length === 0) return candidates;

  const teamCaseTypes = team.flatMap(member => member.casePreferences);
  const uniqueTeamCaseTypes = new Set(teamCaseTypes);
  
  // If team has no case types, allow any candidate
  if (uniqueTeamCaseTypes.size === 0) {
    return candidates;
  }

  // Allow candidates with at least one common case type or any candidate if team is small
  return candidates.filter(candidate => {
    const hasCommonCaseType = candidate.casePreferences.some(caseType => 
      uniqueTeamCaseTypes.has(caseType)
    );
    
    // Allow if there's a common case type, or if team is small (be more flexible)
    return hasCommonCaseType || team.length < 3;
  });
}

/**
 * Get availability level (High, Medium, Low)
 */
function getAvailabilityLevel(participant: Participant): 'High' | 'Medium' | 'Low' {
  switch (participant.availability) {
    case 'Fully Available (10–15 hrs/week)': return 'High';
    case 'Moderately Available (5–10 hrs/week)': return 'Medium';
    case 'Lightly Available (1–4 hrs/week)': return 'Low';
    case 'Not available now, but interested later': return 'Low';
    default: return 'Medium';
  }
}

/**
 * Check if two availability levels are compatible
 * Rules: High with High, High with Medium, Medium with Medium, Medium with Low
 */
function isAvailabilityCompatible(level1: 'High' | 'Medium' | 'Low', level2: 'High' | 'Medium' | 'Low'): boolean {
  const compatibilityMatrix = {
    'High': ['High', 'Medium'],
    'Medium': ['High', 'Medium', 'Low'],
    'Low': ['Medium', 'Low']
  };
  
  return compatibilityMatrix[level1].includes(level2);
}

/**
 * ABSOLUTE STRICT Team Preference Matching - enforces exact team composition rules
 */
function filterByAbsoluteStrictTeamPreference(team: Participant[], candidates: Participant[]): Participant[] {
  if (team.length === 0) return candidates;
  
  // Get the team preference of the current team (should be consistent)
  const teamPreferences = team.map(member => member.teamPreference);
  const uniqueTeamPrefs = [...new Set(teamPreferences)];
  
  // If team has mixed preferences, something is wrong
  if (uniqueTeamPrefs.length > 1) {
    console.log('🔒 ❌ Team has inconsistent team preferences - this should not happen');
    return [];
  }
  
  const teamPreference = uniqueTeamPrefs[0];
  console.log(`🔒 Team preference requirement: ${teamPreference}`);
  
  // Filter candidates based on EXACT team preference compatibility
  return candidates.filter(candidate => {
    const isCompatible = isAbsoluteStrictTeamPreferenceCompatible(teamPreference, candidate.teamPreference, team, candidate);
    if (!isCompatible) {
      console.log(`🔒 ❌ Rejected ${candidate.fullName}: team pref ${candidate.teamPreference} incompatible with team requirement ${teamPreference}`);
    }
    return isCompatible;
  });
}

/**
 * Check if team preferences are absolutely compatible
 */
function isAbsoluteStrictTeamPreferenceCompatible(
  teamPreference: 'Undergrads only' | 'Postgrads only' | 'Either UG or PG',
  candidatePreference: 'Undergrads only' | 'Postgrads only' | 'Either UG or PG',
  team: Participant[],
  candidate: Participant
): boolean {
  // Check education levels
  const candidateIsUG = !candidate.currentYear.includes('PG') && !candidate.currentYear.includes('MBA');
  const candidateIsPG = candidate.currentYear.includes('PG') || candidate.currentYear.includes('MBA');
  
  const teamEducationLevels = team.map(member => 
    (!member.currentYear.includes('PG') && !member.currentYear.includes('MBA')) ? 'UG' : 'PG'
  );
  const teamHasUG = teamEducationLevels.includes('UG');
  const teamHasPG = teamEducationLevels.includes('PG');
  
  // ABSOLUTE STRICT RULES:
  
  // Rule 1: If team wants "Undergrads only", candidate must be UG and want "Undergrads only" or "Either"
  if (teamPreference === 'Undergrads only') {
    return candidateIsUG && 
           (candidatePreference === 'Undergrads only' || candidatePreference === 'Either UG or PG') &&
           !teamHasPG; // Team must not have any PG members
  }
  
  // Rule 2: If team wants "Postgrads only", candidate must be PG and want "Postgrads only" or "Either"
  if (teamPreference === 'Postgrads only') {
    return candidateIsPG && 
           (candidatePreference === 'Postgrads only' || candidatePreference === 'Either UG or PG') &&
           !teamHasUG; // Team must not have any UG members
  }
  
  // Rule 3: If team wants "Either UG or PG", candidate must also want "Either UG or PG"
  if (teamPreference === 'Either UG or PG') {
    return candidatePreference === 'Either UG or PG';
  }
  
  return false;
}

/**
 * STRICT Availability Matching - enforces the exact compatibility rules
 */
function filterByStrictAvailabilityMatch(team: Participant[], candidates: Participant[]): Participant[] {
  if (team.length === 0) return candidates;
  
  const teamAvailabilityLevels = team.map(member => getAvailabilityLevel(member));
  
  return candidates.filter(candidate => {
    const candidateAvailabilityLevel = getAvailabilityLevel(candidate);
    
    // STRICT: Candidate must be compatible with ALL team members
    return teamAvailabilityLevels.every(teamLevel => 
      isAvailabilityCompatible(teamLevel, candidateAvailabilityLevel)
    );
  });
}

/**
 * Select the best candidate using absolute strict scoring
 */
function selectBestCandidateAbsoluteStrict(team: Participant[], candidates: Participant[], targetSize: number): Participant | null {
  if (candidates.length === 0) return null;

  let bestCandidate: Participant | null = null;
  let bestScore = -1;

  candidates.forEach(candidate => {
    const score = calculateAntiBiasScore(team, candidate, targetSize);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  });

  return bestCandidate;
}

/**
 * Calculate anti-bias compatibility score
 */
function calculateAntiBiasScore(team: Participant[], candidate: Participant, targetSize: number): number {
  let score = 0;

  // Experience diversity bonus (prefer different experience levels)
  const teamExperiences = team.map(p => p.experience);
  if (!teamExperiences.includes(candidate.experience)) {
    score += 25;
  }

  // Case type overlap bonus (prefer some common interests)
  const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
  const candidateCaseTypes = new Set(candidate.casePreferences);
  const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
  score += caseOverlap * 15;

  // Skill diversity bonus (prefer complementary skills)
  const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
  const candidateSkills = new Set(candidate.coreStrengths);
  const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
  const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
  score += uniqueSkills * 10;

  // Availability compatibility bonus
  const teamAvailabilities = team.map(p => p.availability);
  const availabilityMatch = teamAvailabilities.some(avail => 
    isAvailabilityCompatible(getAvailabilityLevel({ availability: avail } as Participant), 
                           getAvailabilityLevel(candidate))
  );
  if (availabilityMatch) {
    score += 20;
  }

  // Role diversity bonus
  const teamRoles = new Set(team.flatMap(p => p.preferredRoles));
  const candidateRoles = new Set(candidate.preferredRoles);
  const roleOverlap = [...teamRoles].filter(role => candidateRoles.has(role)).length;
  const uniqueRoles = candidate.preferredRoles.length - roleOverlap;
  score += uniqueRoles * 8;

  return score;
}

/**
 * Create team object from participants
 */
function createTeamObject(members: Participant[]): Team {
  const teamId = uuidv4();
  
  // Calculate team compatibility score
  let totalScore = 0;
  let comparisons = 0;
  
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalScore += calculateAntiBiasScore([members[i]], members[j], members.length);
      comparisons++;
    }
  }
  
  const compatibilityScore = comparisons > 0 ? totalScore / comparisons : 0;
  
  // Find common case types
  const allCaseTypes = members.flatMap(m => m.casePreferences);
  const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonCaseTypes = Object.entries(caseTypeCounts)
    .filter(([_, count]) => count >= 2)
    .map(([type, _]) => type as CaseType)
    .slice(0, 3);

  // Calculate average experience
  const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
  const avgExperience = members.reduce((sum, m) => sum + experienceValues[m.experience], 0) / members.length;

  // Calculate team size preference match
  const preferredSizeMatches = members.filter(m => m.preferredTeamSize === members.length).length;
  const preferredTeamSizeMatch = (preferredSizeMatches / members.length) * 100;

  return {
    id: teamId,
    members,
    skillVector: [], // Simplified for this implementation
    compatibilityScore: Math.min(100, Math.max(0, compatibilityScore)),
    teamSize: members.length,
    averageExperience: avgExperience,
    commonCaseTypes,
    workStyleCompatibility: 'Anti-bias optimized',
    preferredTeamSizeMatch
  };
}

/**
 * Get experience score for sorting
 */
function getExperienceScore(experience: Participant['experience']): number {
  const experienceValues = { 
    'None': 0, 
    'Participated in 1–2': 1, 
    'Participated in 3+': 2, 
    'Finalist/Winner in at least one': 3 
  };
  return experienceValues[experience];
}

/**
 * Calculate team size distribution
 */
function calculateTeamSizeDistribution(teams: Team[]): Record<number, number> {
  return teams.reduce((acc, team) => {
    acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}

/**
 * Calculate case type distribution
 */
function calculateCaseTypeDistribution(teams: Team[]): Record<string, number> {
  return teams.reduce((acc, team) => {
    team.commonCaseTypes.forEach(caseType => {
      acc[caseType] = (acc[caseType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Create team with relaxed constraints for better matching
 */
function createTeamWithRelaxedConstraints(participants: Participant[], targetSize: number): Team | null {
  if (participants.length < targetSize) return null;

  // RELAXED: Allow participants with different team size preferences (±1 difference)
  const relaxedParticipants = participants.filter(p => 
    Math.abs(p.preferredTeamSize - targetSize) <= 1
  );
  
  if (relaxedParticipants.length < targetSize) {
    console.log(`Not enough participants for relaxed team size ${targetSize}: ${relaxedParticipants.length} available, ${targetSize} needed`);
    return null;
  }

  // Start with the most experienced participant as anchor
  const anchor = relaxedParticipants[0];
  const team: Participant[] = [anchor];
  const remaining = relaxedParticipants.slice(1);

  console.log(`Starting RELAXED ${targetSize}-member team with anchor: ${anchor.fullName} (prefers size ${anchor.preferredTeamSize})`);

  // Build team with relaxed constraints
  while (team.length < targetSize && remaining.length > 0) {
    const nextMember = findBestMatchRelaxed(team, remaining, targetSize);
    if (nextMember) {
      team.push(nextMember);
      console.log(`Added member: ${nextMember.fullName} (prefers size ${nextMember.preferredTeamSize})`);
      const index = remaining.findIndex(p => p.id === nextMember.id);
      remaining.splice(index, 1);
    } else {
      console.log(`No suitable member found for relaxed team of size ${team.length}`);
      break;
    }
  }

  // Return team if it has exactly the target size
  if (team.length !== targetSize) {
    console.log(`Relaxed team formation failed: got ${team.length} members, needed ${targetSize}`);
    return null;
  }

  console.log(`Created RELAXED ${targetSize}-member team with exactly ${team.length} members`);
  return createTeamObject(team);
}

/**
 * Find best match with relaxed constraints
 */
function findBestMatchRelaxed(currentTeam: Participant[], candidates: Participant[], targetSize: number): Participant | null {
  console.log(`Finding RELAXED match for ${targetSize}-member team of size ${currentTeam.length} from ${candidates.length} candidates`);

  // RELAXED Step 1: Team size preference - allow ±1 difference
  const candidatesWithFlexibleSize = candidates.filter(c => 
    Math.abs(c.preferredTeamSize - targetSize) <= 1
  );
  console.log(`After flexible team size filtering: ${candidatesWithFlexibleSize.length} candidates`);
  
  if (candidatesWithFlexibleSize.length === 0) {
    console.log('No candidates with flexible team size preference');
    return null;
  }

  // RELAXED Step 2: Availability matching - more lenient
  const candidatesWithFlexibleAvailability = filterByFlexibleAvailabilityMatch(currentTeam, candidatesWithFlexibleSize);
  console.log(`After flexible availability filtering: ${candidatesWithFlexibleAvailability.length} candidates`);
  
  if (candidatesWithFlexibleAvailability.length === 0) {
    console.log('No candidates with flexible availability, using all size-compatible candidates');
    return selectBestCandidateRelaxed(currentTeam, candidatesWithFlexibleSize, targetSize);
  }

  return selectBestCandidateRelaxed(currentTeam, candidatesWithFlexibleAvailability, targetSize);
}

/**
 * Flexible availability matching - more lenient than strict mode
 */
function filterByFlexibleAvailabilityMatch(team: Participant[], candidates: Participant[]): Participant[] {
  if (team.length === 0) return candidates;
  
  const teamAvailabilityLevels = team.map(member => getAvailabilityLevel(member));
  
  return candidates.filter(candidate => {
    const candidateAvailabilityLevel = getAvailabilityLevel(candidate);
    
    // FLEXIBLE: Candidate must be compatible with at least one team member
    return teamAvailabilityLevels.some(teamLevel => 
      isAvailabilityCompatible(teamLevel, candidateAvailabilityLevel)
    );
  });
}

/**
 * Select best candidate with relaxed scoring
 */
function selectBestCandidateRelaxed(team: Participant[], candidates: Participant[], targetSize: number): Participant | null {
  if (candidates.length === 0) return null;

  let bestCandidate: Participant | null = null;
  let bestScore = -1;

  candidates.forEach(candidate => {
    const score = calculateRelaxedScore(team, candidate, targetSize);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  });

  return bestCandidate;
}

/**
 * Calculate relaxed compatibility score with more lenient criteria
 */
function calculateRelaxedScore(team: Participant[], candidate: Participant, targetSize: number): number {
  let score = 0;

  // Experience diversity bonus (prefer different experience levels)
  const teamExperiences = team.map(p => p.experience);
  if (!teamExperiences.includes(candidate.experience)) {
    score += 20; // Slightly reduced from strict mode
  }

  // Case type overlap bonus (prefer some common interests)
  const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
  const candidateCaseTypes = new Set(candidate.casePreferences);
  const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
  score += caseOverlap * 12; // Reduced weight

  // Skill diversity bonus (prefer complementary skills)
  const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
  const candidateSkills = new Set(candidate.coreStrengths);
  const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
  const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
  score += uniqueSkills * 8;

  // Availability compatibility bonus (more lenient)
  const teamAvailabilities = team.map(p => p.availability);
  const availabilityMatch = teamAvailabilities.some(avail => 
    isAvailabilityCompatible(getAvailabilityLevel({ availability: avail } as Participant), 
                           getAvailabilityLevel(candidate))
  );
  if (availabilityMatch) {
    score += 15; // Reduced from strict mode
  }

  // Role diversity bonus
  const teamRoles = new Set(team.flatMap(p => p.preferredRoles));
  const candidateRoles = new Set(candidate.preferredRoles);
  const roleOverlap = [...teamRoles].filter(role => candidateRoles.has(role)).length;
  const uniqueRoles = candidate.preferredRoles.length - roleOverlap;
  score += uniqueRoles * 6; // Reduced weight

  // Team size preference bonus (flexible)
  const teamSizePreferences = team.map(p => p.preferredTeamSize);
  const avgTeamSizePreference = teamSizePreferences.reduce((sum, size) => sum + size, 0) / teamSizePreferences.length;
  const sizeDifference = Math.abs(candidate.preferredTeamSize - avgTeamSizePreference);
  if (sizeDifference <= 1) {
    score += 10; // Bonus for reasonable size preference
  }

  return score;
}

/**
 * Form additional teams from remaining participants with very relaxed constraints
 */
function formAdditionalTeamsRelaxed(participants: Participant[]): { teams: Team[], unmatched: Participant[] } {
  const teams: Team[] = [];
  const remaining = [...participants];

  console.log(`Forming additional teams with relaxed constraints from ${remaining.length} participants`);

  // Sort by experience and availability
  remaining.sort((a, b) => {
    const experienceOrder = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
    const expDiff = experienceOrder[b.experience] - experienceOrder[a.experience];
    if (expDiff !== 0) return expDiff;
    
    const availOrder = { 
      'Fully Available (10–15 hrs/week)': 3, 
      'Moderately Available (5–10 hrs/week)': 2, 
      'Lightly Available (1–4 hrs/week)': 1,
      'Not available now, but interested later': 0
    };
    return availOrder[b.availability] - availOrder[a.availability];
  });

  // Try to form teams of any reasonable size
  const possibleSizes = [4, 3, 2];
  
  for (const targetSize of possibleSizes) {
    while (remaining.length >= targetSize) {
      // Take the best available participants for this size
      const teamMembers = remaining.splice(0, targetSize);
      
      if (teamMembers.length === targetSize) {
        const team = createRelaxedTeamObject(teamMembers);
        teams.push(team);
        console.log(`Formed additional relaxed team of size ${targetSize}`);
      }
    }
    
    if (remaining.length < 2) break; // Can't form more teams
  }

  return { teams, unmatched: remaining };
}

/**
 * Create team object for relaxed matching
 */
function createRelaxedTeamObject(members: Participant[]): Team {
  const teamId = `relaxed-${uuidv4()}`;
  
  // Calculate relaxed compatibility score
  let totalScore = 0;
  let comparisons = 0;
  
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalScore += calculateRelaxedScore([members[i]], members[j], members.length);
      comparisons++;
    }
  }
  
  const compatibilityScore = comparisons > 0 ? Math.min(100, Math.max(40, totalScore / comparisons)) : 70;
  
  // Find common case types (more lenient)
  const allCaseTypes = members.flatMap(m => m.casePreferences);
  const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonCaseTypes = Object.entries(caseTypeCounts)
    .filter(([_, count]) => count >= 1) // More lenient - any case type
    .map(([type, _]) => type as CaseType)
    .slice(0, 3);

  // Calculate average experience
  const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
  const avgExperience = members.reduce((sum, m) => sum + experienceValues[m.experience], 0) / members.length;

  // Calculate flexible team size preference match
  const avgPreferredSize = members.reduce((sum, m) => sum + m.preferredTeamSize, 0) / members.length;
  const preferredTeamSizeMatch = Math.max(0, 100 - Math.abs(avgPreferredSize - members.length) * 25);

  return {
    id: teamId,
    members,
    skillVector: [],
    compatibilityScore,
    teamSize: members.length,
    averageExperience: avgExperience,
    commonCaseTypes: commonCaseTypes.length > 0 ? commonCaseTypes : ['Consulting'],
    workStyleCompatibility: 'Relaxed constraints optimized',
    preferredTeamSizeMatch
  };
}