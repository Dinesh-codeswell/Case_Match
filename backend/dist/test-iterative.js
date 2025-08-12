"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = require("./csv-parser");
const iterativeMatchmaking_1 = require("./iterativeMatchmaking");
const fs_1 = __importDefault(require("fs"));
async function testIterativeMatching() {
    try {
        console.log('=== Testing Iterative Matching ===\n');
        const csvData = fs_1.default.readFileSync('../Testing/team_match_dataset_10_entries.csv', 'utf-8');
        console.log('Loading test data...');
        const participants = await (0, csv_parser_1.parseCSVToParticipants)(csvData);
        console.log(`Loaded ${participants.length} participants\n`);
        const result = (0, iterativeMatchmaking_1.runIterativeMatching)(participants, {
            maxIterations: participants.length,
            minParticipantsPerIteration: 2,
            logLevel: 'detailed'
        });
        console.log('\n=== Final Results ===');
        console.log(`Total iterations: ${result.iterations}`);
        console.log(`Teams formed: ${result.teams.length}`);
        console.log(`Participants matched: ${result.statistics.totalParticipants - result.unmatched.length}/${result.statistics.totalParticipants}`);
        console.log(`Final efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
        console.log(`Unmatched participants: ${result.unmatched.length}`);
        if (result.unmatched.length > 0) {
            console.log('\nUnmatched participants:');
            result.unmatched.forEach(p => {
                console.log(`- ${p.fullName} (${p.currentYear}, prefers team size ${p.preferredTeamSize})`);
            });
        }
        console.log('\nTeam breakdown:');
        result.teams.forEach((team, index) => {
            console.log(`Team ${index + 1}: ${team.members.length} members, compatibility: ${team.compatibilityScore.toFixed(1)}%`);
            team.members.forEach(member => {
                console.log(`  - ${member.fullName} (${member.currentYear})`);
            });
        });
    }
    catch (error) {
        console.error('Error testing iterative matching:', error);
    }
}
testIterativeMatching();
