'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Leaderboard</h2>
      {entries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No scores yet. Be the first!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Rank</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">WPM</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Accuracy</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Difficulty</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Theme</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{entry.wpm}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{entry.accuracy}%</td>
                  <td className="py-2 text-gray-900 dark:text-white capitalize">{entry.difficulty}</td>
                  <td className="py-2 text-gray-900 dark:text-white capitalize">{entry.theme}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    {entry.timestamp.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};