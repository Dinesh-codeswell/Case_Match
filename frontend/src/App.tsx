import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TeamResults from './components/TeamResults';
import Statistics from './components/Statistics';
import LoadingSpinner from './components/LoadingSpinner';
import ExportResults from './components/ExportResults';
import IterativeStats from './components/IterativeStats';
import { exportTeamsToCSV } from './utils/csvExport';
import { Team, Participant, MatchingResult } from './types';

function App() {
  const [results, setResults] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useIterativeMatching, setUseIterativeMatching] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const queryParams = new URLSearchParams({
        useIterativeMatching: useIterativeMatching.toString(),
        logLevel: 'detailed'
      });

      const response = await fetch(`http://localhost:4000/upload-csv?${queryParams}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data || !data.teams || !Array.isArray(data.teams)) {
        throw new Error('Invalid response format: missing teams data');
      }
      
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matching the main website style */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Logo similar to Beyond Career */}
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-gray-900">BEYOND CAREER</span>
                </div>
              </div>
            </div>
            
            {/* Navigation matching the main website */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Resources</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Opportunities</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Events</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">CareerAI</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results && !loading && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Case Team Matcher
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Internships, Jobs, Tools—All In One Place. Turn learning into outcomes. 
              From building your resume to landing your dream job, we bring every opportunity under one roof.
            </p>
            
            {/* Strict Matching Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Strict Matching Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📏 Team Size Matching</h4>
                  <p>Students are only matched with their preferred team size. If not enough students prefer the same size, they remain unmatched.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">⏰ Availability Matching</h4>
                  <p>Compatible availability levels only:</p>
                  <ul className="mt-2 text-xs">
                    <li>• High ↔ High, Medium</li>
                    <li>• Medium ↔ High, Medium, Low</li>
                    <li>• Low ↔ Medium, Low</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : !results ? (
          <div className="space-y-8">
            {/* Settings Panel */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Matching Configuration</h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {showSettings ? 'Hide Settings' : 'Show Settings'}
                </button>
              </div>
              
              {showSettings && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Iterative Matching</label>
                      <p className="text-sm text-gray-600">Run multiple iterations to match unmatched students</p>
                    </div>
                    <button
                      onClick={() => setUseIterativeMatching(!useIterativeMatching)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        useIterativeMatching ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          useIterativeMatching ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {useIterativeMatching && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Iterative Matching Benefits:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Runs multiple iterations to maximize participant matching</li>
                        <li>• Focuses on unmatched students in each iteration</li>
                        <li>• Provides detailed iteration statistics and progress tracking</li>
                        <li>• Typically achieves higher overall matching efficiency</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 font-medium text-lg">
                  Successfully formed {results.teams?.length || 0} teams from {results.statistics?.totalParticipants || 0} participants!
                </span>
              </div>
            </div>

            {/* Iterative Matching Statistics */}
            {results.iterations && results.iterationHistory && (
              <IterativeStats results={results} />
            )}

            {/* Statistics */}
            {results.statistics && (
              <Statistics
                totalParticipants={results.statistics.totalParticipants}
                teamsFormed={results.statistics.teamsFormed}
                averageTeamSize={results.statistics.averageTeamSize}
                matchingEfficiency={results.statistics.matchingEfficiency}
                teamSizeDistribution={results.statistics.teamSizeDistribution || {}}
                caseTypeDistribution={results.statistics.caseTypeDistribution || {}}
              />
            )}

            {/* Export Results */}
            <ExportResults data={results} />

            {/* Teams Grid */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Formed Teams
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {results.teams && results.teams.map((team, index) => (
                  <TeamResults key={team.id} team={team} teamNumber={index + 1} />
                ))}
              </div>
            </div>

            {/* Unmatched Participants */}
            {results.unmatched && results.unmatched.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-yellow-800 mb-6 text-center">
                  Unmatched Participants ({results.unmatched.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.unmatched.map((participant) => (
                    <div key={participant.id} className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
                      <div className="font-semibold text-gray-900">{participant.fullName}</div>
                      <div className="text-sm text-gray-500">{participant.collegeName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => {
                  setResults(null);
                  setError(null);
                }}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Upload New File
              </button>
              
              <button
                onClick={() => {
                  const exportData = {
                    teams: results.teams,
                    unmatched: results.unmatched,
                    statistics: results.statistics
                  };
                  exportTeamsToCSV(exportData);
                }}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
