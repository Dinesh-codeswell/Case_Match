export interface Participant {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  collegeName: string;
  currentYear: string;
  coreStrengths: string[];
  preferredRoles: string[];
  workingStyle?: string[];
  idealTeamStructure?: string;
  lookingFor?: string;
  availability: string;
  experience: string;
  workStyle?: string;
  casePreferences: string[];
  preferredTeamSize: number;
  teamPreference: 'Undergrads only' | 'Postgrads only' | 'Either UG or PG';
}

export interface Team {
  id: string;
  members: Participant[];
  skillVector: number[];
  compatibilityScore: number;
  teamSize: number;
  averageExperience: number;
  commonCaseTypes: string[];
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
}

export type CoreStrength = 
  | 'Research'
  | 'Modeling'
  | 'Markets'
  | 'Design'
  | 'Pitching'
  | 'Coordination'
  | 'Ideation'
  | 'Product'
  | 'Storytelling'
  | 'Technical';

export type PreferredRole = 
  | 'Team Lead'
  | 'Researcher'
  | 'Data Analyst'
  | 'Designer'
  | 'Presenter'
  | 'Coordinator'
  | 'Flexible with any role';

export type CaseType = 
  | 'Consulting'
  | 'Product/Tech'
  | 'Marketing'
  | 'Social Impact'
  | 'Operations/Supply Chain'
  | 'Finance'
  | 'Public Policy/ESG';

export type TeamPreference = 
  | 'Undergrads only'
  | 'Postgrads only'
  | 'Either UG or PG';