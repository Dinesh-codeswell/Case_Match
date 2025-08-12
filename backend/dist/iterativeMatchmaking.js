"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIterativeMatching = runIterativeMatching;
exports.getIterativeMatchingStats = getIterativeMatchingStats;
const matchmaking_1 = require("./matchmaking");
function runIterativeMatching(participants, options = {}) {
    const { maxIterations = 30, minParticipantsPerIteration = 2, logLevel = 'detailed' } = options;
    if (logLevel !== 'minimal') {
        console.log(`\n=== Starting Iterative Matchmaking ===`);
        console.log(`Total participants: ${participants.length}`);
        console.log(`Max iterations: ${maxIterations}`);
        console.log(`Min participants per iteration: ${minParticipantsPerIteration}`);
    }
    let allTeams = [];
    let remainingParticipants = [...participants];
    let iteration = 0;
    const iterationHistory = [];
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
        let iterationResult;
        if (iteration <= 3 && consecutiveFailures === 0) {
            iterationResult = (0, matchmaking_1.matchParticipantsToTeams)(remainingParticipants, false);
            if (logLevel === 'verbose') {
                console.log(`Standard strict matching: ${iterationResult.teams.length} teams formed`);
            }
        }
        else if (iteration <= 8) {
            if (logLevel === 'verbose') {
                console.log('Using relaxed matching mode...');
            }
            iterationResult = (0, matchmaking_1.matchParticipantsToTeams)(remainingParticipants, true);
        }
        else if (iteration <= 12) {
            if (logLevel === 'verbose') {
                console.log('Using strategic regrouping with relaxed constraints...');
            }
            iterationResult = tryStrategicRegrouping(remainingParticipants, logLevel);
        }
        else if (iteration <= 18) {
            if (logLevel === 'verbose') {
                console.log('Using alternative grouping strategies...');
            }
            iterationResult = tryAlternativeGrouping(remainingParticipants, logLevel);
        }
        else if (iteration <= 25) {
            if (logLevel === 'verbose') {
                console.log('Using flexible team size matching...');
            }
            iterationResult = tryFlexibleSizeMatching(remainingParticipants, logLevel);
        }
        else {
            if (logLevel === 'verbose') {
                console.log('Using emergency matching with minimal constraints...');
            }
            iterationResult = tryEmergencyMatching(remainingParticipants, logLevel);
        }
        const newTeams = iterationResult.teams;
        const newlyMatchedCount = newTeams.reduce((sum, team) => sum + team.members.length, 0);
        const updatedNewTeams = newTeams.map((team, index) => ({
            ...team,
            id: `team-${allTeams.length + index + 1}-iter${iteration}`
        }));
        allTeams = [...allTeams, ...updatedNewTeams];
        remainingParticipants = iterationResult.unmatched;
        totalParticipantsMatched += newlyMatchedCount;
        const iterationEfficiency = participantsAtStart > 0 ? (newlyMatchedCount / participantsAtStart) * 100 : 0;
        iterationHistory.push({
            iteration,
            participantsProcessed: participantsAtStart,
            teamsFormed: newTeams.length,
            participantsMatched: newlyMatchedCount,
            remainingUnmatched: remainingParticipants.length,
            efficiency: iterationEfficiency
        });
        if (logLevel !== 'minimal') {
            console.log(`Iteration ${iteration} results:`);
            console.log(`  - Teams formed: ${newTeams.length}`);
            console.log(`  - Participants matched: ${newlyMatchedCount}`);
            console.log(`  - Remaining unmatched: ${remainingParticipants.length}`);
            console.log(`  - Iteration efficiency: ${iterationEfficiency.toFixed(1)}%`);
        }
        if (newlyMatchedCount === 0) {
            consecutiveFailures++;
            if (logLevel !== 'minimal') {
                console.log(`No progress made in iteration ${iteration} (consecutive failures: ${consecutiveFailures})`);
            }
            if (consecutiveFailures >= maxConsecutiveFailures && remainingParticipants.length < 4) {
                if (logLevel !== 'minimal') {
                    console.log(`Stopping after ${consecutiveFailures} consecutive failures with ${remainingParticipants.length} participants remaining`);
                }
                break;
            }
        }
        else {
            consecutiveFailures = 0;
        }
        if (remainingParticipants.length >= 4 && iteration < maxIterations - 2) {
            if (logLevel === 'verbose') {
                console.log(`Continuing with ${remainingParticipants.length} participants (${maxIterations - iteration} iterations remaining)`);
            }
        }
        if (remainingParticipants.length === 0) {
            if (logLevel !== 'minimal') {
                console.log(`All participants matched after ${iteration} iterations!`);
            }
            break;
        }
    }
    const totalParticipants = participants.length;
    const finalMatchingEfficiency = totalParticipants > 0 ? (totalParticipantsMatched / totalParticipants) * 100 : 0;
    const averageTeamSize = allTeams.length > 0 ? totalParticipantsMatched / allTeams.length : 0;
    const teamSizeDistribution = allTeams.reduce((acc, team) => {
        acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
        return acc;
    }, {});
    const caseTypeDistribution = allTeams.reduce((acc, team) => {
        team.commonCaseTypes.forEach(caseType => {
            acc[caseType] = (acc[caseType] || 0) + 1;
        });
        return acc;
    }, {});
    const result = {
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
        console.log(`\n=== Final Iterative Matching Results ===`);
        console.log(`Total iterations: ${iteration}`);
        console.log(`Total teams formed: ${allTeams.length}`);
        console.log(`Total participants matched: ${totalParticipantsMatched}/${totalParticipants}`);
        console.log(`Final matching efficiency: ${finalMatchingEfficiency.toFixed(1)}%`);
        console.log(`Remaining unmatched: ${remainingParticipants.length}`);
        if (logLevel === 'verbose' && iterationHistory.length > 0) {
            console.log(`\n--- Iteration Summary ---`);
            iterationHistory.forEach(hist => {
                console.log(`Iteration ${hist.iteration}: ${hist.participantsMatched}/${hist.participantsProcessed} matched (${hist.efficiency.toFixed(1)}%)`);
            });
        }
    }
    return result;
}
function tryStrategicRegrouping(participants, logLevel = 'detailed') {
    if (logLevel === 'verbose') {
        console.log(`Starting strategic regrouping for ${participants.length} participants with strict team sizes`);
    }
    const teams = [];
    let remaining = [...participants];
    const sizeGroups = {
        2: remaining.filter(p => p.preferredTeamSize === 2),
        3: remaining.filter(p => p.preferredTeamSize === 3),
        4: remaining.filter(p => p.preferredTeamSize === 4)
    };
    if (logLevel === 'verbose') {
        console.log(`Size groups: 2-member (${sizeGroups[2].length}), 3-member (${sizeGroups[3].length}), 4-member (${sizeGroups[4].length})`);
    }
    const sizeOrder = [4, 3, 2];
    for (const targetSize of sizeOrder) {
        const candidates = sizeGroups[targetSize];
        if (candidates.length >= targetSize) {
            if (logLevel === 'verbose') {
                console.log(`Attempting to form ${targetSize}-member teams from ${candidates.length} candidates`);
            }
            const teamsFormed = formOptimalTeamsOfSize(candidates, targetSize, logLevel);
            teams.push(...teamsFormed);
            const matchedIds = new Set(teamsFormed.flatMap(team => team.members.map(m => m.id)));
            remaining = remaining.filter(p => !matchedIds.has(p.id));
            if (logLevel === 'verbose') {
                console.log(`Formed ${teamsFormed.length} teams of size ${targetSize}, ${remaining.length} participants remaining`);
            }
        }
    }
    const totalParticipants = participants.length;
    const matchedParticipants = totalParticipants - remaining.length;
    const matchingEfficiency = totalParticipants > 0 ? (matchedParticipants / totalParticipants) * 100 : 0;
    const averageTeamSize = teams.length > 0 ? matchedParticipants / teams.length : 0;
    const teamSizeDistribution = teams.reduce((acc, team) => {
        acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
        return acc;
    }, {});
    const caseTypeDistribution = teams.reduce((acc, team) => {
        team.commonCaseTypes.forEach(caseType => {
            acc[caseType] = (acc[caseType] || 0) + 1;
        });
        return acc;
    }, {});
    return {
        teams,
        unmatched: remaining,
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
function formOptimalTeamsOfSize(candidates, targetSize, logLevel) {
    const teams = [];
    const available = [...candidates];
    available.sort((a, b) => {
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
    while (available.length >= targetSize) {
        const team = buildBestTeamOfSize(available, targetSize, logLevel);
        if (team && team.members.length === targetSize) {
            teams.push(team);
            team.members.forEach(member => {
                const index = available.findIndex(p => p.id === member.id);
                if (index !== -1) {
                    available.splice(index, 1);
                }
            });
            if (logLevel === 'verbose') {
                console.log(`Formed team of ${targetSize} members, ${available.length} candidates remaining`);
            }
        }
        else {
            break;
        }
    }
    return teams;
}
function buildBestTeamOfSize(candidates, targetSize, logLevel) {
    if (candidates.length < targetSize)
        return null;
    const anchor = candidates[0];
    const team = [anchor];
    const remaining = candidates.slice(1);
    if (logLevel === 'verbose') {
        console.log(`Building team of size ${targetSize} with anchor: ${anchor.fullName}`);
    }
    while (team.length < targetSize && remaining.length > 0) {
        let bestCandidate = null;
        let bestScore = -1;
        for (const candidate of remaining) {
            const score = calculateStrictCompatibilityScore(team, candidate);
            if (score > bestScore) {
                bestScore = score;
                bestCandidate = candidate;
            }
        }
        if (bestCandidate) {
            team.push(bestCandidate);
            const index = remaining.findIndex(p => p.id === bestCandidate.id);
            remaining.splice(index, 1);
            if (logLevel === 'verbose') {
                console.log(`Added ${bestCandidate.fullName} to team (score: ${bestScore.toFixed(1)})`);
            }
        }
        else {
            break;
        }
    }
    if (team.length === targetSize) {
        return createStrictTeamObject(team);
    }
    return null;
}
function calculateStrictCompatibilityScore(team, candidate) {
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
    const teamEducationLevels = team.map(p => p.currentYear.includes('PG') || p.currentYear.includes('MBA') ? 'PG' : 'UG');
    const candidateEducationLevel = candidate.currentYear.includes('PG') || candidate.currentYear.includes('MBA') ? 'PG' : 'UG';
    const hasEducationDiversity = teamEducationLevels.includes('PG') && teamEducationLevels.includes('UG');
    if (!hasEducationDiversity && !teamEducationLevels.includes(candidateEducationLevel)) {
        score += 12;
    }
    return score;
}
function createStrictTeamObject(members) {
    const teamId = `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let totalScore = 0;
    let comparisons = 0;
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            totalScore += calculateStrictCompatibilityScore([members[i]], members[j]);
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
        workStyleCompatibility: 'Optimized for compatibility',
        preferredTeamSizeMatch
    };
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
    if (level1 === 'High')
        return level2 === 'High' || level2 === 'Medium';
    if (level1 === 'Medium')
        return true;
    if (level1 === 'Low')
        return level2 === 'Medium' || level2 === 'Low';
    return false;
}
function tryAlternativeGrouping(participants, logLevel) {
    if (logLevel === 'verbose') {
        console.log(`Trying alternative grouping for ${participants.length} participants`);
    }
    const ugParticipants = participants.filter(p => !p.currentYear.includes('PG') && !p.currentYear.includes('MBA'));
    const pgParticipants = participants.filter(p => p.currentYear.includes('PG') || p.currentYear.includes('MBA'));
    if (logLevel === 'verbose') {
        console.log(`Alternative grouping: ${ugParticipants.length} UG, ${pgParticipants.length} PG`);
    }
    const teams = [];
    const remaining = [...participants];
    remaining.sort((a, b) => {
        const sizeOrder = b.preferredTeamSize - a.preferredTeamSize;
        if (sizeOrder !== 0)
            return sizeOrder;
        const experienceOrder = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
        return experienceOrder[b.experience] - experienceOrder[a.experience];
    });
    const sizeGroups = {
        2: remaining.filter(p => p.preferredTeamSize === 2),
        3: remaining.filter(p => p.preferredTeamSize === 3),
        4: remaining.filter(p => p.preferredTeamSize === 4)
    };
    const sizeCounts = Object.entries(sizeGroups).map(([size, participants]) => ({
        size: parseInt(size),
        count: participants.length,
        participants
    })).sort((a, b) => b.count - a.count);
    for (const { size, participants: sizeParticipants } of sizeCounts) {
        if (sizeParticipants.length >= size) {
            const formedTeams = formOptimalTeamsOfSize(sizeParticipants, size, logLevel);
            teams.push(...formedTeams);
            const matchedIds = new Set(formedTeams.flatMap(team => team.members.map(m => m.id)));
            const remainingIndex = remaining.length;
            for (let i = remainingIndex - 1; i >= 0; i--) {
                if (matchedIds.has(remaining[i].id)) {
                    remaining.splice(i, 1);
                }
            }
        }
    }
    return createMatchingResult(participants, teams, remaining);
}
function tryMinimalGrouping(participants, logLevel) {
    if (logLevel === 'verbose') {
        console.log(`Trying minimal grouping for ${participants.length} participants`);
    }
    const teams = [];
    const remaining = [...participants];
    if (remaining.length >= 2) {
        remaining.sort((a, b) => {
            const aCommonTypes = a.casePreferences.length;
            const bCommonTypes = b.casePreferences.length;
            return bCommonTypes - aCommonTypes;
        });
        const preferredSizes = [...new Set(remaining.map(p => p.preferredTeamSize))].sort((a, b) => b - a);
        for (const targetSize of preferredSizes) {
            const candidates = remaining.filter(p => p.preferredTeamSize === targetSize);
            if (candidates.length >= targetSize) {
                const team = buildBestTeamOfSize(candidates, targetSize, logLevel);
                if (team) {
                    teams.push(team);
                    team.members.forEach(member => {
                        const index = remaining.findIndex(p => p.id === member.id);
                        if (index !== -1) {
                            remaining.splice(index, 1);
                        }
                    });
                    if (logLevel === 'verbose') {
                        console.log(`Formed minimal team of size ${targetSize}`);
                    }
                    break;
                }
            }
        }
    }
    return createMatchingResult(participants, teams, remaining);
}
function tryFlexibleSizeMatching(participants, logLevel) {
    if (logLevel === 'verbose') {
        console.log(`Trying flexible size matching for ${participants.length} participants`);
    }
    const teams = [];
    const remaining = [...participants];
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
    while (remaining.length >= 2) {
        const possibleSizes = [4, 3, 2];
        let teamFormed = false;
        for (const targetSize of possibleSizes) {
            if (remaining.length >= targetSize) {
                const flexibleCandidates = remaining.filter(p => Math.abs(p.preferredTeamSize - targetSize) <= 1);
                if (flexibleCandidates.length >= targetSize) {
                    const team = buildFlexibleTeam(flexibleCandidates, targetSize, logLevel);
                    if (team && team.members.length === targetSize) {
                        teams.push(team);
                        team.members.forEach(member => {
                            const index = remaining.findIndex(p => p.id === member.id);
                            if (index !== -1) {
                                remaining.splice(index, 1);
                            }
                        });
                        teamFormed = true;
                        if (logLevel === 'verbose') {
                            console.log(`Formed flexible team of size ${targetSize}`);
                        }
                        break;
                    }
                }
            }
        }
        if (!teamFormed) {
            break;
        }
    }
    return createMatchingResult(participants, teams, remaining);
}
function tryEmergencyMatching(participants, logLevel) {
    if (logLevel === 'verbose') {
        console.log(`Emergency matching for ${participants.length} participants - minimal constraints`);
    }
    const teams = [];
    const remaining = [...participants];
    remaining.sort((a, b) => {
        const aCaseCount = a.casePreferences.length;
        const bCaseCount = b.casePreferences.length;
        return bCaseCount - aCaseCount;
    });
    while (remaining.length >= 2) {
        const teamSize = Math.min(remaining.length, 4);
        const teamMembers = remaining.splice(0, teamSize);
        if (teamMembers.length >= 2) {
            const team = createEmergencyTeam(teamMembers);
            teams.push(team);
            if (logLevel === 'verbose') {
                console.log(`Emergency team formed with ${teamMembers.length} members`);
            }
        }
    }
    return createMatchingResult(participants, teams, remaining);
}
function buildFlexibleTeam(candidates, targetSize, logLevel) {
    if (candidates.length < targetSize)
        return null;
    const team = [candidates[0]];
    const remaining = candidates.slice(1);
    if (logLevel === 'verbose') {
        console.log(`Building flexible team of size ${targetSize} with anchor: ${candidates[0].fullName}`);
    }
    while (team.length < targetSize && remaining.length > 0) {
        let bestCandidate = null;
        let bestScore = -1;
        for (const candidate of remaining) {
            const score = calculateFlexibleCompatibilityScore(team, candidate);
            if (score > bestScore) {
                bestScore = score;
                bestCandidate = candidate;
            }
        }
        if (bestCandidate) {
            team.push(bestCandidate);
            const index = remaining.findIndex(p => p.id === bestCandidate.id);
            remaining.splice(index, 1);
            if (logLevel === 'verbose') {
                console.log(`Added ${bestCandidate.fullName} to flexible team (score: ${bestScore.toFixed(1)})`);
            }
        }
        else {
            break;
        }
    }
    return team.length === targetSize ? createFlexibleTeamObject(team) : null;
}
function calculateFlexibleCompatibilityScore(team, candidate) {
    let score = 0;
    const teamCaseTypes = new Set(team.flatMap(p => p.casePreferences));
    const candidateCaseTypes = new Set(candidate.casePreferences);
    const caseOverlap = [...teamCaseTypes].filter(type => candidateCaseTypes.has(type)).length;
    score += caseOverlap * 10;
    const teamSkills = new Set(team.flatMap(p => p.coreStrengths));
    const candidateSkills = new Set(candidate.coreStrengths);
    const skillOverlap = [...teamSkills].filter(skill => candidateSkills.has(skill)).length;
    const uniqueSkills = candidate.coreStrengths.length - skillOverlap;
    score += uniqueSkills * 8;
    const teamAvailabilities = team.map(p => getAvailabilityLevel({ availability: p.availability }));
    const candidateAvailability = getAvailabilityLevel(candidate);
    const hasReasonableAvailability = teamAvailabilities.some(avail => avail === candidateAvailability ||
        (avail === 'Medium') ||
        (candidateAvailability === 'Medium'));
    if (hasReasonableAvailability) {
        score += 15;
    }
    const teamExperiences = team.map(p => p.experience);
    if (!teamExperiences.includes(candidate.experience)) {
        score += 12;
    }
    return score;
}
function createFlexibleTeamObject(members) {
    const teamId = `flexible-team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const compatibilityScore = 75;
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
    const sizeMatch = Math.max(0, 100 - Math.abs(avgPreferredSize - members.length) * 20);
    return {
        id: teamId,
        members,
        skillVector: [],
        compatibilityScore,
        teamSize: members.length,
        averageExperience: avgExperience,
        commonCaseTypes: commonCaseTypes.length > 0 ? commonCaseTypes : ['Consulting'],
        workStyleCompatibility: 'Flexible matching optimized',
        preferredTeamSizeMatch: sizeMatch
    };
}
function createEmergencyTeam(members) {
    const teamId = `emergency-team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const compatibilityScore = 60;
    const allCaseTypes = members.flatMap(m => m.casePreferences);
    const commonCaseTypes = [...new Set(allCaseTypes)].slice(0, 3);
    const experienceValues = { 'None': 0, 'Participated in 1–2': 1, 'Participated in 3+': 2, 'Finalist/Winner in at least one': 3 };
    const avgExperience = members.reduce((sum, m) => sum + experienceValues[m.experience], 0) / members.length;
    return {
        id: teamId,
        members,
        skillVector: [],
        compatibilityScore,
        teamSize: members.length,
        averageExperience: avgExperience,
        commonCaseTypes: commonCaseTypes.length > 0 ? commonCaseTypes : ['Consulting'],
        workStyleCompatibility: 'Emergency matching - basic compatibility',
        preferredTeamSizeMatch: 50
    };
}
function createMatchingResult(originalParticipants, teams, unmatched) {
    const totalParticipants = originalParticipants.length;
    const matchedParticipants = totalParticipants - unmatched.length;
    const matchingEfficiency = totalParticipants > 0 ? (matchedParticipants / totalParticipants) * 100 : 0;
    const averageTeamSize = teams.length > 0 ? matchedParticipants / teams.length : 0;
    const teamSizeDistribution = teams.reduce((acc, team) => {
        acc[team.teamSize] = (acc[team.teamSize] || 0) + 1;
        return acc;
    }, {});
    const caseTypeDistribution = teams.reduce((acc, team) => {
        team.commonCaseTypes.forEach(caseType => {
            acc[caseType] = (acc[caseType] || 0) + 1;
        });
        return acc;
    }, {});
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
function getIterativeMatchingStats(result) {
    return {
        totalIterations: result.iterations,
        totalTeamsFormed: result.teams.length,
        totalParticipantsMatched: result.statistics.totalParticipants - result.unmatched.length,
        finalEfficiency: result.statistics.matchingEfficiency,
        iterationBreakdown: result.iterationHistory,
        averageIterationEfficiency: result.iterationHistory.length > 0
            ? result.iterationHistory.reduce((sum, hist) => sum + hist.efficiency, 0) / result.iterationHistory.length
            : 0,
        bestIteration: result.iterationHistory.length > 0
            ? result.iterationHistory.reduce((best, current) => current.efficiency > best.efficiency ? current : best)
            : null,
        worstIteration: result.iterationHistory.length > 0
            ? result.iterationHistory.reduce((worst, current) => current.efficiency < worst.efficiency ? current : worst)
            : null
    };
}
