import React, { useState } from 'react';
import { exportTeamsToCSV, exportTeamsToJSON } from '../utils/csvExport';

interface ExportResultsProps {
  data: {
    teams: any[];
    unmatched: any[];
    statistics: {
      totalParticipants: number;
      teamsFormed: number;
      averageTeamSize: number;
      matchingEfficiency: number;
      teamSizeDistribution: { [key: number]: number };
      caseTypeDistribution: { [key: string]: number };
    };
  };
}

const ExportResults: React.FC<ExportResultsProps> = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'json'>('csv');

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportType === 'csv') {
        exportTeamsToCSV(data);
      } else {
        exportTeamsToJSON(data);
      }
      
      // Show success feedback
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Export Results
        </h3>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Download your team formation results for further analysis and record keeping
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Options */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Export Format</h4>
          <div className="space-y-4">
            <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <input
                type="radio"
                name="exportType"
                value="csv"
                checked={exportType === 'csv'}
                onChange={(e) => setExportType(e.target.value as 'csv' | 'json')}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-4">
                <span className="text-lg font-semibold text-gray-700">CSV Format</span>
                <p className="text-sm text-gray-500">Best for spreadsheet analysis</p>
              </div>
            </label>
            <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <input
                type="radio"
                name="exportType"
                value="json"
                checked={exportType === 'json'}
                onChange={(e) => setExportType(e.target.value as 'csv' | 'json')}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-4">
                <span className="text-lg font-semibold text-gray-700">JSON Format</span>
                <p className="text-sm text-gray-500">Best for data processing</p>
              </div>
            </label>
          </div>
        </div>

        {/* Export Preview */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h4 className="text-xl font-bold text-blue-900 mb-6 text-center">What's Included</h4>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Summary Statistics</span>
                <p className="text-sm text-blue-700">Matching efficiency and team formation metrics</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Team Information</span>
                <p className="text-sm text-blue-700">Detailed team data with compatibility scores</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Member Profiles</span>
                <p className="text-sm text-blue-700">Complete participant details and preferences</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Unmatched List</span>
                <p className="text-sm text-blue-700">Participants who couldn't be matched (if any)</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="text-lg text-gray-600">
            <span className="font-bold">{data.teams.length}</span> teams • 
            <span className="font-bold ml-1">{data.statistics.totalParticipants}</span> participants
          </div>
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`
            px-12 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform
            ${isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
            }
          `}
        >
          {isExporting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export {exportType.toUpperCase()}
            </div>
          )}
        </button>

        {/* Success Message */}
        {!isExporting && (
          <div className="mt-4 text-sm text-gray-500">
            File will be downloaded as: <span className="font-mono font-semibold">team_formation_results_{new Date().toISOString().split('T')[0]}.{exportType}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportResults; 