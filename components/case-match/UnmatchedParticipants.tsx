'use client';

import React, { useState } from 'react';
import { UnmatchedAnalysis, UnmatchedReason } from '@/lib/unmatched-analysis';

interface Participant {
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

interface UnmatchedParticipantsProps {
  analyses: UnmatchedAnalysis[];
  totalParticipants: number;
}

const UnmatchedParticipants: React.FC<UnmatchedParticipantsProps> = ({ 
  analyses, 
  totalParticipants 
}) => {
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);
  const [showReasons, setShowReasons] = useState<{ [key: string]: boolean }>({});

  if (analyses.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Perfect Matching!</h3>
            <p className="text-green-700">All {totalParticipants} participants have been successfully matched into teams.</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: UnmatchedReason['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: UnmatchedReason['category']) => {
    switch (category) {
      case 'TEAM_SIZE':
        return '👥';
      case 'TEAM_PREFERENCE':
        return '🎓';
      case 'COMPATIBILITY':
        return '🤝';
      case 'AVAILABILITY':
        return '⏰';
      case 'INSUFFICIENT_CANDIDATES':
        return '📊';
      case 'QUALITY_THRESHOLD':
        return '⭐';
      default:
        return '❓';
    }
  };

  const toggleReasons = (participantId: string) => {
    setShowReasons(prev => ({
      ...prev,
      [participantId]: !prev[participantId]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-3">⚠️ Unmatched Participants</span>
              <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-semibold">
                {analyses.length} unmatched
              </span>
            </h3>
            <p className="text-red-100 mt-1">
              {((analyses.length / totalParticipants) * 100).toFixed(1)}% of participants could not be matched
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Statistics */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Unmatching Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analyses.length}</div>
              <div className="text-gray-600">Unmatched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalParticipants - analyses.length}</div>
              <div className="text-gray-600">Matched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((totalParticipants - analyses.length) / totalParticipants * 100).toFixed(0)}%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(analyses.reduce((sum, a) => sum + a.reasons.length, 0) / analyses.length)}
              </div>
              <div className="text-gray-600">Avg Issues</div>
            </div>
          </div>
        </div>

        {/* Unmatched Participants List */}
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.participant.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Participant Header */}
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setExpandedParticipant(
                  expandedParticipant === analysis.participant.id ? null : analysis.participant.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {analysis.participant.fullName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-lg">{analysis.participant.fullName}</h5>
                      <p className="text-sm text-gray-500">{analysis.participant.collegeName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Team Size: {analysis.participant.preferredTeamSize}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {analysis.participant.teamPreference}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {analysis.reasons.length} Issue{analysis.reasons.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {analysis.potentialMatches.length} Potential Matches
                      </div>
                    </div>
                    <div className={`transition-transform duration-200 ${
                      expandedParticipant === analysis.participant.id ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedParticipant === analysis.participant.id && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  {/* Team Preference Section */}
                  <div className="mb-6">
                    <h6 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🎯</span>
                      Team Preferences
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Preferred Team Size:</span>
                        <p className="text-gray-800 mt-1">{analysis.participant.preferredTeamSize} members</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Team Composition:</span>
                        <p className="text-gray-800 mt-1">{analysis.participant.teamPreference}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Availability:</span>
                        <p className="text-gray-800 mt-1">{analysis.participant.availability}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Experience:</span>
                        <p className="text-gray-800 mt-1">{analysis.participant.experience}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <span className="font-medium text-gray-600 text-sm">Case Preferences:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.participant.casePreferences.map((pref, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="font-medium text-gray-600 text-sm">Core Strengths:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.participant.coreStrengths.map((strength, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Matching Issues */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="text-md font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">🚫</span>
                        Matching Issues ({analysis.reasons.length})
                      </h6>
                      <button
                        onClick={() => toggleReasons(analysis.participant.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {showReasons[analysis.participant.id] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {analysis.reasons.map((reason, idx) => (
                        <div key={idx} className={`border rounded-lg p-3 ${getSeverityColor(reason.severity)}`}>
                          <div className="flex items-start space-x-3">
                            <span className="text-lg">{getCategoryIcon(reason.category)}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h7 className="font-medium">{reason.title}</h7>
                                <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                                  {reason.severity}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{reason.description}</p>
                              
                              {showReasons[analysis.participant.id] && (
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <span className="text-xs font-medium">Details:</span>
                                    <ul className="text-xs mt-1 space-y-1">
                                      {reason.details.map((detail, detailIdx) => (
                                        <li key={detailIdx} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          <span>{detail}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium">Suggestions:</span>
                                    <ul className="text-xs mt-1 space-y-1">
                                      {reason.suggestions.map((suggestion, suggIdx) => (
                                        <li key={suggIdx} className="flex items-start">
                                          <span className="mr-2">💡</span>
                                          <span>{suggestion}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Potential Matches */}
                  {analysis.potentialMatches.length > 0 && (
                    <div className="mb-6">
                      <h6 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🤝</span>
                        Potential Matches ({analysis.potentialMatches.length})
                      </h6>
                      <div className="space-y-2">
                        {analysis.potentialMatches.slice(0, 3).map((match, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {match.participant.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{match.participant.fullName}</p>
                                <p className="text-xs text-gray-500">{match.participant.collegeName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-blue-600">
                                {match.compatibilityScore.toFixed(1)}% Compatible
                              </div>
                              {match.blockingIssues.length > 0 && (
                                <div className="text-xs text-red-600 mt-1">
                                  {match.blockingIssues.length} blocking issue{match.blockingIssues.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h6 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Recommendations
                    </h6>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <ul className="text-sm space-y-2">
                        {analysis.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-blue-600">•</span>
                            <span className="text-blue-800">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnmatchedParticipants;