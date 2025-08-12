import { parseCSVToParticipants } from './csv-parser';
import fs from 'fs';

async function testParsing() {
  try {
    // Test with the sample CSV data
    const csvData = fs.readFileSync('../Testing/team_match_dataset_10_entries.csv', 'utf-8');
    console.log('CSV Data Preview:');
    console.log(csvData.substring(0, 300) + '...\n');
    
    const participants = await parseCSVToParticipants(csvData);
    
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
    
  } catch (error) {
    console.error('Error testing parsing:', error);
  }
}

testParsing();