'use client';

import React from 'react';

interface MetricsBarProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeRemaining: number;
  focusMode: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ wpm, accuracy, errors, timeRemaining, focusMode }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${focusMode ? '2' : '4'} gap-4 mb-6`}>
      {!focusMode && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wpm}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{errors}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
      </div>
      {!focusMode && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{timeRemaining}s</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time Left</div>
        </div>
      )}
    </div>
  );
};