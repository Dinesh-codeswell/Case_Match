"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = require("./csv-parser");
async function testCSVParsing() {
    try {
        console.log('Testing CSV parsing...');
        const csvPath = path_1.default.join(__dirname, '../../sample_participants.csv');
        const csvData = fs_1.default.readFileSync(csvPath, 'utf-8');
        console.log('CSV data loaded, length:', csvData.length);
        console.log('First 200 characters:', csvData.substring(0, 200));
        const participants = await (0, csv_parser_1.parseCSVToParticipants)(csvData);
        console.log(`\nParsed ${participants.length} participants from CSV`);
        if (participants.length === 0) {
            console.error('No participants parsed from CSV');
            return;
        }
        participants.forEach((participant, index) => {
            console.log(`\nParticipant ${index + 1}:`);
            console.log(`  Name: "${participant.fullName}"`);
            console.log(`  Email: "${participant.email}"`);
            console.log(`  College: "${participant.collegeName}"`);
            console.log(`  Year: "${participant.currentYear}"`);
            console.log(`  Skills: ${participant.coreStrengths.join(', ')}`);
            console.log(`  Roles: ${participant.preferredRoles.join(', ')}`);
            console.log(`  Experience: ${participant.experience}`);
            console.log(`  Availability: ${participant.availability}`);
            console.log(`  Case Types: ${participant.casePreferences.join(', ')}`);
        });
        console.log('\nCSV parsing test completed!');
    }
    catch (error) {
        console.error('Error testing CSV parsing:', error);
    }
}
testCSVParsing();
