export interface Participant {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  collegeName: string;
  currentYear: 'First Year' | 'Second Year' | 'Third Year' | 'Final Year' | 'PG/MBA (1st Year)' | 'PG/MBA (2nd Year)';
  coreStrengths: CoreStrength[];
  preferredRoles: PreferredRole[];
  workingStyle: WorkingStyle[];
  idealTeamStructure: 'Similar skillsets across all members' | 'Diverse roles and specializations' | 'Flexible with any structure';
  lookingFor: 'Build a new team from scratch' | 'Join an existing team' | 'Open to both options';
  availability: 'Fully Available (10–15 hrs/week)' | 'Moderately Available (5–10 hrs/week)' | 'Lightly Available (1–4 hrs/week)' | 'Not available now, but interested later';
  experience: 'None' | 'Participated in 1–2' | 'Participated in 3+' | 'Finalist/Winner in at least one';
  workStyle: 'Structured meetings and deadlines' | 'Flexible work with async updates' | 'Combination of both';
  casePreferences: CaseType[];
  preferredTeamSize: 2 | 3 | 4;
}

export type CoreStrength = 
  | 'Strategy & Structuring'
  | 'Data Analysis & Research'
  | 'Financial Modeling'
  | 'Market Research'
  | 'Presentation Design (PPT/Canva)'
  | 'Public Speaking & Pitching'
  | 'Time Management & Coordination'
  | 'Innovation & Ideation'
  | 'UI/UX or Product Thinking'
  | 'Storytelling'
  | 'Technical (Coding, App Dev, Automation)';

export type PreferredRole = 
  | 'Team Lead'
  | 'Researcher'
  | 'Data Analyst'
  | 'Designer'
  | 'Presenter'
  | 'Coordinator'
  | 'Flexible with any role';

export type WorkingStyle = 
  | 'I like owning a task from start to finish'
  | 'I prefer clearly divided responsibilities'
  | 'I enjoy brainstorming and team sessions'
  | 'I prefer working independently with regular updates'
  | 'I like representing and presenting for the team'
  | 'I prefer backstage roles but ensure high-quality input';

export type CaseType = 
  | 'Consulting'
  | 'Product/Tech'
  | 'Marketing'
  | 'Social Impact'
  | 'Operations/Supply Chain'
  | 'Finance'
  | 'Public Policy/ESG';

export interface Team {
  id: string;
  members: Participant[];
  skillVector: number[];
  compatibilityScore: number;
  teamSize: number;
  averageExperience: number;
  commonCaseTypes: CaseType[];
  workStyleCompatibility: string;
  preferredTeamSizeMatch: number;
}

export interface MatchingResult {
  teams: Team[];
  unmatched: Participant[];
  statistics: {
    totalParticipants: number;
    teamsFormed: number;
    averageTeamSize: number;
    matchingEfficiency: number;
    teamSizeDistribution: { [key: number]: number };
    caseTypeDistribution: { [key: string]: number };
  };
  iterations?: number;
  iterationHistory?: {
    iteration: number;
    participantsProcessed: number;
    teamsFormed: number;
    participantsMatched: number;
    remainingUnmatched: number;
    efficiency: number;
  }[];
}
