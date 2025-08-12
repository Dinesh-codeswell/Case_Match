'use client';

import React, { useState, useEffect } from 'react';

interface FeatureImportance {
  feature_name: string;
  importance_score: number;
  impact_on_reward: number;
  usage_frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  category: 'participant_attribute' | 'team_preference' | 'compatibility_metric' | 'contextual';
}

interface FeatureImportanceAnalyzerProps {
  data?: FeatureImportance[];
  showTrends?: boolean;
  groupByCategory?: boolean;
}

const FeatureImportanceAnalyzer: React.FC<FeatureImportanceAnalyzerProps> = ({
  data,
  showTrends = true,
  groupByCategory = true
}) => {
  const [features, setFeatures] = useState<FeatureImportance[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'importance' | 'impact' | 'frequency'>('importance');

  // Generate mock feature importance data
  useEffect(() => {
    if (data) {
      setFeatures(data);
    } else {
      const mockFeatures: FeatureImportance[] = [
        {
          feature_name: 'Team Size Preference',
          importance_score: 0.92,
          impact_on_reward: 1.8,
          usage_frequency: 0.95,
          trend: 'stable',
          category: 'team_preference'
        },
        {
          feature_name: 'Core Strengths Overlap',
          importance_score: 0.87,
          impact_on_reward: 1.6,
          usage_frequency: 0.88,
          trend: 'increasing',
          category: 'compatibility_metric'
        },
        {
          feature_name: 'Education Level Match',
          importance_score: 0.84,
          impact_on_reward: 1.4,
          usage_frequency: 0.92,
          trend: 'stable',
          category: 'participant_attribute'
        },
        {
          feature_name: 'Availability Compatibility',
          importance_score: 0.79,
          impact_on_reward: 1.2,
          usage_frequency: 0.85,
          trend: 'increasing',
          category: 'participant_attribute'
        },
        {
          feature_name: 'Case Type Preferences',
          importance_score: 0.76,
          impact_on_reward: 1.1,
          usage_frequency: 0.78,
          trend: 'stable',
          category: 'participant_attribute'
        },
        {
          feature_name: 'Experience Level Balance',
          importance_score: 0.71,
          impact_on_reward: 0.9,
          usage_frequency: 0.82,
          trend: 'increasing',
          category: 'compatibility_metric'
        },
        {
          feature_name: 'Working Style Compatibility',
          importance_score: 0.68,
          impact_on_reward: 0.8,
          usage_frequency: 0.75,
          trend: 'decreasing',
          category: 'compatibility_metric'
        },
        {
          feature_name: 'College Diversity',
          importance_score: 0.62,
          impact_on_reward: 0.6,
          usage_frequency: 0.70,
          trend: 'stable',
          category: 'contextual'
        },
        {
          feature_name: 'Role Preference Match',
          importance_score: 0.58,
          impact_on_reward: 0.5,
          usage_frequency: 0.68,
          trend: 'decreasing',
          category: 'team_preference'
        },
        {
          feature_name: 'Previous Team Success',
          importance_score: 0.45,
          impact_on_reward: 0.3,
          usage_frequency: 0.45,
          trend: 'increasing',
          category: 'contextual'
        }
      ];
      setFeatures(mockFeatures);
    }
  }, [data]);

  const categories = ['all', ...new Set(features.map(f => f.category))];
  
  const filteredFeatures = features
    .filter(f => selectedCategory === 'all' || f.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'importance':
          return b.importance_score - a.importance_score;
        case 'impact':
          return b.impact_on_reward - a.impact_on_reward;
        case 'frequency':
          return b.usage_frequency - a.usage_frequency;
        default:
          return 0;
      }
    });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'participant_attribute': return 'bg-blue-100 text-blue-800';
      case 'team_preference': return 'bg-green-100 text-green-800';
      case 'compatibility_metric': return 'bg-purple-100 text-purple-800';
      case 'contextual': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatFeatureName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Importance Analysis</h3>
        <p className="text-gray-600">
          Understanding which participant attributes and compatibility metrics drive successful team matching
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'importance' | 'impact' | 'frequency')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="importance">Importance Score</option>
              <option value="impact">Impact on Reward</option>
              <option value="frequency">Usage Frequency</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredFeatures.length} of {features.length} features
        </div>
      </div>

      {/* Feature List */}
      <div className="space-y-4">
        {filteredFeatures.map((feature, index) => (
          <div key={feature.feature_name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {formatFeatureName(feature.feature_name)}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                    {formatCategoryName(feature.category)}
                  </span>
                  {showTrends && (
                    <span className={`text-sm ${getTrendColor(feature.trend)}`}>
                      {getTrendIcon(feature.trend)}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Rank #{index + 1} • Impact: {feature.impact_on_reward.toFixed(1)}x reward multiplier
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {(feature.importance_score * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Importance</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Importance Score</span>
                  <span className="font-medium">{(feature.importance_score * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${feature.importance_score * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Impact on Reward</span>
                  <span className="font-medium">{feature.impact_on_reward.toFixed(1)}x</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (feature.impact_on_reward / 2) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Usage Frequency</span>
                  <span className="font-medium">{(feature.usage_frequency * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${feature.usage_frequency * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {features.length}
          </div>
          <div className="text-sm text-blue-800">Total Features</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {features.filter(f => f.importance_score > 0.7).length}
          </div>
          <div className="text-sm text-green-800">High Impact</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {features.filter(f => f.trend === 'increasing').length}
          </div>
          <div className="text-sm text-purple-800">Trending Up</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {(features.reduce((sum, f) => sum + f.usage_frequency, 0) / features.length * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-orange-800">Avg Usage</div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Team size preference is the most critical factor for successful matching</li>
          <li>• Core strengths overlap shows increasing importance over time</li>
          <li>• Working style compatibility has declining influence on match success</li>
          <li>• {features.filter(f => f.trend === 'increasing').length} features are gaining importance through learning</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureImportanceAnalyzer;