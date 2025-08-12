const { runIterativeMatching } = require('./backend/src/iterativeMatchmaking');

// Create test data with challenging matching scenarios
function createTestParticipants() {
  const participants = [
    // Group 1: 4 participants who prefer size 4 (should form 1 team)
    {
      id: '1', fullName: 'Alice Johnson', email: 'alice@test.com', whatsappNumber: '+1234567890',
      collegeName: 'MIT', currentYear: 'Third Year',
      coreStrengths: ['Research', 'Modeling'], preferredRoles: ['Team Lead'],
      workingStyle: ['I enjoy brainstorming and team sessions'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Build a new team from scratch',
      availability: 'Fully Available (10–15 hrs/week)',
      experience: 'Participated in 3+', workStyle: 'Combination of both',
      casePreferences: ['Consulting', 'Finance'], preferredTeamSize: 4,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '2', fullName: 'Bob Smith', email: 'bob@test.com', whatsappNumber: '+1234567891',
      collegeName: 'Stanford', currentYear: 'Second Year',
      coreStrengths: ['Design', 'Pitching'], preferredRoles: ['Designer'],
      workingStyle: ['I prefer clearly divided responsibilities'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Build a new team from scratch',
      availability: 'Moderately Available (5–10 hrs/week)',
      experience: 'Participated in 1–2', workStyle: 'Structured meetings and deadlines',
      casePreferences: ['Marketing', 'Product/Tech'], preferredTeamSize: 4,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '3', fullName: 'Carol Davis', email: 'carol@test.com', whatsappNumber: '+1234567892',
      collegeName: 'Harvard', currentYear: 'Final Year',
      coreStrengths: ['Coordination', 'Storytelling'], preferredRoles: ['Coordinator'],
      workingStyle: ['I like owning a task from start to finish'],
      idealTeamStructure: 'Similar skillsets across all members',
      lookingFor: 'Join an existing team',
      availability: 'Fully Available (10–15 hrs/week)',
      experience: 'Finalist/Winner in at least one', workStyle: 'Flexible work with async updates',
      casePreferences: ['Social Impact', 'Operations/Supply Chain'], preferredTeamSize: 4,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '4', fullName: 'David Wilson', email: 'david@test.com', whatsappNumber: '+1234567893',
      collegeName: 'UC Berkeley', currentYear: 'First Year',
      coreStrengths: ['Technical', 'Product'], preferredRoles: ['Data Analyst'],
      workingStyle: ['I prefer working independently with regular updates'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Open to both options',
      availability: 'Lightly Available (1–4 hrs/week)',
      experience: 'None', workStyle: 'Combination of both',
      casePreferences: ['Product/Tech', 'Finance'], preferredTeamSize: 4,
      teamPreference: 'Either UG or PG'
    },
    
    // Group 2: 3 participants who prefer size 3 (should form 1 team)
    {
      id: '5', fullName: 'Eva Brown', email: 'eva@test.com', whatsappNumber: '+1234567894',
      collegeName: 'Yale', currentYear: 'Second Year',
      coreStrengths: ['Markets', 'Ideation'], preferredRoles: ['Researcher'],
      workingStyle: ['I enjoy brainstorming and team sessions'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Build a new team from scratch',
      availability: 'Moderately Available (5–10 hrs/week)',
      experience: 'Participated in 1–2', workStyle: 'Combination of both',
      casePreferences: ['Consulting', 'Marketing'], preferredTeamSize: 3,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '6', fullName: 'Frank Miller', email: 'frank@test.com', whatsappNumber: '+1234567895',
      collegeName: 'Princeton', currentYear: 'Third Year',
      coreStrengths: ['Research', 'Coordination'], preferredRoles: ['Team Lead'],
      workingStyle: ['I like representing and presenting for the team'],
      idealTeamStructure: 'Similar skillsets across all members',
      lookingFor: 'Join an existing team',
      availability: 'Fully Available (10–15 hrs/week)',
      experience: 'Participated in 3+', workStyle: 'Structured meetings and deadlines',
      casePreferences: ['Finance', 'Public Policy/ESG'], preferredTeamSize: 3,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '7', fullName: 'Grace Lee', email: 'grace@test.com', whatsappNumber: '+1234567896',
      collegeName: 'Columbia', currentYear: 'Final Year',
      coreStrengths: ['Pitching', 'Storytelling'], preferredRoles: ['Presenter'],
      workingStyle: ['I prefer backstage roles but ensure high-quality input'],
      idealTeamStructure: 'Flexible with any structure',
      lookingFor: 'Open to both options',
      availability: 'Moderately Available (5–10 hrs/week)',
      experience: 'Finalist/Winner in at least one', workStyle: 'Flexible work with async updates',
      casePreferences: ['Marketing', 'Social Impact'], preferredTeamSize: 3,
      teamPreference: 'Either UG or PG'
    },
    
    // Group 3: 5 participants with mixed preferences (challenging case)
    {
      id: '8', fullName: 'Henry Taylor', email: 'henry@test.com', whatsappNumber: '+1234567897',
      collegeName: 'NYU', currentYear: 'Second Year',
      coreStrengths: ['Design', 'Technical'], preferredRoles: ['Designer'],
      workingStyle: ['I enjoy brainstorming and team sessions'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Build a new team from scratch',
      availability: 'Lightly Available (1–4 hrs/week)',
      experience: 'None', workStyle: 'Combination of both',
      casePreferences: ['Product/Tech', 'Operations/Supply Chain'], preferredTeamSize: 2,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '9', fullName: 'Ivy Chen', email: 'ivy@test.com', whatsappNumber: '+1234567898',
      collegeName: 'UCLA', currentYear: 'First Year',
      coreStrengths: ['Modeling', 'Markets'], preferredRoles: ['Data Analyst'],
      workingStyle: ['I prefer clearly divided responsibilities'],
      idealTeamStructure: 'Similar skillsets across all members',
      lookingFor: 'Join an existing team',
      availability: 'Moderately Available (5–10 hrs/week)',
      experience: 'Participated in 1–2', workStyle: 'Structured meetings and deadlines',
      casePreferences: ['Finance', 'Consulting'], preferredTeamSize: 2,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '10', fullName: 'Jack Anderson', email: 'jack@test.com', whatsappNumber: '+1234567899',
      collegeName: 'Northwestern', currentYear: 'Third Year',
      coreStrengths: ['Coordination', 'Product'], preferredRoles: ['Coordinator'],
      workingStyle: ['I like owning a task from start to finish'],
      idealTeamStructure: 'Diverse roles and specializations',
      lookingFor: 'Open to both options',
      availability: 'Fully Available (10–15 hrs/week)',
      experience: 'Participated in 3+', workStyle: 'Flexible work with async updates',
      casePreferences: ['Product/Tech', 'Marketing'], preferredTeamSize: 3,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '11', fullName: 'Kate Rodriguez', email: 'kate@test.com', whatsappNumber: '+1234567800',
      collegeName: 'Duke', currentYear: 'Final Year',
      coreStrengths: ['Research', 'Pitching'], preferredRoles: ['Researcher'],
      workingStyle: ['I prefer working independently with regular updates'],
      idealTeamStructure: 'Similar skillsets across all members',
      lookingFor: 'Build a new team from scratch',
      availability: 'Lightly Available (1–4 hrs/week)',
      experience: 'Finalist/Winner in at least one', workStyle: 'Combination of both',
      casePreferences: ['Consulting', 'Social Impact'], preferredTeamSize: 4,
      teamPreference: 'Either UG or PG'
    },
    {
      id: '12', fullName: 'Leo Martinez', email: 'leo@test.com', whatsappNumber: '+1234567801',
      collegeName: 'Georgetown', currentYear: 'Second Year',
      coreStrengths: ['Storytelling', 'Ideation'], preferredRoles: ['Presenter'],
      workingStyle: ['I like representing and presenting for the team'],
      idealTeamStructure: 'Flexible with any structure',
      lookingFor: 'Join an existing team',
      availability: 'Moderately Available (5–10 hrs/week)',
      experience: 'None', workStyle: 'Structured meetings and deadlines',
      casePreferences: ['Marketing', 'Public Policy/ESG'], preferredTeamSize: 3,
      teamPreference: 'Either UG or PG'
    }
  ];
  
  return participants;
}

console.log('🚀 Testing Enhanced 30-Iteration Matching System...\n');

const participants = createTestParticipants();
console.log(`✅ Created ${participants.length} test participants`);
console.log('   - 4 participants prefer team size 4');
console.log('   - 4 participants prefer team size 3'); 
console.log('   - 2 participants prefer team size 2');
console.log('   - 2 participants with mixed preferences');

console.log('\n🎯 Running 30-iteration matching with progressive strategy relaxation...\n');

const result = runIterativeMatching(participants, {
  maxIterations: 30,
  minParticipantsPerIteration: 2,
  logLevel: 'detailed'
});

console.log('\n📊 FINAL RESULTS:');
console.log(`Total iterations run: ${result.iterations}`);
console.log(`Teams formed: ${result.teams.length}`);
console.log(`Participants matched: ${result.statistics.totalParticipants - result.unmatched.length}/${result.statistics.totalParticipants}`);
console.log(`Final efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
console.log(`Unmatched participants: ${result.unmatched.length}`);

if (result.unmatched.length > 0) {
  console.log('\n❌ Unmatched participants:');
  result.unmatched.forEach(p => {
    console.log(`   - ${p.fullName} (prefers size ${p.preferredTeamSize}, availability: ${p.availability})`);
  });
}

console.log('\n🏆 Teams formed:');
result.teams.forEach((team, index) => {
  console.log(`   Team ${index + 1} (${team.teamSize} members, compatibility: ${team.compatibilityScore.toFixed(1)}%):`);
  team.members.forEach(member => {
    console.log(`     - ${member.fullName} (preferred size: ${member.preferredTeamSize})`);
  });
});

console.log('\n📈 Iteration History:');
result.iterationHistory.forEach(hist => {
  console.log(`   Iteration ${hist.iteration}: ${hist.participantsMatched}/${hist.participantsProcessed} matched (${hist.efficiency.toFixed(1)}%) - ${hist.remainingUnmatched} remaining`);
});

const avgEfficiency = result.iterationHistory.length > 0 
  ? result.iterationHistory.reduce((sum, hist) => sum + hist.efficiency, 0) / result.iterationHistory.length 
  : 0;

console.log(`\n📊 Average iteration efficiency: ${avgEfficiency.toFixed(1)}%`);
console.log(`🎯 Expected improvement: Should have fewer unmatched participants with 30 iterations and progressive relaxation`);