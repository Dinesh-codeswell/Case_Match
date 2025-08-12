import React from 'react';
import RLDashboardTabs from '@/components/rl-dashboard/RLDashboardTabs';

export default function RLDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 Reinforcement Learning Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor algorithm learning progress, performance metrics, and optimization insights in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RLDashboardTabs />
      </div>
    </div>
  );
}