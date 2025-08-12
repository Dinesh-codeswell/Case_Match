import fs from 'fs';
import path from 'path';
import { parseCSVToParticipants } from './csv-parser';

async function testCSVParsing() {
  try {
    console.log('Testing CSV parsing...');
    
    // Read the sample CSV file
    const csvPath = path.join(__dirname, '../../sample_participants.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('CSV data loaded, length:', csvData.length);
    console.log('First 200 characters:', csvData.substring(0, 200));
    
    // Parse participants
    const participants = await parseCSVToParticipants(csvData);
    console.log(`\nParsed ${participants.length} participants from CSV`);
    
    if (participants.length === 0) {
      console.error('No participants parsed from CSV');
      return;
    }
    
    // Display all participants
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
    
  } catch (error) {
    console.error('Error testing CSV parsing:', error);
  }
}

// Run the test
testCSVParsing(); 