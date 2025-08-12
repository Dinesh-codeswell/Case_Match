import { parseCSVToParticipants } from './csv-parser';
import { matchParticipantsToTeams } from './matchmaking';
import * as fs from 'fs';
import * as path from 'path';

async function testActualDataset() {
  try {
    // Read the actual dataset
    const csvPath = path.join(__dirname, '../../case_comp_team_dataset.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('Testing with actual case_comp_team_dataset.csv...');
    
    // Parse the CSV
    const participants = await parseCSVToParticipants(csvData);
    console.log(`Parsed ${participants.length} participants from actual dataset`);
    
    // Log some sample participants to verify parsing
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
    
    // Run the matching algorithm
    console.log('\nRunning anti-bias matching algorithm...');
    const result = matchParticipantsToTeams(participants);
    
    // Display results
    console.log('\n=== Matching Results ===');
    console.log(`Total Participants: ${result.statistics.totalParticipants}`);
    console.log(`Teams Formed: ${result.statistics.teamsFormed}`);
    console.log(`Average Team Size: ${result.statistics.averageTeamSize.toFixed(1)}`);
    console.log(`Matching Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
    console.log(`Team Size Distribution:`, result.statistics.teamSizeDistribution);
    console.log(`Case Type Distribution:`, result.statistics.caseTypeDistribution);
    
    // Display teams
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
    
    // Display unmatched participants
    if (result.unmatched.length > 0) {
      console.log('\nUnmatched Participants:');
      result.unmatched.forEach(participant => {
        console.log(`  - ${participant.fullName} (${participant.currentYear}) from ${participant.collegeName}`);
      });
    }
    
    console.log('\nFull algorithm test completed successfully!');
    
  } catch (error) {
    console.error('Error testing actual dataset:', error);
  }
}

testActualDataset(); 