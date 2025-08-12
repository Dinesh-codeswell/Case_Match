"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchParticipantsToTeams = matchParticipantsToTeams;
const uuid_1 = require("uuid");
const config = {
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
const requiredRoles = {
    strategist: ['Strategy & Structuring', 'Innovation & Ideation'],
    analyst: ['Data Analysis & Research', 'Financial Modeling', 'Market Research'],
    communicator: ['Public Speaking & Pitching', 'Storytelling', 'Presentation Design (PPT/Canva)'],
    designer: ['UI/UX or Product Thinking', 'Storytelling', 'Presentation Design (PPT/Canva)']
};
const roleMapping = {
    'Team Lead': 'lead',
    'Researcher': 'researcher',
    'Data Analyst': 'analyst',
    'Designer': 'designer',
    'Presenter': 'presenter',
    'Coordinator': 'coordinator',
    'Flexible with any role': 'flexible'
};
function matchParticipantsToTeams(participants, relaxedMode = false) {
    console.log(`Starting anti-bias matchmaking for ${participants.length} participants`);
    const ugParticipants = participants.filter(p => !p.currentYear.includes('PG') && !p.currentYear.includes('MBA'));
    const pgParticipants = participants.filter(p => p.currentYear.includes('PG') || p.currentYear.includes('MBA'));
    console.log(`Education level separation: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);
    const ugTeams = formTeamsAntiBias(ugParticipants, relaxedMode);
    const pgTeams = formTeamsAntiBias(pgParticipants, relaxedMode);
    const allTeams = [...ugTeams.teams, ...pgTeams.teams];
    const unmatched = [...ugTeams.unmatched, ...pgTeams.unmatched];
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
function formTeamsAntiBias(participants, relaxedMode = false) {
    if (participants.length === 0) {
        return { teams: [], unmatched: [] };
    }
    const teams = [];
    const availableParticipants = [...participants];
    availableParticipants.sort((a, b) => getExperienceScore(b) - getExperienceScore(a));
    console.log(`Forming anti-bias teams from ${availableParticipants.length} participants`);
    const size2Participants = availableParticipants.filter(p => p.preferredTeamSize === 2);
    const size3Participants = availableParticipants.filter(p => p.preferredTeamSize === 3);
    const size4Participants = availableParticipants.filter(p => p.preferredTeamSize === 4);
    console.log(`Team size preferences: 2=${size2Participants.length}, 3=${size3Participants.length}, 4=${size4Participants.length}`);
    const size2Teams = formTeamsBySize(size2Participants, 2, relaxedMode);
    const size3Teams = formTeamsBySize(size3Participants, 3, relaxedMode);
    const size4Teams = formTeamsBySize(size4Participants, 4, relaxedMode);
    const allTeams = [...size2Teams.teams, ...size3Teams.teams, ...size4Teams.teams];
    let remainingParticipants = [...size2Teams.unmatched, ...size3Teams.unmatched, ...size4Teams.unmatched];
    if (relaxedMode && remainingParticipants.length >= 2) {
        console.log(`RELAXED MODE: Attempting to form additional teams from ${remainingParticipants.length} unmatched participants`);
        const additionalTeams = formAdditionalTeamsRelaxed(remainingParticipants);
        allTeams.push(...additionalTeams.teams);
        remainingParticipants = additionalTeams.unmatched;
        console.log(`RELAXED MODE: Formed ${additionalTeams.teams.length} additional teams, ${remainingParticipants.length} still unmatched`);
    }
    else {
        console.log(`STRICT MODE: ${remainingParticipants.length} participants remain unmatched due to strict constraints`);
    }
    const finalTeams = allTeams;
    const unmatched = remainingParticipants;
    console.log(`Anti-bias team formation complete: ${finalTeams.length} teams, ${unmatched.length} unmatched`);
    return { teams: finalTeams, unmatched };
}
function formTeamsBySize(participants, targetSize, relaxedMode = false) {
    const teams = [];
    const availableParticipants = [...participants];
    while (availableParticipants.length >= targetSize) {
        const team = relaxedMode
            ? createTeamWithRelaxedConstraints(availableParticipants, targetSize)
            : createTeamWithStrictConstraints(availableParticipants, targetSize);
        if (team && team.members.length === targetSize) {
            teams.push(team);
            const mode = relaxedMode ? 'RELAXED' : 'STRICT';
            console.log(`Formed ${mode} ${targetSize}-member team with exactly ${team.members.length} members`);
            team.members.forEach(member => {
                const index = availableParticipants.findIndex(p => p.id === member.id);
                if (index !== -1) {
                    availableParticipants.splice(index, 1);
                }
            });
        }
        else {
            const mode = relaxedMode ? 'relaxed' : 'strict';
            console.log(`Cannot form more ${targetSize}-member teams with ${mode} constraints`);
            break;
        }
    }
    return { teams, unmatched: availableParticipants };
}
function createTeamWithStrictConstraints(participants, targetSize) {
    if (participants.length < targetSize)
        return null;
    const strictParticipants = participants.filter(p => p.preferredTeamSize === targetSize);
    if (strictParticipants.length < targetSize) {
        console.log(`Not enough participants prefer team size ${targetSize}: ${strictParticipants.length} available, ${targetSize} needed`);
        return null;
    }
    const anchor = strictParticipants[0];
    const team = [anchor];
    const remaining = strictParticipants.slice(1);
    console.log(`Starting STRICT ${targetSize}-member team with anchor: ${anchor.fullName} (prefers size ${anchor.preferredTeamSize})`);
    while (team.length < targetSize && remaining.length > 0) {
        const nextMember = findBestMatchStrict(team, remaining, targetSize);
        if (nextMember) {
            team.push(nextMember);
            console.log(`Added member: ${nextMember.fullName} (prefers size ${nextMember.preferredTeamSize})`);
            const index = remaining.findIndex(p => p.id === nextMember.id);
            remaining.splice(index, 1);
        }
        else {
            console.log(`No suitable member found for strict team of size ${team.length}`);
            break;
        }
    }
    if (team.length !== targetSize) {
        console.log(`Strict team formation failed: got ${team.length} members, needed ${targetSize}`);
        return null;
    }
    console.log(`Created STRICT ${targetSize}-member team with exactly ${team.length} members`);
    return createTeamObject(team);
}
function findBestMatchStrict(currentTeam, candidates, targetSize) {
    console.log(`Finding STRICT match for ${targetSize}-member team of size ${currentTeam.length} from ${candidates.length} candidates`);
    const candidatesWithCorrectSize = candidates.filter(c => c.preferredTeamSize === targetSize);
    console.log(`After strict team size filtering: ${candidatesWithCorrectSize.length} candidates`);
    if (candidatesWithCorrectSize.length === 0) {
        console.log('No candidates with correct team size preference');
        return null;
    }
    const candidatesWithStrictAvailability = filterByStrictAvailabilityMatch(currentTeam, candidatesWithCorrectSize);
    console.log(`After strict availability filtering: ${candidatesWithStrictAvailability.length} candidates`);
    if (candidatesWithStrictAvailability.length === 0) {
        console.log('No candidates with compatible availability');
        return null;
    }
    return findBestMatchWithStrictCandidates(currentTeam, candidatesWithStrictAvailability, targetSize);
}
function findBestMatchWithStrictCandidates(currentTeam, candidates, targetSize) {
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
        return selectBestCandidateAntiBias(currentTeam, candidatesWithRelaxedCase, targetSize);
    }
    return selectBestCandidateAntiBias(currentTeam, candidatesWithCaseDiversity, targetSize);
}
function filterByCaseTypeDiversity(team, candidates) {
    if (team.length === 0)
        return candidates;
    const teamCaseTypes = team.flatMap(member => member.casePreferences);
    const uniqueTeamCaseTypes = new Set(teamCaseTypes);
    if (uniqueTeamCaseTypes.size === 0) {
        return candidates;
    }
    const candidatesWithDifferentCaseTypes = candidates.filter(candidate => {
        const candidateCaseTypes = new Set(candidate.casePreferences);
        const hasDifferentCaseTypes = candidate.casePreferences.some(caseType => !uniqueTeamCaseTypes.has(caseType));
        return hasDifferentCaseTypes;
    });
    return candidatesWithDifferentCaseTypes.length > 0 ? candidatesWithDifferentCaseTypes : candidates;
}
function filterByCaseTypeRelaxed(team, candidates) {
    if (team.length === 0)
        return candidates;
    const teamCaseTypes = team.flatMap(member => member.casePreferences);
    const uniqueTeamCaseTypes = new Set(teamCaseTypes);
    if (uniqueTeamCaseTypes.size === 0) {
        return candidates;
    }
    return candidates.filter(candidate => {
        const hasCommonCaseType = candidate.casePreferences.some(caseType => uniqueTeamCaseTypes.has(caseType));
        return hasCommonCaseType || team.length < 3;
    });
}
function getAvailabilityLevel(participant) {
    switch (participant.availability) {
        case 'Fully Available (10–15 hrs/week)': return 'High';
        case 'Moderately Available (5–10 hrs/week)': return 'Medium';
        case 'Lightly Available (1–4 hrs/week)': return 'Low';
        case 'Not available now, but interested later': return 'Low';
        default: return 'Medium';
    }
}
function isAvailabilityCompatible(level1, level2) {
    const compatibilityMatrix = {
        'High': ['High', 'Medium'],
        'Medium': ['High', 'Medium', 'Low'],
        'Low': ['Medium', 'Low']
    };
    return compatibilityMatrix[level1].includes(level2);
}
function filterByStrictAvailabilityMatch(team, candidates) {
    if (team.length === 0)
        return candidates;
    const teamAvailabilityLevels = team.map(member => getAvailabilityLevel(member));
    return candidates.filter(candidate => {
        const candidateAvailabilityLevel = getAvailabilityLevel(candidate);
        return teamAvailabilityLevels.every(teamLevel => isAvailabilityCompatible(teamLevel, candidateAvailabilityLevel));
    });
}
function selectBestCandidateAntiBias(team, candidates, targetSize) {
    if (candidates.length === 0)
        return null;
    let bestCandidate = null;
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
function calculateAntiBiasScore(team, candidate, targetSize) {
    let score = 0;
    const teamExperiences = team.map(p => p.experience);
    if (!teamExperiences.includes(candidate.experience)) {
        score += 25;
    }
    const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
    const candidateCaseTypes = new Set(candidate.casePreferences);
    const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
    score += caseOverlap * 15;
    const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
    const candidateSkills = new Set(candidate.coreStrengths);
    const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
    const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
    score += uniqueSkills * 10;
    const teamAvailabilities = team.map(p => p.availability);
    const availabilityMatch = teamAvailabilities.some(avail => isAvailabilityCompatible(getAvailabilityLevel({ availability: avail }), getAvailabilityLevel(candidate)));
    if (availabilityMatch) {
        score += 20;
    }
    const teamRoles = new Set(team.flatMap(p => p.preferredRoles));
    const candidateRoles = new Set(candidate.preferredRoles);
    const roleOverlap = [...teamRoles].filter(role => candidateRoles.has(role)).length;
    const uniqueRoles = candidate.preferredRoles.length - roleOverlap;
    score += uniqueRoles * 8;
    return score;
}
function createTeamObject(members) {
    const teamId = (0, uuid_1.v4)();
    let totalScore = 0;
    let comparisons = 0;
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            totalScore += calculateAntiBiasScore([members[i]], members[j], members.length);
            comparisons++;
        }
    }
    const compatibilityScore = comparisons > 0 ? totalScore / comparisons : 0;
    const allCaseTypes = members.flatMap(m => m.casePreferences);
    const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const commonCaseTypes = Object.entries(caseTypeCounts)
        .filter(([_, count]) => count >= 2)
        .map(([type, _]) => type)
        .slice(0, 3);
    const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
    const avgExperience = members.reduce((sum, m) => sum + experienceValues[m.experience], 0) / members.length;
    const preferredSizeMatches = members.filter(m => m.preferredTeamSize === members.length).length;
    const preferredTeamSizeMatch = (preferredSizeMatches / members.length) * 100;
    return {
        id: teamId,
        members,
        skillVector: [],
        compatibilityScore: Math.min(100, Math.max(0, compatibilityScore)),
        teamSize: members.length,
        averageExperience: avgExperience,
        commonCaseTypes,
        workStyleCompatibility: 'Anti-bias optimized',
        preferredTeamSizeMatch
    };
}
function getExperienceScore(experience) {
    const experienceValues = {
        'None': 0,
        'Participated in 1–2': 1,
        'Participated in 3+': 2,
        'Finalist/Winner in at least one': 3
    };
    return experienceValues[experience];
}
function calculateTeamSizeDistribution(teams) {
    return teams.reduce((acc, team) => {
        acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
        return acc;
    }, {});
}
function calculateCaseTypeDistribution(teams) {
    return teams.reduce((acc, team) => {
        team.commonCaseTypes.forEach(caseType => {
            acc[caseType] = (acc[caseType] || 0) + 1;
        });
        return acc;
    }, {});
}
function createTeamWithRelaxedConstraints(participants, targetSize) {
    if (participants.length < targetSize)
        return null;
    const relaxedParticipants = participants.filter(p => Math.abs(p.preferredTeamSize - targetSize) <= 1);
    if (relaxedParticipants.length < targetSize) {
        console.log(`Not enough participants for relaxed team size ${targetSize}: ${relaxedParticipants.length} available, ${targetSize} needed`);
        return null;
    }
    const anchor = relaxedParticipants[0];
    const team = [anchor];
    const remaining = relaxedParticipants.slice(1);
    console.log(`Starting RELAXED ${targetSize}-member team with anchor: ${anchor.fullName} (prefers size ${anchor.preferredTeamSize})`);
    while (team.length < targetSize && remaining.length > 0) {
        const nextMember = findBestMatchRelaxed(team, remaining, targetSize);
        if (nextMember) {
            team.push(nextMember);
            console.log(`Added member: ${nextMember.fullName} (prefers size ${nextMember.preferredTeamSize})`);
            const index = remaining.findIndex(p => p.id === nextMember.id);
            remaining.splice(index, 1);
        }
        else {
            console.log(`No suitable member found for relaxed team of size ${team.length}`);
            break;
        }
    }
    if (team.length !== targetSize) {
        console.log(`Relaxed team formation failed: got ${team.length} members, needed ${targetSize}`);
        return null;
    }
    console.log(`Created RELAXED ${targetSize}-member team with exactly ${team.length} members`);
    return createTeamObject(team);
}
function findBestMatchRelaxed(currentTeam, candidates, targetSize) {
    console.log(`Finding RELAXED match for ${targetSize}-member team of size ${currentTeam.length} from ${candidates.length} candidates`);
    const candidatesWithFlexibleSize = candidates.filter(c => Math.abs(c.preferredTeamSize - targetSize) <= 1);
    console.log(`After flexible team size filtering: ${candidatesWithFlexibleSize.length} candidates`);
    if (candidatesWithFlexibleSize.length === 0) {
        console.log('No candidates with flexible team size preference');
        return null;
    }
    const candidatesWithFlexibleAvailability = filterByFlexibleAvailabilityMatch(currentTeam, candidatesWithFlexibleSize);
    console.log(`After flexible availability filtering: ${candidatesWithFlexibleAvailability.length} candidates`);
    if (candidatesWithFlexibleAvailability.length === 0) {
        console.log('No candidates with flexible availability, using all size-compatible candidates');
        return selectBestCandidateRelaxed(currentTeam, candidatesWithFlexibleSize, targetSize);
    }
    return selectBestCandidateRelaxed(currentTeam, candidatesWithFlexibleAvailability, targetSize);
}
function filterByFlexibleAvailabilityMatch(team, candidates) {
    if (team.length === 0)
        return candidates;
    const teamAvailabilityLevels = team.map(member => getAvailabilityLevel(member));
    return candidates.filter(candidate => {
        const candidateAvailabilityLevel = getAvailabilityLevel(candidate);
        return teamAvailabilityLevels.some(teamLevel => isAvailabilityCompatible(teamLevel, candidateAvailabilityLevel));
    });
}
function selectBestCandidateRelaxed(team, candidates, targetSize) {
    if (candidates.length === 0)
        return null;
    let bestCandidate = null;
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
function calculateRelaxedScore(team, candidate, targetSize) {
    let score = 0;
    const teamExperiences = team.map(p => p.experience);
    if (!teamExperiences.includes(candidate.experience)) {
        score += 20;
    }
    const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
    const candidateCaseTypes = new Set(candidate.casePreferences);
    const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
    score += caseOverlap * 12;
    const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
    const candidateSkills = new Set(candidate.coreStrengths);
    const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
    const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
    score += uniqueSkills * 8;
    const teamAvailabilities = team.map(p => p.availability);
    const availabilityMatch = teamAvailabilities.some(avail => isAvailabilityCompatible(getAvailabilityLevel({ availability: avail }), getAvailabilityLevel(candidate)));
    if (availabilityMatch) {
        score += 15;
    }
    const teamRoles = new Set(team.flatMap(p => p.preferredRoles));
    const candidateRoles = new Set(candidate.preferredRoles);
    const roleOverlap = [...teamRoles].filter(role => candidateRoles.has(role)).length;
    const uniqueRoles = candidate.preferredRoles.length - roleOverlap;
    score += uniqueRoles * 6;
    const teamSizePreferences = team.map(p => p.preferredTeamSize);
    const avgTeamSizePreference = teamSizePreferences.reduce((sum, size) => sum + size, 0) / teamSizePreferences.length;
    const sizeDifference = Math.abs(candidate.preferredTeamSize - avgTeamSizePreference);
    if (sizeDifference <= 1) {
        score += 10;
    }
    return score;
}
function formAdditionalTeamsRelaxed(participants) {
    const teams = [];
    const remaining = [...participants];
    console.log(`Forming additional teams with relaxed constraints from ${remaining.length} participants`);
    remaining.sort((a, b) => {
        const experienceOrder = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
        const expDiff = experienceOrder[b.experience] - experienceOrder[a.experience];
        if (expDiff !== 0)
            return expDiff;
        const availOrder = {
            'Fully Available (10–15 hrs/week)': 3,
            'Moderately Available (5–10 hrs/week)': 2,
            'Lightly Available (1–4 hrs/week)': 1,
            'Not available now, but interested later': 0
        };
        return availOrder[b.availability] - availOrder[a.availability];
    });
    const possibleSizes = [4, 3, 2];
    for (const targetSize of possibleSizes) {
        while (remaining.length >= targetSize) {
            const teamMembers = remaining.splice(0, targetSize);
            if (teamMembers.length === targetSize) {
                const team = createRelaxedTeamObject(teamMembers);
                teams.push(team);
                console.log(`Formed additional relaxed team of size ${targetSize}`);
            }
        }
        if (remaining.length < 2)
            break;
    }
    return { teams, unmatched: remaining };
}
function createRelaxedTeamObject(members) {
    const teamId = `relaxed-${(0, uuid_1.v4)()}`;
    let totalScore = 0;
    let comparisons = 0;
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            totalScore += calculateRelaxedScore([members[i]], members[j], members.length);
            comparisons++;
        }
    }
    const compatibilityScore = comparisons > 0 ? Math.min(100, Math.max(40, totalScore / comparisons)) : 70;
    const allCaseTypes = members.flatMap(m => m.casePreferences);
    const caseTypeCounts = allCaseTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const commonCaseTypes = Object.entries(caseTypeCounts)
        .filter(([_, count]) => count >= 1)
        .map(([type, _]) => type)
        .slice(0, 3);
    const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
    const avgExperience = members.reduce((sum, m) => sum + experienceValues[m.experience], 0) / members.length;
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
