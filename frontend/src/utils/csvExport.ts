import { Team, Participant } from '../types';

interface ExportData {
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

export function exportTeamsToCSV(data: ExportData): void {
  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';
  
  // Add header for teams
  csvContent += 'Team Formation Results\n\n';
  
  // Add statistics summary
  csvContent += 'Summary Statistics\n';
  csvContent += `Total Participants,${data.statistics.totalParticipants}\n`;
  csvContent += `Teams Formed,${data.statistics.teamsFormed}\n`;
  csvContent += `Average Team Size,${data.statistics.averageTeamSize.toFixed(1)}\n`;
  csvContent += `Matching Efficiency,${data.statistics.matchingEfficiency.toFixed(1)}%\n\n`;
  
  // Add team size distribution
  csvContent += 'Team Size Distribution\n';
  csvContent += 'Team Size,Count\n';
  Object.entries(data.statistics.teamSizeDistribution).forEach(([size, count]) => {
    csvContent += `${size} Members,${count}\n`;
  });
  csvContent += '\n';
  
  // Add case type distribution
  csvContent += 'Case Type Distribution\n';
  csvContent += 'Case Type,Count\n';
  Object.entries(data.statistics.caseTypeDistribution).forEach(([caseType, count]) => {
    csvContent += `${caseType},${count}\n`;
  });
  csvContent += '\n';
  
  // Add detailed team information
  csvContent += 'Detailed Team Information\n';
  csvContent += 'Team Number,Team ID,Compatibility Score,Team Size,Preferred Team Size Match,Common Case Types,Work Style Compatibility\n';
  
  data.teams.forEach((team, index) => {
    const teamNumber = index + 1;
    const commonCaseTypes = team.commonCaseTypes.join('; ');
    csvContent += `${teamNumber},${team.id},${team.compatibilityScore.toFixed(1)}%,${team.members.length},${team.preferredTeamSizeMatch}%,${commonCaseTypes},${team.workStyleCompatibility}\n`;
  });
  
  csvContent += '\n';
  
  // Add team members details
  csvContent += 'Team Members Details\n';
  csvContent += 'Team Number,Member Name,Email,College,Current Year,Experience,Availability,Core Strengths,Preferred Roles,Case Preferences,Preferred Team Size\n';
  
  data.teams.forEach((team, teamIndex) => {
    const teamNumber = teamIndex + 1;
    team.members.forEach((member) => {
      const coreStrengths = member.coreStrengths.join('; ');
      const preferredRoles = member.preferredRoles.join('; ');
      const casePreferences = member.casePreferences.join('; ');
      
      csvContent += `${teamNumber},${member.fullName},${member.email},${member.collegeName},${member.currentYear},${member.experience},${member.availability},"${coreStrengths}","${preferredRoles}","${casePreferences}",${member.preferredTeamSize}\n`;
    });
  });
  
  // Add unmatched participants
  if (data.unmatched.length > 0) {
    csvContent += '\nUnmatched Participants\n';
    csvContent += 'Name,Email,College,Current Year,Experience,Availability,Core Strengths,Preferred Roles,Case Preferences,Preferred Team Size\n';
    
    data.unmatched.forEach((participant) => {
      const coreStrengths = participant.coreStrengths.join('; ');
      const preferredRoles = participant.preferredRoles.join('; ');
      const casePreferences = participant.casePreferences.join('; ');
      
      csvContent += `${participant.fullName},${participant.email},${participant.collegeName},${participant.currentYear},${participant.experience},${participant.availability},"${coreStrengths}","${preferredRoles}","${casePreferences}",${participant.preferredTeamSize}\n`;
    });
  }
  
  // Create and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `team_formation_results_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTeamsToJSON(data: ExportData): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `team_formation_results_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
} 