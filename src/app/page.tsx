'use client';

import React, { useState } from 'react';
import { Game } from '@/components/game/Game';
import { SelectionPanel } from '@/components/ui/SelectionPanel';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Button } from '@/components/ui/Button';
import { useLeaderboard } from '@/hooks/useLeaderboard';

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

  const { getTopEntries } = useLeaderboard();

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
      <Game
        timeLimit={timeLimit}
        difficulty={difficulty}
        theme={theme}
        focusMode={focusMode}
        onRetry={handleRetry}
        onQuit={handleQuit}
      />
    );
  }

  if (view === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-4">
          <Leaderboard entries={getTopEntries()} />
          <div className="flex justify-center">
            <Button onClick={handleBackToSelection}>Back to Game</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
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
        <div className="flex justify-center">
          <Button onClick={handleViewLeaderboard} variant="secondary">
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}