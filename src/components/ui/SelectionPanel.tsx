'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

type TimeLimit = 15 | 30 | 60;
type Difficulty = 'easy' | 'medium' | 'hard';
type Theme = 'normal' | 'programming' | 'motivational' | 'fitness';

interface SelectionPanelProps {
  timeLimit: TimeLimit;
  difficulty: Difficulty;
  theme: Theme;
  focusMode: boolean;
  onTimeLimitChange: (time: TimeLimit) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onThemeChange: (theme: Theme) => void;
  onFocusModeChange: (focusMode: boolean) => void;
  onStart: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = React.memo(({
  timeLimit,
  difficulty,
  theme,
  focusMode,
  onTimeLimitChange,
  onDifficultyChange,
  onThemeChange,
  onFocusModeChange,
  onStart,
}) => {
  return (
    <motion.div
      className="max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white">
        Typing Speed Game
      </h1>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Limit
          </label>
          <select
            id="time-limit"
            value={timeLimit}
            onChange={(e) => onTimeLimitChange(Number(e.target.value) as TimeLimit)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base min-h-[44px] touch-manipulation"
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base min-h-[44px] touch-manipulation"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base min-h-[44px] touch-manipulation"
          >
            <option value="normal">Normal</option>
            <option value="programming">Programming</option>
            <option value="motivational">Motivational</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <input
            id="focus-mode"
            type="checkbox"
            checked={focusMode}
            onChange={(e) => onFocusModeChange(e.target.checked)}
            className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded touch-manipulation"
          />
          <label htmlFor="focus-mode" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Focus Mode (No timer, accuracy only)
          </label>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button onClick={onStart} className="w-full min-h-[48px] touch-manipulation text-base font-semibold">
            Start Game
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
});