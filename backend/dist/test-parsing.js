"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = require("./csv-parser");
const fs_1 = __importDefault(require("fs"));
async function testParsing() {
    try {
        const csvData = fs_1.default.readFileSync('../Testing/team_match_dataset_10_entries.csv', 'utf-8');
        console.log('CSV Data Preview:');
        console.log(csvData.substring(0, 300) + '...\n');
        const participants = await (0, csv_parser_1.parseCSVToParticipants)(csvData);
        console.log(`Parsed ${participants.length} participants:\n`);
        participants.forEach((participant, index) => {
            console.log(`${index + 1}. ${participant.fullName}`);
            console.log(`   Email: ${participant.email}`);
            console.log(`   College: ${participant.collegeName}`);
            console.log(`   Year: ${participant.currentYear}`);
            console.log(`   Core Strengths: ${participant.coreStrengths.join(', ')}`);
            console.log(`   Preferred Roles: ${participant.preferredRoles.join(', ')}`);
            console.log(`   Working Style: ${participant.workingStyle.join(', ')}`);
            console.log(`   Ideal Team Structure: ${participant.idealTeamStructure}`);
            console.log(`   Looking For: ${participant.lookingFor}`);
            console.log(`   Availability: ${participant.availability}`);
            console.log(`   Experience: ${participant.experience}`);
            console.log(`   Work Style: ${participant.workStyle}`);
            console.log(`   Case Preferences: ${participant.casePreferences.join(', ')}`);
            console.log(`   Preferred Team Size: ${participant.preferredTeamSize}`);
            console.log('');
        });
    }
    catch (error) {
        console.error('Error testing parsing:', error);
    }
}
testParsing();
