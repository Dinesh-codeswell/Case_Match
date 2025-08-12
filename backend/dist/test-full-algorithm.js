"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const matchmaking_1 = require("./matchmaking");
const csv_parser_1 = require("./csv-parser");
async function testFullAlgorithm() {
    try {
        console.log('Testing full algorithm with sample CSV...');
        const csvPath = path_1.default.join(__dirname, '../../sample_participants.csv');
        const csvData = fs_1.default.readFileSync(csvPath, 'utf-8');
        console.log('CSV data loaded, length:', csvData.length);
        const participants = await (0, csv_parser_1.parseCSVToParticipants)(csvData);
        console.log(`\nParsed ${participants.length} participants from CSV`);
        if (participants.length === 0) {
            console.error('No participants parsed from CSV');
            return;
        }
        console.log('\nRunning hierarchical matching algorithm...');
        const result = (0, matchmaking_1.matchParticipantsToTeams)(participants);
        console.log('\n=== Matching Results ===');
        console.log(`Total Participants: ${result.statistics.totalParticipants}`);
        console.log(`Teams Formed: ${result.statistics.teamsFormed}`);
        console.log(`Average Team Size: ${result.statistics.averageTeamSize.toFixed(1)}`);
        console.log(`Matching Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
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
        console.error('Error testing full algorithm:', error);
    }
}
testFullAlgorithm();
