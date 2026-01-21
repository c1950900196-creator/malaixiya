'use client';

import React from 'react';

interface LoadingProgressProps {
  step: string;
  progress: number;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ step, progress }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="inline-block relative">
            <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{progress}%</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Generating Your Meal Plan
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          {step}
        </p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-6 space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress >= 20 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Creating user session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress >= 40 ? 'bg-green-500' : progress >= 20 ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
            <span>Saving profile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress >= 60 ? 'bg-green-500' : progress >= 40 ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
            <span>Generating meal plan (21 meals)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-500' : progress >= 60 ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
            <span>Creating shopping list (AI generating...)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
            <span>Complete and redirect</span>
          </div>
        </div>
        
        {progress >= 60 && progress < 80 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
              💡 AI is generating the shopping list, this may take 1-2 minutes, please wait...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
