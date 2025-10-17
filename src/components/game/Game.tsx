'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { TextDisplay } from './TextDisplay';
import { MetricsBar } from './MetricsBar';
import { ResultsModal } from './ResultsModal';
import { Button } from '@/components/ui/Button';

interface GameProps {
  timeLimit: 15 | 30 | 60;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'normal' | 'programming' | 'motivational' | 'fitness';
  focusMode: boolean;
  onRetry: () => void;
  onQuit?: () => void;
}

export const Game: React.FC<GameProps> = React.memo(({ timeLimit, difficulty, theme, focusMode, onRetry, onQuit }) => {
  const { addEntry } = useLeaderboard();
  const {
    gameState,
    text,
    typedText,
    timeRemaining,
    wpm,
    accuracy,
    errors,
    currentWordIndex,
    powerUpAvailable,
    slowMode,
    error,
    startGame,
    handleKeyPress,
    activatePowerUp,
    resetGame,
    clearError,
  } = useGame();

  useEffect(() => {
    if (gameState === 'idle') {
      startGame(timeLimit, difficulty, theme, focusMode, (stats) => {
        addEntry(stats);
      });
    }
  }, [gameState, startGame, timeLimit, difficulty, theme, focusMode, addEntry]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState === 'playing') {
        event.preventDefault();
        handleKeyPress(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleKeyPress]);

  const handleRetry = () => {
    resetGame();
    onRetry();
  };

  if (gameState === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Typing Game</h1>
          <p className="mb-4">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          id="game-title"
        >
          Typing Speed Test
        </motion.h1>

        {error && (
          <motion.div
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="inline-flex rounded-md bg-red-100 dark:bg-red-900 p-1.5 text-red-400 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  aria-label="Dismiss error"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          role="region"
          aria-labelledby="metrics-heading"
        >
          <h2 id="metrics-heading" className="sr-only">Typing Metrics</h2>
          <MetricsBar wpm={wpm} accuracy={accuracy} errors={errors} timeRemaining={timeRemaining} focusMode={focusMode} />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {powerUpAvailable && !focusMode && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={activatePowerUp}
                disabled={slowMode}
                className={`${slowMode ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'} w-full sm:w-auto min-h-[44px] touch-manipulation`}
              >
                {slowMode ? 'Slow Motion Active' : '⚡ Power-Up'}
              </Button>
            </motion.div>
          )}

          {focusMode && gameState === 'playing' && onQuit && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={onQuit}
                variant="secondary"
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto min-h-[44px] touch-manipulation"
              >
                Quit Test
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          role="main"
          aria-labelledby="text-display-heading"
        >
          <h2 id="text-display-heading" className="sr-only">Typing Text Display</h2>
          <TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />
        </motion.div>

        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            role="dialog"
            aria-labelledby="results-modal-heading"
            aria-modal="true"
          >
            <h2 id="results-modal-heading" className="sr-only">Game Results</h2>
            <ResultsModal
              wpm={wpm}
              accuracy={accuracy}
              errors={errors}
              focusMode={focusMode}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
});

Game.displayName = 'Game';