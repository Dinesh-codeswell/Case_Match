import { Participant, Team, MatchingResult } from './case-match-types';

export interface IterativeMatchingResult extends MatchingResult {
  iterations: number;
  iterationHistory: {
    iteration: number;
    participantsProcessed: number;
    teamsFormed: number;
    participantsMatched: number;
    remainingUnmatched: number;
    efficiency: number;
  }[];
}

export interface IterativeMatchingOptions {
  maxIterations?: number;
  minParticipantsPerIteration?: number;
  logLevel?: 'minimal' | 'detailed' | 'verbose';
}

/**
 * Enhanced 30-iteration matching with progressive constraint relaxation
 */
export function runEnhancedIterativeMatching(
  participants: Participant[], 
  options: IterativeMatchingOptions = {}
): IterativeMatchingResult {
  const { 
    maxIterations = 30, // Enhanced to 30 iterations
    minParticipantsPerIteration = 2,
    logLevel = 'detailed' 
  } = options;

  if (logLevel !== 'minimal') {
    console.log(`\n=== Starting Enhanced 30-Iteration Matchmaking ===`);
    console.log(`Total participants: ${participants.length}`);
    console.log(`Max iterations: ${maxIterations}`);
    console.log(`Progressive strategy relaxation enabled`);
  }

  let allTeams: Team[] = [];
  let remainingParticipants = [...participants];
  let iteration = 0;
  const iterationHistory: IterativeMatchingResult['iterationHistory'] = [];
  let totalParticipantsMatched = 0;

  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 8;

  while (remainingParticipants.length >= minParticipantsPerIteration && iteration < maxIterations) {
    iteration++;
    const participantsAtStart = remainingParticipants.length;

    if (logLevel === 'verbose') {
      console.log(`\n--- Iteration ${iteration} ---`);
      console.log(`Processing ${participantsAtStart} unmatched participants`);
    }

    // STRICT ONLY: All iterations use strict constraints - no flexibility allowed
    let iterationResult: MatchingResult;
    let strategyUsed = '';
    
    // ALL PHASES: Only strict matching with exact team size and team preference requirements
    iterationResult = matchWithStrictConstraints(remainingParticipants);
    strategyUsed = 'Strict Constraints Only';
    
    if (logLevel === 'verbose') {
      console.log(`Using STRICT matching only - no flexibility in team size or team preferences`);
    }
    
    // Process results
    const newTeams = iterationResult.teams;
    const newlyMatchedCount = newTeams.reduce((sum, team) => sum + team.members.length, 0);
    
    // Update team IDs to be unique across iterations
    const updatedNewTeams = newTeams.map((team, index) => ({
      ...team,
      id: `team-${allTeams.length + index + 1}-iter${iteration}`
    }));
    
    allTeams = [...allTeams, ...updatedNewTeams];
    remainingParticipants = iterationResult.unmatched;
    totalParticipantsMatched += newlyMatchedCount;

    // Calculate iteration efficiency
    const iterationEfficiency = participantsAtStart > 0 ? (newlyMatchedCount / participantsAtStart) * 100 : 0;

    // Record iteration history
    iterationHistory.push({
      iteration,
      participantsProcessed: participantsAtStart,
      teamsFormed: newTeams.length,
      participantsMatched: newlyMatchedCount,
      remainingUnmatched: remainingParticipants.length,
      efficiency: iterationEfficiency
    });

    if (logLevel !== 'minimal') {
      console.log(`Iteration ${iteration} (${strategyUsed}):`);
      console.log(`  - Teams formed: ${newTeams.length}`);
      console.log(`  - Participants matched: ${newlyMatchedCount}`);
      console.log(`  - Remaining unmatched: ${remainingParticipants.length}`);
      console.log(`  - Iteration efficiency: ${iterationEfficiency.toFixed(1)}%`);
    }

    // Track consecutive failures
    if (newlyMatchedCount === 0) {
      consecutiveFailures++;
      if (logLevel !== 'minimal') {
        console.log(`No progress in iteration ${iteration} (consecutive failures: ${consecutiveFailures})`);
      }
      
      if (consecutiveFailures >= maxConsecutiveFailures && remainingParticipants.length < 4) {
        if (logLevel !== 'minimal') {
          console.log(`Stopping after ${consecutiveFailures} consecutive failures with ${remainingParticipants.length} participants remaining`);
        }
        break;
      }
    } else {
      consecutiveFailures = 0;
    }

    // Break if everyone is matched
    if (remainingParticipants.length === 0) {
      if (logLevel !== 'minimal') {
        console.log(`🎉 All participants matched after ${iteration} iterations!`);
      }
      break;
    }
  }

  // Calculate final statistics
  const totalParticipants = participants.length;
  const finalMatchingEfficiency = totalParticipants > 0 ? (totalParticipantsMatched / totalParticipants) * 100 : 0;
  const averageTeamSize = allTeams.length > 0 ? totalParticipantsMatched / allTeams.length : 0;

  const teamSizeDistribution = allTeams.reduce((acc, team) => {
    acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const caseTypeDistribution = allTeams.reduce((acc, team) => {
    team.commonCaseTypes.forEach(caseType => {
      acc[caseType] = (acc[caseType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const result: IterativeMatchingResult = {
    teams: allTeams,
    unmatched: remainingParticipants,
    statistics: {
      totalParticipants,
      teamsFormed: allTeams.length,
      averageTeamSize,
      matchingEfficiency: finalMatchingEfficiency,
      teamSizeDistribution,
      caseTypeDistribution
    },
    iterations: iteration,
    iterationHistory
  };

  if (logLevel !== 'minimal') {
    console.log(`\n=== Enhanced Iterative Matching Complete ===`);
    console.log(`Total iterations: ${iteration}`);
    console.log(`Teams formed: ${allTeams.length}`);
    console.log(`Participants matched: ${totalParticipantsMatched}/${totalParticipants}`);
    console.log(`Final efficiency: ${finalMatchingEfficiency.toFixed(1)}%`);
    console.log(`Unmatched: ${remainingParticipants.length}`);
  }

  return result;
}

// STRICT ONLY: Matching with ABSOLUTE team size and team preference requirements
function matchWithStrictConstraints(participants: Participant[]): MatchingResult {
  const teams: Team[] = [];
  const remaining = [...participants];
  
  console.log(`🔒 STRICT MODE: Processing ${remaining.length} participants with ABSOLUTE constraints`);
  
  // Separate by education level AND team preference
  const ugOnlyParticipants = remaining.filter(p => 
    (!p.currentYear.includes('PG') && !p.currentYear.includes('MBA')) && 
    p.teamPreference === 'Undergrads only'
  );
  const pgOnlyParticipants = remaining.filter(p => 
    (p.currentYear.includes('PG') || p.currentYear.includes('MBA')) && 
    p.teamPreference === 'Postgrads only'
  );
  const mixedUgParticipants = remaining.filter(p => 
    (!p.currentYear.includes('PG') && !p.currentYear.includes('MBA')) && 
    p.teamPreference === 'Either UG or PG'
  );
  const mixedPgParticipants = remaining.filter(p => 
    (p.currentYear.includes('PG') || p.currentYear.includes('MBA')) && 
    p.teamPreference === 'Either UG or PG'
  );
  
  // Handle impossible combinations (UG wanting PG-only, PG wanting UG-only)
  const impossibleCombinations = remaining.filter(p => 
    ((!p.currentYear.includes('PG') && !p.currentYear.includes('MBA')) && p.teamPreference === 'Postgrads only') ||
    ((p.currentYear.includes('PG') || p.currentYear.includes('MBA')) && p.teamPreference === 'Undergrads only')
  );
  
  console.log(`🔒 STRICT SEPARATION:`);
  console.log(`   - UG Only: ${ugOnlyParticipants.length}`);
  console.log(`   - PG Only: ${pgOnlyParticipants.length}`);
  console.log(`   - Mixed UG: ${mixedUgParticipants.length}`);
  console.log(`   - Mixed PG: ${mixedPgParticipants.length}`);
  console.log(`   - Impossible combinations: ${impossibleCombinations.length}`);
  
  // Form teams within each strict category
  const ugOnlyTeams = formAbsolutelyStrictTeams(ugOnlyParticipants, 'UG-Only');
  const pgOnlyTeams = formAbsolutelyStrictTeams(pgOnlyParticipants, 'PG-Only');
  const mixedTeams = formMixedStrictTeams([...mixedUgParticipants, ...mixedPgParticipants]);
  
  teams.push(...ugOnlyTeams.teams, ...pgOnlyTeams.teams, ...mixedTeams.teams);
  const unmatched = [...ugOnlyTeams.unmatched, ...pgOnlyTeams.unmatched, ...mixedTeams.unmatched, ...impossibleCombinations];
  
  console.log(`🔒 STRICT RESULTS: ${teams.length} teams formed, ${unmatched.length} unmatched`);
  
  return createMatchingResult(participants, teams, unmatched);
}

// REMOVED: All flexible matching functions - only strict matching allowed

// STRICT Helper functions - NO flexibility allowed
function formAbsolutelyStrictTeams(participants: Participant[], category: string): { teams: Team[], unmatched: Participant[] } {
  const teams: Team[] = [];
  const remaining = [...participants];
  
  console.log(`🔒 ABSOLUTE STRICT: Processing ${remaining.length} ${category} participants`);
  
  // Group by EXACT preferred team size only
  const sizeGroups = {
    2: remaining.filter(p => p.preferredTeamSize === 2),
    3: remaining.filter(p => p.preferredTeamSize === 3),
    4: remaining.filter(p => p.preferredTeamSize === 4)
  };
  
  console.log(`🔒 ${category} Size Groups: 2=${sizeGroups[2].length}, 3=${sizeGroups[3].length}, 4=${sizeGroups[4].length}`);
  
  const matched = new Set<string>();
  
  // Form teams of EXACT size only - no flexibility
  for (const [size, sizeParticipants] of Object.entries(sizeGroups)) {
    const targetSize = parseInt(size);
    const availableParticipants = sizeParticipants.filter(p => !matched.has(p.id));
    
    console.log(`🔒 Attempting to form ${targetSize}-member teams from ${availableParticipants.length} candidates`);
    
    while (availableParticipants.length >= targetSize) {
      // Take exactly the required number of participants
      const teamMembers = availableParticipants.slice(0, targetSize);
      
      // Verify all members have the same team size preference
      const allSameSize = teamMembers.every(member => member.preferredTeamSize === targetSize);
      
      if (allSameSize) {
        const team = createAbsolutelyStrictTeam(teamMembers, category);
        teams.push(team);
        teamMembers.forEach(member => matched.add(member.id));
        // Remove matched participants from available list
        availableParticipants.splice(0, targetSize);
        console.log(`🔒 ✅ Formed ${targetSize}-member ${category} team`);
      } else {
        console.log(`🔒 ❌ Team size mismatch detected - rejecting team`);
        break;
      }
    }
  }
  
  const unmatched = remaining.filter(p => !matched.has(p.id));
  console.log(`🔒 ${category} Results: ${teams.length} teams, ${unmatched.length} unmatched`);
  
  return { teams, unmatched };
}

function formMixedStrictTeams(participants: Participant[]): { teams: Team[], unmatched: Participant[] } {
  const teams: Team[] = [];
  const remaining = [...participants];
  
  console.log(`🔒 MIXED STRICT: Processing ${remaining.length} mixed preference participants`);
  
  // Group by EXACT preferred team size only
  const sizeGroups = {
    2: remaining.filter(p => p.preferredTeamSize === 2),
    3: remaining.filter(p => p.preferredTeamSize === 3),
    4: remaining.filter(p => p.preferredTeamSize === 4)
  };
  
  console.log(`🔒 Mixed Size Groups: 2=${sizeGroups[2].length}, 3=${sizeGroups[3].length}, 4=${sizeGroups[4].length}`);
  
  const matched = new Set<string>();
  
  // Form mixed teams with EXACT size requirements
  for (const [size, sizeParticipants] of Object.entries(sizeGroups)) {
    const targetSize = parseInt(size);
    const availableParticipants = sizeParticipants.filter(p => !matched.has(p.id));
    
    while (availableParticipants.length >= targetSize) {
      const teamMembers = availableParticipants.slice(0, targetSize);
      
      // Verify all members have the same team size preference and allow mixed education
      const allSameSize = teamMembers.every(member => member.preferredTeamSize === targetSize);
      const allAllowMixed = teamMembers.every(member => member.teamPreference === 'Either UG or PG');
      
      if (allSameSize && allAllowMixed) {
        const team = createAbsolutelyStrictTeam(teamMembers, 'Mixed');
        teams.push(team);
        teamMembers.forEach(member => matched.add(member.id));
        // Remove matched participants from available list
        availableParticipants.splice(0, targetSize);
        console.log(`🔒 ✅ Formed ${targetSize}-member Mixed team`);
      } else {
        console.log(`🔒 ❌ Mixed team requirements not met - rejecting team`);
        break;
      }
    }
  }
  
  const unmatched = remaining.filter(p => !matched.has(p.id));
  console.log(`🔒 Mixed Results: ${teams.length} teams, ${unmatched.length} unmatched`);
  
  return { teams, unmatched };
}

// REMOVED: All flexible team formation functions

function calculateCompatibilityScore(team: Participant[], candidate: Participant): number {
  let score = 0;
  
  // Case type overlap
  const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
  const candidateCaseTypes = new Set(candidate.casePreferences);
  const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
  score += caseOverlap * 10;
  
  // Skill diversity
  const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
  const candidateSkills = new Set(candidate.coreStrengths);
  const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
  const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
  score += uniqueSkills * 8;
  
  // Experience diversity
  const teamExperiences = team.map(p => p.experience);
  if (!teamExperiences.includes(candidate.experience)) {
    score += 15;
  }
  
  return score;
}

function calculateActualCompatibilityScore(members: Participant[]): number {
  if (members.length < 2) return 100;
  
  let totalScore = 0;
  let comparisons = 0;
  
  // Calculate pairwise compatibility scores
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const member1 = members[i];
      const member2 = members[j];
      
      let pairScore = 0;
      
      // Case type compatibility (0-30 points)
      const member1Cases = new Set(member1.casePreferences);
      const member2Cases = new Set(member2.casePreferences);
      const caseOverlap = [...member1Cases].filter(type => member2Cases.has(type)).length;
      const maxCases = Math.max(member1Cases.size, member2Cases.size);
      pairScore += maxCases > 0 ? (caseOverlap / maxCases) * 30 : 0;
      
      // Skill complementarity (0-25 points)
      const member1Skills = new Set(member1.coreStrengths);
      const member2Skills = new Set(member2.coreStrengths);
      const skillOverlap = [...member1Skills].filter(skill => member2Skills.has(skill)).length;
      const totalUniqueSkills = new Set([...member1Skills, ...member2Skills]).size;
      const skillDiversity = totalUniqueSkills - skillOverlap;
      pairScore += Math.min(25, skillDiversity * 4);
      
      // Experience compatibility (0-20 points)
      const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
      const exp1 = experienceValues[member1.experience as keyof typeof experienceValues] || 0;
      const exp2 = experienceValues[member2.experience as keyof typeof experienceValues] || 0;
      const expDiff = Math.abs(exp1 - exp2);
      pairScore += expDiff > 0 ? 20 : 10; // Diversity bonus or same level bonus
      
      // Availability compatibility (0-15 points)
      const availabilityMatch = getAvailabilityCompatibility(member1.availability, member2.availability);
      pairScore += availabilityMatch;
      
      // Team size preference compatibility (0-10 points)
      const sizeDiff = Math.abs(member1.preferredTeamSize - member2.preferredTeamSize);
      pairScore += Math.max(0, 10 - sizeDiff * 3);
      
      totalScore += pairScore;
      comparisons++;
    }
  }
  
  const averageScore = comparisons > 0 ? totalScore / comparisons : 50;
  return Math.min(100, Math.max(30, Math.round(averageScore)));
}

function getAvailabilityCompatibility(availability1: string, availability2: string): number {
  const availabilityLevels = {
    'Fully Available (10–15 hrs/week)': 3,
    'Moderately Available (5–10 hrs/week)': 2,
    'Lightly Available (1–4 hrs/week)': 1,
    'Not available now, but interested later': 0
  };
  
  const level1 = availabilityLevels[availability1 as keyof typeof availabilityLevels] || 2;
  const level2 = availabilityLevels[availability2 as keyof typeof availabilityLevels] || 2;
  
  const diff = Math.abs(level1 - level2);
  return Math.max(0, 15 - diff * 5);
}

// STRICT ONLY: Team creation function
function createAbsolutelyStrictTeam(members: Participant[], category: string): Team {
  const calculatedScore = calculateActualCompatibilityScore(members);
  return createTeamObject(members, `Absolutely Strict ${category}`, calculatedScore);
}

function createTeamObject(members: Participant[], workStyleCompatibility: string, baseScore: number): Team {
  const teamId = `enhanced-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Find common case types
  const allCaseTypes = members.flatMap(m => m.casePreferences);
  const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonCaseTypes = Object.entries(caseTypeCounts)
    .filter(([_, count]) => count >= 1)
    .map(([type, _]) => type)
    .slice(0, 3);

  // Calculate average experience
  const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
  const avgExperience = members.reduce((sum, m) => sum + (experienceValues[m.experience as keyof typeof experienceValues] || 0), 0) / members.length;

  // Calculate team size preference match
  const avgPreferredSize = members.reduce((sum, m) => sum + m.preferredTeamSize, 0) / members.length;
  const preferredTeamSizeMatch = Math.max(0, 100 - Math.abs(avgPreferredSize - members.length) * 20);

  return {
    id: teamId,
    members,
    skillVector: [],
    compatibilityScore: baseScore,
    teamSize: members.length,
    averageExperience: avgExperience,
    commonCaseTypes: commonCaseTypes.length > 0 ? commonCaseTypes : ['Consulting'],
    workStyleCompatibility,
    preferredTeamSizeMatch
  };
}

function createMatchingResult(originalParticipants: Participant[], teams: Team[], unmatched: Participant[]): MatchingResult {
  const totalParticipants = originalParticipants.length;
  const actualMatchedParticipants = teams.reduce((sum, team) => sum + team.members.length, 0);
  const matchingEfficiency = totalParticipants > 0 ? (actualMatchedParticipants / totalParticipants) * 100 : 0;
  const averageTeamSize = teams.length > 0 ? actualMatchedParticipants / teams.length : 0;

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
    teams,
    unmatched,
    statistics: {
      totalParticipants,
      teamsFormed: teams.length,
      averageTeamSize,
      matchingEfficiency,
      teamSizeDistribution,
      caseTypeDistribution
    }
  };
}