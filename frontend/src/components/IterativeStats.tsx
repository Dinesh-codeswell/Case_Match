import React, { useState } from 'react';
import { MatchingResult } from '../types';

interface IterativeStatsProps {
  results: MatchingResult;
}

const IterativeStats: React.FC<IterativeStatsProps> = ({ results }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Only show if this is an iterative result
  if (!results.iterations || !results.iterationHistory) {
    return null;
  }

  const { iterations, iterationHistory } = results;
  const totalParticipantsMatched = results.statistics.totalParticipants - results.unmatched.length;
  const averageIterationEfficiency = iterationHistory.length > 0 
    ? iterationHistory.reduce((sum, hist) => sum + hist.efficiency, 0) / iterationHistory.length 
    : 0;

  const bestIteration = iterationHistory.length > 0 
    ? iterationHistory.reduce((best, current) => 
        current.efficiency > best.efficiency ? current : best
      )
    : null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-900 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Iterative Matching Results
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{iterations}</div>
          <div className="text-sm text-gray-600 font-medium">Total Iterations</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{totalParticipantsMatched}</div>
          <div className="text-sm text-gray-600 font-medium">Participants Matched</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{averageIterationEfficiency.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 font-medium">Avg Iteration Efficiency</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{bestIteration?.efficiency.toFixed(1) || 0}%</div>
          <div className="text-sm text-gray-600 font-medium">Best Iteration</div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Matching Progress</h4>
        <div className="space-y-2">
          {iterationHistory.map((iteration, index) => (
            <div key={iteration.iteration} className="flex items-center space-x-3">
              <div className="w-16 text-sm font-medium text-gray-600">
                Iter {iteration.iteration}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${iteration.efficiency}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {iteration.participantsMatched}/{iteration.participantsProcessed} ({iteration.efficiency.toFixed(1)}%)
                </div>
              </div>
              <div className="w-20 text-sm text-gray-600">
                {iteration.remainingUnmatched} left
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="border-t border-blue-200 pt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Iteration Details</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iteration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants Processed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teams Formed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants Matched
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {iterationHistory.map((iteration) => (
                  <tr key={iteration.iteration} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {iteration.iteration}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {iteration.participantsProcessed}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {iteration.teamsFormed}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {iteration.participantsMatched}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        iteration.efficiency >= 80 ? 'bg-green-100 text-green-800' :
                        iteration.efficiency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {iteration.efficiency.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {iteration.remainingUnmatched}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-6 bg-blue-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">Key Insights</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Algorithm ran for {iterations} iterations to maximize participant matching</li>
          <li>• {totalParticipantsMatched} out of {results.statistics.totalParticipants} participants were successfully matched ({results.statistics.matchingEfficiency.toFixed(1)}%)</li>
          {bestIteration && (
            <li>• Best performing iteration was #{bestIteration.iteration} with {bestIteration.efficiency.toFixed(1)}% efficiency</li>
          )}
          {results.unmatched.length > 0 && (
            <li>• {results.unmatched.length} participants remain unmatched and may need manual assignment</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IterativeStats;