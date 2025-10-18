'use client';

import React from 'react';
import { LeaderboardEntry, DisplayEntry } from '@/types/leaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = React.memo(({ entries }) => {
  // Ensure we always show 10 rows, padding with empty entries if needed
  const displayEntries: DisplayEntry[] = [...entries];
  while (displayEntries.length < 10) {
    displayEntries.push({
      id: `empty-${displayEntries.length}`,
      wpm: 0,
      accuracy: 0,
      difficulty: 'easy' as const,
      theme: 'normal' as const,
      timestamp: new Date(),
      isEmpty: true
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-0" role="region" aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading" className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">Leaderboard</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-sm" role="table" aria-label="Typing game leaderboard with player scores">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Rank</th>
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">WPM</th>
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Accuracy</th>
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell">Difficulty</th>
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden md:table-cell">Theme</th>
                <th scope="col" className="text-left py-2 px-2 sm:px-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.map((entry, index) => (
                <tr key={entry.id} className={`border-b border-gray-200 dark:border-gray-700 ${entry.isEmpty ? 'opacity-50' : ''}`} role="row">
                  <td className="py-2 px-2 sm:px-4 text-gray-900 dark:text-white text-xs sm:text-sm" role="gridcell" aria-label={`Rank ${index + 1}`}>{index + 1}</td>
                  <td className="py-2 px-2 sm:px-4 text-gray-900 dark:text-white text-xs sm:text-sm" role="gridcell" aria-label={entry.isEmpty ? 'No score yet' : `${entry.wpm} words per minute`}>{entry.isEmpty ? '-' : entry.wpm}</td>
                  <td className="py-2 px-2 sm:px-4 text-gray-900 dark:text-white text-xs sm:text-sm" role="gridcell" aria-label={entry.isEmpty ? 'No score yet' : `${entry.accuracy} percent accuracy`}>{entry.isEmpty ? '-' : `${entry.accuracy}%`}</td>
                  <td className="py-2 px-2 sm:px-4 text-gray-900 dark:text-white capitalize text-xs sm:text-sm hidden sm:table-cell" role="gridcell" aria-label={entry.isEmpty ? 'No score yet' : `Difficulty: ${entry.difficulty}`}>{entry.isEmpty ? '-' : entry.difficulty}</td>
                  <td className="py-2 px-2 sm:px-4 text-gray-900 dark:text-white capitalize text-xs sm:text-sm hidden md:table-cell" role="gridcell" aria-label={entry.isEmpty ? 'No score yet' : `Theme: ${entry.theme}`}>{entry.isEmpty ? '-' : entry.theme}</td>
                  <td className="py-2 px-2 sm:px-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm" role="gridcell" aria-label={entry.isEmpty ? 'No score yet' : `Date: ${entry.timestamp.toLocaleDateString()}`}>
                    {entry.isEmpty ? '-' : entry.timestamp.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});