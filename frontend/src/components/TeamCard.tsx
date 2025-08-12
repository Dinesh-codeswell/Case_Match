import React, { useState } from 'react';
import { Team } from '../types';

interface TeamCardProps {
  team: Team;
  teamNumber: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, teamNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  // Safety checks
  if (!team || !team.members || !Array.isArray(team.members)) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: Invalid team data</p>
      </div>
    );
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTeamSizeColor = (size: number) => {
    switch (size) {
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-purple-100 text-purple-800';
      case 4: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300
        ${isHovered ? 'shadow-xl scale-105 border-blue-300' : 'hover:shadow-md'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with solid color matching the website style */}
      <div className="bg-blue-600 px-6 py-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3">Team {teamNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTeamSizeColor(team.members.length)}`}>
                  {team.members.length} members
                </span>
              </h3>
              <p className="text-blue-100 text-lg mt-2">
                Compatibility: {team.compatibilityScore.toFixed(1)}%
              </p>
            </div>
            
            {/* Compatibility Badge */}
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${getCompatibilityColor(team.compatibilityScore)}`}>
              {team.compatibilityScore.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Team Size Preference Match */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700">Team Size Preference Match</span>
            <span className="text-lg font-bold text-blue-600">{team.preferredTeamSizeMatch || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${team.preferredTeamSizeMatch || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Common Interests */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Common Case Interests</h4>
          <div className="flex flex-wrap gap-3">
            {team.commonCaseTypes && team.commonCaseTypes.length > 0 ? (
              team.commonCaseTypes.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200 hover:scale-105 transition-transform duration-200"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full">
                No common interests
              </span>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h4>
          <div className="space-y-4">
            {team.members.map((member, index) => (
              <div
                key={member.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200 cursor-pointer
                  ${expandedMember === index 
                    ? 'border-blue-300 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }
                `}
                onClick={() => setExpandedMember(expandedMember === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-lg">{member.fullName}</h5>
                      <p className="text-sm text-gray-500">{member.collegeName}</p>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <div className={`transition-transform duration-200 ${expandedMember === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Member Details */}
                {expandedMember === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">Experience:</span>
                        <p className="text-gray-800 mt-1">{member.experience}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Availability:</span>
                        <p className="text-gray-800 mt-1">{member.availability}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-600 text-sm">Core Strengths:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.coreStrengths && member.coreStrengths.length > 0 ? (
                          member.coreStrengths.map((strength, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                              {strength}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-600 text-sm">Preferred Roles:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.preferredRoles && member.preferredRoles.length > 0 ? (
                          member.preferredRoles.map((role, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-600 text-sm">Case Preferences:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.casePreferences && member.casePreferences.length > 0 ? (
                          member.casePreferences.map((pref, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                              {pref}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-600 text-sm">Working Style:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.workingStyle && member.workingStyle.length > 0 ? (
                          member.workingStyle.map((style, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                              {style}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">Work Style:</span>
                        <p className="text-gray-800 mt-1">{member.workStyle || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Team Structure:</span>
                        <p className="text-gray-800 mt-1">{member.idealTeamStructure || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-600 text-sm">Looking For:</span>
                      <p className="text-gray-800 mt-1">{member.lookingFor || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{team.members.length}</div>
              <div className="text-sm text-gray-600 font-medium">Members</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{team.commonCaseTypes?.length || 0}</div>
              <div className="text-sm text-gray-600 font-medium">Common Interests</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{team.preferredTeamSizeMatch || 0}%</div>
              <div className="text-sm text-gray-600 font-medium">Size Match</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
