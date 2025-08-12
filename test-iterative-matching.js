// Test the enhanced iterative matching functionality
const fs = require('fs');

// Simple test data
const testCSV = `Full Name,Email ID,WhatsApp Number,College Name,Current Year of Study,Top 3 Core Strengths,Preferred Role(s),Working Style Preferences,Ideal Team Structure,Looking For,Availability (next 2–4 weeks),Previous Case Comp Experience,Work Style,Case Comp Preferences,Preferred Team Size,Who do you want on your team?
Alice Johnson,alice@test.com,1111111111,MIT,Second Year,Research;Modeling,Team Lead,I enjoy brainstorming,Diverse roles,Build new team,Fully Available (10–15 hrs/week),Participated in 1–2,Combination of both,Consulting;Finance,4,Either UG or PG
Bob Smith,bob@test.com,2222222222,Stanford,Third Year,Modeling;Markets,Data Analyst,I prefer divided responsibilities,Diverse roles,Join existing,Moderately Available (5–10 hrs/week),Participated in 3+,Structured meetings,Finance;Consulting,4,Undergrads only
Carol Davis,carol@test.com,3333333333,Berkeley,Final Year,Product;Technical,Designer,I like owning tasks,Similar skillsets,Open to both,Lightly Available (1–4 hrs/week),None,Flexible work,Product/Tech;Marketing,4,Either UG or PG
David Wilson,david@test.com,4444444444,Harvard,First Year,Design;Pitching,Presenter,I enjoy brainstorming,Diverse roles,Build new team,Fully Available (10–15 hrs/week),Finalist/Winner,Combination of both,Marketing;Social Impact,4,Undergrads only
Eva Brown,eva@test.com,5555555555,Yale,Second Year,Ideation;Storytelling,Researcher,I prefer working independently,Flexible structure,Join existing,Moderately Available (5–10 hrs/week),Participated in 1–2,Combination of both,Social Impact;Consulting,3,Either UG or PG
Frank Miller,frank@test.com,6666666666,Princeton,Third Year,Coordination;Research,Coordinator,I enjoy brainstorming,Diverse roles,Build new team,Fully Available (10–15 hrs/week),Participated in 3+,Structured meetings,Consulting;Operations,3,Undergrads only
Grace Lee,grace@test.com,7777777777,Columbia,Final Year,Research;Modeling,Data Analyst,I prefer divided responsibilities,Similar skillsets,Open to both,Moderately Available (5–10 hrs/week),None,Flexible work,Finance;Product/Tech,3,Either UG or PG
Henry Taylor,henry@test.com,8888888888,Cornell,First Year,Pitching;Ideation,Presenter,I like representing team,Diverse roles,Build new team,Lightly Available (1–4 hrs/week),Participated in 1–2,Combination of both,Marketing;Consulting,2,Undergrads only
Iris Chen,iris@test.com,9999999999,Dartmouth,Second Year,Technical;Product,Designer,I prefer backstage roles,Similar skillsets,Join existing,Fully Available (10–15 hrs/week),Finalist/Winner,Flexible work,Product/Tech;Social Impact,2,Either UG or PG
Jack Anderson,jack@test.com,1010101010,Brown,Third Year,Markets;Storytelling,Researcher,I enjoy brainstorming,Flexible structure,Open to both,Moderately Available (5–10 hrs/week),Participated in 3+,Combination of both,Operations;Marketing,4,Undergrads only`;

console.log('🧪 Testing Enhanced Iterative Case Matching...\n');

// Write test CSV to a temporary file
fs.writeFileSync('temp-test.csv', testCSV);

console.log('✅ Test data created with 10 participants');
console.log('   - 4 participants prefer team size 4');
console.log('   - 3 participants prefer team size 3'); 
console.log('   - 2 participants prefer team size 2');
console.log('   - Mixed experience levels and skills');

console.log('\n📊 Expected Results:');
console.log('   - Should form 1 team of size 4 (4 participants)');
console.log('   - Should form 1 team of size 3 (3 participants)');
console.log('   - Should form 1 team of size 2 (2 participants)');
console.log('   - Should have 1 unmatched participant');
console.log('   - Should run up to 10 iterations to optimize matching');

console.log('\n🚀 To test manually:');
console.log('1. Start the development server: npm run dev');
console.log('2. Go to: http://localhost:3000/case-match');
console.log('3. Upload the temp-test.csv file');
console.log('4. Observe the console logs for iteration details');
console.log('5. Check that team size preferences are strictly followed');

console.log('\n📋 Key Features to Verify:');
console.log('✓ 10 iterations maximum');
console.log('✓ Strict team size preference adherence');
console.log('✓ Education level separation (all UG in this test)');
console.log('✓ Unmatched participants processed in each iteration');
console.log('✓ Enhanced compatibility scoring');
console.log('✓ Detailed console logging of the matching process');

// Clean up
setTimeout(() => {
  if (fs.existsSync('temp-test.csv')) {
    fs.unlinkSync('temp-test.csv');
    console.log('\n🧹 Cleaned up test file');
  }
}, 1000);