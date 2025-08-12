import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      onFileUpload(file);
    } else {
      alert('Please select a valid CSV file.');
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Upload Card - Matching the website's card style */}
      <div
        className={`
          relative bg-white rounded-xl shadow-lg border-2 border-dashed transition-all duration-300 ease-in-out p-12
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : isHovered 
              ? 'border-gray-400 bg-gray-50 scale-102' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Upload Icon */}
        <div className="text-center mb-8">
          <div className={`
            mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300
            ${isDragOver 
              ? 'bg-blue-500 text-white scale-110' 
              : isHovered 
                ? 'bg-gray-100 text-gray-600 scale-105' 
                : 'bg-gray-50 text-gray-400'
            }
          `}>
            <svg 
              className={`w-10 h-10 transition-transform duration-300 ${isDragOver ? 'animate-bounce' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>

          {/* Text Content */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isDragOver ? 'Drop your CSV file here' : 'Upload your CSV file'}
          </h3>
          
          <p className="text-lg text-gray-600 mb-8">
            {isDragOver 
              ? 'Release to upload your participant data' 
              : 'Drag and drop your CSV file here, or click to browse'
            }
          </p>

          {/* Upload Button */}
          <button
            type="button"
            className={`
              px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform
              ${isDragOver || isHovered
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Choose File'}
          </button>
        </div>

        {/* File Requirements Card */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">File Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">CSV Format</h5>
              <p className="text-sm text-gray-600">Only CSV files are supported</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Participant Details</h5>
              <p className="text-sm text-gray-600">Must include all required fields</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Case Preferences</h5>
              <p className="text-sm text-gray-600">Case competition interests</p>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
            <div className="text-blue-600 font-bold text-2xl">
              Drop to upload
            </div>
          </div>
        )}
      </div>

      {/* Processing Message */}
      {loading && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse mr-4"></div>
            <span className="text-blue-700 font-semibold text-lg">Processing your file...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
