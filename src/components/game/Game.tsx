'use client';

import React, { useEffect } from 'react';
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

export const Game: React.FC<GameProps> = ({ timeLimit, difficulty, theme, focusMode, onRetry, onQuit }) => {
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
    startGame,
    handleKeyPress,
    activatePowerUp,
    resetGame,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Typing Speed Test
        </h1>

        <MetricsBar wpm={wpm} accuracy={accuracy} errors={errors} timeRemaining={timeRemaining} focusMode={focusMode} />

        <div className="flex justify-center gap-4 mb-4">
          {powerUpAvailable && !focusMode && (
            <Button
              onClick={activatePowerUp}
              disabled={slowMode}
              className={slowMode ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'}
            >
              {slowMode ? 'Slow Motion Active' : '⚡ Power-Up'}
            </Button>
          )}

          {focusMode && gameState === 'playing' && onQuit && (
            <Button
              onClick={onQuit}
              variant="secondary"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Quit Test
            </Button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <TextDisplay text={text} typedText={typedText} currentWordIndex={currentWordIndex} />
        </div>

        {gameState === 'completed' && (
          <ResultsModal
            wpm={wpm}
            accuracy={accuracy}
            errors={errors}
            focusMode={focusMode}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};