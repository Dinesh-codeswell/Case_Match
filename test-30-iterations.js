// Test the enhanced 30-iteration matching using the API route
const fs = require('fs');

// Create a test CSV with challenging matching scenarios
const testCSV = `Full Name,Email ID,WhatsApp Number,College Name,Current Year of Study,Top 3 Core Strengths,Preferred Role(s),Working Style Preferences,Ideal Team Structure,Looking For,Availability (next 2–4 weeks),Previous Case Comp Experience,Work Style,Case Comp Preferences,Preferred Team Size,Who do you want on your team?
Alice Johnson,alice@test.com,+1234567890,MIT,Third Year,Research;Modeling;Pitching,Team Lead,I enjoy brainstorming and team sessions,Diverse roles and specializations,Build a new team from scratch,Fully Available (10–15 hrs/week),Participated in 3+,Combination of both,Consulting;Finance,4,Either UG or PG
Bob Smith,bob@test.com,+1234567891,Stanford,Second Year,Design;Pitching;Coordination,Designer,I prefer clearly divided responsibilities,Diverse roles and specializations,Build a new team from scratch,Moderately Available (5–10 hrs/week),Participated in 1–2,Structured meetings and deadlines,Marketing;Product/Tech,4,Either UG or PG
Carol Davis,carol@test.com,+1234567892,Harvard,Final Year,Coordination;Storytelling;Markets,Coordinator,I like owning a task from start to finish,Similar skillsets across all members,Join an existing team,Fully Available (10–15 hrs/week),Finalist/Winner in at least one,Flexible work with async updates,Social Impact;Operations/Supply Chain,4,Either UG or PG
David Wilson,david@test.com,+1234567893,UC Berkeley,First Year,Technical;Product;Ideation,Data Analyst,I prefer working independently with regular updates,Diverse roles and specializations,Open to both options,Lightly Available (1–4 hrs/week),None,Combination of both,Product/Tech;Finance,4,Either UG or PG
Eva Brown,eva@test.com,+1234567894,Yale,Second Year,Markets;Ideation;Research,Researcher,I enjoy brainstorming and team sessions,Diverse roles and specializations,Build a new team from scratch,Moderately Available (5–10 hrs/week),Participated in 1–2,Combination of both,Consulting;Marketing,3,Either UG or PG
Frank Miller,frank@test.com,+1234567895,Princeton,Third Year,Research;Coordination;Modeling,Team Lead,I like representing and presenting for the team,Similar skillsets across all members,Join an existing team,Fully Available (10–15 hrs/week),Participated in 3+,Structured meetings and deadlines,Finance;Public Policy/ESG,3,Either UG or PG
Grace Lee,grace@test.com,+1234567896,Columbia,Final Year,Pitching;Storytelling;Design,Presenter,I prefer backstage roles but ensure high-quality input,Flexible with any structure,Open to both options,Moderately Available (5–10 hrs/week),Finalist/Winner in at least one,Flexible work with async updates,Marketing;Social Impact,3,Either UG or PG
Henry Taylor,henry@test.com,+1234567897,NYU,Second Year,Design;Technical;Product,Designer,I enjoy brainstorming and team sessions,Diverse roles and specializations,Build a new team from scratch,Lightly Available (1–4 hrs/week),None,Combination of both,Product/Tech;Operations/Supply Chain,2,Either UG or PG
Ivy Chen,ivy@test.com,+1234567898,UCLA,First Year,Modeling;Markets;Coordination,Data Analyst,I prefer clearly divided responsibilities,Similar skillsets across all members,Join an existing team,Moderately Available (5–10 hrs/week),Participated in 1–2,Structured meetings and deadlines,Finance;Consulting,2,Either UG or PG
Jack Anderson,jack@test.com,+1234567899,Northwestern,Third Year,Coordination;Product;Storytelling,Coordinator,I like owning a task from start to finish,Diverse roles and specializations,Open to both options,Fully Available (10–15 hrs/week),Participated in 3+,Flexible work with async updates,Product/Tech;Marketing,3,Either UG or PG
Kate Rodriguez,kate@test.com,+1234567800,Duke,Final Year,Research;Pitching;Technical,Researcher,I prefer working independently with regular updates,Similar skillsets across all members,Build a new team from scratch,Lightly Available (1–4 hrs/week),Finalist/Winner in at least one,Combination of both,Consulting;Social Impact,4,Either UG or PG
Leo Martinez,leo@test.com,+1234567801,Georgetown,Second Year,Storytelling;Ideation;Markets,Presenter,I like representing and presenting for the team,Flexible with any structure,Join an existing team,Moderately Available (5–10 hrs/week),None,Structured meetings and deadlines,Marketing;Public Policy/ESG,3,Either UG or PG
Maya Patel,maya@test.com,+1234567802,Vanderbilt,First Year,Design;Coordination;Pitching,Designer,I enjoy brainstorming and team sessions,Diverse roles and specializations,Build a new team from scratch,Fully Available (10–15 hrs/week),Participated in 1–2,Combination of both,Product/Tech;Marketing,2,Either UG or PG
Noah Kim,noah@test.com,+1234567803,Rice,Third Year,Technical;Research;Modeling,Data Analyst,I prefer clearly divided responsibilities,Similar skillsets across all members,Join an existing team,Moderately Available (5–10 hrs/week),Participated in 3+,Structured meetings and deadlines,Finance;Product/Tech,4,Either UG or PG
Olivia Zhang,olivia@test.com,+1234567804,Emory,Final Year,Markets;Storytelling;Ideation,Researcher,I like owning a task from start to finish,Flexible with any structure,Open to both options,Lightly Available (1–4 hrs/week),Finalist/Winner in at least one,Flexible work with async updates,Consulting;Social Impact,3,Either UG or PG`;

