'use client';

import React, { useState } from 'react';
import LearningMetricsDashboard from './LearningMetricsDashboard';
import RealTimeTrainingMonitor from './RealTimeTrainingMonitor';
import ActionHeatmap from './charts/ActionHeatmap';
import FeatureImportanceAnalyzer from './FeatureImportanceAnalyzer';
import LearningCurveChart from './charts/LearningCurveChart';

type TabType = 'overview' | 'realtime' | 'analysis' | 'features' | 'charts';

interface Tab {
  id: TabType;
  name: string;
  icon: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: '📊',
    description: 'Core learning metrics and performance indicators'
  },
  {
    id: 'realtime',
    name: 'Real-time',
    icon: '⚡',
    description: 'Live training monitoring and controls'
  },
  {
    id: 'charts',
    name: 'Charts',
    icon: '📈',
    description: 'Advanced learning curve and trend analysis'
  },
  {
    id: 'analysis',
    name: 'Actions',
    icon: '🎯',
    description: 'Action distribution and decision patterns'
  },
  {
    id: 'features',
    name: 'Features',
    icon: '🔍',
    description: 'Feature importance and impact analysis'
  }
];

const RLDashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <LearningMetricsDashboard refreshInterval={5000} />;
      
      case 'realtime':
        return <RealTimeTrainingMonitor isTraining={true} refreshInterval={2000} />;
      
      case 'charts':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Interactive Learning Curve</h3>
              <LearningCurveChart 
                data={[
                  { episode: 1, reward: 5.2, efficiency: 45, satisfaction: 6.1, timestamp: new Date(Date.now() - 14 * 60000).toISOString(), moving_average_reward: 5.2, moving_average_efficiency: 45 },
                  { episode: 2, reward: 6.1, efficiency: 52, satisfaction: 6.4, timestamp: new Date(Date.now() - 13 * 60000).toISOString(), moving_average_reward: 5.65, moving_average_efficiency: 48.5 },
                  { episode: 3, reward: 7.3, efficiency: 58, satisfaction: 6.8, timestamp: new Date(Date.now() - 12 * 60000).toISOString(), moving_average_reward: 6.2, moving_average_efficiency: 51.7 },
                  { episode: 4, reward: 8.1, efficiency: 63, satisfaction: 7.1, timestamp: new Date(Date.now() - 11 * 60000).toISOString(), moving_average_reward: 6.675, moving_average_efficiency: 54.5 },
                  { episode: 5, reward: 9.2, efficiency: 68, satisfaction: 7.5, timestamp: new Date(Date.now() - 10 * 60000).toISOString(), moving_average_reward: 7.18, moving_average_efficiency: 57.2 },
                  { episode: 6, reward: 8.8, efficiency: 71, satisfaction: 7.3, timestamp: new Date(Date.now() - 9 * 60000).toISOString(), moving_average_reward: 7.45, moving_average_efficiency: 59.5 },
                  { episode: 7, reward: 10.1, efficiency: 74, satisfaction: 7.8, timestamp: new Date(Date.now() - 8 * 60000).toISOString(), moving_average_reward: 7.83, moving_average_efficiency: 61.6 },
                  { episode: 8, reward: 9.7, efficiency: 76, satisfaction: 7.6, timestamp: new Date(Date.now() - 7 * 60000).toISOString(), moving_average_reward: 8.06, moving_average_efficiency: 63.4 },
                  { episode: 9, reward: 11.2, efficiency: 79, satisfaction: 8.1, timestamp: new Date(Date.now() - 6 * 60000).toISOString(), moving_average_reward: 8.41, moving_average_efficiency: 65.1 },
                  { episode: 10, reward: 10.8, efficiency: 81, satisfaction: 7.9, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), moving_average_reward: 8.65, moving_average_efficiency: 66.7 },
                  { episode: 11, reward: 12.1, efficiency: 83, satisfaction: 8.3, timestamp: new Date(Date.now() - 4 * 60000).toISOString(), moving_average_reward: 8.98, moving_average_efficiency: 68.2 },
                  { episode: 12, reward: 11.5, efficiency: 85, satisfaction: 8.1, timestamp: new Date(Date.now() - 3 * 60000).toISOString(), moving_average_reward: 9.18, moving_average_efficiency: 69.6 },
                  { episode: 13, reward: 13.2, efficiency: 87, satisfaction: 8.5, timestamp: new Date(Date.now() - 2 * 60000).toISOString(), moving_average_reward: 9.52, moving_average_efficiency: 71.0 },
                  { episode: 14, reward: 12.8, efficiency: 89, satisfaction: 8.4, timestamp: new Date(Date.now() - 1 * 60000).toISOString(), moving_average_reward: 9.77, moving_average_efficiency: 72.3 },
                  { episode: 15, reward: 14.1, efficiency: 91, satisfaction: 8.7, timestamp: new Date().toISOString(), moving_average_reward: 10.05, moving_average_efficiency: 73.5 }
                ]}
                height={400}
                showMovingAverage={true}
                showEfficiency={true}
                autoScale={true}
              />
            </div>
          </div>
        );
      
      case 'analysis':
        return <ActionHeatmap width={800} height={500} />;
      
      case 'features':
        return <FeatureImportanceAnalyzer showTrends={true} groupByCategory={true} />;
      
      default:
        return <LearningMetricsDashboard refreshInterval={5000} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Description */}
        <div className="mt-4 px-2">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RLDashboardTabs;