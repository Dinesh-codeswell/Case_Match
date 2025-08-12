'use client';

import React from 'react';
import Link from 'next/link';

export default function TestRLPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            RL Dashboard Test
          </h1>
          <p className="text-gray-600 mb-6">
            Click the button below to access the Reinforcement Learning Dashboard
          </p>
          
          <Link 
            href="/rl-dashboard"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 inline-flex items-center"
          >
            <span className="mr-2">🚀</span>
            Open RL Dashboard
          </Link>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link 
              href="/case-match"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Case Match
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}