// Write test CSV file
fs.writeFileSync('temp-30-iteration-test.csv', testCSV);

console.log('🚀 Enhanced 30-Iteration Matching Test');
console.log('=====================================\n');

console.log('✅ Created test CSV with 15 participants:');
console.log('   - 4 participants prefer team size 4');
console.log('   - 6 participants prefer team size 3');
console.log('   - 3 participants prefer team size 2');
console.log('   - 2 additional participants with size 4 and 2 preferences');
console.log('   - Mixed experience levels and availability');
console.log('   - Diverse skill sets and case preferences\n');

console.log('🎯 Expected Results with 30 Iterations:');
console.log('   - Should form 1 team of size 4 (4 participants)');
console.log('   - Should form 2 teams of size 3 (6 participants)');
console.log('   - Should form 1-2 teams of size 2 (2-4 participants)');
console.log('   - Should have 0-1 unmatched participants (significant improvement!)');
console.log('   - Should use progressive strategy relaxation across 30 iterations\n');

console.log('📋 Testing Strategy:');
console.log('   - Iterations 1-3: Strict matching (education level + exact team size)');
console.log('   - Iterations 4-8: Relaxed matching (±1 team size difference allowed)');
console.log('   - Iterations 9-12: Strategic regrouping');
console.log('   - Iterations 13-18: Alternative grouping strategies');
console.log('   - Iterations 19-25: Flexible team size matching');
console.log('   - Iterations 26-30: Emergency matching with minimal constraints\n');

console.log('🔧 To test the enhanced system:');
console.log('1. Start the development server: npm run dev');
console.log('2. Go to: http://localhost:3000/case-match');
console.log('3. Upload the temp-30-iteration-test.csv file');
console.log('4. Check the browser console for detailed iteration logs');
console.log('5. Verify that most/all participants are matched\n');

console.log('📊 Key Improvements to Verify:');
console.log('✓ 30 iterations maximum (increased from 10)');
console.log('✓ Progressive constraint relaxation');
console.log('✓ Better handling of unmatched students');
console.log('✓ Flexible team size matching in later iterations');
console.log('✓ Emergency matching as last resort');
console.log('✓ Detailed logging of each iteration strategy\n');

console.log('🎯 Success Criteria:');
console.log('   - Matching efficiency should be >90% (vs previous ~30%)');
console.log('   - Maximum 1-2 unmatched participants');
console.log('   - Teams should still maintain reasonable compatibility');
console.log('   - Progressive relaxation should be visible in logs\n');

console.log('📁 Test file created: temp-30-iteration-test.csv');
console.log('🧹 Remember to delete the test file after testing');

// Cleanup function
setTimeout(() => {
  try {
    fs.unlinkSync('temp-30-iteration-test.csv');
    console.log('\n🧹 Test file cleaned up automatically');
  } catch (err) {
    console.log('\n⚠️ Please manually delete temp-30-iteration-test.csv');
  }
}, 30000); // Clean up after 30 seconds