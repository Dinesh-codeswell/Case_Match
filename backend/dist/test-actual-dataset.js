"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = require("./csv-parser");
const matchmaking_1 = require("./matchmaking");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function testActualDataset() {
    try {
        const csvPath = path.join(__dirname, '../../case_comp_team_dataset.csv');
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        console.log('Testing with actual case_comp_team_dataset.csv...');
        const participants = await (0, csv_parser_1.parseCSVToParticipants)(csvData);
        console.log(`Parsed ${participants.length} participants from actual dataset`);
        console.log('\nSample participants:');
        participants.slice(0, 3).forEach((participant, index) => {
            console.log(`\nParticipant ${index + 1}:`);
            console.log(`  Name: ${participant.fullName}`);
            console.log(`  College: ${participant.collegeName}`);
            console.log(`  Year: ${participant.currentYear}`);
            console.log(`  Core Strengths: ${participant.coreStrengths.join(', ')}`);
            console.log(`  Preferred Roles: ${participant.preferredRoles.join(', ')}`);
            console.log(`  Case Preferences: ${participant.casePreferences.join(', ')}`);
            console.log(`  Preferred Team Size: ${participant.preferredTeamSize}`);
            console.log(`  Experience: ${participant.experience}`);
            console.log(`  Availability: ${participant.availability}`);
        });
        console.log('\nRunning anti-bias matching algorithm...');
        const result = (0, matchmaking_1.matchParticipantsToTeams)(participants);
        console.log('\n=== Matching Results ===');
        console.log(`Total Participants: ${result.statistics.totalParticipants}`);
        console.log(`Teams Formed: ${result.statistics.teamsFormed}`);
        console.log(`Average Team Size: ${result.statistics.averageTeamSize.toFixed(1)}`);
        console.log(`Matching Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
        console.log(`Team Size Distribution:`, result.statistics.teamSizeDistribution);
        console.log(`Case Type Distribution:`, result.statistics.caseTypeDistribution);
        result.teams.forEach((team, index) => {
            console.log(`\nTeam ${index + 1} (Compatibility: ${team.compatibilityScore.toFixed(1)}%):`);
            team.members.forEach(member => {
                console.log(`  - ${member.fullName} (${member.currentYear})`);
                console.log(`    College: ${member.collegeName}`);
                console.log(`    Skills: ${member.coreStrengths.join(', ')}`);
                console.log(`    Roles: ${member.preferredRoles.join(', ')}`);
                console.log(`    Experience: ${member.experience}`);
                console.log(`    Availability: ${member.availability}`);
            });
            console.log(`  Common Case Types: ${team.commonCaseTypes.join(', ')}`);
            console.log(`  Work Style: ${team.workStyleCompatibility}`);
            console.log(`  Average Experience: ${team.averageExperience.toFixed(1)}`);
        });
        if (result.unmatched.length > 0) {
            console.log('\nUnmatched Participants:');
            result.unmatched.forEach(participant => {
                console.log(`  - ${participant.fullName} (${participant.currentYear}) from ${participant.collegeName}`);
            });
        }
        console.log('\nFull algorithm test completed successfully!');
    }
    catch (error) {
        console.error('Error testing actual dataset:', error);
    }
}
testActualDataset();
