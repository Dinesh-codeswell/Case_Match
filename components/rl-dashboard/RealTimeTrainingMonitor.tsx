'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TrainingMetrics {
  current_episode: number;
  current_reward: number;
  current_loss: number;
  learning_rate: number;
  exploration_rate: number;
  actions_per_second: number;
  memory_usage_mb: number;
  training_time_elapsed: number;
  estimated_time_remaining: number;
  convergence_score: number;
  last_action: {
    type: string;
    reward: number;
    q_value: number;
    timestamp: string;
  };
}

interface RealTimeTrainingMonitorProps {
  isTraining?: boolean;
  refreshInterval?: number;
}

const RealTimeTrainingMonitor: React.FC<RealTimeTrainingMonitorProps> = ({
  isTraining = false,
  refreshInterval = 1000
}) => {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [recentRewards, setRecentRewards] = useState<number[]>([]);
  const [recentLosses, setRecentLosses] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time training data
  const generateMockMetrics = (): TrainingMetrics => {
    const episode = (metrics?.current_episode || 0) + 1;
    const baseReward = 8 + Math.sin(episode * 0.1) * 3 + Math.random() * 2;
    const baseLoss = Math.max(0.1, 2 - episode * 0.05 + Math.random() * 0.5);
    
    return {
      current_episode: episode,
      current_reward: baseReward,
      current_loss: baseLoss,
      learning_rate: Math.max(0.001, 0.01 - episode * 0.0001),
      exploration_rate: Math.max(0.1, 1.0 - episode * 0.02),
      actions_per_second: 15 + Math.random() * 10,
      memory_usage_mb: 150 + Math.random() * 50,
      training_time_elapsed: episode * 2.5,
      estimated_time_remaining: Math.max(0, (100 - episode) * 2.5),
      convergence_score: Math.min(1.0, episode * 0.01 + Math.random() * 0.1),
      last_action: {
        type: ['match', 'skip', 'reassign'][Math.floor(Math.random() * 3)],
        reward: baseReward + (Math.random() - 0.5) * 2,
        q_value: Math.random(),
        timestamp: new Date().toISOString()
      }
    };
  };

  // Start/stop real-time monitoring
  useEffect(() => {
    if (isTraining) {
      setIsConnected(true);
      intervalRef.current = setInterval(() => {
        const newMetrics = generateMockMetrics();
        setMetrics(newMetrics);
        setLastUpdate(new Date());
        
        // Update recent data arrays
        setRecentRewards(prev => [...prev.slice(-29), newMetrics.current_reward]);
        setRecentLosses(prev => [...prev.slice(-29), newMetrics.current_loss]);
      }, refreshInterval);
    } else {
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTraining, refreshInterval]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusColor = (isConnected: boolean, isTraining: boolean) => {
    if (!isConnected) return 'text-gray-500 bg-gray-100';
    if (isTraining) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusText = (isConnected: boolean, isTraining: boolean) => {
    if (!isConnected) return 'Disconnected';
    if (isTraining) return 'Training Active';
    return 'Connected';
  };

  if (!metrics && !isTraining) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⏸️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Not Active</h3>
          <p className="text-gray-600 mb-4">
            Start a training session to see real-time metrics
          </p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Start Training Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(isConnected, isTraining)}`}>
              {getStatusText(isConnected, isTraining)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Live Training Metrics */}
      {metrics && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📊</span>
            Live Training Metrics
          </h3>

          {/* Primary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-800 mb-1">Current Episode</div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.current_episode}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-800 mb-1">Current Reward</div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.current_reward.toFixed(2)}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-800 mb-1">Current Loss</div>
              <div className="text-2xl font-bold text-red-600">
                {metrics.current_loss.toFixed(3)}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-800 mb-1">Convergence</div>
              <div className="text-2xl font-bold text-purple-600">
                {(metrics.convergence_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Learning Parameters */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Learning Rate</span>
                <span className="text-sm text-gray-600">{metrics.learning_rate.toFixed(4)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(metrics.learning_rate / 0.01) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Exploration Rate</span>
                <span className="text-sm text-gray-600">{(metrics.exploration_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.exploration_rate * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {metrics.actions_per_second.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Actions/sec</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {metrics.memory_usage_mb.toFixed(0)} MB
              </div>
              <div className="text-sm text-gray-600">Memory Usage</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatTime(metrics.training_time_elapsed)}
              </div>
              <div className="text-sm text-gray-600">Elapsed</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatTime(metrics.estimated_time_remaining)}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>

          {/* Recent Trends */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Rewards */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Rewards (Last 30)</h4>
              <div className="h-20 flex items-end space-x-1">
                {recentRewards.map((reward, index) => {
                  const maxReward = Math.max(...recentRewards);
                  const height = (reward / maxReward) * 100;
                  return (
                    <div
                      key={index}
                      className="bg-green-500 rounded-t flex-1 transition-all duration-300"
                      style={{ height: `${height}%` }}
                      title={`Episode ${metrics.current_episode - recentRewards.length + index + 1}: ${reward.toFixed(2)}`}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Recent Losses */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Losses (Last 30)</h4>
              <div className="h-20 flex items-end space-x-1">
                {recentLosses.map((loss, index) => {
                  const maxLoss = Math.max(...recentLosses);
                  const height = (loss / maxLoss) * 100;
                  return (
                    <div
                      key={index}
                      className="bg-red-500 rounded-t flex-1 transition-all duration-300"
                      style={{ height: `${height}%` }}
                      title={`Episode ${metrics.current_episode - recentLosses.length + index + 1}: ${loss.toFixed(3)}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Action Details */}
      {metrics?.last_action && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Last Action Taken
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Action Type</div>
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {metrics.last_action.type}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Reward</div>
                <div className={`text-lg font-semibold ${
                  metrics.last_action.reward >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.last_action.reward.toFixed(2)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Q-Value</div>
                <div className="text-lg font-semibold text-blue-600">
                  {metrics.last_action.q_value.toFixed(3)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Timestamp</div>
                <div className="text-sm text-gray-900">
                  {new Date(metrics.last_action.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Controls</h3>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isTraining 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTraining ? '⏹️ Stop Training' : '▶️ Start Training'}
          </button>
          
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            ⏸️ Pause
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            💾 Save Checkpoint
          </button>
          
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            ⚙️ Adjust Parameters
          </button>
          
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            📊 Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTrainingMonitor;