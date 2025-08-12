'use client';

import React, { useState, useEffect } from 'react';

interface ActionData {
  action_type: string;
  state_category: string;
  frequency: number;
  success_rate: number;
  average_reward: number;
}

interface ActionHeatmapProps {
  data?: ActionData[];
  width?: number;
  height?: number;
}

const ActionHeatmap: React.FC<ActionHeatmapProps> = ({
  data,
  width = 600,
  height = 400
}) => {
  const [selectedCell, setSelectedCell] = useState<ActionData | null>(null);
  const [heatmapData, setHeatmapData] = useState<ActionData[]>([]);

  // Generate mock data if none provided
  useEffect(() => {
    if (data) {
      setHeatmapData(data);
    } else {
      // Generate mock action distribution data
      const mockData: ActionData[] = [];
      const actionTypes = ['match', 'skip', 'reassign', 'defer'];
      const stateCategories = [
        'high_compatibility',
        'medium_compatibility', 
        'low_compatibility',
        'size_mismatch',
        'preference_conflict',
        'availability_issue'
      ];

      actionTypes.forEach(action => {
        stateCategories.forEach(state => {
          mockData.push({
            action_type: action,
            state_category: state,
            frequency: Math.floor(Math.random() * 100) + 10,
            success_rate: Math.random() * 0.8 + 0.2,
            average_reward: (Math.random() - 0.3) * 2
          });
        });
      });

      setHeatmapData(mockData);
    }
  }, [data]);

  const getColorIntensity = (value: number, min: number, max: number): string => {
    const normalized = (value - min) / (max - min);
    const intensity = Math.floor(normalized * 255);
    
    if (normalized > 0.7) {
      return `rgb(${255 - intensity * 0.3}, ${255 - intensity * 0.8}, ${255 - intensity * 0.8})`;
    } else if (normalized > 0.4) {
      return `rgb(${255 - intensity * 0.5}, ${255 - intensity * 0.5}, ${255})`;
    } else {
      return `rgb(${255}, ${255 - intensity * 0.5}, ${255 - intensity * 0.8})`;
    }
  };

  const actionTypes = [...new Set(heatmapData.map(d => d.action_type))];
  const stateCategories = [...new Set(heatmapData.map(d => d.state_category))];
  
  const maxFrequency = Math.max(...heatmapData.map(d => d.frequency));
  const minFrequency = Math.min(...heatmapData.map(d => d.frequency));

  const cellWidth = (width - 120) / actionTypes.length;
  const cellHeight = (height - 80) / stateCategories.length;

  const formatStateName = (state: string): string => {
    return state.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatActionName = (action: string): string => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Distribution Heatmap</h3>
        <p className="text-sm text-gray-600">
          Frequency of RL actions taken in different state categories
        </p>
      </div>

      <div className="relative">
        <svg width={width} height={height} className="border border-gray-100 rounded">
          {/* Y-axis labels (state categories) */}
          {stateCategories.map((state, index) => (
            <text
              key={state}
              x={110}
              y={40 + index * cellHeight + cellHeight / 2}
              textAnchor="end"
              className="text-xs fill-gray-600"
              dominantBaseline="middle"
            >
              {formatStateName(state)}
            </text>
          ))}

          {/* X-axis labels (action types) */}
          {actionTypes.map((action, index) => (
            <text
              key={action}
              x={120 + index * cellWidth + cellWidth / 2}
              y={height - 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {formatActionName(action)}
            </text>
          ))}

          {/* Heatmap cells */}
          {heatmapData.map((item) => {
            const actionIndex = actionTypes.indexOf(item.action_type);
            const stateIndex = stateCategories.indexOf(item.state_category);
            const x = 120 + actionIndex * cellWidth;
            const y = 40 + stateIndex * cellHeight;
            const color = getColorIntensity(item.frequency, minFrequency, maxFrequency);

            return (
              <rect
                key={`${item.action_type}-${item.state_category}`}
                x={x}
                y={y}
                width={cellWidth - 2}
                height={cellHeight - 2}
                fill={color}
                stroke="#fff"
                strokeWidth={1}
                className="cursor-pointer hover:stroke-gray-400 hover:stroke-2"
                onMouseEnter={() => setSelectedCell(item)}
                onMouseLeave={() => setSelectedCell(null)}
              />
            );
          })}

          {/* Grid lines */}
          {actionTypes.map((_, index) => (
            <line
              key={`v-${index}`}
              x1={120 + index * cellWidth}
              y1={40}
              x2={120 + index * cellWidth}
              y2={height - 40}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          
          {stateCategories.map((_, index) => (
            <line
              key={`h-${index}`}
              x1={120}
              y1={40 + index * cellHeight}
              x2={width - 20}
              y2={40 + index * cellHeight}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
        </svg>

        {/* Color scale legend */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <span className="text-xs text-gray-600">Low</span>
          <div className="flex space-x-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((intensity, index) => (
              <div
                key={index}
                className="w-4 h-4 border border-gray-300"
                style={{
                  backgroundColor: getColorIntensity(
                    minFrequency + intensity * (maxFrequency - minFrequency),
                    minFrequency,
                    maxFrequency
                  )
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">High</span>
        </div>
      </div>

      {/* Tooltip/Details Panel */}
      {selectedCell && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            {formatActionName(selectedCell.action_type)} → {formatStateName(selectedCell.state_category)}
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Frequency</div>
              <div className="text-lg font-semibold text-blue-600">
                {selectedCell.frequency}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Success Rate</div>
              <div className="text-lg font-semibold text-green-600">
                {(selectedCell.success_rate * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">Avg Reward</div>
              <div className={`text-lg font-semibold ${
                selectedCell.average_reward >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedCell.average_reward.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {heatmapData.reduce((sum, item) => sum + item.frequency, 0)}
          </div>
          <div className="text-sm text-blue-800">Total Actions</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {(heatmapData.reduce((sum, item) => sum + item.success_rate, 0) / heatmapData.length * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-green-800">Avg Success Rate</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {actionTypes.length}
          </div>
          <div className="text-sm text-purple-800">Action Types</div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stateCategories.length}
          </div>
          <div className="text-sm text-orange-800">State Categories</div>
        </div>
      </div>
    </div>
  );
};

export default ActionHeatmap;