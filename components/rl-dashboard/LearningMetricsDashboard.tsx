'use client';

import React, { useState, useEffect } from 'react';

// Import types directly to avoid module issues
interface PerformanceMetrics {
  current_episode: number;
  total_episodes: number;
  best_reward: number;
  current_reward: number;
  average_reward: number;
  convergence_status: 'training' | 'converging' | 'converged' | 'diverging';
  exploration_rate: number;
  learning_rate: number;
  last_improvement_episode: number;
  training_start_time: string;
  estimated_completion_time: string;
}

interface LearningCurvePoint {
  episode: number;
  reward: number;
  efficiency: number;
  satisfaction: number;
  timestamp: string;
  moving_average_reward: number;
  moving_average_efficiency: number;
}

interface LearningMetricsDashboardProps {
  refreshInterval?: number; // in milliseconds
}

const LearningMetricsDashboard: React.FC<LearningMetricsDashboardProps> = ({ 
  refreshInterval = 5000 
}) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [learningCurve, setLearningCurve] = useState<LearningCurvePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch metrics data (mock data for now)
  const fetchMetrics = async () => {
    try {
      // Mock data for demonstration
      const mockMetrics: PerformanceMetrics = {
        current_episode: 15,
        total_episodes: 15,
        best_reward: 12.5,
        current_reward: 11.8,
        average_reward: 9.2,
        convergence_status: 'converging',
        exploration_rate: 0.3,
        learning_rate: 0.01,
        last_improvement_episode: 13,
        training_start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimated_completion_time: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      };

      const mockCurve: LearningCurvePoint[] = [];
      for (let i = 1; i <= 15; i++) {
        mockCurve.push({
          episode: i,
          reward: 5 + Math.random() * 8 + (i * 0.2),
          efficiency: 50 + Math.random() * 20 + (i * 1.5),
          satisfaction: 6 + Math.random() * 2 + (i * 0.1),
          timestamp: new Date(Date.now() - (15 - i) * 2 * 60 * 1000).toISOString(),
          moving_average_reward: 8 + (i * 0.15),
          moving_average_efficiency: 60 + (i * 1.2)
        });
      }
      
      setPerformanceMetrics(mockMetrics);
      setLearningCurve(mockCurve);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching RL metrics:', error);
      setIsLoading(false);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converged': return 'text-green-600 bg-green-100';
      case 'converging': return 'text-blue-600 bg-blue-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'diverging': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'converged': return '✅';
      case 'converging': return '🔄';
      case 'training': return '🚀';
      case 'diverging': return '⚠️';
      default: return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!performanceMetrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Learning Data Available</h3>
          <p className="text-gray-600 mb-4">
            Start a reinforcement learning session to see performance metrics.
          </p>
          <button 
            onClick={fetchMetrics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🧠 Reinforcement Learning Dashboard
            </h2>
            <p className="text-gray-600">
              Real-time monitoring of algorithm learning and performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Core Learning Indicators */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Core Learning Indicators</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Current Episode */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {performanceMetrics.current_episode}
            </div>
            <div className="text-sm text-blue-800 font-medium">Current Episode</div>
            <div className="text-xs text-blue-600 mt-1">
              of {performanceMetrics.total_episodes} total
            </div>
          </div>

          {/* Best Reward */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {performanceMetrics.best_reward.toFixed(1)}
            </div>
            <div className="text-sm text-green-800 font-medium">Best Reward</div>
            <div className="text-xs text-green-600 mt-1">
              Current: {performanceMetrics.current_reward.toFixed(1)}
            </div>
          </div>

          {/* Average Reward */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {performanceMetrics.average_reward.toFixed(1)}
            </div>
            <div className="text-sm text-purple-800 font-medium">Average Reward</div>
            <div className="text-xs text-purple-600 mt-1">
              Across all episodes
            </div>
          </div>

          {/* Convergence Status */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">
              {getStatusIcon(performanceMetrics.convergence_status)}
            </div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(performanceMetrics.convergence_status)}`}>
              {performanceMetrics.convergence_status.toUpperCase()}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Learning Status
            </div>
          </div>
        </div>

        {/* Learning Parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Exploration Rate */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Exploration Rate</span>
              <span className="text-xs text-orange-600">ε (epsilon)</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {(performanceMetrics.exploration_rate * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${performanceMetrics.exploration_rate * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Learning Rate */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-800">Learning Rate</span>
              <span className="text-xs text-indigo-600">α (alpha)</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {performanceMetrics.learning_rate.toFixed(3)}
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${performanceMetrics.learning_rate * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Last Improvement */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-teal-800 mb-2">Last Improvement</div>
            <div className="text-2xl font-bold text-teal-600 mb-1">
              Episode {performanceMetrics.last_improvement_episode}
            </div>
            <div className="text-xs text-teal-600">
              {performanceMetrics.current_episode - performanceMetrics.last_improvement_episode} episodes ago
            </div>
          </div>

          {/* Training Time */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-pink-800 mb-2">Training Duration</div>
            <div className="text-lg font-bold text-pink-600 mb-1">
              {(() => {
                const start = new Date(performanceMetrics.training_start_time);
                const now = new Date();
                const diffMs = now.getTime() - start.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                
                if (diffHours > 0) {
                  return `${diffHours}h ${diffMins % 60}m`;
                } else {
                  return `${diffMins}m`;
                }
              })()}
            </div>
            <div className="text-xs text-pink-600">
              Since training started
            </div>
          </div>
        </div>
      </div>

      {/* Learning Curve Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Curve</h3>
        
        {learningCurve.length > 0 ? (
          <div className="space-y-4">
            {/* Simple ASCII-style chart for now */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Reward Progression</div>
              <div className="space-y-1">
                {learningCurve.slice(-10).map((point, index) => {
                  const maxReward = Math.max(...learningCurve.map(p => p.reward));
                  const barWidth = maxReward > 0 ? (point.reward / maxReward) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-12 text-xs text-gray-600">
                        Ep {point.episode}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {point.reward.toFixed(1)}
                        </div>
                      </div>
                      <div className="w-16 text-xs text-gray-600 text-right">
                        {point.efficiency.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {learningCurve[learningCurve.length - 1]?.moving_average_reward.toFixed(1) || '0'}
                </div>
                <div className="text-sm text-blue-800">Moving Avg Reward</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {learningCurve[learningCurve.length - 1]?.moving_average_efficiency.toFixed(1) || '0'}%
                </div>
                <div className="text-sm text-green-800">Moving Avg Efficiency</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {learningCurve[learningCurve.length - 1]?.satisfaction.toFixed(1) || '0'}
                </div>
                <div className="text-sm text-purple-800">Latest Satisfaction</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📈</div>
            <div className="text-gray-600">No learning curve data available yet.</div>
            <div className="text-sm text-gray-500 mt-2">
              Data will appear after the first few training episodes.
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={fetchMetrics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh Data</span>
          </button>
          
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <span>📊</span>
            <span>Export Metrics</span>
          </button>
          
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <span>⚙️</span>
            <span>Adjust Parameters</span>
          </button>
          
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
            <span>🎯</span>
            <span>Run Test Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningMetricsDashboard;