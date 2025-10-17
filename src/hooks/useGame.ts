'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameSession, GameState, Difficulty, Theme } from '@/types/game';
import { generateText } from '@/utils/textThemes';
import { calculateWPM, calculateAccuracy, calculateErrors } from '@/utils/calculations';
import { storage } from '@/utils/localStorage';

interface UseGameReturn {
  gameState: GameState;
  text: string;
  typedText: string;
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  errors: number;
  currentWordIndex: number;
  powerUpAvailable: boolean;
  slowMode: boolean;
  slowTimeRemaining: number;
  startGame: (timeLimit: 15 | 30 | 60, difficulty: Difficulty, theme: Theme, focusMode: boolean, onComplete?: (stats: { wpm: number; accuracy: number; difficulty: Difficulty; theme: Theme }) => void) => void;
  handleKeyPress: (key: string) => void;
  activatePowerUp: () => void;
  resetGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [text, setText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [theme, setTheme] = useState<Theme>('normal');
  const [focusMode, setFocusMode] = useState(false);
  const [consecutivePerfect, setConsecutivePerfect] = useState(0);
  const [powerUpAvailable, setPowerUpAvailable] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [slowTimeRemaining, setSlowTimeRemaining] = useState(0);
  const [onComplete, setOnComplete] = useState<((stats: { wpm: number; accuracy: number; difficulty: Difficulty; theme: Theme }) => void) | undefined>();

  useEffect(() => {
    const stored = storage.get<number>('consecutivePerfect');
    if (stored) {
      setConsecutivePerfect(stored);
      setPowerUpAvailable(stored >= 3);
    }
  }, []);

  const currentWordIndex = useMemo(() => {
    if (!text || typedText.length >= text.length) return -1;
    const words = text.split(' ');
    const pos = typedText.length;
    let cumulative = 0;
    for (let i = 0; i < words.length; i++) {
      const wordStart = cumulative;
      const wordEnd = cumulative + words[i].length;
      if (pos >= wordStart && pos <= wordEnd) {
        return pos === wordEnd ? (i + 1 < words.length ? i + 1 : -1) : i;
      }
      cumulative = wordEnd + 1;
    }
    return -1;
  }, [text, typedText]);

  const startGame = useCallback((timeLimit: 15 | 30 | 60, diff: Difficulty, th: Theme, focus: boolean, completeCallback?: (stats: { wpm: number; accuracy: number; difficulty: Difficulty; theme: Theme }) => void) => {
    const gameText = generateText(diff, th);
    setText(gameText);
    setTypedText('');
    setTimeRemaining(focus ? -1 : timeLimit); // -1 for no timer
    setStartTime(new Date());
    setGameState('playing');
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setDifficulty(diff);
    setTheme(th);
    setFocusMode(focus);
    setOnComplete(() => completeCallback);
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'Backspace') {
      setTypedText(prev => prev.slice(0, -1));
    } else if (key.length === 1) {
      setTypedText(prev => prev + key);
    }
  }, [gameState]);

  const activatePowerUp = useCallback(() => {
    if (powerUpAvailable && !slowMode) {
      setSlowMode(true);
      setSlowTimeRemaining(3);
      setPowerUpAvailable(false);
    }
  }, [powerUpAvailable, slowMode]);

  const resetGame = useCallback(() => {
    setGameState('idle');
    setText('');
    setTypedText('');
    setTimeRemaining(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setSlowMode(false);
    setSlowTimeRemaining(0);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (gameState === 'playing' && !focusMode && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (slowMode) {
            setSlowTimeRemaining(prev => {
              const newRemaining = prev - 1;
              if (newRemaining <= 0) {
                setSlowMode(false);
              }
              return Math.max(0, newRemaining);
            });
          }
          return Math.max(0, newTime);
        });
      }, slowMode ? 2000 : 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, timeRemaining, focusMode, slowMode]);

  // Game completion effect
  useEffect(() => {
    if (gameState === 'playing') {
      let shouldComplete = false;

      if (!focusMode && timeRemaining === 0) {
        shouldComplete = true;
      } else if (focusMode && typedText.length >= text.length) {
        shouldComplete = true;
      }

      if (shouldComplete) {
        setGameState('completed');
        const newConsecutive = accuracy === 100 ? consecutivePerfect + 1 : 0;
        setConsecutivePerfect(newConsecutive);
        setPowerUpAvailable(newConsecutive >= 3);
        storage.set('consecutivePerfect', newConsecutive);
        if (onComplete) {
          onComplete({ wpm, accuracy, difficulty, theme });
        }
      }
    }
  }, [gameState, timeRemaining, focusMode, typedText, text, wpm, accuracy, consecutivePerfect, difficulty, theme, onComplete]);

  useEffect(() => {
    if (typedText && startTime) {
      const elapsedSeconds = (Date.now() - startTime.getTime()) / 1000;
      const currentWpm = calculateWPM(typedText, elapsedSeconds);
      const currentAccuracy = calculateAccuracy(typedText, text);
      const currentErrors = calculateErrors(typedText, text);

      setWpm(currentWpm);
      setAccuracy(currentAccuracy);
      setErrors(currentErrors);
    }
  }, [typedText, text, startTime]);

  return {
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
    slowTimeRemaining,
    startGame,
    handleKeyPress,
    activatePowerUp,
    resetGame,
  };
};