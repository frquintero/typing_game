'use client';

import React, { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useLeaderboard } from '@/hooks/useLeaderboard';

// Lazy load components for better performance
const Game = lazy(() => import('@/components/game/Game').then(module => ({ default: module.Game })));
const SelectionPanel = lazy(() => import('@/components/ui/SelectionPanel').then(module => ({ default: module.SelectionPanel })));
const Leaderboard = lazy(() => import('@/components/leaderboard/Leaderboard').then(module => ({ default: module.Leaderboard })));

type TimeLimit = 15 | 30 | 60;
type Difficulty = 'easy' | 'medium' | 'hard';
type Theme = 'normal' | 'programming' | 'motivational' | 'fitness';

export default function Home() {
  const [view, setView] = useState<'selection' | 'game' | 'leaderboard'>('selection');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [theme, setTheme] = useState<Theme>('normal');
  const [focusMode, setFocusMode] = useState(false);

  const { getTopEntries, resetLeaderboard } = useLeaderboard();

  const handleStartGame = () => {
    setGameStarted(true);
    setView('game');
  };

  const handleRetry = () => {
    setGameStarted(false);
    setView('selection');
  };

  const handleViewLeaderboard = () => {
    setView('leaderboard');
  };

  const handleQuit = () => {
    setGameStarted(false);
    setView('selection');
  };

  const handleBackToSelection = () => {
    setView('selection');
  };

  if (view === 'game') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="game"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading game...</p>
              </div>
            </div>
          }>
            <Game
              timeLimit={timeLimit}
              difficulty={difficulty}
              theme={theme}
              focusMode={focusMode}
              onRetry={handleRetry}
              onQuit={handleQuit}
            />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (view === 'leaderboard') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="leaderboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
        >
          <div className="max-w-4xl w-full space-y-4">
            <Suspense fallback={
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
              </div>
            }>
              <Leaderboard entries={getTopEntries(10)} />
            </Suspense>
            <div className="flex justify-center gap-4">
              <Button onClick={resetLeaderboard} variant="secondary">
                Reset Leaderboard
              </Button>
              <Button onClick={handleBackToSelection}>Back to Game</Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="selection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full space-y-4">
          <Suspense fallback={
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
            </div>
          }>
            <SelectionPanel
              timeLimit={timeLimit}
              difficulty={difficulty}
              theme={theme}
              focusMode={focusMode}
              onTimeLimitChange={setTimeLimit}
              onDifficultyChange={setDifficulty}
              onThemeChange={setTheme}
              onFocusModeChange={setFocusMode}
              onStart={handleStartGame}
            />
          </Suspense>
          <div className="flex justify-center">
            <Button onClick={handleViewLeaderboard} variant="secondary">
              View Leaderboard
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}