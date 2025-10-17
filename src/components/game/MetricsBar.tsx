'use client';

import React from 'react';

interface MetricsBarProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeRemaining: number;
  focusMode: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = React.memo(({ wpm, accuracy, errors, timeRemaining, focusMode }) => {
  return (
    <div className={`grid grid-cols-2 ${focusMode ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-3 sm:gap-4 mb-4 sm:mb-6`} role="region" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="sr-only">Typing Performance Metrics</h2>
      {!focusMode && (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow text-center min-h-[80px] sm:min-h-[100px] flex flex-col justify-center" role="status" aria-label={`Words per minute: ${wpm}`}>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">{wpm}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" aria-hidden="true">WPM</div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow text-center min-h-[80px] sm:min-h-[100px] flex flex-col justify-center" role="status" aria-label={`Typing accuracy: ${accuracy} percent`}>
        <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400" aria-hidden="true">{accuracy}%</div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" aria-hidden="true">Accuracy</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow text-center min-h-[80px] sm:min-h-[100px] flex flex-col justify-center" role="status" aria-label={`Typing errors: ${errors}`}>
        <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400" aria-hidden="true">{errors}</div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" aria-hidden="true">Errors</div>
      </div>
      {!focusMode && (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow text-center min-h-[80px] sm:min-h-[100px] flex flex-col justify-center" role="status" aria-label={`Time remaining: ${timeRemaining} seconds`}>
          <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400" aria-hidden="true">{timeRemaining}s</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" aria-hidden="true">Time Left</div>
        </div>
      )}
    </div>
  );
});