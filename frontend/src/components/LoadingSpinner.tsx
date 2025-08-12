import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      {/* Main Spinner */}
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
      </div>
      
      {/* Loading Text with Typing Animation */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          <span className="inline-block animate-pulse">Processing</span>
          <span className="inline-block animate-bounce ml-1">.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.4s' }}>.</span>
        </h3>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Analyzing participant data and forming optimal teams using our advanced matching algorithm...
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-80 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
      </div>
      
      {/* Loading Steps */}
      <div className="flex space-x-8 text-lg text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <span className="font-semibold">Parsing CSV</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
          <span className="font-semibold">Matching Teams</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
          <span className="font-semibold">Finalizing</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 rounded-xl p-6 max-w-md">
        <h4 className="text-lg font-bold text-blue-900 mb-3 text-center">What's happening?</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
            Analyzing participant skills and preferences
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
            Matching based on case competition interests
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
            Optimizing team size and role distribution
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
            Calculating compatibility scores
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoadingSpinner;
