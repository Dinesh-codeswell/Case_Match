"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testHierarchicalAlgorithm = testHierarchicalAlgorithm;
const matchmaking_1 = require("./matchmaking");
const sampleParticipants = [
    {
        id: '1',
        fullName: 'Alice Johnson',
        email: 'alice@college.edu',
        whatsappNumber: '+1234567890',
        collegeName: 'Engineering College',
        currentYear: 'Third Year',
        coreStrengths: ['Strategy & Structuring', 'Data Analysis & Research', 'Public Speaking & Pitching'],
        preferredRoles: ['Team Lead', 'Presenter'],
        workingStyle: ['I like owning a task from start to finish'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Fully Available (10–15 hrs/week)',
        experience: 'Participated in 3+',
        workStyle: 'Structured meetings and deadlines',
        casePreferences: ['Consulting', 'Product/Tech']
    },
    {
        id: '2',
        fullName: 'Bob Smith',
        email: 'bob@college.edu',
        whatsappNumber: '+1234567891',
        collegeName: 'Business School',
        currentYear: 'Second Year',
        coreStrengths: ['Financial Modeling', 'Market Research', 'Time Management & Coordination'],
        preferredRoles: ['Data Analyst', 'Researcher'],
        workingStyle: ['I prefer clearly divided responsibilities'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Fully Available (10–15 hrs/week)',
        experience: 'Participated in 1–2',
        workStyle: 'Structured meetings and deadlines',
        casePreferences: ['Finance', 'Consulting']
    },
    {
        id: '3',
        fullName: 'Carol Davis',
        email: 'carol@college.edu',
        whatsappNumber: '+1234567892',
        collegeName: 'Design Institute',
        currentYear: 'Final Year',
        coreStrengths: ['UI/UX or Product Thinking', 'Storytelling', 'Presentation Design (PPT/Canva)'],
        preferredRoles: ['Designer', 'Presenter'],
        workingStyle: ['I enjoy brainstorming and team sessions'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Moderately Available (5–10 hrs/week)',
        experience: 'Finalist/Winner in at least one',
        workStyle: 'Flexible work with async updates',
        casePreferences: ['Product/Tech', 'Marketing']
    },
    {
        id: '4',
        fullName: 'David Wilson',
        email: 'david@college.edu',
        whatsappNumber: '+1234567893',
        collegeName: 'Engineering College',
        currentYear: 'Third Year',
        coreStrengths: ['Innovation & Ideation', 'Technical (Coding, App Dev, Automation)', 'Time Management & Coordination'],
        preferredRoles: ['Coordinator', 'Flexible with any role'],
        workingStyle: ['I prefer working independently with regular updates'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Fully Available (10–15 hrs/week)',
        experience: 'Participated in 1–2',
        workStyle: 'Combination of both',
        casePreferences: ['Product/Tech', 'Operations/Supply Chain']
    },
    {
        id: '5',
        fullName: 'Emma Brown',
        email: 'emma@mba.edu',
        whatsappNumber: '+1234567894',
        collegeName: 'MBA School',
        currentYear: 'PG/MBA (1st Year)',
        coreStrengths: ['Strategy & Structuring', 'Financial Modeling', 'Public Speaking & Pitching'],
        preferredRoles: ['Team Lead', 'Presenter'],
        workingStyle: ['I like representing and presenting for the team'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Fully Available (10–15 hrs/week)',
        experience: 'Finalist/Winner in at least one',
        workStyle: 'Structured meetings and deadlines',
        casePreferences: ['Consulting', 'Finance']
    },
    {
        id: '6',
        fullName: 'Frank Miller',
        email: 'frank@mba.edu',
        whatsappNumber: '+1234567895',
        collegeName: 'MBA School',
        currentYear: 'PG/MBA (2nd Year)',
        coreStrengths: ['Data Analysis & Research', 'Market Research', 'Time Management & Coordination'],
        preferredRoles: ['Data Analyst', 'Researcher'],
        workingStyle: ['I prefer backstage roles but ensure high-quality input'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Moderately Available (5–10 hrs/week)',
        experience: 'Participated in 3+',
        workStyle: 'Flexible work with async updates',
        casePreferences: ['Marketing', 'Social Impact']
    },
    {
        id: '7',
        fullName: 'Grace Lee',
        email: 'grace@mba.edu',
        whatsappNumber: '+1234567896',
        collegeName: 'MBA School',
        currentYear: 'PG/MBA (1st Year)',
        coreStrengths: ['UI/UX or Product Thinking', 'Storytelling', 'Innovation & Ideation'],
        preferredRoles: ['Designer', 'Flexible with any role'],
        workingStyle: ['I enjoy brainstorming and team sessions'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Fully Available (10–15 hrs/week)',
        experience: 'Participated in 1–2',
        workStyle: 'Combination of both',
        casePreferences: ['Product/Tech', 'Marketing']
    },
    {
        id: '8',
        fullName: 'Henry Chen',
        email: 'henry@mba.edu',
        whatsappNumber: '+1234567897',
        collegeName: 'MBA School',
        currentYear: 'PG/MBA (2nd Year)',
        coreStrengths: ['Technical (Coding, App Dev, Automation)', 'Data Analysis & Research', 'Presentation Design (PPT/Canva)'],
        preferredRoles: ['Coordinator', 'Data Analyst'],
        workingStyle: ['I prefer clearly divided responsibilities'],
        idealTeamStructure: 'Diverse roles and specializations',
        lookingFor: 'Build a new team from scratch',
        availability: 'Moderately Available (5–10 hrs/week)',
        experience: 'Participated in 3+',
        workStyle: 'Structured meetings and deadlines',
        casePreferences: ['Product/Tech', 'Operations/Supply Chain']
    }
];
function testHierarchicalAlgorithm() {
    console.log('=== Testing Hierarchical Team Matching Algorithm ===\n');
    console.log('Sample Participants:');
    sampleParticipants.forEach((participant, index) => {
        console.log(`${index + 1}. ${participant.fullName} (${participant.currentYear})`);
        console.log(`   Skills: ${participant.coreStrengths.join(', ')}`);
        console.log(`   Roles: ${participant.preferredRoles.join(', ')}`);
        console.log(`   Experience: ${participant.experience}`);
        console.log(`   Availability: ${participant.availability}`);
        console.log(`   Case Types: ${participant.casePreferences.join(', ')}\n`);
    });
    const result = (0, matchmaking_1.matchParticipantsToTeams)(sampleParticipants);
    console.log('=== Matching Results ===\n');
    result.teams.forEach((team, index) => {
        console.log(`Team ${index + 1} (Compatibility: ${team.compatibilityScore.toFixed(1)}%):`);
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
        console.log('');
    });
    if (result.unmatched.length > 0) {
        console.log('Unmatched Participants:');
        result.unmatched.forEach(participant => {
            console.log(`  - ${participant.fullName} (${participant.currentYear})`);
        });
        console.log('');
    }
    console.log('=== Statistics ===');
    console.log(`Total Participants: ${result.statistics.totalParticipants}`);
    console.log(`Teams Formed: ${result.statistics.teamsFormed}`);
    console.log(`Average Team Size: ${result.statistics.averageTeamSize.toFixed(1)}`);
    console.log(`Matching Efficiency: ${result.statistics.matchingEfficiency.toFixed(1)}%`);
    return result;
}
if (require.main === module) {
    testHierarchicalAlgorithm();
}
