import React from 'react';
import { Team } from '../types';

interface TeamResultsProps {
  team: Team;
  teamNumber: number;
}

const TeamResults: React.FC<TeamResultsProps> = ({ team, teamNumber }) => {
  // Safety checks
  if (!team || !team.members || !Array.isArray(team.members)) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: Invalid team data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          Team {teamNumber}
        </h3>
        <p className="text-blue-100 text-sm">
          Compatibility: {team.compatibilityScore.toFixed(1)}%
        </p>
      </div>

      <div className="p-6">
        {/* Team Members */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-gray-900 text-lg">Members</h4>
          {team.members.map((member, index) => (
            <div key={member.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">{member.fullName}</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {member.currentYear}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{member.collegeName}</p>
              
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span>
                    <p className="text-gray-600">{member.experience}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Availability:</span>
                    <p className="text-gray-600">{member.availability}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Skills:</span>
                  <p className="text-gray-600">{member.coreStrengths?.join(', ') || 'Not specified'}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Preferred Roles:</span>
                  <p className="text-gray-600">{member.preferredRoles?.join(', ') || 'Not specified'}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Case Preferences:</span>
                  <p className="text-gray-600">{member.casePreferences?.join(', ') || 'Not specified'}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Working Style:</span>
                  <p className="text-gray-600">{member.workingStyle?.join(', ') || 'Not specified'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">Work Style:</span>
                    <p className="text-gray-600">{member.workStyle || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Looking For:</span>
                    <p className="text-gray-600">{member.lookingFor || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{team.teamSize}</p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {team.averageExperience.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Avg Experience</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">
                {team.preferredTeamSizeMatch.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">Size Match</p>
            </div>
          </div>
        </div>

        {/* Team Details */}
        <div className="mt-4 space-y-3">
          {team.commonCaseTypes && team.commonCaseTypes.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-700">Common Interests:</span>
              <p className="text-sm text-gray-900">{team.commonCaseTypes.join(', ')}</p>
            </div>
          )}
          
          <div>
            <span className="text-xs font-medium text-gray-700">Work Style:</span>
            <p className="text-sm text-gray-900">{team.workStyleCompatibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamResults;
