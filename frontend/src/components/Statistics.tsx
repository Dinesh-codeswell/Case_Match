import React, { useState, useEffect } from 'react';

interface StatisticsProps {
  totalParticipants: number;
  teamsFormed: number;
  averageTeamSize: number;
  matchingEfficiency: number;
  teamSizeDistribution: { [key: number]: number };
  caseTypeDistribution: { [key: string]: number };
}

const Statistics: React.FC<StatisticsProps> = ({
  totalParticipants,
  teamsFormed,
  averageTeamSize,
  matchingEfficiency,
  teamSizeDistribution,
  caseTypeDistribution
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalParticipants: 0,
    teamsFormed: 0,
    averageTeamSize: 0,
    matchingEfficiency: 0
  });

  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

  // Animate values on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animate = () => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setAnimatedValues({
          totalParticipants: Math.round(totalParticipants * progress),
          teamsFormed: Math.round(teamsFormed * progress),
          averageTeamSize: Number((averageTeamSize * progress).toFixed(1)),
          matchingEfficiency: Number((matchingEfficiency * progress).toFixed(1))
        });

        if (step >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };

    animate();
  }, [totalParticipants, teamsFormed, averageTeamSize, matchingEfficiency]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    if (efficiency >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTeamSizeColor = (size: number) => {
    switch (size) {
      case 2: return 'bg-blue-500';
      case 3: return 'bg-purple-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Matching Statistics
      </h2>
      <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {animatedValues.totalParticipants.toLocaleString()}
          </div>
          <div className="text-lg text-blue-700 font-semibold">Total Participants</div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {animatedValues.teamsFormed}
          </div>
          <div className="text-lg text-green-700 font-semibold">Teams Formed</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {animatedValues.averageTeamSize}
          </div>
          <div className="text-lg text-purple-700 font-semibold">Avg Team Size</div>
        </div>

        <div className={`bg-yellow-50 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200`}>
          <div className={`text-4xl font-bold mb-2 ${getEfficiencyColor(animatedValues.matchingEfficiency)}`}>
            {animatedValues.matchingEfficiency}%
          </div>
          <div className="text-lg text-yellow-700 font-semibold">Matching Efficiency</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Size Distribution */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Team Size Distribution
          </h3>
          
          <div className="space-y-6">
            {Object.entries(teamSizeDistribution).map(([size, count]) => (
              <div key={size} className="flex items-center space-x-6">
                <div className="w-20 text-lg font-semibold text-gray-700">
                  {size} Members
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full ${getTeamSizeColor(parseInt(size))} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${(count / Math.max(...Object.values(teamSizeDistribution))) * 100}%`,
                      transform: hoveredChart === `team-${size}` ? 'scaleY(1.1)' : 'scaleY(1)'
                    }}
                    onMouseEnter={() => setHoveredChart(`team-${size}`)}
                    onMouseLeave={() => setHoveredChart(null)}
                  ></div>
                </div>
                <div className="w-16 text-lg font-bold text-gray-900 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Type Distribution */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Case Type Distribution
          </h3>
          
          <div className="space-y-4">
            {Object.entries(caseTypeDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([caseType, count], index) => (
                <div key={caseType} className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-700 truncate">
                        {caseType}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(caseTypeDistribution))) * 100}%`,
                          backgroundColor: `hsl(${index * 45}, 70%, 60%)`,
                          transform: hoveredChart === `case-${caseType}` ? 'scaleY(1.1)' : 'scaleY(1)'
                        }}
                        onMouseEnter={() => setHoveredChart(`case-${caseType}`)}
                        onMouseLeave={() => setHoveredChart(null)}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Efficiency Meter */}
      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Matching Efficiency
        </h3>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-2000 ease-out ${
                animatedValues.matchingEfficiency >= 90 ? 'bg-green-500' :
                animatedValues.matchingEfficiency >= 75 ? 'bg-yellow-500' :
                animatedValues.matchingEfficiency >= 60 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${animatedValues.matchingEfficiency}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white drop-shadow">
              {animatedValues.matchingEfficiency}% Success Rate
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-sm text-gray-600 font-semibold">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
