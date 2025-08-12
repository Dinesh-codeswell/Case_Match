import { parseCSVToParticipants } from './csv-parser';
import { runIterativeMatching } from './iterativeMatchmaking';
import fs from 'fs';

async function testIterativeMatching() {
  try {
    console.log('=== Testing Iterative Matching ===\n');
    
    // Test with the sample CSV data
    const csvData = fs.readFileSync('../Testing/team_match_dataset_10_entries.csv', 'utf-8');
    console.log('Loading test data...');
    
    const participants = await parseCSVToParticipants(csvData);
    console.log(`Loaded ${participants.length} participants\n`);
    
    // Run iterative matching
    const result = runIterativeMatching(participants, {
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
    
  } catch (error) {
    console.error('Error testing iterative matching:', error);
  }
}

testIterativeMatching();