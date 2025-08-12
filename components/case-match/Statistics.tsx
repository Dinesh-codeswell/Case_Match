'use client';

import React from 'react';

interface Statistics {
  totalParticipants: number;
  teamsFormed: number;
  averageTeamSize: number;
  matchingEfficiency: number;
  teamSizeDistribution: { [key: number]: number };
  caseTypeDistribution: { [key: string]: number };
}

interface StatisticsProps {
  statistics: Statistics;
  unmatchedCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({ statistics, unmatchedCount }) => {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-100';
    if (efficiency >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Matching Statistics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {statistics.totalParticipants}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Participants</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {statistics.teamsFormed}
          </div>
          <div className="text-sm text-gray-600 font-medium">Teams Formed</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {statistics.averageTeamSize.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Avg Team Size</div>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 px-4 py-2 rounded-lg ${getEfficiencyColor(statistics.matchingEfficiency)}`}>
            {statistics.matchingEfficiency.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Matching Efficiency</div>
        </div>
      </div>

      {/* Unmatched Participants */}
      {unmatchedCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 font-semibold">
              {unmatchedCount} participants could not be matched into teams
            </span>
          </div>
        </div>
      )}

      {/* Team Size Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Size Distribution</h3>
        <div className="space-y-3">
          {Object.entries(statistics.teamSizeDistribution).map(([size, count]) => (
            <div key={size} className="flex items-center">
              <div className="w-20 text-sm font-medium text-gray-700">
                {size} members:
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${statistics.teamsFormed > 0 ? (count / statistics.teamsFormed) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div className="w-16 text-sm font-semibold text-gray-900 text-right">
                {count} teams
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Type Distribution */}
      {Object.keys(statistics.caseTypeDistribution).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Case Type Interests</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(statistics.caseTypeDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([caseType, count]) => (
                <div key={caseType} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-gray-900 mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{caseType}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;