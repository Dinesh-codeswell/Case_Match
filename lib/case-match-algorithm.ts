import { v4 as uuidv4 } from 'uuid';
import { Participant, Team, MatchingResult } from './case-match-types';

export function matchParticipantsToTeams(participants: Participant[]): MatchingResult {
  console.log(`Starting team matching for ${participants.length} participants`);
  
  if (participants.length < 2) {
    return {
      teams: [],
      unmatched: participants,
      statistics: generateStatistics([], participants)
    };
  }

  // Step 1: Education Level Matching (UG matched with UG, PG matched with PG)
  const ugParticipants = participants.filter(p => 
    !p.currentYear.includes('PG') && !p.currentYear.includes('MBA')
  );
  const pgParticipants = participants.filter(p => 
    p.currentYear.includes('PG') || p.currentYear.includes('MBA')
  );

  console.log(`Education level separation: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);

  // Step 2: Form teams within each education level
  const ugTeams = formTeamsByEducationLevel(ugParticipants);
  const pgTeams = formTeamsByEducationLevel(pgParticipants);
  
  const allTeams = [...ugTeams.teams, ...pgTeams.teams];
  const unmatched = [...ugTeams.unmatched, ...pgTeams.unmatched];

  const result: MatchingResult = {
    teams: allTeams,
    unmatched,
    statistics: generateStatistics(allTeams, unmatched)
  };

  console.log(`Matching complete: ${allTeams.length} teams formed, ${unmatched.length} unmatched`);
  return result;
}

function formTeamsByEducationLevel(participants: Participant[]): { teams: Team[], unmatched: Participant[] } {
  if (participants.length === 0) {
    return { teams: [], unmatched: [] };
  }

  const teams: Team[] = [];
  const availableParticipants = [...participants];
  
  // Sort by experience (most experienced first) for better team formation
  availableParticipants.sort((a, b) => getExperienceScore(b.experience) - getExperienceScore(a.experience));

  console.log(`Forming teams from ${availableParticipants.length} participants`);

  // Group participants by preferred team size
  const sizeGroups = {
    2: availableParticipants.filter(p => p.preferredTeamSize === 2),
    3: availableParticipants.filter(p => p.preferredTeamSize === 3),
    4: availableParticipants.filter(p => p.preferredTeamSize === 4)
  };

  console.log(`Team size preferences: 2=${sizeGroups[2].length}, 3=${sizeGroups[3].length}, 4=${sizeGroups[4].length}`);

  // Form teams prioritizing preferred team sizes
  const size4Teams = formTeamsBySize(sizeGroups[4], 4);
  const size3Teams = formTeamsBySize(sizeGroups[3], 3);
  const size2Teams = formTeamsBySize(sizeGroups[2], 2);

  // Combine all teams
  const allTeams = [...size4Teams.teams, ...size3Teams.teams, ...size2Teams.teams];
  const remainingParticipants = [...size4Teams.unmatched, ...size3Teams.unmatched, ...size2Teams.unmatched];

  console.log(`Team formation complete: ${allTeams.length} teams, ${remainingParticipants.length} unmatched`);
  return { teams: allTeams, unmatched: remainingParticipants };
}

function formTeamsBySize(participants: Participant[], targetSize: number): { teams: Team[], unmatched: Participant[] } {
  const teams: Team[] = [];
  const availableParticipants = [...participants];

  while (availableParticipants.length >= targetSize) {
    const team = createOptimalTeam(availableParticipants, targetSize);
    if (team && team.members.length === targetSize) {
      teams.push(team);
      console.log(`Formed ${targetSize}-member team with ${team.members.length} members`);
      
      // Remove team members from available participants
      team.members.forEach(member => {
        const index = availableParticipants.findIndex(p => p.id === member.id);
        if (index !== -1) {
          availableParticipants.splice(index, 1);
        }
      });
    } else {
      console.log(`Cannot form more ${targetSize}-member teams`);
      break;
    }
  }

  return { teams, unmatched: availableParticipants };
}

function createOptimalTeam(participants: Participant[], targetSize: number): Team | null {
  if (participants.length < targetSize) return null;

  // Start with the most experienced participant as anchor
  const anchor = participants[0];
  const team: Participant[] = [anchor];
  const remaining = participants.slice(1);

  console.log(`Building team of size ${targetSize} with anchor: ${anchor.fullName}`);

  // Greedily add the best compatible members
  while (team.length < targetSize && remaining.length > 0) {
    let bestCandidate: Participant | null = null;
    let bestScore = -1;

    for (const candidate of remaining) {
      const score = calculateCompatibilityScore(team, candidate);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      team.push(bestCandidate);
      const index = remaining.findIndex(p => p.id === bestCandidate!.id);
      remaining.splice(index, 1);
      
      console.log(`Added ${bestCandidate.fullName} to team (score: ${bestScore.toFixed(1)})`);
    } else {
      break;
    }
  }

  // Only return team if it has exactly the target size
  if (team.length === targetSize) {
    return createTeamObject(team);
  }

  return null;
}

function calculateCompatibilityScore(team: Participant[], candidate: Participant): number {
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
    isAvailabilityCompatible(getAvailabilityLevel(avail), getAvailabilityLevel(candidate.availability))
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

function createTeamObject(members: Participant[]): Team {
  const teamId = uuidv4();
  
  // Calculate team compatibility score
  let totalScore = 0;
  let comparisons = 0;
  
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalScore += calculateCompatibilityScore([members[i]], members[j]);
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
    .map(([type, _]) => type)
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
    workStyleCompatibility: 'Optimized for compatibility',
    preferredTeamSizeMatch
  };
}

function getExperienceScore(experience: string): number {
  const experienceValues = { 
    'None': 0, 
    'Participated in 1–2': 1, 
    'Participated in 3+': 2, 
    'Finalist/Winner in at least one': 3 
  };
  return experienceValues[experience] || 0;
}

function getAvailabilityLevel(availability: string): 'High' | 'Medium' | 'Low' {
  switch (availability) {
    case 'Fully Available (10–15 hrs/week)': return 'High';
    case 'Moderately Available (5–10 hrs/week)': return 'Medium';
    case 'Lightly Available (1–4 hrs/week)': return 'Low';
    case 'Not available now, but interested later': return 'Low';
    default: return 'Medium';
  }
}

function isAvailabilityCompatible(level1: 'High' | 'Medium' | 'Low', level2: 'High' | 'Medium' | 'Low'): boolean {
  const compatibilityMatrix = {
    'High': ['High', 'Medium'],
    'Medium': ['High', 'Medium', 'Low'],
    'Low': ['Medium', 'Low']
  };
  
  return compatibilityMatrix[level1].includes(level2);
}

function generateStatistics(teams: Team[], unmatched: Participant[]): MatchingResult['statistics'] {
  const totalParticipants = teams.reduce((sum, team) => sum + team.members.length, 0) + unmatched.length;
  const teamsFormed = teams.length;
  const averageTeamSize = teams.length > 0 ? 
    teams.reduce((sum, team) => sum + team.teamSize, 0) / teams.length : 0;
  const matchingEfficiency = totalParticipants > 0 ? 
    ((totalParticipants - unmatched.length) / totalParticipants) * 100 : 0;

  // Calculate team size distribution
  const teamSizeDistribution = teams.reduce((acc, team) => {
    acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Calculate case type distribution
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