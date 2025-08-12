import fs from 'fs';
import path from 'path';
import { matchParticipantsToTeams } from './matchmaking';
import { parseCSVToParticipants } from './csv-parser';
import { Participant } from './types';

async function testAPIWithSampleCSV() {
  try {
    console.log('Testing API with sample CSV file...');
    
    // Read the sample CSV file
    const csvPath = path.join(__dirname, '../../sample_participants.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('CSV data loaded, length:', csvData.length);
    
    // Parse participants
    const participants = await parseCSVToParticipants(csvData);
    console.log(`Parsed ${participants.length} participants from CSV`);
    
    if (participants.length === 0) {
      console.error('No participants parsed from CSV');
      return;
    }
    
    // Display first few participants
    participants.slice(0, 3).forEach((participant: Participant, index: number) => {
      console.log(`\nParticipant ${index + 1}:`);
      console.log(`  Name: ${participant.fullName}`);
      console.log(`  Email: ${participant.email}`);
      console.log(`  Year: ${participant.currentYear}`);
      console.log(`  Skills: ${participant.coreStrengths.join(', ')}`);
      console.log(`  Roles: ${participant.preferredRoles.join(', ')}`);
      console.log(`  Experience: ${participant.experience}`);
      console.log(`  Availability: ${participant.availability}`);
      console.log(`  Case Types: ${participant.casePreferences.join(', ')}`);
    });
    
    // Run matching algorithm
    console.log('\nRunning matching algorithm...');
    const result = matchParticipantsToTeams(participants);
    
    // Display results
    console.log('\n=== Matching Results ===');
    console.log(`Total Participants: ${result.statistics.totalParticipants}`);
    console.log(`Teams Formed: ${result.statistics.teamsFormed}`);
    console.log(`Average Team Size: ${result.statistics.averageTeamSize.toFixed(1)}`);
    console.log(`Matching Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
    
    result.teams.forEach((team, index) => {
      console.log(`\nTeam ${index + 1} (Compatibility: ${team.compatibilityScore.toFixed(1)}%):`);
      team.members.forEach(member => {
        console.log(`  - ${member.fullName} (${member.currentYear})`);
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
        console.log(`  - ${participant.fullName} (${participant.currentYear})`);
      });
    }
    
    console.log('\nAPI test completed successfully!');
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testAPIWithSampleCSV(); 