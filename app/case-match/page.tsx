'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/case-match/FileUpload';
import TeamCard from '@/components/case-match/TeamCard';
import Statistics from '@/components/case-match/Statistics';
import UnmatchedParticipants from '@/components/case-match/UnmatchedParticipants';
import { MatchingResult } from '@/lib/case-match';
import { analyzeUnmatchedParticipants } from '@/lib/unmatched-analysis';

export default function CaseMatchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/case-match/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const csvContent = generateCSV(results);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-matching-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (results: MatchingResult): string => {
    const headers = [
      'Team ID',
      'Team Number',
      'Member Name',
      'Email',
      'WhatsApp',
      'College',
      'Year',
      'Experience',
      'Availability',
      'Core Strengths',
      'Preferred Roles',
      'Case Preferences',
      'Team Size',
      'Compatibility Score'
    ];

    const rows = [headers.join(',')];

    results.teams.forEach((team, teamIndex) => {
      team.members.forEach((member) => {
        const row = [
          team.id,
          (teamIndex + 1).toString(),
          `"${member.fullName}"`,
          member.email,
          member.whatsappNumber,
          `"${member.collegeName}"`,
          member.currentYear,
          member.experience,
          member.availability,
          `"${member.coreStrengths.join('; ')}"`,
          `"${member.preferredRoles.join('; ')}"`,
          `"${member.casePreferences.join('; ')}"`,
          team.teamSize.toString(),
          team.compatibilityScore.toFixed(1)
        ];
        rows.push(row.join(','));
      });
    });

    // Add unmatched participants
    if (results.unmatched.length > 0) {
      rows.push(''); // Empty line
      rows.push('UNMATCHED PARTICIPANTS');
      results.unmatched.forEach((member) => {
        const row = [
          'UNMATCHED',
          'N/A',
          `"${member.fullName}"`,
          member.email,
          member.whatsappNumber,
          `"${member.collegeName}"`,
          member.currentYear,
          member.experience,
          member.availability,
          `"${member.coreStrengths.join('; ')}"`,
          `"${member.preferredRoles.join('; ')}"`,
          `"${member.casePreferences.join('; ')}"`,
          'N/A',
          'N/A'
        ];
        rows.push(row.join(','));
      });
    }

    return rows.join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Case Competition Team Matching
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your participant data and let our AI-powered algorithm create optimal teams 
              based on skills, experience, availability, and preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        {!results && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Don't have a CSV file? Download our sample template to get started.
              </p>
              <a
                href="/sample-case-match.csv"
                download="sample-case-match.csv"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Sample CSV
              </a>
            </div>
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Processing File</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Team Matching Results</h2>
              <div className="flex space-x-4">
                <a
                  href="/rl-dashboard"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">🧠</span>
                  RL Dashboard
                </a>
                <button
                  onClick={downloadResults}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Results
                </button>
                <button
                  onClick={() => {
                    setResults(null);
                    setError(null);
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                  Upload New File
                </button>
              </div>
            </div>

            {/* Statistics */}
            <Statistics 
              statistics={results.statistics} 
              unmatchedCount={results.unmatched.length}
            />

            {/* Teams Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {results.teams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  teamNumber={index + 1}
                />
              ))}
            </div>

            {/* Enhanced Unmatched Participants Analysis */}
            <div className="mt-12">
              {(() => {
                try {
                  // Calculate all participants from teams and unmatched
                  const allParticipants = [
                    ...results.teams.flatMap(team => team.members),
                    ...results.unmatched
                  ];
                  
                  // Analyze unmatched participants
                  const unmatchedReport = analyzeUnmatchedParticipants(
                    results.unmatched,
                    allParticipants,
                    results.teams
                  );
                  
                  return (
                    <UnmatchedParticipants 
                      analyses={unmatchedReport.analyses}
                      totalParticipants={allParticipants.length}
                    />
                  );
                } catch (error) {
                  console.error('Error in unmatched analysis:', error);
                  
                  // Fallback to simple unmatched display
                  return (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="bg-red-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <span className="mr-3">⚠️ Unmatched Participants</span>
                          <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-semibold">
                            {results.unmatched.length} unmatched
                          </span>
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.unmatched.map((participant) => (
                            <div key={participant.id} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{participant.fullName}</h4>
                              <p className="text-sm text-gray-600 mb-1">{participant.collegeName}</p>
                              <p className="text-sm text-gray-600 mb-2">{participant.currentYear}</p>
                              
                              {/* Enhanced Team Preferences Display */}
                              <div className="mt-3 space-y-2 text-xs">
                                <div>
                                  <span className="font-medium text-gray-700">Team Size Preference:</span>
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {participant.preferredTeamSize} members
                                  </span>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Team Composition:</span>
                                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                    {participant.teamPreference}
                                  </span>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Availability:</span>
                                  <p className="text-gray-600 mt-1">{participant.availability}</p>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Experience:</span>
                                  <p className="text-gray-600 mt-1">{participant.experience}</p>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Case Preferences:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {participant.casePreferences.map((pref, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {pref}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Core Strengths:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {participant.coreStrengths.map((strength, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                        {strength}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Basic Unmatching Reason */}
                                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                                  <span className="font-medium text-red-700 text-xs">Likely Issue:</span>
                                  <p className="text-red-600 text-xs mt-1">
                                    {participant.preferredTeamSize > 4 || participant.preferredTeamSize < 2 
                                      ? 'Invalid team size preference (must be 2-4)'
                                      : participant.availability === 'Not available now, but interested later'
                                      ? 'Not currently available for team participation'
                                      : `Insufficient participants with matching preferences (team size: ${participant.preferredTeamSize}, composition: ${participant.teamPreference})`
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}

        {/* How It Works Section */}
        {!results && !loading && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our advanced matching algorithm considers multiple factors to create balanced, compatible teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload CSV</h3>
                <p className="text-gray-600">
                  Upload your participant data with skills, preferences, and availability information.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Matching</h3>
                <p className="text-gray-600">
                  Our algorithm analyzes skills, experience, availability, and preferences to form optimal teams.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Results</h3>
                <p className="text-gray-600">
                  View detailed team compositions with compatibility scores and download results as CSV.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}